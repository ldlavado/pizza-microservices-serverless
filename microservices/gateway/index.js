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
      detail: error.message,
    });
  }
}

// -------------------------------------------------------------------
// Proxied routes
// -------------------------------------------------------------------

// ORDERS
app.post("/orders", (req, res) => {
  forward(`${URL_ORDERS}/orders`, req, res);
});

// NOTIFICATIONS
app.post("/notifications", (req, res) => {
  forward(`${URL_NOTIFICATIONS}/notifications`, req, res);
});

// INVENTORY
app.all("/inventory", (req, res) => {
  forward(`${URL_INVENTORY}/inventory`, req, res);
});
app.all("/inventory/:pizza", (req, res) => {
  forward(`${URL_INVENTORY}/inventory/${req.params.pizza}`, req, res);
});

// PAYMENTS
app.all("/payments", (req, res) => {
  forward(`${URL_PAYMENTS}/payments`, req, res);
});

app.get("/", (req, res) => {
  res.json({ service: "gateway", status: "ok", port: PORT });
});

app.listen(PORT, () => {
  console.log(`[GATEWAY] API Gateway listening on http://localhost:${PORT}`);
});
