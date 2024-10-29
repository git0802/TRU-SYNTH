import { API_CONFIG } from './config';

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private apiKey: string;
  private onMessage: (data: any) => void;
  private onError: (error: any) => void;
  private messageQueue: any[] = [];
  private isConnected: boolean = false;
  private connectionPromise: Promise<void> | null = null;

  constructor(apiKey: string, onMessage: (data: any) => void, onError: (error: any) => void) {
    this.apiKey = apiKey;
    this.onMessage = onMessage;
    this.onError = onError;
  }

  async connect(): Promise<void> {
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      try {
        const url = `${API_CONFIG.REALTIME_API_URL}?model=${API_CONFIG.MODEL}`;
        
        this.ws = new WebSocket(url);
        
        // Set headers before the connection is established
        this.ws.addEventListener('open', () => {
          // Send authentication message immediately after connection
          this.send({
            type: 'authentication',
            token: `Bearer ${this.apiKey}`
          });
          
          this.isConnected = true;
          this.initializeSession();
          this.flushMessageQueue();
          resolve();
        });

        this.ws.addEventListener('message', (event) => this.handleMessage(event));
        
        this.ws.addEventListener('error', (error) => {
          this.onError({
            type: 'websocket_error',
            message: 'WebSocket connection error',
            originalError: error
          });
          reject(error);
        });

        this.ws.addEventListener('close', () => {
          this.isConnected = false;
          this.connectionPromise = null;
        });

      } catch (error) {
        this.onError({
          type: 'connection_error',
          message: 'Failed to establish WebSocket connection',
          originalError: error
        });
        reject(error);
      }
    });

    return this.connectionPromise;
  }

  private async initializeSession() {
    const sessionConfig = {
      type: 'session.update',
      session: {
        input_audio_transcription: true,
        voice: API_CONFIG.VOICE,
        instructions: `You are a helpful AI assistant. Keep responses concise and natural.
          Your voice should be warm and engaging. Speak naturally and conversationally.`
      }
    };

    await this.send(sessionConfig);
    await this.send({
      type: 'response.create',
      response: {
        modalities: ['text', 'audio'],
      }
    });
  }

  private handleMessage(event: MessageEvent) {
    try {
      const data = JSON.parse(event.data);
      
      if (data.type === 'error') {
        if (data.error?.message?.includes('authentication')) {
          this.handleAuthError(data.error);
          return;
        }
        this.onError(data.error);
        return;
      }
      
      if (data.type === 'authentication_success') {
        this.isConnected = true;
        return;
      }
      
      this.onMessage(data);
    } catch (error) {
      this.onError({
        type: 'message_error',
        message: 'Failed to process server message',
        originalError: error
      });
    }
  }

  private handleAuthError(error: any) {
    this.onError({
      type: 'auth_error',
      message: 'Authentication failed. Please check your API key.',
      originalError: error
    });
    this.disconnect();
  }

  private async send(data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const tryToSend = () => {
        if (this.ws?.readyState === WebSocket.OPEN) {
          try {
            this.ws.send(JSON.stringify(data));
            resolve();
          } catch (error) {
            reject(error);
          }
        } else if (this.ws?.readyState === WebSocket.CONNECTING) {
          // If still connecting, queue the message
          this.messageQueue.push({
            data,
            resolve,
            reject
          });
        } else {
          reject(new Error('WebSocket is not connected'));
        }
      };

      if (!this.isConnected) {
        this.messageQueue.push({
          data,
          resolve,
          reject
        });
        this.connect().catch(reject);
      } else {
        tryToSend();
      }
    });
  }

  private async flushMessageQueue() {
    while (this.messageQueue.length > 0) {
      const { data, resolve, reject } = this.messageQueue.shift();
      try {
        await this.send(data);
        resolve();
      } catch (error) {
        reject(error);
      }
    }
  }

  async sendAudio(audioBuffer: ArrayBuffer) {
    if (!this.isConnected) {
      await this.connect();
    }

    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));
    await this.send({
      type: 'input_audio_buffer.append',
      audio: base64Audio,
      timestamp: Date.now()
    });
  }

  disconnect() {
    if (this.ws) {
      this.isConnected = false;
      this.messageQueue = [];
      this.ws.close();
      this.ws = null;
      this.connectionPromise = null;
    }
  }
}