const express = require('express');

const morgan = require('morgan');
const debug = require('debug')('app');
require('dotenv').config();
const authRoutes = require('./src/routes/auth.routes');
const policiesRoutes = require('./src/routes/policies.routes');

const port = process.env.PORT || 1905;

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use('/', authRoutes);
app.use('/polices', policiesRoutes);

app.listen(port, debug(`server is running on port ${port}`));
