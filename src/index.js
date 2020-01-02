/* eslint-disable no-console */
const kafkaHost = process.env.KAFKA_HOST;
const kafkaPort = process.env.KAFKA_PORT;
const kafkaTopic = process.env.KAFKA_TOPIC;
const express = require('express');
require('./db/mongoose');
const kafka = require('kafka-node');
const Pohyb = require('./models/pohyb');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());


let mDate = new Date();
let mDateStr = mDate.toString('dddd MMM yyyy h:mm:ss');

try {
  console.log(`${mDateStr}: Kafka Consumer is booting up ... (ENVs: kafkaHost:${kafkaHost}; kafkaTopic:${kafkaTopic}; kafkaHost:${kafkaHost}; kafkaPort:${kafkaPort};)`);

  const client = new kafka.KafkaClient({ kafkaHost: `${kafkaHost}:${kafkaPort}` });
  const topics = [
    {
      topic: kafkaTopic,
      partition: 0,
    },
  ];
  const options = {
  // autoCommit: true,
    autoCommit: false,
    fetchMaxWaitMs: 1000,
    fetchMaxBytes: 1024 * 1024,
    encoding: 'utf8',
    fromOffset: false,
  };

  const consumer = new kafka.Consumer(client, topics, options);
  // consumer.setOffset(kafkaTopic, 0, 0);

  client.on('ready', () => {
    console.log('Client ready!');
  });

  consumer.on('offsetOutOfRange', (err) => {
    console.log(`Kafka offsetOutOfRange: ${err}`);
  });

  consumer.on('message', async (message) => {
    mDate = new Date();
    mDateStr = mDate.toString('dddd MMM yyyy h:mm:ss');
    console.log(`${mDateStr} : consumer.on() invoked.`);
    // console.log(message.value);

    const pohyb = new Pohyb(JSON.parse(message.value));
    pohyb.save().then(() => {
      consumer.commit((err, dta) => {
        if (err) {
          mDate = new Date();
          mDateStr = mDate.toString('dddd MMM yyyy h:mm:ss');
          console.log(`${mDateStr}: Error: ${err}`);
        } else {
          mDate = new Date();
          mDateStr = mDate.toString('dddd MMM yyyy h:mm:ss');
          console.log(`${mDateStr} : Commit success: `, dta);
        }
      });
      mDate = new Date();
      mDateStr = mDate.toString('dddd MMM yyyy h:mm:ss');
      console.log(`${mDateStr} : Journal record saved successfully: ${message.value}`);
    }).catch((error) => {
      mDate = new Date();
      mDateStr = mDate.toString('dddd MMM yyyy h:mm:ss');
      console.log(`${mDateStr}: journalrec.save() error: ${error}`);
    });
  });

  consumer.on('error', (err) => {
    mDate = new Date();
    mDateStr = mDate.toString('dddd MMM yyyy h:mm:ss');
    console.log(`${mDateStr} : Consumer on error ${err}`);
  });
} catch (e) {
  console.log(e);
}

app.post('/pohyby', (req, res) => {
  const pohyb = new Pohyb(req.body);
  pohyb.save().then(() => {
    res.send(pohyb);
  }).catch((error) => {
    res.status(500).send(error);
  });
});

app.get('/pohyby', (req, res) => {
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

  Pohyb.find(params).limit(5).then((pohyby) => {
    res.send(pohyby);
  }).catch((error) => {
    res.status(500).send(error);
  });
});

app.listen(port, () => {
  console.log('Server running on port ', port);
});
