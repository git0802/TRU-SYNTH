export const API_CONFIG = {
  MODEL: 'gpt-4o-realtime-preview-2024-10-01',
  VOICE: 'alloy',
  SAMPLE_RATE: 24000,
  CHANNEL_COUNT: 1,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  CONNECTION_TIMEOUT: 15000,
  AUDIO_CHUNK_SIZE: 2048,
  WEBSOCKET_URL: 'wss://api.openai.com/v1/realtime',
  AUDIO_FORMAT: {
    type: 'pcm16',
    sample_rate: 24000,
    channel_count: 1,
    bits_per_sample: 16
  }
};
