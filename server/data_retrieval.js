
const express = require('express');
const admin = require('firebase-admin');
const app = express();
const cookieParser = require('cookie-parser')();
const router = express.Router();
const verifyToken = require('./verifyToken');


// Ler temperatura da base de dados
router.get('/getTemp',verifyToken , async (req, res) => {
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
router.get('/getHum',verifyToken , async (req, res) => {
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
router.get('/getLum',verifyToken , async (req, res) => {
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
router.get('/getFire',verifyToken , async (req, res) => {
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
router.get('/getMov',verifyToken , async (req, res) => {
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
router.get('/getAlarm',verifyToken , async (req, res) => {
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


// Obter estado das luzes
router.get('/getLights',verifyToken , async (req, res) => {
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

// Obter estado das janelas
router.get('/getWindows',verifyToken , async (req, res) => {
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
        const janelasObj = doc.data().janelas;
  
        if (janelasObj == null) {
          // Janelas ainda não foram definidas, meter a falso
          const resDoc = await userRef.update({
            'janelas.janela1': false,
            'janelas.janela2': false
          })
          return res.status(200).json({ janela1: false, janela2: false })
        } else {
          const janela1 = janelasObj.janela1;
          const janela2 = janelasObj.janela2;
          return res.status(200).json({ janela1: janela1, janela2: janela2 })
        }
      }
  
    } catch (error) {
      return res.status(400).json({ message: error })
    }
  });
    
module.exports = router;