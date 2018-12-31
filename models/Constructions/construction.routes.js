const express = require('express');
const router = express.Router();
const Construction = require('./construction.model');

router

.get( '/constructionsPerType/:idType', ( req, res ) => {
  let idType = req.params.idType;
  return Construction.getConstructionsPerType( idType, res, Construction.responseToClient )
})

.get( '/:idConstruction', ( req, res ) => {
  let idConstruction = req.params.idConstruction;
  return Construction.getConstructionWidthImagesAndType( idConstruction, res, Construction.responseToClient );
} )

.get( '/', ( req, res ) => {
  return Construction.getAllConstructionsWithImagesAndType( res, Construction.responseToClient );
} )

.post( '/', ( req, res ) => {
  const newConstruction = {
    id: null,
    title: req.body.title,
    description: req.body.description,
    statu: req.body.statu,
    address: req.body.address,
    city: req.body.city,
    state: req.body.state,
    start_date: req.body.start_date,
    finish_date: req.body.finish_date,
    statusItem: 0,
    id_type: req.body.id_type
  }

  const newImages = req.body.images;

  return Construction.saveConstructionWithImages( newConstruction, newImages, res, Construction.responseToClient);

})

.put( '/:idConstruction', ( req, res ) => {

})

module.exports = router;