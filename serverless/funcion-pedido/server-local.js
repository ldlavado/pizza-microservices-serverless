// Local server to simulate the serverless function
const http = require("http");
const handler = require("./index");

const PORT = 3005;

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/") {
    let body = "";
    req.on("data", chunk => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        req.body = JSON.parse(body || "{}");
      } catch (e) {
        req.body = {};
      }
      handler(req, res);
    });
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ success: false, message: "Not found" }));
  }
});

server.listen(PORT, () => {
  console.log(`[SERVERLESS] Local function simulation listening on http://localhost:${PORT}`);
});
