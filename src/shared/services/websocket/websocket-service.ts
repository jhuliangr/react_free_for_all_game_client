import type { MessageHandler, ServerMessage } from './schemas';

export class GameSocket {
  private ws: WebSocket | null = null;
  private handlers: MessageHandler[] = [];
  private closeHandlers: (() => void)[] = [];
  private reconnectFailHandlers: (() => void)[] = [];
  private queue: object[] = [];
  private url = import.meta.env.VITE_WS_SERVER;
  private reconnecting = false;
  private reconnectAttempt = 0;
  private readonly maxReconnectAttempts = 5;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  get isReconnecting() {
    return this.reconnecting;
  }

  connect(url = import.meta.env.VITE_WS_SERVER) {
    this.url = url;
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      this.queue.forEach((msg) => this.ws!.send(JSON.stringify(msg)));
      this.queue = [];
    };

    this.ws.onmessage = (event) => {
      const msg: ServerMessage = JSON.parse(event.data);
      this.handlers.forEach((h) => h(msg));
    };

    this.ws.onclose = () => {
      console.log('WebSocket closed');
      if (this.ws !== null) {
        this.attemptReconnect();
      }
    };
    this.ws.onerror = (e) => console.error('WebSocket error', e);
  }

  private attemptReconnect() {
    if (
      this.reconnecting &&
      this.reconnectAttempt >= this.maxReconnectAttempts
    ) {
      this.reconnecting = false;
      this.reconnectAttempt = 0;
      console.log('Reconnection failed after max attempts');
      this.reconnectFailHandlers.forEach((h) => h());
      return;
    }

    this.reconnecting = true;
    this.reconnectAttempt++;
    const delay = Math.min(1000 * 2 ** (this.reconnectAttempt - 1), 8000);
    console.log(
      `Reconnecting attempt ${this.reconnectAttempt}/${this.maxReconnectAttempts} in ${delay}ms...`,
    );

    this.reconnectTimer = setTimeout(() => {
      const ws = new WebSocket(this.url);

      ws.onopen = () => {
        console.log('Reconnected successfully');
        this.ws = ws;
        this.reconnecting = false;
        this.reconnectAttempt = 0;
        this.queue.forEach((msg) => this.ws!.send(JSON.stringify(msg)));
        this.queue = [];

        ws.onmessage = (event) => {
          const msg: ServerMessage = JSON.parse(event.data);
          this.handlers.forEach((h) => h(msg));
        };

        ws.onclose = () => {
          console.log('WebSocket closed');
          if (this.ws !== null) {
            this.attemptReconnect();
          }
        };
        ws.onerror = (e) => console.error('WebSocket error', e);

        this.closeHandlers.forEach((h) => h());
      };

      ws.onerror = () => {
        ws.close();
        this.attemptReconnect();
      };
    }, delay);
  }

  onMessage(handler: MessageHandler) {
    this.handlers.push(handler);
    return () => {
      this.handlers = this.handlers.filter((h) => h !== handler);
    };
  }

  onClose(handler: () => void) {
    this.closeHandlers.push(handler);
    return () => {
      this.closeHandlers = this.closeHandlers.filter((h) => h !== handler);
    };
  }

  onReconnectFail(handler: () => void) {
    this.reconnectFailHandlers.push(handler);
    return () => {
      this.reconnectFailHandlers = this.reconnectFailHandlers.filter(
        (h) => h !== handler,
      );
    };
  }

  join(name: string, playerId?: string, character?: string) {
    const msg: Record<string, string> = { type: 'join', name };
    if (playerId) msg.playerId = playerId;
    if (character) msg.character = character;
    return this.send(msg);
  }

  move(dx: number, dy: number) {
    this.send({ type: 'move', dx, dy });
  }

  attack(angle: number) {
    this.send({ type: 'attack', angle });
  }

  equip(slot: 'skin' | 'weapon' | 'character', itemId: string) {
    this.send({ type: 'equip', slot, itemId });
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.reconnecting = false;
    this.reconnectAttempt = 0;
    this.queue = [];
    const ws = this.ws;
    this.ws = null;
    if (!ws) return;
    if (ws.readyState !== WebSocket.CONNECTING) {
      ws.close();
    } else {
      ws.onopen = () => ws.close();
    }
  }

  private send(payload: object) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload));
    } else if (this.ws?.readyState === WebSocket.CONNECTING) {
      this.queue.push(payload);
    }
  }
}
