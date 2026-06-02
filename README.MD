# Social API

A RESTful API for a social networking platform built with Node.js, Express, TypeScript, and PostgreSQL.

## Features

- JWT Authentication (register, login)
- Post CRUD with ownership validation
- Comment system with nested relations
- Role-based access control
- Unit testing with Jest
- Dockerized & deployed on Render

## Tech Stack

Node.js · Express · TypeScript · PostgreSQL · Prisma ORM · JWT · Docker · GitHub Actions

## Live Demo

https://be-new-dgd5.onrender.com

## API Endpoints

### Auth

- POST /auth/register
- POST /auth/login

### Posts

- GET /posts
- GET /posts/:postId
- POST /posts (auth required)
- PUT /posts/:postId (auth required, owner only)
- DELETE /posts/:postId (auth required, owner only)

### Comments

- GET /posts/:postId/comments
- POST /posts/:postId/comments (auth required)
- DELETE /posts/:postId/comments/:commentId (auth required, owner only)
