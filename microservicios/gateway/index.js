// API Gateway - port 3000
// The ONLY entry point of the system. The client talks only to this service
// and the gateway forwards each request to the corresponding microservice.

const express = require("express");

const app = express();
app.use(express.json());

const PORT = 3000;

// Where each microservice lives (Docker Compose service names)
const URL_ORDERS = "http://orders:3001";
const URL_INVENTORY = "http://inventory:3002";
const URL_PAYMENTS = "http://payments:3003";
const URL_NOTIFICATIONS = "http://notifications:3004";

// -------------------------------------------------------------------
// Logging middleware
// -------------------------------------------------------------------
app.use((req, res, next) => {
  console.log(`[GATEWAY] ${req.method} ${req.path}`);
  next();
});

// -------------------------------------------------------------------
// Helper: forwards (proxies) a request to a destination service
// and returns exactly what that service responds.
// -------------------------------------------------------------------
async function forward(destination, req, res) {
  try {
    const options = {
      method: req.method,
      headers: { "Content-Type": "application/json" },
    };
    if (req.method !== "GET" && req.method !== "HEAD") {
      options.body = JSON.stringify(req.body || {});
    }

    const response = await fetch(destination, options);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.log(`[GATEWAY] Error forwarding to ${destination}: ${error.message}`);
    res.status(502).json({
      success: false,
      message: `The gateway could not contact the destination service (${destination}).`,
      detalle: error.message,
    });
  }
}

// -------------------------------------------------------------------
// Proxied routes
// -------------------------------------------------------------------

// ORDERS
app.post("/pedidos", (req, res) => {
  forward(`${URL_ORDERS}/pedidos`, req, res);
});

// NOTIFICATIONS
app.post("/notificaciones", (req, res) => {
  forward(`${URL_NOTIFICATIONS}/notificaciones`, req, res);
});

// INVENTORY
app.all("/inventario", (req, res) => {
  forward(`${URL_INVENTORY}/inventario`, req, res);
});
app.all("/inventario/:pizza", (req, res) => {
  forward(`${URL_INVENTORY}/inventario/${req.params.pizza}`, req, res);
});

// PAYMENTS
app.all("/pagos", (req, res) => {
  forward(`${URL_PAYMENTS}/pagos`, req, res);
});

app.get("/", (req, res) => {
  res.json({ service: "gateway", status: "ok", port: PORT });
});

app.listen(PORT, () => {
  console.log(`[GATEWAY] API Gateway listening on http://localhost:${PORT}`);
});
