import fs from "fs";

const CARTS_FILE_PATH = './src/files/carts.json';

export default class CartsManager {

    constructor() 
    {
        if (!fs.existsSync(CARTS_FILE_PATH)) 
        {
            this.init();
        } 
        else 
        {
            console.log("El archivo de Carrito Existe.");
        }
    }

    async init() 
    {
        
        await fs.promises.writeFile(CARTS_FILE_PATH, JSON.stringify([]));
    }

    async getCarts() 
    {
        
        const data = await fs.promises.readFile(CARTS_FILE_PATH, 'utf-8');
        const carts = JSON.parse(data);
        return carts;
    }

    async getCartById(cartId) 
    {
        
        const carts = await this.getCarts();
        const cart = carts.find(c => c.id === cartId);
        return cart;
    }

    async addCart() 
    {
        
        const carts = await this.getCarts();
        const newId = this.generateUniqueId(carts);

        const newCart = 
        {
            id: newId,
            products: []
        };

        carts.push(newCart);
        await fs.promises.writeFile(CARTS_FILE_PATH, JSON.stringify(carts, null, 2));

        return newCart;
    }

    async addProductToCart(cartId, productId) 
    {
        
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex(c => c.id === cartId);

        if (cartIndex === -1) 
            {
            throw new Error("Carrito no encontrado");
        }

        const cart = carts[cartIndex];

        const productIndex = cart.products.findIndex(p => p.product === productId);

        
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        carts[cartIndex] = cart;
        await fs.promises.writeFile(CARTS_FILE_PATH, JSON.stringify(carts, null, 2));
        return cart;
    }

    generateUniqueId(carts) 
    {
        let newId = 1;
        const ids = carts.map(c => c.id);

        while (ids.includes(newId)) 
        {
            newId++;
        }

        return newId;
    }
}
