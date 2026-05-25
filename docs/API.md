# QuickKart API

Base URL: `http://localhost:5000/api`

## Auth

`POST /auth/register`

```json
{ "name": "Demo Customer", "email": "customer@quickkart.dev", "phone": "9000000004", "password": "password123", "role": "customer" }
```

`POST /auth/login`

```json
{ "email": "customer@quickkart.dev", "password": "password123" }
```

`GET /auth/me` requires `Authorization: Bearer <token>`.

## Products

`GET /products?search=milk&category=<id>&page=1&limit=12`

`GET /products/categories`

`GET /products/:id`

Admin/store owner:

`POST /products`

`PATCH /products/:id`

`DELETE /products/:id`

## Cart

All cart APIs require customer auth.

`GET /cart`

`POST /cart/items`

```json
{ "productId": "<productId>", "quantity": 2 }
```

`POST /cart/coupon`

```json
{ "code": "QUICK50" }
```

`DELETE /cart`

## Orders

`GET /orders`

`POST /orders`

```json
{ "addressId": "<addressId>", "paymentMethod": "cod" }
```

`PATCH /orders/:id/status` for admin, store owner, delivery partner.

`POST /orders/:id/assign` for admin and store owners.

`POST /orders/:id/payment` creates a Razorpay order when credentials are configured.

`POST /orders/payment/verify` verifies Razorpay signature.

## Admin

Admin auth required.

`GET /admin/analytics`

`GET /admin/users`

`PATCH /admin/users/:id/toggle-ban`

## Delivery

Delivery partner auth required.

`GET /delivery/orders`

`POST /delivery/location`

```json
{ "lat": 12.9716, "lng": 77.5946 }
```

## Uploads

Admin/store owner auth required. Cloudinary credentials must be configured.

`POST /uploads/image`

Form data:

```text
image=<file>
```

Response:

```json
{ "success": true, "image": { "url": "https://...", "publicId": "quickkart/products/..." } }
```

## Socket Events

Client emits:

`user:join`, `order:join`, `delivery:location`, `support:message`

Server emits:

`order:update`, `delivery:location`, `inventory:update`, `admin:order`, `support:message`
