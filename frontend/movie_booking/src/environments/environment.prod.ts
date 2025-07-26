// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiBaseUrl: 'https://api.kgcinemas.com/v1', // Your production API URL
  movieApiUrl: 'https://api.kgcinemas.com/v1/movies',
  bookingApiUrl: 'https://api.kgcinemas.com/v1/bookings',
  enableDebug: false,
  version: '1.0.0',
  defaultLanguage: 'en',
  supportedLanguages: ['en', 'ta'],
  googleMapsApiKey: 'your-prod-key-here',
  analyticsId: 'UA-XXXXX-Z'
};