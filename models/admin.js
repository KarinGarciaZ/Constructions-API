const express = require('express');
const router = express.Router();

const Image = require('./Images/image.routes');
const Construction = require('./Constructions/construction.routes');
const Type = require('./Types/type.routes');
const User = require('./Users/user.routes');

router.use('/type', Type);

router.use('/construction', Construction);

router.use('/image', Image);

router.use('/user', User);

router.use('/', ( req, res ) => {
  res.status(404).send();
});

module.exports = router;