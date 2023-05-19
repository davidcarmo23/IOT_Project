// Variaveis de ambiente
const express = require('express')
const app = express()
const port = 3000
// Firebase
const admin = require('firebase-admin');
const serviceAccount = require('./iottesting-3b1e7-firebase-adminsdk-u0mzd-2c24538b0a.json');
// MQTT Mosquitto
const mqtt = require('mqtt');
const mqttServer = 'mqtt://IP_DO_BROKER';
const mqttUser = 'USUARIO_MQTT';
const mqttPassword = 'SENHA_MQTT';

// Inicialização da Comunicação com o broker MQTT
try {
  const client = mqtt.connect(mqttServer, {
    username: mqttUser,
    password: mqttPassword
  });
  console.log("connected flag  " + client.connected);
} catch (error) {
  console.log("Mosquitto Connection error  " + error);
}


//Inicialização da Comunicação com o Firestore
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://iottesting-3b1e7-default-rtdb.europe-west1.firebasedatabase.app/'
    });
    const db = admin.firestore();
} catch (error) {
  console.log("Firestore Connection error  " + error);
}

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

////////////////////////////////////////////////// Registo/Login //////////////////////////////////////////////////
app.post('/register', function (req, res) {
  console.log(req.body);
  var user = {username: req.body.username, password: req.body.password, email: req.body.email}
  //usar o firebase para guardar o user

  res.send('User registered ' + user);
})

app.post('/login', function (req, res) { 
  console.log(req.body);
  var user = {username: req.body.username, password: req.body.password}
  //usar cookies para manter a sessão iniciada ´
  
  res.send('User logged in ' + user);
})


////////////////////////////////////////////////// Funções Sensores Related //////////////////////////////////////////////////
// Receber dados do tópico temperatura e guardar no Firestore (Tudo numa função ou separadas ????? )
// Utilizar JSON.parse para converter a string recebida em JSON (tem de se enviar como JSON do arduino)
client.on('message', (topic, message) => {
  if (topic === 'temperatura') {
    console.log('Temperatura: ' + message.toString() + '°C');
    db.collection('temperatura').add({
      temperatura: message.toString(),
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      username: 'admin'
    });
  }
});

//Alterar estado das janelas baseado no seu ID
app.post('/ChangeWindowState', function (req, res) {
  console.log(req.body);
  var state = {mode: req.body.mode, windowID: req.body.windowID}
  var topic = "WindowsState";
  client.publish(topic, state);
  res.send('State changed to ' + state);
})

//Alterar estado das janelas baseado na divisão da casa
app.post('/WindowsDivision', function (req, res) {
  console.log(req.body);
  var state = {mode: req.body.mode, division: req.body.Division}
  var topic = "WindowsState";
  client.publish(topic, state);
  res.send('State changed to ' + state);
})

//Alterar estado das luzes baseado no seu ID
app.post('/ChangeLightState', function (req, res) {
  var state = {state: req.body.state, lightID: req.body.lightID}
  var topic = "LightsState";
  client.publish(topic, state);
  res.send('State changed to ' + state);
})


//Alterar estado das luzes baseado na divisão da casa
app.post('/LightsDivision', function (req, res) {
  var state = {mode: req.body.mode, division: req.body.division}
  var topic = "LightsDivision";
  client.publish(topic, mode);
  res.send('Mode changed to ' + mode);
})