const mongoose = require('mongoose');

const Pohyb = mongoose.model('Pohyb', {
  mvm1: { type: String },
  mvm2: { type: String },
  kmat: { type: String },
  mnozstvi: { type: Number },
  hmotnost: { type: Number },
  datumcas_akt: { type: Date, default: Date.now }
});

module.exports = Pohyb;