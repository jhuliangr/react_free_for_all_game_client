import type { MessageHandler, ServerMessage } from './schemas';

export class GameSocket {
  private ws: WebSocket | null = null;
  private handlers: MessageHandler[] = [];
  private queue: object[] = [];

  connect(url = 'wss://homework-hs.site/ws') {
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      this.queue.forEach((msg) => this.ws!.send(JSON.stringify(msg)));
      this.queue = [];
    };

    this.ws.onmessage = (event) => {
      const msg: ServerMessage = JSON.parse(event.data);
      this.handlers.forEach((h) => h(msg));
    };

    this.ws.onclose = () => console.log('WebSocket closed');
    this.ws.onerror = (e) => console.error('WebSocket error', e);
  }

  onMessage(handler: MessageHandler) {
    this.handlers.push(handler);
    return () => {
      this.handlers = this.handlers.filter((h) => h !== handler);
    };
  }

  join(name: string) {
    return this.send({ type: 'join', name });
  }

  move(dx: number, dy: number) {
    this.send({ type: 'move', dx, dy });
  }

  attack(angle: number) {
    this.send({ type: 'attack', angle });
  }

  equip(slot: 'skin' | 'weapon', itemId: string) {
    this.send({ type: 'equip', slot, itemId });
  }

  disconnect() {
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
