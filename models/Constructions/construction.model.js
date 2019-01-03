const connection = require('../../db_config/mysql-connection');
const Image = require('../Images/image.model');
const Construction = {};


/*------------------------------GET--------------------------------*/

Construction.getAllConstructionsWithImagesAndType = ( res, cb ) => {
  if (connection) {
    connection.query(`SELECT * FROM constructions 
                      INNER JOIN images on images.id_Constructions = constructions.id
                      INNER JOIN types on constructions.id_type = types.id
                      WHERE constructions.statusItem = 0 AND images.statusItem = 0`, 
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
                      WHERE constructions.id = ? AND constructions.statusItem = 0 AND images.statusItem = 0`
                      , [idConstruction], 
    async ( error, data ) => {

      if ( error ) return cb( error, res );
      let dataFixed = await Construction.organizeAllConstructionsInner( data );
      return cb( null, res, dataFixed[0], 200 )

    })
  } else return cb( "Error to connect to DB.", res );
}

Construction.getConstructionsPerType = ( idType, res, cb ) => {
  if( connection ) {
    connection.query( `SELECT * FROM constructions 
                      INNER JOIN images on images.id_Constructions = constructions.id
                      INNER JOIN types on constructions.id_type = types.id
                      WHERE constructions.id_type = ? AND constructions.statusItem = 0 AND images.statusItem = 0`, [idType], 
    async ( error, data ) => {
      if ( error ) return cb( error, res );
      let dataFixed = await Construction.organizeAllConstructionsInner( data );
      return cb( null, res, dataFixed, 200 );
    })
  }
}

/*------------------------------POST--------------------------------*/

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

          let imagePromises = Image.saveArrayOfImages( images, data.insertId, Image.saveImageAsync );
          
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

Construction.updateConstruction = ( constructionUpdated, images, res, cb ) => {
  if ( connection ) {
    const idConstruction = constructionUpdated.id;

    connection.beginTransaction( errorBT => {
      if ( errorBT ) return cb( errorBT, res );

      let queryUpdateConstruction = new Promise( ( resolve, reject ) => {
        connection.query( `UPDATE Constructions SET title = ?, description = ?, statu = ?,
                          address = ?, city = ?, state = ?, start_date = ?, finish_date = ?,
                          id_type = ?, statusItem = ? WHERE id = ?`,
                          [ constructionUpdated.title, constructionUpdated.description, constructionUpdated.statu,
                            constructionUpdated.address, constructionUpdated.city, constructionUpdated.state,
                            constructionUpdated.start_date, constructionUpdated.finish_date, constructionUpdated.id_type,
                            constructionUpdated.statusItem, idConstruction ],
          ( errorUpdate, data ) => {
            ( errorUpdate )? reject(errorUpdate) : resolve(data);
          }
        )
      })

      let updateOldImages = Image.makeOldImages( idConstruction );
      let newImages = Image.saveArrayOfImages( images, idConstruction, Image.saveImageAsync );

      let arrayofPromises = [...newImages];
      arrayofPromises.push( queryUpdateConstruction );
      arrayofPromises.push( updateOldImages );

      Promise.all( arrayofPromises )
      .then( datas => {
        connection.commit( errorCommit => {
          if ( errorCommit ) 
            connection.rollback( () => cb( errorCommit, res ) )
          return cb( null, res, datas, 201 );
        })
      })
      .catch( errors => {
        connection.rollback( () => cb( errors, res ) );
      })
      
    })
  } else return cb( 'Error to connect to DB', res );
}

/*------------------------------DELETE--------------------------------*/

Construction.deleteConstruction = ( idConstruction, res, cb ) => {
  if ( connection ) {
    connection.beginTransaction( errorBT => {
      if (errorBT) return cb( errorBT, res );

      let query1 = new Promise( (resolve, reject) => {
        connection.query( 'UPDATE constructions SET statusItem = 1 where id = ?', [idConstruction], ( error, data ) => {
          (error)? reject(error) : resolve(data) 
        })
      })

      let query2 = new Promise( (resolve, reject) => {
        connection.query( 'UPDATE images SET statusItem = 1 where id_Constructions = ?', [idConstruction], ( error, data ) => {
          (error)? reject(error) : resolve(data) 
        })
      })

      Promise.all( [query1, query2] )
      .then( datas => {
        connection.commit( errorCommit => {
          if ( errorCommit ){
            connection.rollback( () => {
              return cb( errorCommit, res );
            })
          }

          return cb( null, res, datas, 200 )
        })
      })
      .catch( errors => {
        connection.rollback( () => {
          return cb( errors, res )
        })
      })
      
    })
  } else return cb( "Error to connect to DB.", res );
}

/*------------------------------METHODS--------------------------------*/

Construction.responseToClient = ( error, res, data, action ) => {
  if ( error )
    res.status(500).json(error);
  else
    res.status(action).json(data);
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
          return { id_image: construction.id_image, url: construction.url };
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