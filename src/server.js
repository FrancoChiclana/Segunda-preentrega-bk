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
app.set('views', './views');

app.use('/api/products', productsRouter(io));
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter(io));

server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

