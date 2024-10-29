export class ConnectionManager {
  private connectionTimeout: number = 15000;

  constructor(
    private onStatusChange: (status: string) => void,
    private onError: (error: any) => void
  ) {}

  async handleConnection(ws: WebSocket): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        if (ws.readyState === WebSocket.CONNECTING) {
          ws.close();
          reject(new Error('Connection timeout'));
        }
      }, this.connectionTimeout);

      const onOpen = () => {
        clearTimeout(timeout);
        cleanup();
        resolve();
      };

      const onError = (error: Event) => {
        clearTimeout(timeout);
        cleanup();
        reject(error);
      };

      const cleanup = () => {
        ws.removeEventListener('open', onOpen);
        ws.removeEventListener('error', onError);
      };

      ws.addEventListener('open', onOpen);
      ws.addEventListener('error', onError);
    });
  }

  handleClose(): void {
    this.onStatusChange('disconnected');
  }
}