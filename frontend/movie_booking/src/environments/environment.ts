// src/environments/environment.ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:3000/api', // Your development API URL
  movieApiUrl: 'http://localhost:3000/api/movies',
  bookingApiUrl: 'http://localhost:3000/api/bookings',
  enableDebug: true,
  version: '1.0.0-dev',
  defaultLanguage: 'en',
  supportedLanguages: ['en', 'ta'],
  googleMapsApiKey: 'your-dev-key-here',
  analyticsId: 'UA-XXXXX-Y'
};