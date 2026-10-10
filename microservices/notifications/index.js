// Notifications service - port 3004
// Notifies when an order is confirmed.

const express = require("express");

const app = express();
app.use(express.json());

const PORT = 3004;

app.post("/notifications", (req, res) => {
  // Step 1: read orderId and pizza from the body
  const { orderId, pizza } = req.body;

  // Step 2: log the notice
  console.log(`[NOTIFICATIONS] Notice: your order ${orderId} of ${pizza} pizza is confirmed.`);

  // Step 3: respond with success
  return res.json({
    success: true,
    message: `Notification sent for order ${orderId}`,
  });
});

app.get("/", (req, res) => {
  res.json({ service: "notifications", status: "ok", port: PORT });
});

app.listen(PORT, () => {
  console.log(`[NOTIFICATIONS] Notifications service listening on http://localhost:${PORT}`);
});
