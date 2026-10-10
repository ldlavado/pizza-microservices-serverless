# Microservices and Serverless Workshop — The Pizzeria

Work through the activities in order and answer the questions in `respuestas/respuestas.md`.

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
- **Notifications (3004):** sends a confirmation notice (completed by the student).
- **Gateway (3000):** single entry point that forwards requests.

### Menu (pizzas.json)

| Pizza | Price | Initial stock |
|---|---|---|
| margarita | 18000 | 5 |
| hawaiana | 22000 | 5 |
| pepperoni | 24000 | 5 |
| vegetariana | 21000 | 5 |
| pollo | 23000 | 5 |

### Endpoints

| Service | Method | Path | Function |
|---|---|---|---|
| Orders | POST | `/pedidos` | Create an order |
| Inventory | GET | `/inventario` | View full inventory |
| Inventory | GET | `/inventario/:pizza` | View one pizza |
| Inventory | POST | `/inventario` | Reserve/deduct a pizza |
| Payments | POST | `/pagos` | Process a payment |
| Notifications | POST | `/notificaciones` | Send notification |
| Gateway | various | `/pedidos`, `/inventario`, `/pagos`, `/notificaciones` | Single entry point |

---

## Recommended way to run

```bash
docker compose up --build
```

Then interact only through the gateway on port 3000.

---

## Activities

(The original activities remain valid. Use the gateway on port 3000 for all tests once the system is up.)

1. Start the services (via Docker Compose).
2. Place several orders.
3. Modify inventory (edit `pizzas.json` and restart the inventory container) to test out-of-stock.
4. Stop a service (e.g. `docker compose stop inventory`) and observe the controlled error.
5. Test timeout behavior.
6. Verify notifications and the gateway logging.

## Serverless

### Local simulation

```bash
cd serverless/funcion-pedido
node server-local.js
```

Then:

```bash
curl -X POST http://localhost:3005/ \
  -H "Content-Type: application/json" \
  -d '{"pizza":"hawaiana"}'
```

---

See `respuestas/respuestas.md` for the analysis answers.
