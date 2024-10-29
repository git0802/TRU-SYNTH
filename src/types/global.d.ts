interface Window {
  webkitAudioContext: typeof AudioContext;
}

// Add this if you don't have global.d.ts
interface AudioWorkletProcessor {
  readonly port: MessagePort;
  process(
    inputs: Float32Array[][],
    outputs: Float32Array[][],
    parameters: Record<string, Float32Array>
  ): boolean;
}

declare var AudioWorkletProcessor: {
  prototype: AudioWorkletProcessor;
  new (options?: any): AudioWorkletProcessor;
};

declare function registerProcessor(
  name: string,
  processorCtor: typeof AudioWorkletProcessor
): void;
