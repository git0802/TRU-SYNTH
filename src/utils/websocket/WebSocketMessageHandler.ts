export class WebSocketMessageHandler {
  private audioContext: AudioContext | null = null;
  private audioQueue: ArrayBuffer[] = [];
  private isPlaying = false;

  constructor(
    private onMessage: ((text: string) => void) | undefined,
    private onTranscript: ((text: string) => void) | undefined,
    private onAudio: ((buffer: ArrayBuffer) => void) | undefined,
    private onError: (error: any) => void
  ) {
    this.audioContext = new AudioContext({
      sampleRate: 24000,
      latencyHint: 'interactive'
    });
  }

  handleMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data);
      console.log('WebSocketMessageHandler: Received data:', data);
      
      switch (data.type) {
        case 'error':
          console.error('Server Error:', data);
          this.handleError(data.error || data);
          break;

        case 'session.authenticated':
          console.log('WebSocketMessageHandler: Authentication successful.');
          break;

        case 'session.updated':
          console.log('Session updated:', data.session);
          break;

        case 'response.text.delta':
          if (data.delta?.text && this.onMessage) {
            this.onMessage(data.delta.text);
          }
          break;

        case 'input_audio_buffer.committed':
          if (data.transcript && this.onTranscript) {
            this.onTranscript(data.transcript);
          }
          break;

        case 'response.audio.delta':
          if (data.delta?.audio && this.onAudio) {
            const audioBuffer = Buffer.from(data.delta.audio, 'base64');
            this.onAudio(audioBuffer);
            this.queueAudioPlayback(audioBuffer);
          }
          break;

        case 'turn.end':
          // Handle end of turn if needed
          break;

        case 'auth.success':
          console.log('Authentication successful');
          break;

        case 'auth.error':
          this.handleError({
            type: 'auth_error',
            message: data.error || 'Authentication failed',
            originalError: data
          });
          break;

        default:
          console.warn('WebSocketMessageHandler: Unhandled message type:', data.type);
      }
    } catch (error) {
      console.error('WebSocketMessageHandler: Error handling message:', error);
      this.handleError({
        type: 'message_parsing_error',
        message: 'Failed to parse WebSocket message',
        originalError: error
      });
    }
  }

  private async queueAudioPlayback(audioBuffer: ArrayBuffer) {
    this.audioQueue.push(audioBuffer);
    if (!this.isPlaying) {
      this.playNextAudio();
    }
  }

  private async playNextAudio() {
    if (!this.audioQueue.length || !this.audioContext) return;
    
    this.isPlaying = true;
    const buffer = this.audioQueue.shift()!;

    try {
      const audioBuffer = await this.audioContext.decodeAudioData(buffer);
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);
      
      source.onended = () => {
        this.isPlaying = false;
        this.playNextAudio();
      };

      source.start();
    } catch (error) {
      console.error('Error playing audio:', error);
      this.isPlaying = false;
      this.playNextAudio();
    }
  }

  private handleError(error: any): void {
    const errorMessage = {
      type: error.type || 'unknown_error',
      message: error.message || 'An unknown error occurred',
      originalError: error
    };

    this.onError(errorMessage);
  }
}
