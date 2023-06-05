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

app.get('/', (req, res) => {
  res.send('Now using https..');
});

var server = https.createServer(options, app);

server.listen(port, () => console.log(`Example app listening on port ${port}!`))

//___________________________________________________________________________

// MQTT Mosquitto
const mqtt = require('mqtt');
const mqttServer = 'mqtt://127.0.0.1:1883';
const mqttUser = 'roger';
const mqttPassword = 'password';


const client = mqtt.connect(mqttServer);


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

//Registar

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
    res.status(400).json({ errorField: 'confirm-password', errorMessage: 'Passwords do not match' });
    return; // Return to exit the function
  }

try {
  // Check if username or email already exist in the database
  const db = admin.firestore();
  const usersCollection = db.collection('users');
  
  const existingUsername = await usersCollection.where('username', '==', user.username).get();
  if (!existingUsername.empty) {
    res.status(400).json({ errorField: 'username', errorMessage: 'Username already exists' });
    return;
  }
  
  const existingEmail = await usersCollection.where('email', '==', user.email).get();
  if (!existingEmail.empty) {
    res.status(400).json({ errorField: 'email', errorMessage: 'Email already exists' });
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
    lastLogin: Date.now()
  });

  res.status(200).json({ successMessage: 'User registered successfully' });
} catch (error) {
  res.status(400).json({ error: 'Error registering user ' + error });
}

})

app.get('/login', (req, res) => {
  const filePath = path.join(__dirname, '..', 'src', 'login.html');
  res.sendFile(filePath);
});

app.post('/login', function (req, res) {
  try {
    const db = admin.firestore();
    const userCollection = db.collection('users');

    userCollection.where('email', '==', req.body.email).get()
      .then((snapshot) => {
        if (snapshot.empty) {
          return res.status(400).json({ error: 'The email is invalid.' });
        }

        const doc = snapshot.docs[0];
        const uid = doc.id;
        const user = doc.data();

        if (user.password !== req.body.password) {
          return res.status(400).json({ error: 'Invalid password.' });
        }

        user.lastLogin = Date.now();
        userCollection.doc(uid).update(user);

        admin.auth().createCustomToken(uid)
          .then((customToken) => {
            res.status(200).json({ customToken });
          })
          .catch((error) => {
            throw error;
          });
      })
      .catch((error) => {
        throw error;
      });
  } catch (error) {
    res.status(400).json({ error: 'Error logging in: ' + error });
  }
});



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
