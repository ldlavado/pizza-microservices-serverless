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
app.get("/inventory", (req, res) => {
  const pizzas = readPizzas();
  res.json(pizzas);
});

// Returns a single pizza
app.get("/inventory/:pizza", (req, res) => {
  const pizzas = readPizzas();
  const name = req.params.pizza.toLowerCase();
  const pizza = pizzas[name];

  if (!pizza) {
    return res.status(404).json({
      available: false,
      message: "That pizza does not exist on the menu.",
    });
  }

  res.json({
    pizza: name,
    stock: pizza.stock,
    available: pizza.stock > 0,
    price: pizza.price,
    ingredients: pizza.ingredients,
  });
});

// Deducts one pizza from stock if available
app.post("/inventory", (req, res) => {
  const { pizza } = req.body;

  if (!pizza) {
    return res.status(400).json({
      available: false,
      message: "You must send the 'pizza' field.",
    });
  }

  const name = pizza.toLowerCase();
  const pizzas = readPizzas();
  const found = pizzas[name];

  if (!found) {
    return res.status(404).json({
      available: false,
      message: `Pizza '${pizza}' does not exist on the menu.`,
    });
  }

  if (found.stock <= 0) {
    return res.status(409).json({
      available: false,
      message: `No stock available for ${found.name} pizza.`,
      stock: found.stock,
    });
  }

  found.stock = found.stock - 1;
  savePizzas(pizzas);

  res.json({
    available: true,
    message: `Reserved one ${found.name} pizza.`,
    remainingStock: found.stock,
    price: found.price,
  });
});

app.get("/", (req, res) => {
  res.json({ service: "inventory", status: "ok", port: PORT });
});

app.listen(PORT, () => {
  console.log(`[INVENTORY] Inventory service listening on http://localhost:${PORT}`);
});
