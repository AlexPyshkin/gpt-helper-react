export const config = {
  api: {
    graphql: '/graphql',
    transcribe: 'https://whisper-api.alexpyshkin.top/transcribe'
  },
  transcribe: {
    defaultParams: {
      lang: 'ru',
      temperature: 0.2,
      beam_size: 5
    }
  }
} as const; 