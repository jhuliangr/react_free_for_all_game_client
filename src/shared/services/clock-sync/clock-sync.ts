import type { PongMessage } from '#shared/services/websocket';

type PingSender = {
  ping(t: number): void;
};

const PING_INTERVAL_MS = 2000;
const EWMA_ALPHA = 0.2;
const MIN_INTERP_DELAY_MS = 80;
const MAX_INTERP_DELAY_MS = 250;
// Multiplier over jitter: 2x jitter covers ~95% of arrival variance for a
// normal distribution. This is the classic Source engine heuristic.
const JITTER_SAFETY_MULTIPLIER = 2;

/**
 * Keeps the client's notion of server time in sync and exposes network
 * health metrics (RTT, jitter) used by the snapshot interpolator to
 * size its playback delay adaptively.
 *
 * Protocol: sends `{type:"ping", t:<clientMs>}` every PING_INTERVAL_MS.
 * Server echoes back `{type:"pong", t:<same>, serverTime:<serverMs>}`.
 * Client computes `rtt = now - t` and `offset = serverTime + rtt/2 - now`.
 *
 * Offset tracking uses the *lowest-RTT* sample seen recently (best sample
 * wins), because the true one-way delay is closest to `rtt/2` when rtt
 * is at its minimum — spikes represent queueing, not clock drift.
 */
export class ClockSync {
  private socket: PingSender | null = null;
  private pingTimer: ReturnType<typeof setInterval> | null = null;
  // EWMA of round-trip time, ms.
  private rtt = 0;
  // EWMA of absolute per-sample deviation from rtt — "jitter".
  private jitter = 0;
  // Clock offset: serverTime ≈ performance.now() + offset.
  // Seeded from the best (lowest-RTT) sample seen so far.
  private offset = 0;
  // RTT of the sample whose offset we're currently using.
  private bestRtt = Infinity;
  // Decays bestRtt over time so we re-seed from newer samples when the
  // route improves or the client changes networks.
  private samplesSinceBest = 0;
  private hasSample = false;

  start(socket: PingSender) {
    this.stop();
    this.socket = socket;
    this.sendPing();
    this.pingTimer = setInterval(() => this.sendPing(), PING_INTERVAL_MS);
  }

  stop() {
    if (this.pingTimer !== null) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
    this.socket = null;
  }

  reset() {
    this.rtt = 0;
    this.jitter = 0;
    this.offset = 0;
    this.bestRtt = Infinity;
    this.samplesSinceBest = 0;
    this.hasSample = false;
  }

  /** Called from the main message handler when a pong arrives. */
  onPong(msg: PongMessage) {
    const now = performance.now();
    const rtt = Math.max(0, now - msg.t);
    if (this.hasSample) {
      const dev = Math.abs(rtt - this.rtt);
      this.jitter = this.jitter * (1 - EWMA_ALPHA) + dev * EWMA_ALPHA;
      this.rtt = this.rtt * (1 - EWMA_ALPHA) + rtt * EWMA_ALPHA;
    } else {
      this.rtt = rtt;
      this.jitter = 0;
      this.hasSample = true;
    }

    // Prefer the lowest-RTT sample's offset: it has the least queueing
    // bias. After ~30 samples (~1min), allow re-seeding even if the
    // current sample is slightly worse, so we adapt to real drift.
    this.samplesSinceBest += 1;
    const decayedBest = this.bestRtt + this.samplesSinceBest * 2;
    if (rtt <= decayedBest) {
      this.offset = msg.serverTime + rtt / 2 - now;
      this.bestRtt = rtt;
      this.samplesSinceBest = 0;
    }
  }

  /** Server-time estimate for the current instant, ms. */
  getServerTime(): number {
    return performance.now() + this.offset;
  }

  /** Current EWMA-smoothed RTT in ms. */
  getRTT(): number {
    return this.rtt;
  }

  /** Current EWMA jitter (RTT deviation) in ms. */
  getJitter(): number {
    return this.jitter;
  }

  /** True once a pong has been received (before that, getServerTime is ~wall clock). */
  isReady(): boolean {
    return this.hasSample;
  }

  /**
   * How far behind the latest server state the snapshot interpolator
   * should render remote entities. Grows when the network jitters so
   * late packets don't cause visible stalls; stays small when the
   * connection is clean to keep reactions snappy.
   */
  getInterpDelay(): number {
    if (!this.hasSample) return MIN_INTERP_DELAY_MS;
    const target = JITTER_SAFETY_MULTIPLIER * this.jitter + MIN_INTERP_DELAY_MS;
    return Math.min(MAX_INTERP_DELAY_MS, Math.max(MIN_INTERP_DELAY_MS, target));
  }

  private sendPing() {
    if (!this.socket) return;
    this.socket.ping(performance.now());
  }
}

export const clockSync = new ClockSync();
