const express = require('express');
const fs = require('fs');
const router = express.Router();
const productsPath = './src/data/products.json';

const readFile = () => JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
const writeFile = (data) => fs.writeFileSync(productsPath, JSON.stringify(data, null, 2));

module.exports = (io) => {
  router.get('/', (req, res) => {
    res.json(readFile());
  });

  router.post('/', (req, res) => {
    const products = readFile();
    const newProduct = { id: String(products.length + 1), ...req.body, thumbnails: [], status: true };
    products.push(newProduct);
    writeFile(products);
    io.emit('updateProducts', products);
    res.status(201).json(newProduct);
  });

  router.delete('/:pid', (req, res) => {
    let products = readFile();
    products = products.filter(product => product.id !== req.params.pid);
    writeFile(products);
    io.emit('updateProducts', products);
    res.status(200).json({ message: 'Producto eliminado' });
  });

  return router;
};
