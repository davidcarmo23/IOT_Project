// Variaveis de ambiente
const express = require('express')
const app = express()
const port = 3000

// Firebase
const admin = require('firebase-admin');
const serviceAccount = require('./iottesting-3b1e7-firebase-adminsdk-u0mzd-2c24538b0a.json');

// MQTT Mosquitto
const mqtt = require('mqtt');
const mqttServer = 'mqtt://127.0.0.1:1890';
const mqttUser = 'roger';
const mqttPassword = 'password';


const client = mqtt.connect(mqttServer);
// Inicialização da Comunicação com o broker MQTT e subscrição aos tópicos

client.on("connect",function(){	
  console.log("connected");
  client.subscribe('temperatura','luminosidade','movimento','luzes','fogo', console.log);
 // client.publish('temperatura', '20');
})

client.on('message', function(topic, message, packet){
  console.log("message is "+ message);
  console.log("topic is "+ topic);
  if(topic == "temperatura"){

  }else if(topic == "luminosidade"){
    
  }else if(topic == "movimento"){
    
  }else if(topic == "luzes"){
    
  }else if(topic == "fogo"){
    
  }
  
})

client.on("error",function(error){
  console.log("Can't connect" + error);
  client.reconnect();
});

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


////////////////////////////////////////////////// Funções Sensores Related /////////////////////////////////////////
// Receber dados do tópico temperatura e guardar no Firestore (Tudo numa função ou separadas ????? )
// Utilizar JSON.parse para converter a string recebida em JSON (tem de se enviar como JSON do arduino)
client.publish('temperatura', '20');

////////////////////////////////////////////////// Temperatura Related /////////////////////////////////////////
app.get('/temperature', function (req, res) {
  //ler do firestore a temperatura


  res.send('Temperature is ' + temperature);
})

app.post('/temperature', function (req, res) {
  //usar o firebase para guardar a temperatura

  res.send('Temperature is ' + temperature);
})


///////////////////////////////////////////////// Windows Related //////////////////////////////////////////////////

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


//////////////////////////////////////////// Lights Related //////////////////////////////////////////////////
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
  client.publish(topic, state);
  res.send('Mode changed to ' + mode);
})

///////////////////////////////////////////// Fire Related //////////////////////////////////////////////////
//Ler estado do fogo
app.get('/FireState', function (req, res) {
  
})

///////////////////////////////////////////// Motion Related //////////////////////////////////////////////////
//Ler estado do movimento (tentar fazer com que dependendo do estado de segurança, ativar o buzzer ou apenas enviar notificação)
app.get('/MotionState', function (req, res) {
  
})