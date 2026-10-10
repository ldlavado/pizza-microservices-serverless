// Inventory service - port 3002
// Stores stock of each pizza and deducts when an order is placed.

const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

const PORT = 3002;

const PIZZAS_FILE = path.join(__dirname, "pizzas.json");

function readPizzas() {
  const content = fs.readFileSync(PIZZAS_FILE, "utf-8");
  return JSON.parse(content);
}

function savePizzas(pizzas) {
  fs.writeFileSync(PIZZAS_FILE, JSON.stringify(pizzas, null, 2), "utf-8");
}

// Returns full inventory
app.get("/inventario", (req, res) => {
  const pizzas = readPizzas();
  res.json(pizzas);
});

// Returns a single pizza
app.get("/inventario/:pizza", (req, res) => {
  const pizzas = readPizzas();
  const name = req.params.pizza.toLowerCase();
  const pizza = pizzas[name];

  if (!pizza) {
    return res.status(404).json({
      disponible: false,
      message: "That pizza does not exist on the menu.",
    });
  }

  res.json({
    pizza: name,
    stock: pizza.stock,
    disponible: pizza.stock > 0,
    precio: pizza.precio,
    ingredientes: pizza.ingredientes,
  });
});

// Deducts one pizza from stock if available
app.post("/inventario", (req, res) => {
  const { pizza } = req.body;

  if (!pizza) {
    return res.status(400).json({
      disponible: false,
      message: "You must send the 'pizza' field.",
    });
  }

  const name = pizza.toLowerCase();
  const pizzas = readPizzas();
  const found = pizzas[name];

  if (!found) {
    return res.status(404).json({
      disponible: false,
      message: `Pizza '${pizza}' does not exist on the menu.`,
    });
  }

  if (found.stock <= 0) {
    return res.status(409).json({
      disponible: false,
      message: `No stock available for ${found.nombre} pizza.`,
      stock: found.stock,
    });
  }

  found.stock = found.stock - 1;
  savePizzas(pizzas);

  res.json({
    disponible: true,
    message: `Reserved one ${found.nombre} pizza.`,
    stockRestante: found.stock,
    precio: found.precio,
  });
});

app.get("/", (req, res) => {
  res.json({ service: "inventory", status: "ok", port: PORT });
});

app.listen(PORT, () => {
  console.log(`[INVENTORY] Inventory service listening on http://localhost:${PORT}`);
});
