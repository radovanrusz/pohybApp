/* eslint-disable no-console */
const express = require('express');
require('./db/mongoose');
const Pohyb = require('./models/pohyb');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json())


app.post('/pohyby', (req, res)=>{
  const pohyb = new Pohyb(req.body);
  pohyb.save().then(()=>{
    res.send(pohyb);
  }).catch((error)=>{res.status(500).send(error);
  })
});

app.get('/pohyby', (req, res) => {
  const { mvm1, kmat, mnozstvi, hmotnost } = req.query;
  console.log(req.query);
  // eslint-disable-next-line prefer-template
  const params = {};
  if (typeof mvm1 !== 'undefined')
  {
    params.mvm1 = { $regex: '.*' + mvm1 + '.*'};
  }
  if (typeof kmat !== 'undefined')
  {
    params.kmat = { $regex: '.*' + kmat + '.*' };
  }

  if (typeof mnozstvi !== 'undefined')
  {
    params.mnozstvi = { $eq: mnozstvi };
  }

  if (typeof hmotnost !== 'undefined')
  {
    params.hmotnost = { $eq: hmotnost };
  }

  Pohyb.find(params).limit(5).then((pohyby) => {
    res.send(pohyby);
  }).catch((error) => {
    res.status(500).send(error);
  });
});

app.listen(port, () => {
  console.log('Server running on port ', port);
});
