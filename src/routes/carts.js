const express = require('express');
const fs = require('fs');
const router = express.Router();
const path = ('../data/carts.json');

const readCarts = () => JSON.parse(fs.readFileSync(path, 'utf-8'));

const saveCarts = (carts) => fs.writeFileSync(path, JSON.stringify(carts, null, 2));

router.post('/', (req,res) => {
    const carts = readCarts();
    const newCart = { id: String(carts.lengh + 1), products: []};

    carts.push(newCart);
    saveCarts(carts);
    res.status(201).json(newCart);
});

router.get('/:cid', (req, res) =>{
    const carts = readCarts();
    const cart = carts.find(c => c.id === req.params.cid);

    return cart ? res.json(cart.products) : res.status(404).send('Carrito no encontrado');
});

router.post('/:cid/product/:pid', (req, res) => {
    const carts = readCarst();
    const cart = carts.find(x => c.id === req.params.cid);

    if(!cart) return res.status(404).send('Carrito no encontrado');

    const productIndex = cart.products.findIndex(p => p.product === req.params.pid);

    if (productIndex > -1) {
        cart.product[productIndex].quantity += 1;
    } else {
        cart.product.push({ product: req.params.pid, quantity: 1});
    }

    saveCarts(carts);
    res.json(cart);
});

module.exports = router;