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
            //Creo el archivo de productos.
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
            // Validar que todos los campos requeridos estén presentes
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
            // Generar un ID único y autoincremental
            let newId = 1;
            const ids = products.map(p => p.id);
    
            // Buscar el siguiente ID disponible
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
    
            // No se debe actualizar el ID
            const productToUpdate = products[productIndex];
            const updatedProduct = { ...productToUpdate, ...updatedProductData, id: productToUpdate.id };
    
            // Reemplazar el producto en la lista
            products[productIndex] = updatedProduct;
    
            // Guardar los cambios en el archivo
            await fs.promises.writeFile(PRODUCT_FILE_PATH, JSON.stringify(products, null, 2));
    
            return updatedProduct;
        }
    
        // Método para eliminar un producto existente
        async deleteProduct(productId) {
            const products = await this.getProducts();
            const newProductsList = products.filter(p => p.id !== productId);
    
            if (newProductsList.length === products.length) {
                // Si la longitud no cambia, el producto no fue encontrado
                return false;
            }
    
            // Guardar la nueva lista de productos
            await fs.promises.writeFile(PRODUCT_FILE_PATH, JSON.stringify(newProductsList, null, 2));
    
            return true;
        }
}