# EventSphere Backend

This is the backend API for the EventSphere Management system.

## Prerequisites

- Node.js (v18 or above recommended)
- MongoDB (running locally or accessible remotely)

## Installation

Clone the repository and install dependencies:

```bash
npm install
```

## Environment Setup

Create a `.env` file in the `backend/` directory and add your environment variables (example):

```
MONGODB_URI=mongodb://localhost:27017/eventsphere
JWT_SECRET=your_jwt_secret
PORT=8080
```

## Running the Server

Start the development server with:

```bash
npm start
```

The server will run with `nodemon` for auto-reloading.

## Project Structure

- `Controllers/` – Route handlers and business logic
- `Middlewares/` – Express middlewares
- `Models/` – Mongoose models
- `Routes/` – API route definitions
- `uploads/` – Uploaded files

## API Endpoints

Refer to the route files in [`Routes/`](Routes/) for available endpoints.

## License

This project is licensed under the ISC License.