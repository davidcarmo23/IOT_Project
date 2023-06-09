const e = require('express');
const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const verifyToken = require('./verifyToken');
const mqtt = require('mqtt');
const { mqttServer } = require('./env');

const client = mqtt.connect(mqttServer);

// Desativar alarme
router.post('/disableAlarm', verifyToken ,async (req, res) => {
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
  
        client.publish('alarm', '0');
  
        return res.status(200).json({ message: "ok" })
      }
  
    } catch (error) {
      return res.status(400).json({ message: error })
    }
  });

  // Ativar alarme
router.post('/activateAlarm',verifyToken ,async (req, res) => {
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

        client.publish('alarm', '1');
        return res.status(200).json({ message: "ok" })
      }
  
    } catch (error) {
      return res.status(400).json({ message: error })
    }
  });

// Desativar luz
router.post('/disableLight',verifyToken ,async (req, res) => {
    try {
      const user_uid = req.cookies.userID;
      var light = toString(req.body.lightID);
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

        client.publish(light, '0');
        return res.status(200).json({ message: "ok" })
      }
  
    } catch (error) {
      return res.status(400).json({ message: error })
    }
  });
  
// Ativar luz
router.post('/activateLight',verifyToken ,async (req, res) => {
    try {
      const user_uid = req.cookies.userID;
      var light = toString(req.body.lightID);
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
  
        client.publish(light, '0');
        return res.status(200).json({ message: "ok" })
      }
  
    } catch (error) {
      return res.status(400).json({ message: error })
    }
  });
 
// Desativar janela
router.post('/disableWindow',verifyToken ,async (req, res) => {
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
        const path = "janelas." + req.body.janela;
        const resDoc = await userRef.update({
          [path]: false
        })
  
        client.publish('windows', '0');
        return res.status(200).json({ message: "ok" })
      }
  
    } catch (error) {
      return res.status(400).json({ message: error })
    }
  });

  // Ativar janela
router.post('/activateWindow',verifyToken ,async (req, res) => {
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
        const path = "janelas." + req.body.janela;
        const resDoc = await userRef.update({
          [path]: true
        })
  
        client.publish('windows', '1');
        return res.status(200).json({ message: "ok" })
      }
  
    } catch (error) {
      return res.status(400).json({ message: error })
    }
  });
  
module.exports = router;