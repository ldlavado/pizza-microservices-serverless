// Notifications service - port 3004
// Notifies when an order is confirmed.

const express = require("express");

const app = express();
app.use(express.json());

const PORT = 3004;

app.post("/notificaciones", (req, res) => {
  // Step 1: read pedidoId and pizza from the body
  const { pedidoId, pizza } = req.body;

  // Step 2: log the notice
  console.log(`[NOTIFICATIONS] Notice: your order ${pedidoId} of ${pizza} pizza is confirmed.`);

  // Step 3: respond with success
  return res.json({
    success: true,
    message: `Notification sent for order ${pedidoId}`,
  });
});

app.get("/", (req, res) => {
  res.json({ service: "notifications", status: "ok", port: PORT });
});

app.listen(PORT, () => {
  console.log(`[NOTIFICATIONS] Notifications service listening on http://localhost:${PORT}`);
});
