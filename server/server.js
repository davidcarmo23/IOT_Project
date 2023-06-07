//variaveis globais
const express = require('express')
const path = require('path');
const mime = require('mime');
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const {TOKEN_SECRET} = require('./env')

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

const bcrypt = require("bcrypt")

app.get('/register', (req, res) => {
  const filePath = path.join(__dirname, '..', 'src', 'register.html');
  res.sendFile(filePath);
});

app.post('/doregister', async function (req, res) {
  var user = {
    username: req.body.username,
    password: req.body.password,
    confirmPassword: req.body.confirm_password, // Access confirm-password field
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

    // Obter hash da password
    const hash = await bcrypt.hash(user.password, 12)

    // Inserir user na Firestore
    const userDoc = await db.collection('users').add({
      username: user.username,
      email: user.email,
      password: hash,
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

app.post('/dologin', function (req, res) {
  try {
    const db = admin.firestore();
    const userCollection = db.collection('users');

    userCollection.where('email', '==', req.body.email).get()
      .then(async (snapshot) => {
        if (snapshot.empty) {
          return res.status(400).json({ error: 'The email is invalid.' });
        }

        const doc = snapshot.docs[0];
        const uid = doc.id;
        const user = doc.data();

        // Verificar hash da password
        const pass_valid = await bcrypt.compare(req.body.password, user.password)

        if (!pass_valid) {
          return res.status(400).json({ error: 'Invalid password.' });
        }

        user.lastLogin = Date.now();
        userCollection.doc(uid).update(user);

        // Gerar token de autenticação com jwt
        token = jwt.sign(
          { userId: uid, email: user.email },
          TOKEN_SECRET,
          { expiresIn: "2h" }
        );

        res
        .cookie("token", token, {
            httpOnly: true,
            secure: true,
            SameSite: 'None'
          })
          .cookie("userID", uid, {
            httpOnly: true, 
            secure: true,
            SameSite: 'None'
          })

        res.status(200).json({ successMessage: 'User logged in successfully' });
      })
      .catch((error) => {
        res.status(400).json({ error: 'Error logging in: ' + error });
      });
  } catch (error) {
    res.status(400).json({ error: 'Error logging in: ' + error });
  }
});

app.get('/dashboard', (req, res) => {
  const filePath = path.join(__dirname, '..', 'src', 'dashboard.html');
  res.sendFile(filePath);
});

// Ler temperatura da base de dados
app.get('/getTemp', async (req, res) => {
  try {
    const user_uid = req.cookies.userID;
    if (user_uid == null)
      return res.status(401).json({ message: "User não está logado." })

    const db = admin.firestore();
    const userRef = db.collection('users').doc(user_uid);
    const doc = await userRef.get();
    if (!doc.exists) {
      // User não existe na dashboard, deve ser impossível (!)
      return res.status(400).json({ message: "User não existe." })
    } else {
      var today = new Date();
      var month = (today.getUTCMonth() + 1 < 10 ? '0' : '') + (today.getUTCMonth() + 1);
      var day = (today.getUTCDate() < 10 ? '0' : '') + today.getUTCDate();
      var year = today.getUTCFullYear();

      var date = year + "-" + month + "-" + day;

      const tempObj = doc.data().temperatura;

      if (tempObj == null || tempObj[date] == null) {
        // Não há registo de temperaturas
        return res.status(400).json({ message: "Não há temperaturas registadas para o dia de hoje." })
      } else {
        const original_array = tempObj[date];
        const lastTemp = original_array[original_array.length - 1]
        return res.status(200).json({ temperatura: original_array, lastTemp: lastTemp, date: date })
      }
    }

  } catch (error) {
    return res.status(400).json({ message: error })
  }
});

// Ler humidade da base de dados
app.get('/getHum', async (req, res) => {
  try {
    const user_uid = req.cookies.userID;
    if (user_uid == null)
      return res.status(401).json({ message: "User não está logado." })

    const db = admin.firestore();
    const userRef = db.collection('users').doc(user_uid);
    const doc = await userRef.get();
    if (!doc.exists) {
      // User não existe na dashboard, deve ser impossível (!)
      return res.status(400).json({ message: "User não existe." })
    } else {
      var today = new Date();
      var month = (today.getUTCMonth() + 1 < 10 ? '0' : '') + (today.getUTCMonth() + 1);
      var day = (today.getUTCDate() < 10 ? '0' : '') + today.getUTCDate();
      var year = today.getUTCFullYear();

      var date = year + "-" + month + "-" + day;

      const humObj = doc.data().humidade;

      if (humObj == null || humObj[date] == null) {
        // Não há registo de humidades
        return res.status(400).json({ message: "Não há humidade registada para o dia de hoje." })
      } else {
        const original_array = humObj[date];
        const lastHum = original_array[original_array.length - 1]
        return res.status(200).json({ humidade: original_array, lastHum: lastHum, date: date })
      }
    }

  } catch (error) {
    return res.status(400).json({ message: error })
  }
});

// Ler luminosidade da base de dados
app.get('/getLum', async (req, res) => {
  try {
    const user_uid = req.cookies.userID;
    if (user_uid == null)
      return res.status(401).json({ message: "User não está logado." })

    const db = admin.firestore();
    const userRef = db.collection('users').doc(user_uid);
    const doc = await userRef.get();
    if (!doc.exists) {
      // User não existe na dashboard, deve ser impossível (!)
      return res.status(400).json({ message: "User não existe." })
    } else {
      var today = new Date();
      var month = (today.getUTCMonth() + 1 < 10 ? '0' : '') + (today.getUTCMonth() + 1);
      var day = (today.getUTCDate() < 10 ? '0' : '') + today.getUTCDate();
      var year = today.getUTCFullYear();

      var date = year + "-" + month + "-" + day;

      const lumObj = doc.data().luminosidade;

      if (lumObj == null || lumObj[date] == null) {
        // Não há registo de luminosidades
        return res.status(400).json({ message: "Não há luminosidade registada para o dia de hoje." })
      } else {
        const original_array = lumObj[date];
        const lastLum = original_array[original_array.length - 1]
        return res.status(200).json({ luminosidade: original_array, lastLum: lastLum, date: date })
      }
    }

  } catch (error) {
    return res.status(400).json({ message: error })
  }
});

// Ler última ocurrência de fogo da base de dados
app.get('/getFire', async (req, res) => {
  try {
    const user_uid = req.cookies.userID;
    if (user_uid == null)
      return res.status(401).json({ message: "User não está logado." })

    const db = admin.firestore();
    const userRef = db.collection('users').doc(user_uid);
    const doc = await userRef.get();
    if (!doc.exists) {
      // User não existe na dashboard, deve ser impossível (!)
      return res.status(400).json({ message: "User não existe." })
    } else {
      const fireObj = doc.data().fogo;

      if (fireObj == null || fireObj.lastOccurrence == null) {
        return res.status(400).json({ message: "Utilizador não tem fogos registados." })
      } else {
        const lastOccurrence = fireObj.lastOccurrence;
        return res.status(200).json({ lastOccurrence: lastOccurrence })
      }
    }

  } catch (error) {
    return res.status(400).json({ message: error })
  }
});

// Ler movimento da base de dados
app.get('/getMov', async (req, res) => {
  try {
    const user_uid = req.cookies.userID;
    if (user_uid == null)
      return res.status(401).json({ message: "User não está logado." })

    const db = admin.firestore();
    const userRef = db.collection('users').doc(user_uid);
    const doc = await userRef.get();
    if (!doc.exists) {
      // User não existe na dashboard, deve ser impossível (!)
      return res.status(400).json({ message: "User não existe." })
    } else {
      const movObj = doc.data().movimento;

      if (movObj == null || movObj.distancia == null) {
        return res.status(400).json({ message: "Utilizador não tem distância registada." })
      } else {
        const distancia = movObj.distancia;
        return res.status(200).json({ distancia: distancia })
      }
    }

  } catch (error) {
    return res.status(400).json({ message: error })
  }
});

// Obter estado do alarme
app.get('/getAlarm', async (req, res) => {
  try {
    const user_uid = req.cookies.userID;
    if (user_uid == null)
      return res.status(401).json({ message: "User não está logado." })

    const db = admin.firestore();
    const userRef = db.collection('users').doc(user_uid);
    const doc = await userRef.get();
    if (!doc.exists) {
      // User não existe na dashboard, deve ser impossível (!)
      return res.status(400).json({ message: "User não existe." })
    } else {
      const movObj = doc.data().movimento;

      if (movObj == null || movObj.alarme == null) {
        // Alarme ainda não foi definido, meter a falso
        const resDoc = await userRef.update({
          'movimento.alarme': false
        })
        return res.status(200).json({ alarme: false })
      } else {
        const alarme = movObj.alarme;
        return res.status(200).json({ alarme: alarme })
      }
    }

  } catch (error) {
    return res.status(400).json({ message: error })
  }
});

// Desativar alarme
app.get('/disableAlarm', async (req, res) => {
  try {
    const user_uid = req.cookies.userID;
    if (user_uid == null)
      return res.status(401).json({ message: "User não está logado." })

    const db = admin.firestore();
    const userRef = db.collection('users').doc(user_uid);
    const doc = await userRef.get();
    if (!doc.exists) {
      // User não existe na dashboard, deve ser impossível (!)
      return res.status(400).json({ message: "User não existe." })
    } else {
      const resDoc = await userRef.update({
        'movimento.alarme': false
      })

      // TODO: desativar alarme no arduino

      return res.status(200).json({ message: "ok" })
    }

  } catch (error) {
    return res.status(400).json({ message: error })
  }
});

// Ativar alarme
app.get('/activateAlarm', async (req, res) => {
  try {
    const user_uid = req.cookies.userID;
    if (user_uid == null)
      return res.status(401).json({ message: "User não está logado." })

    const db = admin.firestore();
    const userRef = db.collection('users').doc(user_uid);
    const doc = await userRef.get();
    if (!doc.exists) {
      // User não existe na dashboard, deve ser impossível (!)
      return res.status(400).json({ message: "User não existe." })
    } else {
      const resDoc = await userRef.update({
        'movimento.alarme': true
      })

      // TODO: ativar alarme no arduino

      return res.status(200).json({ message: "ok" })
    }

  } catch (error) {
    return res.status(400).json({ message: error })
  }
});

// Obter estado das luzes
app.get('/getLuzes', async (req, res) => {
  try {
    const user_uid = req.cookies.userID;
    if (user_uid == null)
      return res.status(401).json({ message: "User não está logado." })

    const db = admin.firestore();
    const userRef = db.collection('users').doc(user_uid);
    const doc = await userRef.get();
    if (!doc.exists) {
      // User não existe na dashboard, deve ser impossível (!)
      return res.status(400).json({ message: "User não existe." })
    } else {
      const luzesObj = doc.data().luzes;

      if (luzesObj == null) {
        // Luzes ainda não foram definidas, meter a falso
        const resDoc = await userRef.update({
          'luzes.divisao1': false,
          'luzes.divisao2': false
        })
        return res.status(200).json({ divisao1: false, divisao2: false })
      } else {
        const divisao1 = luzesObj.divisao1;
        const divisao2 = luzesObj.divisao2;
        return res.status(200).json({ divisao1: divisao1, divisao2: divisao2 })
      }
    }

  } catch (error) {
    return res.status(400).json({ message: error })
  }
});

// Desativar luz
app.post('/disableLuz', async (req, res) => {
  try {
    const user_uid = req.cookies.userID;
    if (user_uid == null)
      return res.status(401).json({ message: "User não está logado." })

    const db = admin.firestore();
    const userRef = db.collection('users').doc(user_uid);
    const doc = await userRef.get();
    if (!doc.exists) {
      // User não existe na dashboard, deve ser impossível (!)
      return res.status(400).json({ message: "User não existe." })
    } else {
      const path = "luzes." + req.body.divisao;
      const resDoc = await userRef.update({
        [path]: false
      })

      // TODO: desativar luz no arduino

      return res.status(200).json({ message: "ok" })
    }

  } catch (error) {
    return res.status(400).json({ message: error })
  }
});

// Ativar luz
app.post('/activateLuz', async (req, res) => {
  try {
    const user_uid = req.cookies.userID;
    if (user_uid == null)
      return res.status(401).json({ message: "User não está logado." })

    const db = admin.firestore();
    const userRef = db.collection('users').doc(user_uid);
    const doc = await userRef.get();
    if (!doc.exists) {
      // User não existe na dashboard, deve ser impossível (!)
      return res.status(400).json({ message: "User não existe." })
    } else {
      const path = "luzes." + req.body.divisao;
      const resDoc = await userRef.update({
        [path]: true
      })

      // TODO: ativar luz no arduino

      return res.status(200).json({ message: "ok" })
    }

  } catch (error) {
    return res.status(400).json({ message: error })
  }
});



app.post('/logout', function (req, res) { 

  try {
    res.clearCookie("token");
    res.clearCookie("userID");
    res.status(200).json({ successMessage: 'User logged out successfully' });
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
