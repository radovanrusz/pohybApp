/* eslint-disable no-console */
const express = require('express');

const router = new express.Router();
require('../db/mongoose');
const Journal = require('../models/journal');

router.post('/journal', (req, res) => {
  const journal = new Journal(req.body);
  journal.save().then(() => {
    res.send(journal);
  }).catch((error) => {
    res.status(500).send(error);
  });
});

router.get('/journal', (req, res) => {
  const {
    mvm1,
    kmat,
    mnozstvi,
    hmotnost,
  } = req.query;
  console.log(req.query);
  // eslint-disable-next-line prefer-template
  const params = {};
  if (typeof mvm1 !== 'undefined') {
    params.mvm1 = { $regex: `.*${mvm1}.*` };
  }

  if (typeof kmat !== 'undefined') {
    params.kmat = { $regex: `.*${kmat}.*` };
  }

  if (typeof mnozstvi !== 'undefined') {
    params.mnozstvi = { $eq: mnozstvi };
  }

  if (typeof hmotnost !== 'undefined') {
    params.hmotnost = { $eq: hmotnost };
  }

  Journal.find(params).limit(500).then((journal) => {
    res.send(journal);
  }).catch((error) => {
    res.status(500).send(error);
  });
});


module.exports = router;
