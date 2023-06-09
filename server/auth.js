const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { TOKEN_SECRET } = require('./env');

router.post('/doregister', async function (req, res) {
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

router.post('/dologin', function (req, res) {
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

router.get('/logout', function (req, res) {

  try {
    res.clearCookie("token");
    res.clearCookie("userID");
    res.status(200).json({ successMessage: 'User logged out successfully' });
  } catch (error) {
    console.log('Error logging out ' + error);
  }

})

//verificar se o token é valido
router.get('/verifytoken', function (req, res) {
    try {
      const token = req.cookies.token;
      if (!token){
        return res.status(401).json({ error: 'Access denied' });
      } 
    } catch (error) {
      res.status(400).json({ error: 'Error verifying token ' + error });
    }
  });

module.exports = router;