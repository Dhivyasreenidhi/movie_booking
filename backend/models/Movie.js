const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  genre: { type: [String], default: [] },
  releaseDate: { type: Date },
  duration: { type: Number }, // in minutes
  director: { type: String },
  cast: { type: [String], default: [] },
  language: { type: String },
  posterUrl: { type: String },
  trailerUrl: { type: String },
  userRating: { type: Number, default: 0 },
  votes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Movie', movieSchema);
