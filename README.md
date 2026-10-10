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
├── microservices/
│   ├── orders/              (orders - port 3001)
│   ├── inventory/           (inventory - port 3002)
│   ├── payments/            (payments - port 3003)
│   ├── notifications/       (notifications - port 3004)
│   └── gateway/             (API Gateway - port 3000)
├── serverless/
│   └── order-function/      (example Serverless function)
├── answers/
│   └── answers.md           (workshop answers)
├── docker-compose.yml
├── workshop-guide.md
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
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{"pizza":"hawaiana"}'
```

Check inventory:

```bash
curl http://localhost:3000/inventory
```

## Workshop answers

Full analysis answers are available here:  
**[answers/answers.md](https://github.com/ldlavado/pizza-microservices-serverless/blob/main/answers/answers.md)**

## Workshop guide

See [workshop-guide.md](workshop-guide.md) for the full step-by-step guide and activities.

## Manual run (without Docker)

Install dependencies and run each service in its own terminal (requires Node.js 18+).  
**Note:** when running outside Docker, change the internal URLs in the code from Docker service names (`http://inventory:3002`) to `http://localhost:3002`.
