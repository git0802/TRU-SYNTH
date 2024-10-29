export interface WebSocketConfig {
  apiKey: string;
  onMessage?: (text: string) => void;
  onTranscript?: (text: string) => void;
  onAudio?: (audioData: ArrayBuffer) => void;
  onError?: (error: Error) => void;
  onConnectionStatus?: (status: 'connected' | 'disconnected' | 'error') => void;
}

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private sessionId: string | null = null;
  private config: WebSocketConfig;
  private audioContext: AudioContext | null = null;
  private audioQueue: ArrayBuffer[] = [];
  private isPlaying: boolean = false;
  private isAuthenticated: boolean = false; // Add this line

  constructor(config: WebSocketConfig) {
    this.config = config;
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  // Utility methods
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  async connect(): Promise<void> {
    if (this.ws?.readyState === WebSocket.OPEN && this.sessionId) {
      console.log('WebSocket already connected and session ID is set');
      return;
    }

    return new Promise<void>((resolve, reject) => {
      this.ws = new WebSocket('ws://localhost:3000');
      this.ws.binaryType = 'arraybuffer';

      const timeout = setTimeout(() => {
        reject(new Error('Connection timeout: session ID not received'));
      }, 15000);

      this.ws.onopen = () => {
        console.log('WebSocket connection opened');
        // No need to resolve yet; wait for session ID
      };

      this.ws.onerror = (event: Event) => {
        console.error('WebSocket error:', event);
        clearTimeout(timeout);
        reject(new Error('WebSocket error'));
      };

      this.ws.onmessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        this.handleMessage(event);

        if (data.type === 'session.created') {
          console.log('Received session.created message:', data);
          this.sessionId = data.session?.id;
          console.log('Assigned Session ID:', this.sessionId);

          if (this.sessionId) {
            clearTimeout(timeout);
            resolve();
          } else {
            console.error('Session ID not found in session.created message');
            reject(new Error('Session ID not found in session.created message'));
          }
        }
      };

      this.ws.onclose = (event: CloseEvent) => {
        console.log('WebSocket connection closed:', event);
        clearTimeout(timeout);
        reject(new Error('WebSocket connection closed'));
      };
    });
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data);
      console.log('Received message type:', data.type);

      switch (data.type) {
        case 'session.created':
          this.sessionId = data.session?.id;
          console.log('Assigned Session ID:', this.sessionId);
          break;

        case 'error':
          console.error('Server error:', data.error || data.message);
          this.config.onError?.(new Error(data.error || data.message || 'Unknown error from server'));
          break;

        case 'response.text.delta':
          if (data.delta?.text) {
            console.log('Received text:', data.delta.text);
            this.config.onMessage?.(data.delta.text);
          }
          break;

        case 'response.audio.delta':
          if (data.delta) {
            const audioBuffer = this.base64ToArrayBuffer(data.delta);
            console.log('Received audio delta, size:', audioBuffer.byteLength);
            this.playAudioData(audioBuffer);
          }
          break;

        case 'input_audio_buffer.committed':
          if (data.transcript) {
            console.log('Received transcript:', data.transcript);
            this.config.onTranscript?.(data.transcript);
          }
          break;

        default:
          console.warn('Unhandled message type:', data.type);
      }
    } catch (error) {
      console.error('Error handling message:', error);
      this.config.onError?.(error instanceof Error ? error : new Error(String(error)));
    }
  }

  private async playAudioData(audioData: ArrayBuffer) {
    if (!this.audioContext) {
      console.error('AudioContext not initialized');
      return;
    }

    try {
      // Create a new ArrayBuffer with WAV header
      const wavData = new ArrayBuffer(44 + audioData.byteLength);
      const view = new DataView(wavData);
      
      // Write WAV header
      const writeString = (offset: number, string: string) => {
        for (let i = 0; i < string.length; i++) {
          view.setUint8(offset + i, string.charCodeAt(i));
        }
      };

      writeString(0, 'RIFF');
      view.setUint32(4, 36 + audioData.byteLength, true);
      writeString(8, 'WAVE');
      writeString(12, 'fmt ');
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, 1, true);
      view.setUint32(24, 24000, true);
      view.setUint32(28, 48000, true);
      view.setUint16(32, 2, true);
      view.setUint16(34, 16, true);
      writeString(36, 'data');
      view.setUint32(40, audioData.byteLength, true);

      // Copy audio data
      new Uint8Array(wavData, 44).set(new Uint8Array(audioData));

      // Decode and play
      const audioBuffer = await this.audioContext.decodeAudioData(wavData);
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);
      source.start(0);

      console.log('Playing audio chunk');
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  }

  private async playNextAudio() {
    if (!this.audioContext || this.audioQueue.length === 0) {
      this.isPlaying = false;
      return;
    }

    this.isPlaying = true;

    try {
      // Ensure AudioContext is running
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
        console.log('AudioContext resumed');
      }

      const audioData = this.audioQueue.shift()!;
      console.log('Decoding audio data, size:', audioData.byteLength);
      
      const audioBuffer = await this.audioContext.decodeAudioData(audioData);
      console.log('Audio data decoded successfully');

      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);

      source.onended = () => {
        console.log('Audio chunk finished playing');
        this.isPlaying = false;
        this.playNextAudio();
      };

      console.log('Starting playback of audio chunk');
      source.start(0);
    } catch (error) {
      console.error('Error playing audio:', error);
      this.isPlaying = false;
      this.playNextAudio();
    }
  }

  async sendAudio(audioData: ArrayBuffer): Promise<void> {
    try {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN || !this.sessionId) {
        console.log('WebSocket not ready. Connecting or waiting for session ID...');
        await this.connect();
      }

      if (!this.ws) {
        throw new Error('WebSocket connection failed');
      }

      const base64Audio = this.arrayBufferToBase64(audioData);

      // Send audio data
      const appendMessage = {
        event_id: `event_${Date.now()}`,
        type: 'input_audio_buffer.append',
        audio: base64Audio
      };
      this.ws.send(JSON.stringify(appendMessage));

      // Send commit message
      const commitMessage = {
        event_id: `event_${Date.now()}`,
        type: 'input_audio_buffer.commit'
      };
      this.ws.send(JSON.stringify(commitMessage));

      console.log('Audio data sent successfully');
    } catch (error) {
      console.error('Error sending audio:', error);
      this.config.onError?.(error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }

  private handleClose(): void {
    this.ws = null;
    this.isAuthenticated = false;
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.isAuthenticated = false;
    }
  }
}
