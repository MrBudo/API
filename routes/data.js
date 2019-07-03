const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const Data = mongoose.model('Data', new mongoose.Schema({
  timestamp: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  Carbon: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  soil: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  }
}));

router.get('/', async (req, res) => {
  const data = await Data.find().sort('timestamp');
  res.send(data);
});

router.post('/', async (req, res) => {
  const { error } = validateData(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let data = new Data({ 
    timestamp: req.body.timestamp,
    Carbon: req.body.Carbon,
    soil: req.body.soil
  });
  data = await data.save();
  
  res.send(data);
});

router.put('/:id', async (req, res) => {
  const { error } = validateData(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const data = await Data.findByIdAndUpdate(req.params.id,
    { 
      timestamp: req.body.timestamp,
      Carbon: req.body.Carbon,
      soil: req.body.soil
    }, { new: true });

  if (!data) return res.status(404).send('The data with the given ID was not found.');
  
  res.send(data);
});

router.delete('/:id', async (req, res) => {
  const data = await Data.findByIdAndRemove(req.params.id);

  if (!data) return res.status(404).send('The data with the given ID was not found.');

  res.send(data);
});

router.get('/:id', async (req, res) => {
  const data = await Data.findById(req.params.id);

  if (!data) return res.status(404).send('The data with the given ID was not found.');

  res.send(data);
});

function validateData(data) {
  const schema = {
    timestamp: Joi.string().min(3).max(50).required(),
    Carbon: Joi.string().min(3).max(50).required(),
    soil: Joi.string().required()
  };

  return Joi.validate(data, schema);
}

module.exports = router; 