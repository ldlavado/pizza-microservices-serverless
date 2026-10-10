// Example serverless function.
// Receives a pizza and returns an order summary with estimated delivery time.

function buildResponse(pizza) {
  const name = (pizza || "unknown").toString();

  const now = new Date();
  const delivery = new Date(now.getTime() + 30 * 60 * 1000); // +30 min

  return {
    success: true,
    pizza: name,
    message: `Order of ${name} pizza received by the Serverless function.`,
    entregaEstimada: delivery.toISOString(),
    ejecutadaEn: now.toISOString(),
  };
}

// Handler for Vercel / Netlify
module.exports = (req, res) => {
  let pizza = "unknown";

  if (req.body && req.body.pizza) {
    pizza = req.body.pizza;
  }

  const body = buildResponse(pizza);

  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;
  res.end(JSON.stringify(body));
};

module.exports.buildResponse = buildResponse;
