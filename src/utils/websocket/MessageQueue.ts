export class MessageQueue {
  private queue: any[] = [];

  enqueue(message: any): void {
    this.queue.push(message);
  }

  dequeue(): any | undefined {
    return this.queue.shift();
  }

  clear(): void {
    this.queue = [];
  }

  isEmpty(): boolean {
    return this.queue.length === 0;
  }

  size(): number {
    return this.queue.length;
  }
}
