"use strict";

  const express = require('express');
  const app = express();
  const bodyParser = require('body-parser');
  const cors = require('cors');
  const env = require('dotenv');
  env.config();

  const adminRoutes = require('./models/admin');

  app.use(bodyParser.json());

  app.use(cors());
  
  app.use(adminRoutes);

  const portExpress = process.env.EXPRESS_PORT;
  const hostExpress = process.env.EXPRESS_HOST;

  app.listen(portExpress, hostExpress, () => {
    console.log(`API ready to get requests...`);
    console.log('running on host ' + hostExpress + ' port ' + portExpress);
  }); 