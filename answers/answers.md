# Workshop Answers

Student: Luis Daniel Lavado

---

## Analysis Questions — Microservices

### 1. What responsibility does each microservice have?

- **Orders:** receives the client request and orchestrates the flow (inventory check + payment + optional notification).
- **Inventory:** manages stock of each pizza; deducts when an order is accepted.
- **Payments:** simulates payment processing (always approves in this workshop).
- **Notifications:** sends a confirmation notice when an order succeeds.
- **Gateway:** single entry point that proxies requests to the correct service.

### 2. How do they communicate?

They communicate over HTTP using the Fetch API. The Orders service calls Inventory and Payments. The Gateway proxies requests to the other services.

### 3. What happens when a service stops working?

The calling service catches the error and returns a controlled HTTP 503 response. The system does not crash. When notifications is down, the order still succeeds and the `notification` field indicates the failure.

### 4. What advantages did you observe when separating the system?

- Independent deployment and scaling.
- Clear separation of concerns.
- Failure isolation (one service down does not take the whole system down).
- Easier to understand and modify individual parts.

### 5. What problems can having several services generate?

- Network latency and potential timeouts.
- More complex local development and testing.
- Need for service discovery / configuration of URLs.
- Distributed error handling and observability challenges.

### 6. What did you learn by creating the notifications service?

How to implement a simple new microservice that fits into an existing flow, and how to make the integration non-blocking so the main business process (order confirmation) is not affected by a secondary concern.

---

## Analysis Questions — Serverless

### 7. What is Serverless?

A model where the cloud provider runs the code only when it is invoked, and the developer does not manage servers.

### 8. What difference did you observe compared to the local services?

The microservices stay running continuously. The Serverless function only executes when a request arrives and then finishes.

### 9. What does it mean to execute a function on demand?

The function starts only when it receives a request, processes it, and stops. There is no permanently running process.

### 10. What advantages and limitations did you observe?

**Advantages:** no server management, automatic scaling, pay-per-use.  
**Limitations:** cold starts, execution time limits, less control over the runtime environment.

---

## Final Questions

### 11. What was the main difference you found between Microservices and Serverless?

Microservices are long-running processes that you manage. Serverless functions are short-lived and managed by the platform; they execute only on demand.

### 12. In what situation would you use a Microservices architecture?

When you need continuous processing, complex internal state, long-running workflows, or when different parts of the system have different scaling and technology needs.

### 13. In what situation would you use a Serverless function?

For event-driven, short-lived tasks such as webhooks, scheduled jobs, simple APIs, or background processing that does not require a permanent process.

### 14. What was the most important thing you learned during the workshop?

How to design a system with clear boundaries between services, how failures propagate (and how to contain them), and the practical difference between always-on services and on-demand functions.

---

## Comparison Microservices vs Serverless

| Characteristic | Microservices | Serverless |
|---|---|---|
| Main unit | Service (long-running process) | Function (short-lived) |
| Example in the workshop | Orders, Inventory, Payments, Notifications, Gateway | order-function |
| Who runs the service? | You (or Docker/orchestrator) | Cloud provider (Vercel, AWS Lambda, etc.) |
| When does it run? | Continuously while the process is up | Only when invoked |
| Communication | HTTP between services | HTTP request triggers the function |
| Infrastructure | Containers / VMs you manage | Fully managed by the platform |
| What the student could observe | Failure isolation, timeouts, orchestration | On-demand execution, no permanent process |

---

## API Gateway Question

### 15. What advantage is there in the client not knowing that there are several different services behind the gateway?

The client only needs to know one URL and one set of endpoints. The internal structure can change (services can be split, merged, or moved) without affecting the client. It also centralizes cross-cutting concerns such as logging, authentication, or rate limiting.

---

## Observations from the tests

- Successful orders return `orderId`, price, remaining stock and transaction id.
- Out-of-stock returns HTTP 409.
- Stopped service returns HTTP 503 from the caller without crashing.
- Very low timeout produces controlled failure.
- Notifications service logs the confirmation and returns success.
- Gateway logs every request and proxies correctly to the backend services.
