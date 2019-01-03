const connection = require('../../db_config/mysql-connection');

const User = {};

User.getAllUsers = ( res, cb ) => {
  if ( connection ) {
    connection.query('SELECT * FROM Users WHERE statusItem = 0', [], ( error, data ) => {
      if ( error ) return cb( error, res );
      return cb( null, res, data, 200 );
    })
  } else return cb( 'Error to connect to DB', res );
}

User.getSingleUser = ( username, res, cb ) => {
  if ( connection ) {
    connection.query('SELECT * FROM Users WHERE username = ? AND statusItem = 0', [username], ( error, data ) => {
      if ( error ) return cb( error, res );
      return cb( null, res, data[0], 200 );
    })
  } else return cb( 'Error to connect to DB', res );
}

User.saveNewUser = ( newUser, res, cb ) => {
  if ( connection ) {
    connection.query('INSERT INTO Users SET ?', [newUser], ( error, data ) => {
      if ( error ) return cb( error, res );
      return cb( null, res, data, 201 );
    })
  } else return cb( 'Error to connect to DB', res );
}

User.updateUser = ( user, res, cb ) => {
  if ( connection ) {
    connection.query('UPDATE Users SET name = ?, phoneNumber = ?, password = ? WHERE username = ?', 
                    [user.name, user.phoneNumber, user.password, user.username], 
      ( error, data ) => {
        if ( error ) return cb( error, res );
        return cb( null, res, data, 201 );
    })
  } else return cb( 'Error to connect to DB', res );
}

User.deleteUser = ( username, res, cb ) => {
  if ( connection ) {
    connection.query('UPDATE Users SET statusItem = 1 WHERE username = ?', [username],
      ( error, data ) => {
        if ( error ) return cb( error, res );
        return cb( null, res, data, 200 );
      }
    )
  } else return cb( 'Error to connect to DB', res );
}

User.responseToClient = ( error, res, data, status ) => {
  if ( error )
    res.status(500).json(error);
  else
    res.status(status).json(data);
}

module.exports = User;