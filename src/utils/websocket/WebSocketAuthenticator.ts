export class WebSocketAuthenticator {
  private apiKey: string;
  private isAuthenticatedState: boolean = false;
  private authTimeout: number = 10000;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async authenticate(ws: WebSocket): Promise<void> {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket not connected');
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        cleanup();
        reject(new Error('Authentication timeout'));
      }, this.authTimeout);

      const authHandler = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'session.updated') {
            cleanup();
            this.isAuthenticatedState = true;
            resolve();
          } else if (data.type === 'error') {
            cleanup();
            reject(new Error(data.error?.message || 'Authentication failed'));
          }
        } catch (error) {
          cleanup();
          reject(error);
        }
      };

      const cleanup = () => {
        clearTimeout(timeout);
        ws.removeEventListener('message', authHandler);
      };

      ws.addEventListener('message', authHandler);

      const authMessage = {
        type: 'auth',
        authorization: `Bearer ${this.apiKey}`,
        headers: {
          'OpenAI-Beta': 'realtime=v1'
        }
      };

      ws.send(JSON.stringify(authMessage));
    });
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedState;
  }

  reset(): void {
    this.isAuthenticatedState = false;
  }
}