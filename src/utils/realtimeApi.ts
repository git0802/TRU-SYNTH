import { WebSocketManager, WebSocketConfig } from './websocket/WebSocketManager';
import { API_CONFIG } from './config';

interface RealtimeAPIConfig {
  apiKey: string;
  onMessage?: (text: string) => void;
  onTranscript?: (text: string) => void;
  onAudio?: (audioBuffer: ArrayBuffer) => void;
  onError?: (error: any) => void;
  onConnectionStatus?: (status: 'connecting' | 'connected' | 'disconnected' | 'error') => void;
}

class RealtimeAPI {
  private wsManager: WebSocketManager;
  private retryCount: number = 0;
  private isConnected: boolean = false;

  constructor(config: RealtimeAPIConfig) {
    this.wsManager = new WebSocketManager({
      ...config,
      onConnectionStatus: (status) => {
        this.isConnected = status === 'connected';
        config.onConnectionStatus?.(status);
        
        if (status === 'error' && this.retryCount < API_CONFIG.MAX_RETRIES) {
          this.retryConnection();
        }
      }
    });
  }

  private async retryConnection(): Promise<void> {
    console.log(`Retrying connection (attempt ${this.retryCount + 1}/${API_CONFIG.MAX_RETRIES})`);
    this.retryCount++;
    await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_DELAY));
    
    try {
      await this.connect();
      this.retryCount = 0;
      console.log('Retry connection successful');
    } catch (error) {
      console.error('Retry connection failed:', error);
      if (this.retryCount >= API_CONFIG.MAX_RETRIES) {
        throw new Error('Failed to establish connection after multiple attempts');
      }
    }
  }

  async connect(): Promise<void> {
    console.log('RealtimeAPI: Connecting...');
    try {
      await this.wsManager.connect();
      this.isConnected = true;
      console.log('RealtimeAPI: Connected successfully');
    } catch (error) {
      console.error('RealtimeAPI: Connection error:', error);
      if (this.retryCount < API_CONFIG.MAX_RETRIES) {
        await this.retryConnection();
      } else {
        throw new Error('Failed to establish connection after multiple attempts');
      }
    }
  }

  async sendAudio(audioData: ArrayBuffer): Promise<void> {
    if (!this.isConnected) {
      console.log('RealtimeAPI: Not connected, attempting to connect...');
      await this.connect();
    }

    try {
      await this.wsManager.sendAudio(audioData);
    } catch (error) {
      console.error('RealtimeAPI: Error sending audio:', error);
      throw error;
    }
  }

  disconnect(): void {
    console.log('RealtimeAPI: Disconnecting...');
    this.wsManager.disconnect();
    this.isConnected = false;
    this.retryCount = 0;
  }
}

export default RealtimeAPI;
