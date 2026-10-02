# Blog-Api

A REST Api used for viewing and altering a blog, such as creating posts and comments, or editing their data.

## Features

- JWT authentication with access and refresh tokens
- User authentication and authorization
- Admin authorization
- CRUD operations for posts and comments

## Tech Stack

- Node.js
- Express
- Prisma
- PostgreSQL
- Passport.js
- JSON Web Tokens
- express-validator

## Setup

### Requirements

- Node.js
- PostgreSQL

### Installation

```bash
git clone https://github.com/Salypse/blog-api.git
cd blog-api
npm install
```

### Create a .env file

```bash
touch .env
```

**`.env`**

```env:
PORT=<desired_port> (default=3000)
DATABASE_URL=<database_connection_string>
JWT_ACCESS_SECRET=<desired_secret>
JWT_REFRESH_SECRET=>desired_secret>
```

### Setup the database

```bash
npx prisma generate
```

## Api

This api uses JSON for requests and returns

Protected routes require a Bearer token for authorization
(Authorization: Bearer \<access-token\>)

Refresh token stored in HTTP cookie

### Successful responses

#### GET posts example

```json
{
  "data": {
    "posts": []
  }
}
```

### Error responses

#### Not found example

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found."
  }
}
```

### Endpoints

#### Posts

| Method | Endpoint       | Description                                             | Auth           |
| :----- | :------------- | :------------------------------------------------------ | :------------- |
| GET    | /posts         | Returns all posts where isPublished = true              | None           |
| GET    | /posts/:postId | Returns a post where id = postId and isPublished = true | None           |
| POST   | /posts         | Creates a new post in database                          | User & isAdmin |
| PUT    | /posts/:postId | Updates post details where id = postId                  | User & isAdmin |
| DELETE | /posts/:postId | Deletes post where id = postId and authorId = user.id   | User & isAdmin |

#### Comments

| Method | Endpoint                           | Description                                                                     | Auth |
| :----- | :--------------------------------- | :------------------------------------------------------------------------------ | :--- |
| GET    | /posts/:postId/comments            | Returns all comments for a valid post                                           | None |
| POST   | /posts/:postId/comments            | Creates a new comment for a valid post                                          | User |
| PUT    | /posts/:postId/comments/:commentId | Updates comment details where post is valid and user is comment author or admin | User |
| DELETE | /posts/:postId/comments/:commentId | Deletes comment where post is valid and user is comment author or admin         | User |
