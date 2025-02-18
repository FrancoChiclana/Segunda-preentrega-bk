const socket = io();

socket.on('updateProducts', (products) => {
  const productList = document.getElementById('product-list');
  productList.innerHTML = products.map(p => `<li>${p.title} - $${p.price} <button onclick="deleteProduct('${p.id}')">Eliminar</button></li>`).join('');
});

const addProduct = () => {
  const title = document.getElementById('title').value;
  const price = document.getElementById('price').value;
  socket.emit('newProduct', { title, price });
};

const deleteProduct = (id) => {
  socket.emit('deleteProduct', id);
};
