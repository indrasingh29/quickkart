# MongoDB and Docker Guide

## Local MongoDB

The local database runs inside Docker using the `mongo` service in `docker-compose.yml`.

Start it:

```bash
docker compose up -d mongo mongo-express
```

Connection string:

```text
mongodb://localhost:27017/quickkart
```

The backend uses this local Docker URL internally:

```text
mongodb://mongo:27017/quickkart
```

Why two URLs?

- From your laptop: use `localhost`.
- From another Docker container: use the service name `mongo`.

## Where Is Database Data Saved?

Mongo data is saved in a Docker named volume:

```text
mongo-data:/data/db
```

This means data remains even if the Mongo container stops or restarts.

Check volumes:

```bash
docker volume ls
docker volume inspect quickkart_mongo-data
```

Delete local database completely:

```bash
docker compose down -v
```

Only run that command when you intentionally want to remove local MongoDB data.

## Access Database in Browser

Mongo Express is included for local database inspection.

URL:

```text
http://localhost:8081
```

Login:

```text
username: admin
password: quickkart
```

Inside Mongo Express:

1. Open the `quickkart` database.
2. View collections like `users`, `products`, `orders`, `stores`, `coupons`.
3. Inspect seeded data and new orders.

## Access Database in MongoDB Compass

Open MongoDB Compass and connect to:

```text
mongodb://localhost:27017/quickkart
```

Compass is better for a clean GUI, indexes, queries, and collection browsing.

## Production MongoDB Atlas

In production, the database is saved in MongoDB Atlas, not Docker.

Render backend should use:

```text
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/quickkart?retryWrites=true&w=majority
```

Atlas data is stored in the cloud cluster. You can view it in:

- MongoDB Atlas dashboard
- MongoDB Compass using the Atlas connection string

## Seed Data

Seed local Docker database:

```bash
npm.cmd run seed --prefix server
```

Seed Atlas production database:

```bash
$env:MONGO_URI="<Atlas URI>"
npm.cmd run seed --prefix server
```

Seed creates demo users, categories, store, products, rider profile, and coupon.
