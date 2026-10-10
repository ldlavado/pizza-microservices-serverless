# Microservices and Serverless Workshop — The Pizzeria

Work through the activities in order and answer the questions in `answers/answers.md`.

## Objectives

- Run and test a microservices system.
- Observe HTTP communication between services.
- See behavior under failures (no stock, service down, timeout).
- Complete and test a new microservice.
- Consume a Serverless function and compare it with the microservices.

## Context

### Microservices

The system is divided into independent services, each with a distinct responsibility, that communicate over HTTP.

```text
Client
   ↓
Orders        (3001)
   ↓
Inventory     (3002)
   ↓
Payments      (3003)
   ↓
Notifications (3004)
   ↓
Order confirmed
```

- **Orders (3001):** receives the order and coordinates inventory and payments.
- **Inventory (3002):** controls the stock of each pizza.
- **Payments (3003):** simulates the charge (always approves).
- **Notifications (3004):** sends a confirmation notice.
- **Gateway (3000):** single entry point that forwards requests.

### Menu (pizzas.json)

| Pizza | Price | Initial stock |
|---|---|---|
| margarita | 18000 | 5 |
| hawaiana | 22000 | 5 |
| pepperoni | 24000 | 5 |
| vegetariana | 21000 | 5 |
| pollo | 23000 | 5 |

### Endpoints (via Gateway)

| Method | Path | Function |
|---|---|---|
| POST | `/orders` | Create an order |
| GET | `/inventory` | View full inventory |
| GET | `/inventory/:pizza` | View one pizza |
| POST | `/inventory` | Reserve/deduct a pizza |
| POST | `/payments` | Process a payment |
| POST | `/notifications` | Send notification |

---

## Recommended way to run

```bash
docker compose up --build
```

Then interact only through the gateway on port 3000.

### Example requests

```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{"pizza":"hawaiana"}'

curl http://localhost:3000/inventory
```

## Serverless

### Local simulation

```bash
cd serverless/order-function
node server-local.js
```

Then:

```bash
curl -X POST http://localhost:3005/ \
  -H "Content-Type: application/json" \
  -d '{"pizza":"hawaiana"}'
```

---

See [answers/answers.md](https://github.com/ldlavado/pizza-microservices-serverless/blob/main/answers/answers.md) for the analysis answers.
