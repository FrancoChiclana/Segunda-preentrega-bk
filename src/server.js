const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const handlebars = require('express-handlebars');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
const viewsRouter = require('./routes/views');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

app.use('/api/products', productsRouter(io));
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter(io));

io.on('connection', (socket) => {
  console.log('Usuario conectado');
  socket.emit('updateProducts', readFile());
  socket.on('newProduct', (product) => {
    let products = readFile();
    const newProduct = { id: String(products.length + 1), ...product, thumbnails: [], status: true };
    products.push(newProduct);
    writeFile(products);
    io.emit('updateProducts', products);
  });
  socket.on('deleteProduct', (id) => {
    let products = readFile();
    products = products.filter(product => product.id !== id);
    writeFile(products);
    io.emit('updateProducts', products);
  });
});

server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

