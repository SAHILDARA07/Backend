# 🔐 JWT Authentication API

A secure REST API built using **Node.js, Express.js, MongoDB, and JSON Web Tokens (JWT)**. This project provides user authentication, registration, login, and protected routes.

## 🚀 Features

- User Registration (Signup)
- User Login
- Password Hashing
- JWT Token Generation
- Authentication Middleware
- Protected API Routes
- MongoDB Database Integration
- RESTful API Architecture

## 🛠️ Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcryptjs
- dotenv
- Nodemon

## 📁 Project Structure

```text
JWT Auth API/
├── middleware/
├── models/
├── routes/
├── .env
├── .gitignore
├── package.json
└── server.js
```

*Note: Update the folder structure according to your actual project.*

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone <your-repository-url>
```

### 2. Open the project folder

```bash
cd "JWT Auth API"
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/jwt-auth
JWT_SECRET=your_strong_secret_key
```

Replace the example secret with a strong, private secret.

### 5. Start the server

```bash
npm run dev
```

The server should start at:

`http://localhost:5000`

## 🔗 API Endpoints

Update these endpoints according to your actual routes.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login an existing user |
| GET | `/api/auth/profile` | Access a protected profile |

## 🧪 Testing

You can test the API using Postman or Thunder Client.

1. Register a new user.
2. Login using the registered credentials.
3. Copy the JWT token from the response.
4. Send the token in the `Authorization` header as:

```text
Bearer YOUR_JWT_TOKEN
```

5. Access the protected route.

## 🔒 Security

- Passwords should be stored as hashes, not plain text.
- Keep your JWT secret inside `.env`.
- Never commit `.env` or expose your JWT secret.
- Validate user input and handle authentication errors.

## 👨‍💻 Author

**Your Name**

## 📄 License

This project is created for educational and learning purposes.




https://github.com/user-attachments/assets/cf2047f0-a192-4a70-b8ee-3e2ac32d7674


