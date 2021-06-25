const express = require('express');

const morgan = require('morgan');
const debug = require('debug');
// const cors = require('cors');
require('dotenv').config();
// const authRoutes = require('./routes/auth.routes');
// const dieticiansRouter = require('./routes/dieticians.routes');

const port = process.env.PORT || 1905;

const app = express();
app.use(morgan('dev'));
app.use(express.json());

// app.use('/', authRoutes);

app.listen(port, debug(`server is running on port ${port}`));
