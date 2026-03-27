# Cocktails App

A full-stack cocktail management app built with **Vue 3**, **NestJS**, **PostgreSQL**, and **Elasticsearch**.


## Setup

### 1. Copy the frontend environment file

```bash
cp frontend/.env.example frontend/.env
```


## Install & Run

### 2. Install dependencies

```bash
npm run install:all
```

### 3. Start the app

```bash
docker compose up --build
```

The app will be available at:
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3000
- **Swagger Docs**: http://localhost:3000/api/docs
- **Kibana**: http://localhost:5601

---

## Testing Elasticsearch Search

The search uses fuzzy matching powered by Elasticsearch, so it handles typos and partial words automatically.

Open the frontend at http://localhost:8080 and try these in the search bar:

| You type | You get |
|----------|---------|
| `mojto` | Mojito |
| `marg` | Margarita |
| `nojito` | Nojito |
| `strwberry` | Strawberry Lemonade |

---

## Testing

### Unit Tests

Tests for service logic, controller behavior, and DTO validation — all dependencies are mocked.

```bash
npm run test:unit
```

### Integration Tests

Integration tests spin up **real PostgreSQL and Elasticsearch instances** using [Testcontainers](https://testcontainers.com/) — no manual setup or mocking required. Each test run gets a fresh, isolated environment that is torn down automatically after the suite completes.

```bash
npm run test:integration
```

> !!! Integration tests require Docker to be running.

### Run All Tests

```bash
npm run test:all
```