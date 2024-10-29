class AudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.bufferSize = 2400; // 100ms at 24kHz
    this.buffer = new Float32Array(this.bufferSize);
    this.bufferIndex = 0;
    this.sampleRate = 24000;
  }

  process(inputs, outputs) {
    const input = inputs[0];
    if (!input || !input[0]) return true;

    const inputChannel = input[0];
    
    for (let i = 0; i < inputChannel.length; i++) {
      this.buffer[this.bufferIndex] = inputChannel[i];
      this.bufferIndex++;

      if (this.bufferIndex >= this.bufferSize) {
        // Convert to Int16 before sending
        const int16Data = new Int16Array(this.bufferSize);
        for (let j = 0; j < this.bufferSize; j++) {
          const s = Math.max(-1, Math.min(1, this.buffer[j]));
          int16Data[j] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        
        this.port.postMessage({
          type: 'audio',
          buffer: int16Data.buffer
        }, [int16Data.buffer]);
        
        this.buffer = new Float32Array(this.bufferSize);
        this.bufferIndex = 0;
      }
    }

    return true;
  }
}

registerProcessor('audio-processor', AudioProcessor);
