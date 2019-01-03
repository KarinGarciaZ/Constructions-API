const connection = require('../../db_config/mysql-connection');

const Image = {};

/*------------------------------GET--------------------------------*/

Image.getAllImages = ( res, cb ) => {
  if (connection) {
    connection.query('SELECT * FROM Images', ( error, data ) => {
      if ( error ) return cb( error, res );
      return cb( null, res, data, 200 );
    })
  } else return cb( "Error to connect to DB.", res );
}

/*------------------------------PUT--------------------------------*/

Image.saveImage = ( newImage, res, cb ) => {
  if (connection) {
    connection.query('INSERT INTO Images SET ?', [newImage], ( error, data ) => {
      if ( error ) return cb( error, res );
      return cb( null, res, data, 201 );
    })
  } else return cb( "Error to connect to DB.", res );
}

/*------------------------------DELETE--------------------------------*/

Image.deleteImage = ( idImage, res, cb ) => {
  if ( connection ) {
    connection.query( 'UPDATE Images SET statusItem = 1 where id_image = ?', [idImage], 
      ( error, data ) => {
        if ( error ) return cb( error, res );
        return cb( null, res, data, 200 )
      })
  } else return cb( 'Error to connect to DB.', res );
}

/*------------------------------METHODS--------------------------------*/

Image.responseToClient = ( error, res, data, action ) => {
  if ( error )
    res.status(500).json(error);
  else
    res.status(action).json(data);
}

Image.saveImageAsync = ( newImage ) => {
  return new Promise( (resolve, reject) => {
    if (connection) {
      connection.query('INSERT INTO Images SET ?', [newImage], ( error, data ) => {
        (error)? reject(error) : resolve(data);
      })
    } else reject( "Error to connect to DB." );
  })
}

Image.saveArrayOfImages = ( images, idConstruction, cb ) => {
  let imagesPromises = images.map( image => {
    let newImage = { id_image: null, id_Constructions: idConstruction, url: image, statusItem: 0 }
    return cb( newImage );
  })

  return imagesPromises;
}

Image.makeOldImages = ( idConstruction ) => {
  return new Promise( ( resolve, reject ) => {
    if( connection ) {
      connection.query( 'UPDATE Images SET statusItem = 1 where id_Constructions = ?', [idConstruction],
      ( error, data ) => {
        (error)? reject(error) : resolve(data);
      })
    } else reject('Error to connecr to DB.')
  })
}

module.exports = Image;