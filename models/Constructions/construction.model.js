const connection = require('../../db_config/mysql-connection');

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

Construction.responseToClient = ( error, res, data, action ) => {
  if ( error )
    res.status(500).json(error);
  else
    res.status(action).json(data);
}

module.exports = Construction;