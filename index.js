const mongoose = require('mongoose');
const data = require('./routes/data');
const express = require('express');
const app = express();

mongoose.connect('mongodb://localhost/test')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.json());
app.use('/api/data', data);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));