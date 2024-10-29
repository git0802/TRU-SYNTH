class AudioProcessor extends AudioWorkletProcessor {
    private buffer: Float32Array;
    private bufferIndex: number;
    private readonly bufferSize: number;
  
    constructor() {
      super();
      this.bufferSize = 2048;
      this.buffer = new Float32Array(this.bufferSize);
      this.bufferIndex = 0;
    }
  
    process(inputs: Float32Array[][], outputs: Float32Array[][]): boolean {
      const input = inputs[0];
      if (!input || !input[0]) return true;
  
      const inputChannel = input[0];
      
      for (let i = 0; i < inputChannel.length; i++) {
        this.buffer[this.bufferIndex++] = inputChannel[i];
        
        if (this.bufferIndex >= this.bufferSize) {
          this.port.postMessage({
            type: 'audio',
            buffer: this.buffer.slice()
          });
          
          this.bufferIndex = 0;
        }
      }
  
      return true;
    }
  }
  
  registerProcessor('audio-processor', AudioProcessor);