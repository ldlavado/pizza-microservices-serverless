// Payments service - port 3003
// Simulates charging. For the workshop it always approves the payment.

const express = require("express");

const app = express();
app.use(express.json());

const PORT = 3003;

app.post("/payments", (req, res) => {
  const { pizza, amount } = req.body;

  if (amount === undefined || amount === null) {
    return res.status(400).json({
      approved: false,
      message: "You must send the 'amount' field.",
    });
  }

  // Fake transaction number
  const transaction = "TX-" + Math.floor(Math.random() * 1000000);

  res.json({
    approved: true,
    transaction: transaction,
    amount: amount,
    message: `Payment approved for $${amount}${pizza ? " (pizza " + pizza + ")" : ""}.`,
  });
});

app.get("/", (req, res) => {
  res.json({ service: "payments", status: "ok", port: PORT });
});

app.listen(PORT, () => {
  console.log(`[PAYMENTS] Payments service listening on http://localhost:${PORT}`);
});
