const connection = require('../../db_config/mysql-connection');

const Image = {};

Image.getAllImages = ( res, cb ) => {
  if (connection) {
    connection.query('SELECT * FROM Images', ( error, data ) => {
      if ( error ) return cb( error, res );
      return cb( null, res, data, 200 );
    })
  } else return cb( "Error to connect to DB.", res );
}

Image.saveImage = ( newImage, res, cb ) => {
  if (connection) {
    connection.query('INSERT INTO Images SET ?', [newImage], ( error, data ) => {
      if ( error ) return cb( error, res );
      return cb( null, res, data, 201 );
    })
  } else return cb( "Error to connect to DB.", res );
}

Image.saveImageAsync = ( newImage ) => {
  return new Promise( (resolve, reject) => {
    if (connection) {
      connection.query('INSERT INTO Images SET ?', [newImage], ( error, data ) => {
        if ( error ) reject( error );
        resolve( data );
      })
    } else reject( "Error to connect to DB." );
  })
}

/*------------------------------METHODS--------------------------------*/

Image.responseToClient = ( error, res, data, action ) => {
  if ( error )
    res.status(500).json(error);
  else
    res.status(action).json(data);
}


Image.getArrayOfImages = ( images, id, cb ) => {
  let imagesPromises = images.map( image => {
    let newImage = { id: null, id_Constructions: id, url: image }
    return cb( newImage );
  })

  return imagesPromises;
}

module.exports = Image;