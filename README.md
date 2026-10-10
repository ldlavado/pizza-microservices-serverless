# Pizza Microservices & Serverless Workshop

Student: Luis Daniel Lavado

## Description

Example pizza ordering system used to practice Microservices and Serverless. The system receives pizza orders and processes them by coordinating several independent services that communicate over HTTP. It also includes an example Serverless function.

## Objectives

- Run and test a microservices system.
- Observe communication between services over HTTP.
- See behavior under failures (no stock, service down, timeout).
- Complete and test a new microservice.
- Consume a Serverless function and compare it with the microservices.

## Technologies

- Node.js 20
- Express (microservices and API Gateway)
- Docker & Docker Compose
- Serverless function compatible with Vercel/Netlify

## Structure

```text
pizza-microservices-serverless/
├── microservicios/
│   ├── servicio-pedidos/         (orders - port 3001)
│   ├── servicio-inventario/      (inventory - port 3002)
│   ├── servicio-pagos/           (payments - port 3003)
│   ├── servicio-notificaciones/  (notifications - port 3004)
│   └── gateway/                  (API Gateway - port 3000)
├── serverless/
│   └── funcion-pedido/           (example Serverless function)
├── respuestas/
│   └── respuestas.md             (workshop answers)
├── docker-compose.yml
└── README.md
```

## How to run (recommended: Docker)

```bash
docker compose up --build
```

All services start and the API Gateway is available at `http://localhost:3000`.

### Main tests

Create an order through the gateway:

```bash
curl -X POST http://localhost:3000/pedidos \
  -H "Content-Type: application/json" \
  -d '{"pizza":"hawaiana"}'
```

Check inventory:

```bash
curl http://localhost:3000/inventario
```

## Manual run (without Docker)

Install dependencies and run each service in its own terminal (requires Node.js 18+).  
**Note:** when running outside Docker, change the internal URLs in the code from Docker service names (`http://inventory:3002`) to `http://localhost:3002`.

## Workshop

See `guia-taller.md` for the full step-by-step guide and activities.  
Answers are in `respuestas/respuestas.md`.
