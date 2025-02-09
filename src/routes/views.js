const express = require('express');
const fs = require('fs');
const router = express.Router();
const productsPath = './src/data/products.json';

const readFile = () => JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

module.exports = (io) => {
  router.get('/home', (req, res) => {
    res.render('home', { products: readFile() });
  });

  router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { products: readFile() });
  });

  return router;
};
