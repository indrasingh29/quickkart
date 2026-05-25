# QuickKart

QuickKart is a production-ready MERN quick-commerce platform inspired by hyperlocal delivery products like Blinkit, Zepto, and Instamart. It has a customer shopping app, admin operations dashboard, delivery partner app, and a modular Express API with real-time order updates.

## Live App Modules

- `client`: Customer app, Vite React, port `5173`
- `admin-panel`: Admin dashboard, Vite React, port `5174`
- `delivery-app`: Rider app, Vite React, port `5175`
- `server`: Node.js, Express, MongoDB, Socket.io API, port `5000`

## What This Project Demonstrates

- Full-stack MERN architecture with clear separation of concerns
- JWT authentication with customer, admin, store owner, and delivery partner roles
- Product catalog, categories, cart, coupons, checkout, order management, and inventory updates
- Socket.io live order tracking, delivery location events, support messages, and admin order notifications
- Razorpay-ready payment flow with COD fallback
- Secure Express setup with Helmet, CORS, rate limiting, Mongo sanitization, XSS sanitization, validation, and centralized error handling
- MongoDB schemas with indexing for products, stores, geolocation, users, orders, coupons, reviews, notifications, and riders
- Render deployment blueprint, Docker setup, Mongo Express, GitHub Actions CI, seed data, and API docs

## Architecture

```text
quickkart/
  client/          Customer storefront
  admin-panel/     Admin dashboard
  delivery-app/    Delivery partner app
  server/          Express API
  docs/            API, deployment, Mongo/Docker, resume notes
  docker/          Shared nginx config
  render.yaml      Render blueprint
  docker-compose.yml
```

Backend flow:

```text
Route -> Controller -> Service -> Model
```

## Local Setup

Use `npm.cmd` on Windows PowerShell if script execution policy blocks `npm`.

```bash
cd quickkart
npm.cmd install
npm.cmd run install:all
copy server\.env.example server\.env
```

Start MongoDB using Docker Desktop:

```bash
docker compose up -d mongo mongo-express
```

Seed demo data:

```bash
npm.cmd run seed --prefix server
```

Run all apps:

```bash
npm.cmd run dev
```

Open:

- Customer: `http://localhost:5173`
- Admin: `http://localhost:5174`
- Delivery: `http://localhost:5175`
- API health: `http://localhost:5000/health`
- Mongo Express: `http://localhost:8081`

Mongo Express login:

- Username: `admin`
- Password: `quickkart`

## Demo Accounts

All demo users use password `password123`.

- Admin: `admin@quickkart.dev`
- Customer: `customer@quickkart.dev`
- Store owner: `owner@quickkart.dev`
- Delivery partner: `rider@quickkart.dev`

## Environment Variables

Backend: copy `server/.env.example` to `server/.env`.

Important backend variables:

- `MONGO_URI`
- `JWT_SECRET`
- `CLIENT_URL`
- `ADMIN_URL`
- `DELIVERY_URL`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `GOOGLE_MAPS_API_KEY`

Frontend examples:

- `client/.env.example`
- `admin-panel/.env.example`
- `delivery-app/.env.example`
- `*.env.production.example` files for deployed URLs

## Database

Local Docker MongoDB data is stored in a Docker named volume:

```text
mongo-data:/data/db
```

That means your database survives container restarts. To inspect data locally, open Mongo Express at `http://localhost:8081`, or connect with MongoDB Compass to:

```text
mongodb://localhost:27017/quickkart
```

For production, use MongoDB Atlas and set `MONGO_URI` in Render.

More details: [docs/MONGO_DOCKER_GUIDE.md](docs/MONGO_DOCKER_GUIDE.md)

## Deployment

QuickKart includes:

- `render.yaml` for Render Blueprint deployment
- `.github/workflows/ci.yml` for GitHub Actions build checks
- Dockerfiles for server and each frontend
- `docker-compose.yml` for local MongoDB, Mongo Express, and API

Deployment guide: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

## API Documentation

See [docs/API.md](docs/API.md).

## Functionality Guide

See [docs/FUNCTIONALITY.md](docs/FUNCTIONALITY.md).

## Resume Notes

See [docs/RESUME.md](docs/RESUME.md).
