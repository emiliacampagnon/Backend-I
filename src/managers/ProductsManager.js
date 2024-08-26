import fs from "fs";

const PRODUCT_FILE_PATH = './src/files/products.json';

export default class ProductsManager {

        constructor()
        {
            if(!fs.existsSync(PRODUCT_FILE_PATH))
            {
                this.init();
            }
            else
            {
                console.log("El archivo de Productos Existe.");
            }
        }

        async init()
        {
           
            await fs.promises.writeFile(PRODUCT_FILE_PATH,JSON.stringify([]));
        }

        async getProducts()
        {
            const data = await fs.promises.readFile(PRODUCT_FILE_PATH, 'utf-8');
            const products = JSON.parse(data);

            return products;
        }

        async getProductById(productId)
        {
            const data = await fs.promises.readFile(PRODUCT_FILE_PATH, 'utf-8');
            const products = JSON.parse(data);
            const product = products.find(p => p.id === productId);
            return product;
        }

        async addProduct(productData) {
     
            const { title, description, code, price, stock, category, thumbnails = [] } = productData;
    
            if (!title || !description || !code || !price || stock === undefined || !category) {
                return "Todos los campos son obligatorios.";
            }

            const products = await this.getProducts();
            const newId = this.generateUniqueId(products);
    
            const newProduct = {
                id: newId,
                title,
                description,
                code,
                price,
                status: true,
                stock,
                category,
                thumbnails
            };
    
            products.push(newProduct);
            await fs.promises.writeFile(PRODUCT_FILE_PATH, JSON.stringify(products, null, 2));
            return newProduct;
        }
    
        generateUniqueId(products) {
            
            let newId = 1;
            const ids = products.map(p => p.id);
    
            
            while (ids.includes(newId)) {
                newId++;
            }
    
            return newId;
        }

        async updateProduct(productId, updatedProductData) {
            const products = await this.getProducts();
            const productIndex = products.findIndex(p => p.id === productId);
    
            if (productIndex === -1) {
                return null;
            }
    
           
            const productToUpdate = products[productIndex];
            const updatedProduct = { ...productToUpdate, ...updatedProductData, id: productToUpdate.id };
    
           
            products[productIndex] = updatedProduct;
    
           
            await fs.promises.writeFile(PRODUCT_FILE_PATH, JSON.stringify(products, null, 2));
    
            return updatedProduct;
        }
    
     
        async deleteProduct(productId) {
            const products = await this.getProducts();
            const newProductsList = products.filter(p => p.id !== productId);
    
            if (newProductsList.length === products.length) {
               
                return false;
            }
    
          
            await fs.promises.writeFile(PRODUCT_FILE_PATH, JSON.stringify(newProductsList, null, 2));
    
            return true;
        }
}