export const startRecording = async (stream: MediaStream, audioChunks: { current: Blob[] }) => {
  const mediaRecorder = new MediaRecorder(stream, {
    mimeType: 'audio/webm;codecs=opus'
  });
  
  audioChunks.current = [];

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      audioChunks.current.push(event.data);
    }
  };

  mediaRecorder.start(100); // Collect data every 100ms for smoother chunks
  return mediaRecorder;
};

export const stopRecording = async (mediaRecorder: MediaRecorder, audioChunks: { current: Blob[] }): Promise<Blob | null> => {
  return new Promise((resolve) => {
    mediaRecorder.onstop = async () => {
      // Create a blob from the audio chunks
      const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
      
      // Convert webm to wav format
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioContext = new AudioContext();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      // Create WAV blob
      const wavBlob = await convertToWav(audioBuffer);
      resolve(wavBlob);
    };
    
    mediaRecorder.stop();
  });
};

const convertToWav = async (audioBuffer: AudioBuffer): Promise<Blob> => {
  const numOfChannels = audioBuffer.numberOfChannels;
  const length = audioBuffer.length * numOfChannels * 2;
  const buffer = new ArrayBuffer(44 + length);
  const view = new DataView(buffer);
  
  // Write WAV header
  writeUTFBytes(view, 0, 'RIFF');
  view.setUint32(4, 36 + length, true);
  writeUTFBytes(view, 8, 'WAVE');
  writeUTFBytes(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numOfChannels, true);
  view.setUint32(24, audioBuffer.sampleRate, true);
  view.setUint32(28, audioBuffer.sampleRate * 2 * numOfChannels, true);
  view.setUint16(32, numOfChannels * 2, true);
  view.setUint16(34, 16, true);
  writeUTFBytes(view, 36, 'data');
  view.setUint32(40, length, true);

  // Write audio data
  const data = new Float32Array(audioBuffer.length * numOfChannels);
  let offset = 44;
  
  for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
    data.set(audioBuffer.getChannelData(i), i * audioBuffer.length);
  }

  for (let i = 0; i < data.length; i++) {
    const sample = Math.max(-1, Math.min(1, data[i]));
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
    offset += 2;
  }

  return new Blob([buffer], { type: 'audio/wav' });
};

const writeUTFBytes = (view: DataView, offset: number, string: string) => {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
};