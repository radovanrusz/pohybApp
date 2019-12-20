const express = require('express');
require('./db/mongoose');
const Pohyb = require('./models/pohyb');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/pohyby', (req, res)=>{
    const pohyb = new Pohyb(req.body);
    pohyb.save().then(()=>{res.send(pohyb);
    }).catch((error)=>{res.status(500).send(error);
    })
});

app.get('/pohyby',(req, res)=>{
    Pohyb.find({}).then((pohyby)=>{
        res.send(pohyby);
    }).catch((error)=>{
        res.status(500).send(error);
    });
});

app.listen(port, ()=>{
    console.log('Server running on port ', port);
});












