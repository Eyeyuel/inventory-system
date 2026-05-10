# inventory MS

////////////cashing for faster responses built in cash manager and then redis//////////////

////////////Frontend//////////////

/////////////////////////// run the project in docker ///////////////////////

product (name) should be uniqe ???
SKU when product is added??

///////////////////////////////////////
Tasks:

# USER MUST CREATE A LOCATION FIRST TO ADD A STOCK

# add product (opening stock): {

    first create product with or without category.

    POST /products: Create the product identity.

    POST /stocks: Create the inventory record by passing the productId and locationId, quantity

}

delete a product: delete a product and remove every stock of the product in all locations, deleting a product just in a certain sotck or location

know how the deleting a product is going to happen is it through stock movement (know what is the purpose of stock movement)
when you add a prduct is that called a stock movement or just changing location is called a stock movement?
///////////////////////////////////////

# products contains the main list of everything we sale

# transactions keeps tracks of what comes in and goes out

# inventory gives us overview of stock on hand

# order authomatically generates orders from our suppliers

# report gives us a snapshot of our inventory

{
A user should be able to add a new product (with SKU, name, unit of measure, etc.) (✅ exept SKU)

A user should be able to edit a product's details (name, UOM, description, but SKU should be immutable) (✅ exept SKU)

A user should be able to define and manage locations (warehouse → zone → bin) (✅ exept)

A user should be able to receive stock into a specific location (against a purchase order or without one) (✅ exept without purcahse order)

A user should be able to ship stock from a location (against a sales order) (✅)

A user should be able to move stock between locations (e.g., bin to bin, warehouse to warehouse) (✅)

A user should be able to adjust stock (add or remove quantity with a reason: damage, loss, found) (✅)

A user should be able to view real-time on-hand quantity by product and location (✅)

A user should be able to see available-to-promise (ATP) = on-hand minus allocated

A user should be able to allocate stock to an order (soft reservation) (✅)

A user should be able to deallocate or release stock from an order

A user should be able to scan barcodes for receiving, picking, moving, and counting

A user should be able to perform a cycle count (compare expected vs actual, record difference)

A user should be able to view full transaction history (who did what, when, why) (✅)

A user should be able to set reorder points and receive low-stock alerts

A user should be able to generate reports (slow-moving stock, turnover, shrinkage, reorder list)

A user with admin role should be able to manage user roles and permissions (receiver ≠ picker ≠ adjuster)
}

// Allow configuration of reason codes (admin can add/disable codes).

<!-- Dockerfile -->

FROM node:22-alpine

WORKDIR /app

COPY package\*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:dev"]

<!-- Dockerfile -->

<!-- Docker-compose.yaml -->

services:
db:
image: postgres:18-alpine
restart: always
environment: - POSTGRES_USER=${DB_USERNAME}
      - POSTGRES_PASSWORD=${DB_PASSWORD} - POSTGRES_DB=${DB_DATABASE}
    container_name: boilerplate-postgres
    volumes:
      - ./pgdata:/var/lib/postgresql
    ports:
      # - '${DB_PORT}:5432' - 5433:5432
networks: - boilerplate-net
healthcheck:
test: ['CMD-SHELL', 'pg_isready -U postgres']
interval: 10s
timeout: 5s
retries: 5

app:
build:
context: .
dockerfile: Dockerfile
container_name: boilerplate-app
environment: - PORT=${PORT}
    ports:
      - '${PORT}:${PORT}'
depends_on: - db
volumes: - ./src:/app/src - ./.env:/app/.env # ← mount the .env file
networks: - boilerplate-net
healthcheck:
test: ['CMD', 'curl', '-f', 'http://localhost:3000/healthCheck']
interval: 10s
timeout: 5s
retries: 3

pgadmin:
image: dpage/pgadmin4
restart: always
container_name: boilerplate-pgadmin
environment: - PGADMIN_DEFAULT_EMAIL=${PGADMIN_EMAIL}
      - PGADMIN_DEFAULT_PASSWORD=${PGADMIN_PASSWORD}
ports: - '${PGADMIN_HOST_PORT}:${PGADMIN_CONTAINER_PORT}'
depends_on: - db
networks: - boilerplate-net

# redis:

# image: redis:alpine

# container_name: boilerplate-redis

# ports:

# - '${REDIS_PORT}:${REDIS_PORT}'

# restart: always

# networks:

# - boilerplate-net

# healthcheck:

# test: ['CMD', 'redis-cli', 'ping']

# interval: 10s

# timeout: 5s

# retries: 3

networks:
boilerplate-net:
driver: bridge

<!-- Docker-compose.yaml -->

<!-- .env -->

PORT=3000

DB_HOST=db
DB_USERNAME=postgres
DB_PASSWORD=123
DB_PORT=5432
DB_DATABASE=testdb

PGADMIN_EMAIL=admin@admin.com
PGADMIN_PASSWORD=123
PGADMIN_HOST_PORT=5050
PGADMIN_CONTAINER_PORT=80

<!-- .env -->
