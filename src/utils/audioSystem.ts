import { WavRecorder } from '../lib/audio/wav_recorder';
import { WavStreamPlayer } from '../lib/audio/wav_stream_player';
import { API_CONFIG } from './config';

export class AudioSystem {
  private recorder: WavRecorder;
  private player: WavStreamPlayer;
  private onAudioData: (data: ArrayBuffer) => void;
  private audioContext: AudioContext;

  constructor(onAudioData: (data: ArrayBuffer) => void) {
    this.onAudioData = onAudioData;
    this.audioContext = new AudioContext({
      sampleRate: API_CONFIG.SAMPLE_RATE,
      latencyHint: 'interactive'
    });

    this.recorder = new WavRecorder({
      sampleRate: API_CONFIG.SAMPLE_RATE,
      outputToSpeakers: false,
      debug: true
    });

    this.player = new WavStreamPlayer({
      sampleRate: API_CONFIG.SAMPLE_RATE
    });
  }

  async startRecording(): Promise<void> {
    await this.recorder.begin();
    await this.recorder.record((data) => {
      // Convert to PCM16 format expected by OpenAI
      const pcm16Data = this.convertToPCM16(data.mono);
      this.onAudioData(pcm16Data.buffer);
    }, API_CONFIG.AUDIO_CHUNK_SIZE);
  }

  private convertToPCM16(floatData: Float32Array): Int16Array {
    const pcm16Data = new Int16Array(floatData.length);
    for (let i = 0; i < floatData.length; i++) {
      const s = Math.max(-1, Math.min(1, floatData[i]));
      pcm16Data[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return pcm16Data;
  }

  async stopRecording(): Promise<void> {
    if (this.recorder) {
      await this.recorder.end();
    }
  }

  async playAudio(audioBuffer: ArrayBuffer): Promise<void> {
    if (!this.player) {
      await this.player.connect();
    }
    // Ensure the audio buffer is in the correct format
    const audioData = new Int16Array(audioBuffer);
    this.player.add16BitPCM(audioData);
  }

  async cleanup(): Promise<void> {
    await this.stopRecording();
    if (this.player) {
      await this.player.disconnect();
    }
  }
}
