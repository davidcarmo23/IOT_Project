const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

// Desativar alarme
router.get('/disableAlarm', async (req, res) => {
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
router.get('/activateAlarm', async (req, res) => {
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

// Desativar luz
router.post('/disableLight', async (req, res) => {
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
router.post('/activateLight', async (req, res) => {
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

// Desativar janela
router.post('/disableWindow', async (req, res) => {
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

      // TODO: desativar janela no arduino

      return res.status(200).json({ message: "ok" })
    }

  } catch (error) {
    return res.status(400).json({ message: error })
  }
});

// Ativar janela
router.post('/activateWindow', async (req, res) => {
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

      // TODO: ativar janela no arduino

      return res.status(200).json({ message: "ok" })
    }

  } catch (error) {
    return res.status(400).json({ message: error })
  }
});

// Lock house
router.get('/lockHouse', async (req, res) => {
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

      // Fechar / desativar todas as funcionalidades da casa
      const resDoc = await userRef.update({
        "luzes.divisao1": false,
        "luzes.divisao2": false,
        "janelas.janela1": false,
        "movimento.alarme": true
      })

      // TODO: enviar comandos para o arduino

      return res.status(200).json({ message: "ok" })
    }

  } catch (error) {
    return res.status(400).json({ message: error })
  }
});

module.exports = router;