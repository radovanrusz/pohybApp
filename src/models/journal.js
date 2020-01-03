const mongoose = require('mongoose');

const Journal = mongoose.model('Journal', {
  mvm1: { type: String },
  mvm2: { type: String },
  kmat: { type: String },
  mnozstvi: { type: Number },
  hmotnost: { type: Number },
  datumcas_akt: { type: Date, default: Date.now },
  timestamp: { type: Date },
});

module.exports = Journal;
