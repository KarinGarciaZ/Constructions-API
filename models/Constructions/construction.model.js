const connection = require('../../db_config/mysql-connection');
const Image = require('../Images/image.model');
const Construction = {};

Construction.getAllConstructions = ( res, cb ) => {
  if (connection) {
    connection.query('SELECT * FROM constructions', ( error, data ) => {
      if ( error ) return cb( error, res );
      return cb( null, res, data, 200 );
    })
  } else return cb( "Error to connect to DB.", res );
}

Construction.saveConstruction = ( newConstruction, res, cb ) => {
  if (connection) {
    connection.query('INSERT INTO Constructions SET ?', [newConstruction], ( error, data ) => {
      if ( error ) return cb( error, res );
      return cb( null, res, data, 201 );
    })
  }
}

Construction.saveConstructionWithImages = ( newConstruction, images, res, cb ) => {
  if (connection) {

    connection.beginTransaction( errorBeginTransaction => {

      if ( errorBeginTransaction ) return cb( errorBeginTransaction, res );

      connection.query( 'INSERT INTO Constructions SET ?', [newConstruction], ( errorInsert, data ) => {
        if ( errorInsert ) {
          return connection.rollback( () => {
            return cb( errorInsert, res );
          });
        }         
        else {

          let imagePromises = Image.getArrayOfImages( images, data.insertId, Image.saveImageAsync );
          
          Promise.all( imagePromises )
          .then( images => {
            return connection.commit( errorCommit => {
              if ( errorCommit ) {
                return connection.rollback( () => {
                  return cb( errorCommit, res );
                });
              }
  
              return cb( null, res, { data, images }, 201 );
            })
          })

          .catch( errors => {
            console.log('errors: ', errors);
            if( errors ) {
              return connection.rollback( () => {
                return cb( errors, res );
              });
            }
          })
          
        }

      })

    })
  
  } else {
    cb( 'Error to connect to DB.', res )
  }
}

Construction.responseToClient = ( error, res, data, action ) => {
  if ( error )
    res.status(500).json(error);
  else
    res.status(action).json(data);
}

module.exports = Construction;