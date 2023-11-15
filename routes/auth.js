const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');
const authModelSchema = require('../models/authModal');
const secretKey = "dndthntr6y4r$fgfg6%fgn@fgfngn#fgnf";

router.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const existUser = await authModelSchema.findOne({ email: email });

    if (existUser && existUser._id) {
      bcrypt.compare(password, existUser.password, function (err, response) {
        if (!err) {
          if (response) {
            const authToken = jwt.sign({ _id: existUser._id, email: existUser.email }, secretKey);
            res.json({ status: 'ok', data: { authToken, response, existUser } });
          } else {
            res.json({ status: 'ok', data: { existUser, response } });
          }
        }
      });
    } else {
      res.json({ status: 'ok', data: { existUser: null, response: false } });
    }
  } catch (err) {
    console.error(err);
    res.json({ status: 'error', data: 'something is wrong' });
  }
  
})


router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const registerUserData = {
      username: username,
      email: email,
      password: hashedPassword,
    };

    const userStoredData = await authModelSchema.create(registerUserData);
    console.log('user stored data', userStoredData);

    res.json({ status: 200, data: userStoredData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', data: 'something went wrong' });
  }
});

module.exports = router;
