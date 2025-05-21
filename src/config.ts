export const config = {
  api: {
    graphql: '/graphql',
    transcribe: 'http://localhost:9099/transcribe'
  },
  transcribe: {
    defaultParams: {
      lang: 'ru',
      temperature: 0.2,
      beam_size: 5
    }
  }
} as const; 