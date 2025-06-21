**Developer Tinder**

> A matchmaking platform for developers to connect, collaborate, and enhance productivity.

---

## 📄 Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Low‑Level Design (LLD)](#low-level-design-lld)
   - Database Schema
   - API Endpoints
5. [Middleware & Authentication Theory](#middleware--authentication-theory)
6. [Notes & To‑Dos](#notes--to-dos)

---

## Project Overview

`Developer Tinder` aims to bring developers together based on interests, skills, and collaboration goals. Users can create profiles, explore other developers, and send connection requests (interested/ignored). Upon mutual interest, connections are formed.

---

## Features

- **Account Management**
  - Create an account
  - Login / Logout
  - View & edit profile
  - Change password
- **Discovery**
  - Feed / Explore page
  - Filtering by skills, technologies, location, etc.
- **Networking**
  - Send connection requests (Interested / Ignored)
  - Review incoming requests (Accept / Reject)
  - View sent requests
  - View matches (mutual interests)

---

## Tech Stack

- **Front‑end**: React
- **Back‑end**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)

---

## Low‑Level Design (LLD)

### Database Schema

```jsonc
// User document\`
{
  "_id": ObjectId,
  "name": String,
  "email": String,
  "passwordHash": String,
  "bio": String,
  "skills": [String],
  "connections": [ObjectId], // matched users
  "requestsSent": [{ userId: ObjectId, status: String }],
  "requestsReceived": [{ userId: ObjectId, status: String }]
}
```

```jsonc
// user_connection collection (optional)
{
  "_id": ObjectId,
  "from": ObjectId,
  "to": ObjectId,
  "status": "interested" | "ignored" | "accepted" | "rejected",
  "timestamp": Date
}
```

### API Endpoints

#### `authRouter`

| Method | Path      | Description                   |
| ------ | --------- | ----------------------------- |
| POST   | `/signup` | Register new user             |
| POST   | `/login`  | Authenticate user & issue JWT |
| POST   | `/logout` | Invalidate session/token      |

#### `profileRouter`

| Method | Path                | Description                          |
| ------ | ------------------- | ------------------------------------ |
| GET    | `/profile/view`     | Get own profile                      |
| PATCH  | `/profile/edit`     | Update profile details (bio, skills) |
| PATCH  | `/profile/password` | Change password                      |

#### `connectionRequestRouter`

| Method | Path                               | Description                    |
| ------ | ---------------------------------- | ------------------------------ |
| POST   | `/request/send/interested/:userId` | Mark another user "interested" |
| POST   | `/request/send/ignored/:userId`    | Mark another user "ignored"    |
| POST   | `/request/review/accepted/:userId` | Accept incoming request        |
| POST   | `/request/review/rejected/:userId` | Reject incoming request        |

#### `userRouter`

| Method | Path                 | Description                      |
| ------ | -------------------- | -------------------------------- |
| GET    | `/connections`       | List matched connections         |
| GET    | `/requests/received` | List incoming requests           |
| GET    | `/feed`              | Get explore feed (status filter) |

---

## Middleware & Authentication Theory

### Middleware Notes

# app.use can handle all HTTP methods: GET, POST, PATCH, DELETE.

# app.use("/route",

# (req, res, next) => { /\* middleware A \*/ next(); },

# (req, res, next) => { /\* middleware B \*/ next(); },

# (req, res) => { /\* final handler \*/ }

# );

# Each `next()` moves to the next middleware in sequence; if you call `res.send()` and then `next()`, you’ll get an error because the response cycle has already ended.

# This same middleware chaining works with `app.get()`, `app.post()`, etc.

# Middlewares act as intermediaries between the request and the response—for example, verifying authentication before reaching the route handler.

# Use built‑in middleware like `express.json()` to parse incoming JSON bodies into `req.body` for easier manipulation.

### Authentication Notes

- we can't directly let someone access any link on the app before authenticating that the user is the one who logged in or someone is hijacking the API.
- here comes the jwt token: it takes our payload and a secret key to produce a signed string representing the session.
- once the user logs in successfully, the server sends back this JSON Web Token, which is usually stored in an HTTP-only cookie in the browser.
- on each protected request (e.g., viewing profile), verify the JWT’s signature and expiry before granting access.
- tokens and cookies can be time‑bound; many sites expire sessions after 7 days, though you can configure longer lifetimes or no expiry.

## Implementation Summary

A concise recap of current implementation steps and learnings:

- **MongoDB & Mongoose Setup**\
  Connected to MongoDB using Mongoose and Compass; defined a `User` model with properties: name, email, passwordHash, etc.

- **CRUD APIs**\
  Built REST endpoints (`POST`, `GET`, `PATCH`, `DELETE`) to create, fetch, update, and delete user data; verified request bodies and responses via Postman.

- **Validation Layers**

  - **Database-Level**: Mongoose schema validations to enforce field requirements (e.g., email format, password length).
  - **System-Level**: Custom helper functions for data sanitization and business rules.
  - **API-Level**: Express middleware to validate `req.body` before reaching controllers.

- **Authentication Logic**\
  Implemented password hashing with bcrypt in signup/login flows. Confirmed using `POST /login` (not GET) to safely send credentials in the request body rather than URL parameters.

  > **Insight**: GET requests cannot carry a request body in most HTTP clients, exposing credentials if passed via query strings—hence, login routes must use POST.

## Notes & To‑Dos

-

---

---

*End of document.*\*\*\*

