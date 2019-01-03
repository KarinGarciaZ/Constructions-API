const express = require('express');
const router = express.Router();

const User = require('./user.model');

router.get('/', (req, res) => {
  return User.getAllUsers( res, User.responseToClient )
})

router.get('/:username', (req, res) => {
  let username = req.params.username;
  return User.getSingleUser( username, res, User.responseToClient )
})

router.post('/', ( req, res ) => {
  let user = {
    username: req.body.username,
    name: req.body.name,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    password: req.body.password,
    statusItem: 0
  }

  return User.saveNewUser( user, res, User.responseToClient );
})

router.put('/', (req, res) => {
  let user = {
    username: req.body.username,
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    password: req.body.password
  }

  return User.updateUser( user, res, User.responseToClient );
})

router.delete('/:username', (req, res) => {
  let username = req.params.username;
  return User.deleteUser( username, res, User.responseToClient );
})

module.exports = router;