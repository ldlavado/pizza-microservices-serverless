// Payments service - port 3003
// Simulates charging. For the workshop it always approves the payment.

const express = require("express");

const app = express();
app.use(express.json());

const PORT = 3003;

app.post("/pagos", (req, res) => {
  const { pizza, monto } = req.body;

  if (monto === undefined || monto === null) {
    return res.status(400).json({
      aprobado: false,
      message: "You must send the 'monto' field.",
    });
  }

  // Fake transaction number
  const transaction = "TX-" + Math.floor(Math.random() * 1000000);

  res.json({
    aprobado: true,
    transaccion: transaction,
    monto: monto,
    message: `Payment approved for $${monto}${pizza ? " (pizza " + pizza + ")" : ""}.`,
  });
});

app.get("/", (req, res) => {
  res.json({ service: "payments", status: "ok", port: PORT });
});

app.listen(PORT, () => {
  console.log(`[PAYMENTS] Payments service listening on http://localhost:${PORT}`);
});
