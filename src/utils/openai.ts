import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const generateResponse = async (messages: { role: 'user' | 'assistant' | 'system'; content: string }[]) => {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are an AI assistant expert specializing in helping users understand and implement AI solutions. 
          You have deep knowledge of:
          - Custom AI agent development
          - Enterprise AI integration
          - Workflow automation
          - AI workforce solutions
          
          Keep responses concise and focused on practical implementation details.
          Always maintain a professional yet approachable tone.`
        },
        ...messages
      ],
      model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-realtime-preview',
      max_tokens: parseInt(import.meta.env.VITE_MAX_TOKENS || '500'),
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response.';
  } catch (error) {
    console.error('Error generating response:', error);
    return 'I apologize, but I encountered an error while processing your request. Please try again later.';
  }
};

export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  try {
    // Convert the blob to a File object with proper naming
    const audioFile = new File([audioBlob], 'audio.wav', {
      type: 'audio/wav',
      lastModified: Date.now()
    });

    const response = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'en',
      response_format: 'text',
    });

    return response;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  }
};

export const synthesizeSpeech = async (text: string): Promise<AudioBuffer | null> => {
  try {
    const response = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'alloy',
      input: text,
    });

    const arrayBuffer = await response.arrayBuffer();
    const audioContext = new AudioContext();
    return await audioContext.decodeAudioData(arrayBuffer);
  } catch (error) {
    console.error('Error synthesizing speech:', error);
    return null;
  }
};