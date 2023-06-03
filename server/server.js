//variaveis globais
const express = require('express')
const path = require('path');
const mime = require('mime');

// Variaveis do https
const https = require('https');
var fs = require('fs');
var key  = fs.readFileSync('../cert/key.pem', 'utf8');
var cert = fs.readFileSync('../cert/cert.pem', 'utf8');
var options = {
  key: key,
  cert: cert
};

// Variaveis
const app = express()
const port = 3000

//opções
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//para o css
app.use(express.static(path.join(__dirname, '/../src'), {
  setHeaders: (res, filePath) => {
    const mimeType = mime.getType(filePath);
    if (mimeType.startsWith('text/css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));


// Firebase
const admin = require('firebase-admin');
const credentials = require('./iottesting-3b1e7-firebase-adminsdk-u0mzd-2c24538b0a.json');

//Inicialização da Comunicação com o Firestore
try {
  admin.initializeApp({
    credential: admin.credential.cert(credentials),
    databaseURL: 'https://iottesting-3b1e7-default-rtdb.europe-west1.firebasedatabase.app/'
    });
    const db = admin.firestore();
} catch (error) {
  console.log("Firestore Connection error  " + error);
}

//Registar
// Serve the registration form
app.get('/register', (req, res) => {
  const filePath = path.join(__dirname, '..', 'src', 'register.html');
  res.sendFile(filePath);
});

app.post('/register', async function (req, res) {
  var user = {
    username: req.body.username,
    password: req.body.password,
    confirmPassword: req.body['confirm-password'], // Access confirm-password field
    email: req.body.email
  }
  
  // Check if passwords match
  if (user.password !== user.confirmPassword) {
    res.status(400).send('Passwords do not match');
    return; // Return to exit the function
  }

try {
  // Check if username or email already exist in the database
  const db = admin.firestore();
  const usersCollection = db.collection('users');
  
  const existingUsername = await usersCollection.where('username', '==', user.username).get();
  if (!existingUsername.empty) {
    res.status(400).send('Username already exists');
    return;
  }
  
  const existingEmail = await usersCollection.where('email', '==', user.email).get();
  if (!existingEmail.empty) {
    res.status(400).send('Email already exists');
    return;
  }
  
  // If username and email are unique, proceed with user registration
  const userRegistration = await admin.auth().createUser({
    email: user.email,
    password: user.password,
    displayName: user.username,
    emailVerified: false,
    disabled: false
  });

  const userUID = userRegistration.uid;
  
  const userRef = db.collection('users').doc(userUID);
  const userDoc = await userRef.set({
    username: user.username,
    email: user.email,
    password: user.password,
    lastLogin: Date.now()
  });

  res.status(200).send('User registered ' + userRegistration);
} catch (error) {
  res.status(400).send('Error registering user ' + error);
}

})


app.get('/', (req, res) => {
  res.send('Now using https..');
});

var server = https.createServer(options, app);

server.listen(port, () => console.log(`Example app listening on port ${port}!`))

//___________________________________________________________________________

// MQTT Mosquitto
const mqtt = require('mqtt');
const mqttServer = 'mqtt://127.0.0.1:1890';
const mqttUser = 'roger';
const mqttPassword = 'password';


const client = mqtt.connect(mqttServer);
// Inicialização da Comunicação com o broker MQTT e subscrição aos tópicos

/*
client.on("connect",function(){	
  console.log("connected");
  client.subscribe('temperatura','luminosidade','movimento','luzes','fogo', console.log);
  
})

//Por ACABAR
client.on('message', function(topic, message, packet){
  console.log("message is "+ message);
  console.log("topic is "+ topic);

  var user = auth.currentUser;

  if(topic == "temperatura"){

    try {
      var databaseRef = database.ref('users/' + user.uid + '/temperatura');
    } catch (error) {
      console.log("Error getting user " + error);
    }

  }

  if(topic == "luminosidade"){

    try {
      var databaseRef = database.ref('users/' + user.uid + '/luminosidade');
    } catch (error) {
      console.log("Error getting user " + error);
    }
 
  }

  if(topic == "movimento"){

    try {
      var databaseRef = database.ref('users/' + user.uid + '/movimento');
    } catch (error) {
      console.log("Error getting user " + error);
    }

  }

  if(topic == "luzes"){
    
    try {
      var databaseRef = database.ref('users/' + user.uid + '/luzes');
    } catch (error) {
      console.log("Error getting user " + error);
    }

  }

  if(topic == "fogo"){

    try {
      var databaseRef = database.ref('users/' + user.uid + '/fogo');
    } catch (error) {
      console.log("Error getting user " + error);
    }

  }

  if(topic == "humidade"){

    try {
      var databaseRef = database.ref('users/' + user.uid + '/humidade');
    } catch (error) {
      console.log("Error getting user " + error);
    }

  }
  
})

client.on("error",function(error){
  console.log("Can't connect" + error);
  client.reconnect();
});
*/



////////////////////////////////////////////////// Registo/Login/Logout POR TESTAR//////////////////////////////////////////////////

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
