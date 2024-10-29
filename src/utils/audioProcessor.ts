import { API_CONFIG } from './config';

class AudioProcessor {
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private workletNode: AudioWorkletNode | null = null;
  private onAudioData: (data: ArrayBuffer) => void;
  private isRecording: boolean = false;

  constructor(onAudioData: (data: ArrayBuffer) => void) {
    this.onAudioData = onAudioData;
  }

  async start(): Promise<void> {
    try {
      console.log('Starting audio processor...');
      
      // Request microphone access
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: API_CONFIG.CHANNEL_COUNT,
          sampleRate: API_CONFIG.SAMPLE_RATE,
          echoCancellation: true,
          noiseSuppression: true
        }
      });
      console.log('Microphone access granted');

      // Create AudioContext
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: API_CONFIG.SAMPLE_RATE,
        latencyHint: 'interactive'
      });
      console.log('AudioContext created');

      // Load and register the worklet
      await this.audioContext.audioWorklet.addModule('/audioProcessor.js');
      console.log('AudioWorklet loaded');

      // Create media stream source
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      
      // Create and connect worklet node
      this.workletNode = new AudioWorkletNode(this.audioContext, 'audio-processor');
      
      // Handle audio data from worklet
      this.workletNode.port.onmessage = (e) => {
        if (e.data.type === 'audio') {
          const float32Array = e.data.buffer;
          const pcm16Data = this.float32ToPCM16(float32Array);
          this.onAudioData(pcm16Data);
        }
      };

      // Connect the audio nodes
      source.connect(this.workletNode);
      console.log('Audio processing pipeline connected');
      
      this.isRecording = true;

    } catch (error) {
      console.error('Error starting audio processor:', error);
      throw error;
    }
  }

  private float32ToPCM16(float32Array: Float32Array): ArrayBuffer {
    const pcm16 = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      // Convert Float32 to Int16
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return pcm16.buffer;
  }

  stop(): void {
    console.log('Stopping audio processor...');
    
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => {
        track.stop();
        console.log('Media track stopped');
      });
      this.mediaStream = null;
    }

    if (this.workletNode) {
      this.workletNode.disconnect();
      this.workletNode = null;
      console.log('Worklet node disconnected');
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
      console.log('AudioContext closed');
    }

    this.isRecording = false;
    console.log('Audio processor stopped');
  }
}

export default AudioProcessor;
