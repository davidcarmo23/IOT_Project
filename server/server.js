// Variaveis de ambiente
const express = require('express')
const app = express()
const port = 3000

// Firebase
const admin = require('firebase-admin');

const serviceAccount = require('./iottesting-3b1e7-firebase-adminsdk-u0mzd-2c24538b0a.json');


// MQTT Mosquitto
const mqtt = require('mqtt');
const mqttServer = 'mqtt://127.0.0.1:1883';
const mqttUser = 'roger';
const mqttPassword = 'password';


const client = mqtt.connect(mqttServer);



//Inicialização da Comunicação com o Firestore
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://iottesting-3b1e7-default-rtdb.europe-west1.firebasedatabase.app/'
    });
    console.log("Firestore Connection successful")
} catch (error) {
  console.log("Firestore Connection error  " + error);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.listen(port, () => console.log(`listening on port ${port}!`))

// Inicialização da Comunicação com o broker MQTT e subscrição aos tópicos
const temperatureTopic = '+/temperatura';
const luminosidadeTopic = '+/luminosidade';
const movimentoTopic = '+/movimento';
const luzesTopic = '+/luzes';
const fogoTopic = '+/fogo';
const humidadeTopic = '+/humidade';
client.on("connect",function(){	
  console.log("connected");
  client.subscribe(temperatureTopic, luminosidadeTopic, movimentoTopic, luzesTopic, fogoTopic, humidadeTopic);
  
})


//Por ACABAR
client.on('message', function(topic, message, packet){

  //arranjar maneira de passar o ip do cliente para o server 
  //ou seja userid/temperatura

  const associated_user = topic.split('/')[0]
  const topic_ext = topic.split('/')[1]
  console.log(associated_user)
  console.log(topic_ext)

  //converter a mensgem para string
  console.log(Buffer.from(message).toString('utf8'))

  const db = admin.firestore();
  const userCollection = db.collection('users')

    userCollection.where('username', '==', associated_user).get().then((snapshot) => {
      if (snapshot.empty) {
        console.log('No matching documents.');
        return;
      }else{
        snapshot.forEach(async doc => {
          const uid = doc.id;
          console.log(uid)

          if(topic_ext == "temperatura"){

            try {
              var today = new Date();
              var month = today.getUTCMonth() + 1;
              var day = today.getUTCDate();
              var year = today.getUTCFullYear();

              var databaseRef = db.collection('users/' + uid + '/temperatura').doc(year + "-" + month + "-" + day + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds())

              const tempDoc = await databaseRef.set({
                temperatura: Buffer.from(message).toString('utf8')
              })

            } catch (error) {
              console.log("Error getting doc " + error);
            }
        
          }
        
          if(topic_ext == "luminosidade"){
        
            try {
              var today = new Date();
              var month = today.getUTCMonth() + 1;
              var day = today.getUTCDate();
              var year = today.getUTCFullYear();

              var databaseRef = db.collection('users/' + uid + '/luminosidade').doc(year + "-" + month + "-" + day + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds())

              const tempDoc = await databaseRef.set({
                luminosidade: Buffer.from(message).toString('utf8')
              })

            } catch (error) {
              console.log("Error getting doc " + error);
            }
         
          }
        
          if(topic_ext == "movimento"){
        
            try {
              var today = new Date();
              var month = today.getUTCMonth() + 1;
              var day = today.getUTCDate();
              var year = today.getUTCFullYear();

              var databaseRef = db.collection('users/' + uid + '/movimento').doc(year + "-" + month + "-" + day + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds())

              const tempDoc = await databaseRef.set({
                movimento: Buffer.from(message).toString('utf8')
              })

            } catch (error) {
              console.log("Error getting doc " + error);
            }
        
          }
        
          if(topic_ext == "luzes"){
            
            try {
              var today = new Date();
              var month = today.getUTCMonth() + 1;
              var day = today.getUTCDate();
              var year = today.getUTCFullYear();

              var databaseRef = db.collection('users/' + uid + '/luzes').doc(year + "-" + month + "-" + day + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds())

              const tempDoc = await databaseRef.set({
                luzes: Buffer.from(message).toString('utf8')
              })

            } catch (error) {
              console.log("Error getting doc " + error);
            }
        
          }
        
          if(topic_ext == "fogo"){
        
            try {
              var today = new Date();
              var month = today.getUTCMonth() + 1;
              var day = today.getUTCDate();
              var year = today.getUTCFullYear();

              var databaseRef = db.collection('users/' + uid + '/fogo').doc(year + "-" + month + "-" + day + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds())

              const tempDoc = await databaseRef.set({
                fogo: Buffer.from(message).toString('utf8')
              })

            } catch (error) {
              console.log("Error getting doc " + error);
            }
        
          }
        
          if(topic_ext == "humidade"){
        
            try {
              var today = new Date();
              var month = today.getUTCMonth() + 1;
              var day = today.getUTCDate();
              var year = today.getUTCFullYear();

              var databaseRef = db.collection('users/' + uid + '/humidade').doc(year + "-" + month + "-" + day + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds())

              const tempDoc = await databaseRef.set({
                humidade: Buffer.from(message).toString('utf8')
              })

            } catch (error) {
              console.log("Error getting doc " + error);
            }
        
          }

        })
      }
    }).catch((error) => {
      res.status(400).send('Error identifying connection ' + error);
    })
})

client.on("error",function(error){
  client.reconnect();
});

////////////////////////////////////////////////// Registo/Login/Logout POR TESTAR//////////////////////////////////////////////////
app.post('/register', async function (req, res) {
  console.log(req.body);
  var user = {username: req.body.username, password: req.body.password, email: req.body.email, ip_address: req.body.ip_address}
  
  try {
    const userRegistration = await admin.auth().createUser({
      email: user.email,
      password: user.password,
      displayName: user.username,
      emailVerified: false,
      disabled: false
    })
  
    const userUID = userRegistration.uid;
    
    const db = admin.firestore();
    const userRef = db.collection('users').doc(userUID);
    const userDoc = await userRef.set({
      username: user.username,
      email: user.email,
      password: user.password,
      lastLogin: Date.now(),
      ip_address: user.ip_address
    })
  
    res.status(200).send('User registered ' + userRegistration);
  } catch (error) {
    res.status(400).send('Error registering user ' + error);
  }

})

app.post('/login', function (req, res) { 
  try {
    const db = admin.firestore();
    const userCollection = db.collection('users')
    
    userCollection.where('email', '==', req.body.email).get().then((snapshot) => {
      if (snapshot.empty) {
        console.log('No matching documents.');
        return;
      }else{
        snapshot.forEach(doc => {
          const uid = doc.id;

          const user = doc.data();
          user.lastLogin = Date.now();
          userCollection.doc(uid).update(user);

          admin.auth().createCustomToken(uid).then((customToken) => {
            res.status(200).send(customToken);
          }).catch((error) => {
            res.status(400).send('Error logging in ' + error);
          })

        })
      }
    }).catch((error) => {
      res.status(400).send('Error logging in ' + error);
    })
  }catch (error) {
    res.status(400).send('Error logging in ' + error);
  }
})

app.post('/logout', function (req, res) { 

  try {
    auth.signOut()
  } catch (error) {
    console.log('Error logging out ' + error);
  }

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

//Obter estado das janelas
app.get('/WindowsState', function (req, res) {
  //ler do firestore o estado das janelas
  res.send('Windows state is ' + state);
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


///////////////////////////////////////////// Humidity Related //////////////////////////////////////////////////
//Ler estado da humidade
app.get('/HumidityState', function (req, res) {
})
