# Advanced_Url_Shortner
# Advanced URL Shortener

An advanced URL shortening application with features like Google Sign-In, detailed analytics, rate limiting, and secure HTTPS implementation.

---

## Table of Contents

1. [Features](#features)  
2. [Installation](#installation)  
3. [Environment Variables](#environment-variables)  
4. [Usage](#usage)  
5. [Project Structure](#project-structure)  
6. [Contributing](#contributing)  

---

## Features

- **Google Sign-In** for user authentication.  
- **Shorten URLs** and organize them under specific topics.  
- **Detailed Analytics** for individual and overall URLs.  
- **Rate Limiting** to prevent abuse.  
- **Redis Integration** for caching.  
- **HTTPS** for secure connections.  

---

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) installed.  
- [Docker](https://www.docker.com/) installed.  

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/advanced-url-shortener.git
   cd advanced-url-shortener
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start Redis and the application using Docker Compose:
   ```bash
   docker-compose up
   ```

4. Your app should now be running at `http://localhost:5000`.

---

## Environment Variables

Set up a `.env` file in the root directory with the following variables:

```env
FIREBASE_SERVICE_ACCOUNT_KEY="./secret/advancedurlshortner-firebase-adminsdk-t8077-1f58304b39.json"
NODE_ENV=development
REDIS_HOST=redis-1
REDIS_PORT=6379
```

---

## Usage

### Access API Documentation

- Swagger API documentation is accessible at `http://localhost:5000/api-docs`.

### Postman Collection

To use the Postman collection, import the file `postman_collection.json` into Postman:

1. Open Postman.
2. Click on **Import**.
3. Select `postman_collection.json` from this repository.
4. Use the available endpoints for testing.

---

## Project Structure

```plaintext
.
|-- Dockerfile
|-- README.md
|-- docker-compose.yml
|-- firebase-admin.js
|-- frontend
|   |-- app.js
|   `-- index.html
|-- https
|   |-- cert.pem
|   `-- key.pem
|-- index.js
|-- lib
|   |-- database.js
|   |-- handlers.js
|   |-- helpers.js
|   `-- server.js
|-- middleware
|   |-- authMiddleware.js
|   `-- rateLimiter.js
|-- models
|   |-- Url.js
|   `-- Users.js
|-- package-lock.json
|-- package.json
|-- routes
|   |-- shortnerRoutes.js
|   |-- urlAnalyticsRoutes.js
|   `-- userRoutes.js
|-- secret
|   `-- advancedurlshortner-firebase-adminsdk-t8077-1f58304b39.json
`-- swagger-config.js
```

---

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.  
2. Create a new branch for your feature:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature-name"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
---

**Note:** The `postman_collection.json` file must be placed in the repository root for proper Postman integration. Ensure your `.env` file is correctly configured before running the application.

