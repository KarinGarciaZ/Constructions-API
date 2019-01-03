const connection = require('../../db_config/mysql-connection');

const Type = {};

Type.getAllTypes = ( res, cb ) => {
  if (connection) {
    connection.query('SELECT * FROM types', ( error, data ) => {
      if ( error ) return cb( error, res );
      return cb( null, res, data, 200 );
    })
  } else return cb( "Error to connect to DB.", res );
}

Type.saveType = ( newType, res, cb ) => {
  if (connection) {
    connection.query('INSERT INTO types SET ?', [newType], ( error, data ) => {
      if ( error ) return cb( error, res );
      return cb( null, res, data, 201 );
    })
  }
}

Type.updateType = ( type, res, cb ) => {
  if ( connection ) {
    connection.query( 'UPDATE Types SET name = ? where id = ?', [type.name, type.id], ( error, data ) => {
      if ( error ) return cb( error, res );
      return cb( null, res, data, 200 )
    })
  } else return cb( 'Error to connect to DB.', res );
}

Type.responseToClient = ( error, res, data, action ) => {
  if ( error )
    res.status(500).json(error);
  else
    res.status(action).json(data);
}

module.exports = Type;