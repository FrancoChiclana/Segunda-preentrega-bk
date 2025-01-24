const express = require('express');
const fs = require('fs');
const router = express.Router();
const path = '../data/products.json';

const readProducts = () => JSON.parse(fs.readFileSync(path, 'utf-8'));

const saveProducts = (products) => fs.writeFileSync(path, JSON.stringify(products, null, 2));

router.get('/', (req, res) => {
    const limit = parseInt(req.query.limit, 10);
    const products = readProducts();
    return res.json(limit ? products.slice(0, limit) : products);
});

router.get('/:pid', (req, res) => {
    const products = readProducts();
    const product = products.find(p => p.id === req.params.pid);
    return product ? res.json(product) : res.status(404).send('Producto no encontrado')
});

router.post('/', (req, res) =>{
    const products = readProducts();
    const { title, description, price, stock, category, thumbnails, status } = req.body;

    if ( !title || !description || !code || !price || !stock || !category) {
        return res.status(400).send('Todos los campos excepto thumbnails son obligatorios')
    }

    const newProduct = {
        id: String(products.length + 1),
        title,
        description,
        code,
        price,
        stock,
        category,
        thumbnails: thumbnails || [],
        status: status ?? true
    };

    products.push(newProduct);
    saveProducts(products);
    res.status(201).json(newProduct);
});

router.put('/:pid', (req, res) =>{
    const products = readProducts();
    const index = products.findIndex(p => p.id === req.params.pid);

    if (index === -1) return res.status(404).send('Producto no encontrado');

    const updatedProduct = { ...products[index], ...req.body };
    delete updatedProduct.id;
    products[index] = updatedProduct;

    saveProducts(products);
    res.json(updatedProduct);
});

router.delete('/:pid' , (req, res) => {
    const products = readProducts();
    const filteredProducts = products.filter(p => p.id !== req.params.pid);

    if (filteredProducts.length === products.length) return res.status(404).send('Producto no encontrado');

    saveProducts(filteredProducts);
    res.sendStatus(204);
});

module.exports = router;