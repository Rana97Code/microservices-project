# microservices-project

# Microservices Project — NestJS, RabbitMQ, MongoDB, Docker

This project implements a **two-microservice architecture** using **NestJS**, **RabbitMQ**, and **MongoDB**, fully containerized with Docker.  
Each microservice runs independently while communicating through RabbitMQ message queues.

# Inside this Repository there are two services Folder and Docker-Compose file
# And every services there are Dockerfile

## Microservices Included

### 1️⃣ Auth Service
Handles:
- User registration & login
- JWT access + refresh tokens
- Publishes `user.created` events
- Verifies tokens for other services via RabbitMQ

## 2️⃣ Product Service
Handles:
- Product CRUD
- Ownership enforcement (only creator can update/delete)
- Validates JWT via RabbitMQ by asking the Auth Service

---

# IMPORTANT — BEFORE INSTALLATION  
This repository originally used `.it` folders instead of `.git`.

### Before running `npm install`:
You **must rename both folders**:
- `auth-service/.it` → `auth-service/.git`
- `product-service/.it` → `product-service/.git`


### This is Auth-Service .env file:
PORT=3001
MONGO_URI=mongodb://localhost:27017/auth_db
JWT_ACCESS_SECRET=access_secret_123
JWT_REFRESH_SECRET=refresh_secret_123
RABBITMQ_URL=amqp://localhost:5672
REFRESH_TOKEN_EXPIRES=1d

### This is Product-Service .env file:
PORT=3002
MONGO_URI=mongodb://localhost:27017/product_db
RABBITMQ_URL=amqp://localhost:5672
AUTH_QUEUE=auth_queue


# After cloning the repository, run the following commands:
# docker compose up --build
 
In local environment you can check the dataflow through Swagger UI:
- Auth Service: http://localhost:3001/docs
- Product Service: http://localhost:3002/docs
- RabbitMQ: http://localhost:15672 (username: guest, password: guest)

# Thank you for your time and consideration.