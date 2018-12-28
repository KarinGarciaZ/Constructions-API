"use strict";

  const express = require('express');
  const app = express();

  const bodyParser = require('body-parser');
  app.use(bodyParser.json());

  const cors = require('cors');
  app.use(cors());

  const env = require('dotenv');
  env.config();

  const Type = require('./models/Types/type.routes');
  app.use('/type', Type);

  const Construction = require('./models/Constructions/construction.routes');
  app.use('/construction', Construction);

  const portExpress = process.env.EXPRESS_PORT;
  const hostExpress = process.env.EXPRESS_HOST;

  app.listen(portExpress, hostExpress, () => {
    console.log(`API ready to get requests...`);
    console.log('running on host ' + hostExpress + ' port ' + portExpress);
  }); 