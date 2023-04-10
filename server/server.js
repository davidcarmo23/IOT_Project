const express = require('express')
const app = express()
const port = 3000

// Comunicação com Arduíno -> passar para RaspberryPi
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline')

const comPort4 = new SerialPort({
path: 'COM4',
baudRate: 9600,
dataBits: 8,
stopBits: 1,
parity: 'none',
});

// Comunicação com Firestore para armazenamento cloud 
const admin = require('firebase-admin');
const serviceAccount = require('./iottesting-3b1e7-firebase-adminsdk-u0mzd-2c24538b0a.json');

admin.initializeApp({
credential: admin.credential.cert(serviceAccount),
databaseURL: 'https://iottesting-3b1e7-default-rtdb.europe-west1.firebasedatabase.app/'
});
const db = admin.firestore();

// 
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))