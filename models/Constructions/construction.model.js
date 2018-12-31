const connection = require('../../db_config/mysql-connection');
const Image = require('../Images/image.model');
const Construction = {};


/*------------------------------GET--------------------------------*/

Construction.getAllConstructions = ( res, cb ) => {
  if (connection) {
    connection.query('SELECT * FROM constructions', ( error, data ) => {
      if ( error ) return cb( error, res );
      return cb( null, res, data, 200 );
    })
  } else return cb( "Error to connect to DB.", res );
}

Construction.getAllConstructionsWithImages = ( res, cb ) => {
  if (connection) {
    connection.query(`SELECT * FROM constructions 
                      INNER JOIN images on images.id_Constructions = constructions.id
                      INNER JOIN types on constructions.id_type = types.id`, 
      async ( error, data ) => {
        if ( error ) return cb( error, res );
        let dataFixed = await Construction.organizeAllConstructionsInner( data );        
        return cb( null, res, dataFixed, 200 );
    })
  } else return cb( "Error to connect to DB.", res );
}

Construction.getConstructionWidthImagesAndType = ( idConstruction, res, cb ) => {
  if ( connection ) {
    connection.query(`SELECT * FROM constructions 
                      INNER JOIN images on images.id_Constructions = constructions.id
                      INNER JOIN types on constructions.id_type = types.id
                      WHERE constructions.id = ?`
                      , [idConstruction], 
    async ( error, data ) => {

      if ( error ) return cb( error, res );
      let dataFixed = await Construction.organizeResponseImagesInner( data );
      return cb( null, res, dataFixed, 200 )

    })
  } else return cb( "Error to connect to DB.", res );
}

Construction.getConstructionsPerType = ( idType, res, cb ) => {
  if( connection ) {
    connection.query( `SELECT * FROM constructions 
                      INNER JOIN images on images.id_Constructions = constructions.id
                      INNER JOIN types on constructions.id_type = types.id
                      WHERE constructions.id_type = ?`, [idType], 
    async ( error, data ) => {
      if ( error ) return cb( error, res );
      let dataFixed = await Construction.organizeAllConstructionsInner( data );
      return cb( null, res, dataFixed, 200 );
    })
  }
}

/*------------------------------POST--------------------------------*/

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

/*------------------------------PUT--------------------------------*/

Construction.updateConstruction = ( constructionUpdated, res, cb ) => {
  
}

/*------------------------------METHODS--------------------------------*/

Construction.responseToClient = ( error, res, data, action ) => {
  if ( error )
    res.status(500).json(error);
  else
    res.status(action).json(data);
}

Construction.organizeResponseImagesInner = ( data ) => {

  return new Promise( resolve => {
    let arrayOfImages = data.map( element => {
      return element.url;
    })
  
    let objectToRes = {
      id: data[0].id_Constructions,
      title: data[0].title,
      description: data[0].description,
      statu: data[0].statu,
      address: data[0].address,
      city: data[0].city,
      state: data[0].state,
      start_date: data[0].start_date,
      finish_date: data[0].finish_date,
      type: {
        id: data[0].id_type,
        name: data[0].name
      },
      images: arrayOfImages
    }

    resolve( objectToRes );
  
  })
}

Construction.organizeAllConstructionsInner = ( data ) => {
  return new Promise( resolve => {
    let ids = data.map( element => element.id_Constructions );
    let uniqueIds = ids.filter( (value, index, self) => self.indexOf( value ) === index );
    let arrayOfConstructionsPerId = uniqueIds.map( element => {
      let arrayByElement = data.filter( elementData => {
        return elementData.id_Constructions === element;
      });
      return arrayByElement;
    });

    let objectToRes = arrayOfConstructionsPerId.map( element => {
      let arrayOfImages = element.map( construction => {
        return construction.url;
      })

      let singleElement = {
        id: element[0].id_Constructions,
        title: element[0].title,
        description: element[0].description,
        statu: element[0].statu,
        address: element[0].address,
        city: element[0].city,
        state: element[0].state,
        start_date: element[0].start_date,
        finish_date: element[0].finish_date,
        type: {
          id: element[0].id_type,
          name: element[0].name
        },
        images: arrayOfImages
      }
      
      return singleElement;

    })

    resolve(objectToRes);
  })
}


module.exports = Construction;