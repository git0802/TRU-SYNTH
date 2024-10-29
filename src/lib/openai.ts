import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    formData.append('model', 'whisper-1');

    const response = await openai.audio.transcriptions.create({
      file: audioBlob,
      model: 'whisper-1',
    });

    return response.text;
  } catch (error) {
    console.error('Transcription error:', error);
    throw error;
  }
};

export const generateSpeech = async (text: string): Promise<ArrayBuffer> => {
  try {
    const response = await openai.audio.speech.create({
      model: import.meta.env.VITE_SPEECH_MODEL as string,
      voice: import.meta.env.VITE_VOICE as string,
      input: text,
    });

    const arrayBuffer = await response.arrayBuffer();
    return arrayBuffer;
  } catch (error) {
    console.error('Speech generation error:', error);
    throw error;
  }
};

export const chatCompletion = async (message: string): Promise<string> => {
  try {
    const completion = await openai.chat.completions.create({
      model: import.meta.env.VITE_OPENAI_MODEL as string,
      messages: [{ role: 'user', content: message }],
      max_tokens: parseInt(import.meta.env.VITE_MAX_TOKENS as string),
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Chat completion error:', error);
    throw error;
  }
};

export default openai;