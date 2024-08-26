import express from "express";
import ProductsManager from "./managers/ProductsManager.js";
import CartsManager from "./managers/CartsManager.js";

const app = express();
const PORT = process.env.PORT | 8080;

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});

app.use(express.json());
const productsManager = new ProductsManager();
const cartsManager = new CartsManager();

app.get("/products", async (req, res) => {
  try {
    const products = await productsManager.getProducts();
    return res.status(200).send({ products });
  } catch (e) {
    console.log("Fallo el listado de productos desde el archivo");
    res.status(500).send("Error en Productos");
  }
});

app.get("/product/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const parseId = parseInt(pid);
    const product = await productsManager.getProductById(parseId);

    if (!product) {
      return res.status(403).send("Producto no encontrado");
    }

    return res.status(200).send({ product });
  } catch (e) {
    res.status(500).send("Error al buscar el producto por id");
  }
});

app.post("/product", async (req, res) => {
  try {
    const productData = req.body;

    const newProduct = await productsManager.addProduct(productData);

    return res.status(201).send({ product: newProduct });
  } catch (e) {
    res.status(500).send(" Error al agregar un producto");
  }
});

app.put("/product/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const updatedProductData = req.body;

    const updatedProduct = await productsManager.updateProduct(
      parseInt(pid),
      updatedProductData
    );

    if (!updatedProduct) {
      return res.status(404).send("Producto no encontrado");
    }

    return res.status(200).send({ product: updatedProduct });
  } catch (e) {
    res.status(500).send("Error al actualizar los datos de un producto.");
  }
});

app.delete("/product/:pid", async (req, res) => {
  try {
    const { pid } = req.params;

    const isDeleted = await productsManager.deleteProduct(parseInt(pid));

    if (!isDeleted) {
      return res.status(404).send("Producto no encontrado");
    }

    return res
      .status(200)
      .send({ message: "Producto eliminado correctamente" });
  } catch (e) {
    res.status(500).send("Error al buscar un producto");
  }
});

app.get("/cart/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await cartsManager.getCartById(parseInt(cid));
    if (!cart) {
      return res.status(404).send("Carrito no encontrado");
    }

    const allProducts = await productsManager.getProducts();

    const detailedProducts = cart.products.map((cartProduct) => {
      const fullProductDetails = allProducts.find(
        (p) => p.id === cartProduct.product
      );
      return {
        ...fullProductDetails,
        quantity: cartProduct.quantity,
      };
    });

    return res.status(200).send({ products: detailedProducts });
  } catch (e) {
    res.status(500).send("Error al consultar el carrito");
  }
});

app.post("/cart", async (req, res) => {
  try {
    const newCart = await cartsManager.addCart();
    return res.status(201).send({ cart: newCart });
  } catch (e) {
    res.status(500).send("Error al crear un nuevo carrito");
  }
});

app.post("/cart/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await cartsManager.getCartById(parseInt(cid));
    if (!cart) {
      return res.status(404).send("Carrito no encontrado");
    }

    const product = await productsManager.getProductById(parseInt(pid));
    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }

    const updatedCart = await cartsManager.addProductToCart(
      parseInt(cid),
      parseInt(pid)
    );

    return res.status(201).send({ cart: updatedCart });
  } catch (e) {
    res.status(500).send("error al asignar un producto al carrito");
  }
});
