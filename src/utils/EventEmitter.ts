export class EventEmitter {
  private events: { [key: string]: Function[] } = {};

  on(event: string, callback: Function) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
    return this;
  }

  emit(event: string, data?: any) {
    const callbacks = this.events[event];
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
    return this;
  }

  removeListener(event: string, callback: Function) {
    const callbacks = this.events[event];
    if (callbacks) {
      this.events[event] = callbacks.filter(cb => cb !== callback);
    }
    return this;
  }

  removeAllListeners() {
    this.events = {};
    return this;
  }
}