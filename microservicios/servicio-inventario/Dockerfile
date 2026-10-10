FROM node:20-alpine
WORKDIR /app
COPY package.json .
RUN npm install --omit=dev
COPY index.js pizzas.json .
EXPOSE 3002
CMD ["node", "index.js"]
