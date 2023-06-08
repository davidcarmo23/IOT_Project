//variaveis globais
const express = require('express')
const path = require('path');
const mime = require('mime');
const cookieParser = require('cookie-parser');
const authRoute = require('./auth');
const commandsRoute = require('./commands');
const data_retrievalRoute = require('./data_retrieval');

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
app.use(cookieParser());
//para o css
app.use(express.static(path.join(__dirname, '/../src'), {
  setHeaders: (res, filePath) => {
    const mimeType = mime.getType(filePath);
    if (mimeType.startsWith('text/css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

app.use("/auth", authRoute);
app.use("/commands", commandsRoute);
app.use("/data_retrieval", data_retrievalRoute);

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
const mqttUser = 'admin';
const mqttPassword = 'admin';


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
      } else {
        snapshot.forEach(async doc => {
          const uid = doc.id;

          var today = new Date();
          var month = (today.getUTCMonth() + 1 < 10 ? '0' : '') + (today.getUTCMonth() + 1);
          var day = (today.getUTCDate() < 10 ? '0' : '') + today.getUTCDate();
          var year = today.getUTCFullYear();

          // FEITO
          if (topic_ext == "temperatura") {

            try {
              var date = year + "-" + month + "-" + day;
              var temperatura = parseInt(Buffer.from(message).toString('utf8'));

              // Ler array
              var databaseRef = db.collection('users').doc(uid);
              const tempDoc = await databaseRef.get();
              const tempObj = tempDoc.data().temperatura;

              if (tempObj == null || tempObj[date] == null) {
                // Inserir temperatura pela primeira vez
                const path = "temperatura." + date;
                const res = await databaseRef.update({
                  [path]: [temperatura]
                })


              } else {
                // Atualizar array
                const original_array = tempObj[date];
                original_array.push(temperatura)

                // Escrever array
                const path = "temperatura." + date;
                const res = await databaseRef.update({
                  [path]: original_array
                })
              }


            } catch (error) {
              console.log("Error getting doc " + error);
            }

          }

          // FEITO
          if (topic_ext == "humidade") {

            try {
              var date = year + "-" + month + "-" + day;
              var humidade = parseInt(Buffer.from(message).toString('utf8'));

              // Ler array
              var databaseRef = db.collection('users').doc(uid);
              const humDoc = await databaseRef.get();
              const humObj = humDoc.data().humidade;

              if (humObj == null || humObj[date] == null) {
                // Inserir humidade pela primeira vez
                const path = "humidade." + date;
                const res = await databaseRef.update({
                  [path]: [humidade]
                })


              } else {
                // Atualizar array
                const original_array = humObj[date];
                original_array.push(humidade)

                // Escrever array
                const path = "humidade." + date;
                const res = await databaseRef.update({
                  [path]: original_array
                })
              }


            } catch (error) {
              console.log("Error getting doc " + error);
            }

          }
        
          // FEITO
          if (topic_ext == "luminosidade") {

            try {
              var date = year + "-" + month + "-" + day;
              var luminosidade = parseInt(Buffer.from(message).toString('utf8'));

              // Ler array
              var databaseRef = db.collection('users').doc(uid);
              const lumDoc = await databaseRef.get();
              const lumObj = lumDoc.data().luminosidade;

              if (lumObj == null || lumObj[date] == null) {
                // Inserir luminosidade pela primeira vez
                const path = "luminosidade." + date;
                const res = await databaseRef.update({
                  [path]: [luminosidade]
                })


              } else {
                // Atualizar array
                const original_array = lumObj[date];
                original_array.push(luminosidade)

                // Escrever array
                const path = "luminosidade." + date;
                const res = await databaseRef.update({
                  [path]: original_array
                })
              }


            } catch (error) {
              console.log("Error getting doc " + error);
            }

          }

          // FEITO
          if (topic_ext == "fogo") {

            try {
              var databaseRef = db.collection('users').doc(uid);

              const res = await databaseRef.update({
                'fogo.lastOccurrence': Date.now()
              })

            } catch (error) {
              console.log("Error getting doc " + error);
            }

          }
        
          // FEITO
          if (topic_ext == "movimento") {

            try {
              var distancia = parseInt(Buffer.from(message).toString('utf8'));

              // Ler objeto
              var databaseRef = db.collection('users').doc(uid);
              const movDoc = await databaseRef.get();
              const movObj = movDoc.data().movimento;

              if (movObj == null || movObj.distancia == null) {
                // Inserir movimento pela primeira vez
                const res = await databaseRef.update({
                  'movimento.distancia': 100,
                  'movimento.lastChange': Date.now()
                })

              } else {
                // Atualizar distancia
                const original_distancia = movObj.distancia;
                console.log(movObj)
                console.log(original_distancia)

                // Escrever array
                const res = await databaseRef.update({
                  'movimento.distancia': distancia,
                  'movimento.lastChange': Date.now()
                })
              }


            } catch (error) {
              console.log("Error getting doc " + error);
            }
        
          }
        
          // FEITO
          if (topic_ext == "luzes") {

            try {
              var msg = Buffer.from(message).toString('utf8');
              var divisao = msg.split('/')[0];
              var estado = (msg.split('/')[1] === 'true');

              // Ler objeto
              var databaseRef = db.collection('users').doc(uid);
              const luzesDoc = await databaseRef.get();
              const luzesObj = luzesDoc.data().luzes;

              if (luzesObj == null) {
                // Inserir luzes pela primeira vez
                const res = await databaseRef.update({
                  'luzes.divisao1': false,
                  'luzes.divisao2': false
                })

              } else {
                // Atualiza divisao
                const path = "luzes." + divisao;
                const res = await databaseRef.update({
                  [path]: estado
                })
              }


            } catch (error) {
              console.log("Error getting doc " + error);
            }

          }

          // FEITO
          if (topic_ext == "janelas") {

            try {
              var msg = Buffer.from(message).toString('utf8');
              var janela = msg.split('/')[0];
              var estado = (msg.split('/')[1] === 'true');

              // Ler objeto
              var databaseRef = db.collection('users').doc(uid);
              const janelasDoc = await databaseRef.get();
              const janelasObj = janelasDoc.data().janelas;

              if (janelasObj == null) {
                // Inserir janelas pela primeira vez
                const res = await databaseRef.update({
                  'janelas.janela1': false,
                  'janelas.janela2': false
                })

              } else {
                // Atualiza janela
                const path = "janelas." + janela;
                const res = await databaseRef.update({
                  [path]: estado
                })
              }


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

////////////////////////////////////////////////// Registo/Login/Logout//////////////////////////////////////////////////
app.get('/register', (req, res) => {
  const filePath = path.join(__dirname, '..', 'src', 'register.html');
  res.sendFile(filePath);
});


app.get('/login', (req, res) => {
  const filePath = path.join(__dirname, '..', 'src', 'login.html');
  res.sendFile(filePath);
});



app.get('/dashboard', (req, res) => {
  const filePath = path.join(__dirname, '..', 'src', 'dashboard.html');
  res.sendFile(filePath);
});