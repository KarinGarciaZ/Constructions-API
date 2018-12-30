const app = require('express');
const router = app.Router();
const Image = require('./image.model');

router
.get( '/', ( req, res ) => {
  return Image.getAllImages( res, Image.responseToClient );
} )

.post( '/', ( req, res ) => {
  const img = {
    id: null,
    id_Constructions: req.body.id_Constructions,
    url: req.body.url
  }

  return Image.saveImage( img, res, Image.responseToClient );
})

module.exports = router;