class Producto {     //creo la clase Producto antes de usarla en la lista de productos
    sku;            
    nombre;         
    categoria;      
    precio;         
    stock;          

    constructor(sku, nombre, precio, categoria, stock) {
        this.sku = sku;
        this.nombre = nombre;
        this.categoria = categoria;
        this.precio = precio;

        if (stock) {
            this.stock = stock;
        } else {
            this.stock = 10;
        }
    }

}

// Creo todos los productos que vende mi super
const queso = new Producto('KS944RUR', 'Queso', 10, 'lacteos', 4);
const gaseosa = new Producto('FN312PPE', 'Gaseosa', 5, 'bebidas');
const cerveza = new Producto('PV332MJ', 'Cerveza', 20, 'bebidas');
const arroz = new Producto('XX92LKI', 'Arroz', 7, 'alimentos', 20);
const fideos = new Producto('UI999TY', 'Fideos', 5, 'alimentos');
const lavandina = new Producto('RT324GD', 'Lavandina', 9, 'limpieza');
const shampoo = new Producto('OL883YE', 'Shampoo', 3, 'higiene', 50);
const jabon = new Producto('WE328NJ', 'Jabon', 4, 'higiene', 3);

// Genero un listado de productos. Simulando base de datos
const productosDelSuper = [queso, gaseosa, cerveza, arroz, fideos, lavandina, shampoo, jabon];


class Carrito {
    productos;      
    categorias;     
    precioTotal;    

    constructor() {
        this.precioTotal = 0;
        this.productos = [];
        this.categorias = [];
    }

    // Agrego la lógica necesaria para actualizar la cantidad de un producto existente en el carrito
    async agregarProducto(sku, cantidad) {
        console.log(`Agregando ${cantidad} ${sku}`);

        const producto = await findProductBySku(sku);   // Busco el producto en la "base de datos"

        const productoExistente = this.productos.find(producto => producto.sku === sku);
        
        if (productoExistente) {
            productoExistente.cantidad += cantidad;
        } else {
            // Si no existe, agrego un nuevo producto al carrito
            const nuevoProducto = new ProductoEnCarrito(sku, producto.nombre, cantidad);
            this.productos.push(nuevoProducto);
        }

        // Actualizo el precio total del carrito
        this.precioTotal = this.precioTotal + (producto.precio * cantidad);

        // Agrego la categoría del producto a la lista de categorías solo si no existe ya en la lista
        if (!this.categorias.includes(producto.categoria)) {
            this.categorias.push(producto.categoria);
        }
    }
    eliminarProducto(sku, cantidad) {            //2) Agregar la función eliminarProducto a la clase Carrito.
        console.log(`Eliminando ${cantidad} ${sku}`);
    
        return new Promise((resolve, reject) => {
            findProductBySku(sku)
                .then((producto) => {
                    const productoExistente = this.productos.find((producto) => producto.sku === sku);  // Busco si ya existe el producto en el carrito
    
                    if (!productoExistente) {            // Si el producto no existe en el carrito, lanzo un error
                        throw new Error(`El producto ${sku} no está en el carrito`);
                    }
    
                    if (cantidad < productoExistente.cantidad) {    // Si la cantidad es menor a la cantidad de ese producto en el carrito, se resta esa cantidad al producto 
                          productoExistente.cantidad -= cantidad;
                         this.precioTotal -= producto.precio * cantidad;
                    } else {                                                // Si la cantidad es mayor o igual a la cantidad de ese producto en el carrito, se elimina el producto del carrito
                         const index = this.productos.indexOf(productoExistente);
                        this.productos.splice(index, 1);
                        this.precioTotal -= producto.precio * productoExistente.cantidad;
                    }

                    resolve(); // Resolvemos la promesa sin ningún valor
                })
                .catch((error) => {
                    reject(error); // Rechazo la promesa con el error capturado
                });
        });
    }
    
}

// Cada producto que se agrega al carrito es creado con esta clase:
class ProductoEnCarrito {
    sku;       
    nombre;    
    cantidad;  

    constructor(sku, nombre, cantidad) {
        this.sku = sku;
        this.nombre = nombre;
        this.cantidad = cantidad;
    }

}

function findProductBySku(sku) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const foundProduct = productosDelSuper.find(product => product.sku === sku);
            if (foundProduct) {
                resolve(foundProduct);
            } else {
                reject(`Product ${sku} not found`);
            }
        }, 1500);
    });
}

//CORROBORO que la clase Producto funcione:
const producto1 = new Producto("KSD99IH", "Membrillo", "alimentos", 22, 5);
console.log(producto1);
console.log(productosDelSuper);

// CORROBORO crear una instancia de Carrito:
const carrito = new Carrito();

// Llamo al método agregarProducto con valores de prueba
carrito.agregarProducto('KS944RUR', 2); // Agregar 2 productos con SKU 'KS944RUR'
carrito.agregarProducto('FN312PPE', 1); // Agregar 1 producto con SKU 'FN312PPE'

carrito.eliminarProducto('KS944RUR', 5);

console.log(ProductoEnCarrito);

// Imprimo la instancia del carrito
console.log(carrito);

