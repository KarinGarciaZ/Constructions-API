const express = require('express');
const router = express.Router();
const Type = require('./type.model');

router
.get( '/', ( req, res ) => {
  return Type.getAllTypes( res, Type.responseToClient );
})

.post( '/', ( req, res ) => {
  let newType = {
    id: null,
    name: req.body.name,
    statusItem: 0
  }

  return Type.saveType( newType, res, Type.responseToClient )
})

.put( '/:idType', ( req, res ) => {
  let type = {
    id: req.params.idType,
    name: req.body.name
  }

  return Type.updateType( type, res, Type.responseToClient );
})

module.exports = router;