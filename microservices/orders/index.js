// Orders service - port 3001
// Receives the order and coordinates inventory and payments.
// Client -> Orders -> Inventory -> Payments -> Order confirmed

const express = require("express");

const app = express();
app.use(express.json());

const PORT = 3001;

const URL_INVENTORY = "http://inventory:3002";
const URL_PAYMENTS = "http://payments:3003";
const URL_NOTIFICATIONS = "http://notifications:3004";

// Set to true once notifications service is running
const NOTIFICATIONS_ENABLED = true;

// Maximum wait time for another service, in ms
const TIMEOUT_MS = 5000;

let orderCounter = 0;

// Makes a request and aborts if it takes longer than TIMEOUT_MS
async function requestWithTimeout(url, options) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timer);
  }
}

app.post("/orders", async (req, res) => {
  const { pizza } = req.body;

  if (!pizza) {
    return res.status(400).json({
      success: false,
      message: "You must send the 'pizza' field. Example: { \"pizza\": \"hawaiian\" }",
    });
  }

  orderCounter = orderCounter + 1;
  const orderId = orderCounter;

  console.log(`\n[ORDERS] New order #${orderId}: ${pizza}`);

  // Step 1: check inventory
  let inventoryData;
  try {
    const invResp = await requestWithTimeout(`${URL_INVENTORY}/inventory`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pizza }),
    });
    inventoryData = await invResp.json();

    if (!inventoryData.available) {
      console.log(`[ORDERS] Order #${orderId} rejected by inventory.`);
      return res.status(409).json({
        success: false,
        orderId,
        pizza,
        message: `Order rejected: ${inventoryData.message}`,
      });
    }
  } catch (error) {
    console.log(`[ORDERS] Error talking to INVENTORY: ${error.message}`);
    return res.status(503).json({
      success: false,
      orderId,
      pizza,
      message:
        "Could not contact the Inventory Service. Make sure it is running.",
      detail: error.message,
    });
  }

  // Step 2: process payment
  let paymentData;
  try {
    const payResp = await requestWithTimeout(`${URL_PAYMENTS}/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pizza, amount: inventoryData.price }),
    });
    paymentData = await payResp.json();

    if (!paymentData.approved) {
      console.log(`[ORDERS] Order #${orderId} rejected by payments.`);
      return res.status(402).json({
        success: false,
        orderId,
        pizza,
        message: `Order rejected: ${paymentData.message}`,
      });
    }
  } catch (error) {
    console.log(`[ORDERS] Error talking to PAYMENTS: ${error.message}`);
    return res.status(503).json({
      success: false,
      orderId,
      pizza,
      message:
        "Could not contact the Payments Service. Make sure it is running.",
      detail: error.message,
    });
  }

  // Step 3 (optional): notify. If it fails, the order still succeeds.
  let notification = null;
  if (NOTIFICATIONS_ENABLED) {
    try {
      const notResp = await requestWithTimeout(`${URL_NOTIFICATIONS}/notifications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, pizza }),
      });
      notification = await notResp.json();
    } catch (error) {
      console.log(`[ORDERS] Could not notify (non-critical): ${error.message}`);
      notification = { success: false, message: "Could not send the notification." };
    }
  }

  // Order confirmed
  console.log(`[ORDERS] Order #${orderId} CONFIRMED.`);
  res.json({
    success: true,
    orderId,
    pizza,
    price: inventoryData.price,
    remainingStock: inventoryData.remainingStock,
    transaction: paymentData.transaction,
    notification,
    message: `Order #${orderId} of ${pizza} pizza confirmed successfully.`,
  });
});

app.get("/", (req, res) => {
  res.json({ service: "orders", status: "ok", port: PORT });
});

app.listen(PORT, () => {
  console.log(`[ORDERS] Orders service listening on http://localhost:${PORT}`);
  console.log(`[ORDERS] Timeout set to ${TIMEOUT_MS} ms.`);
});
