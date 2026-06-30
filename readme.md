<div align="center">

# ⚰️ RIPvscode

### Real-time Collaborative Code Editor

Code together, create rooms instantly, and collaborate in real time.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-black?style=for-the-badge&logo=socket.io)](https://socket.io/)

</div>

---

## 📖 About

**RIPvscode** is a production-grade real-time collaborative coding platform that allows users to:

- Create coding rooms instantly
- Invite teammates using room codes
- Collaborate in real time
- Manage participants and sessions securely
- Experience seamless authentication and room management

The project follows a scalable architecture with clear separation of concerns and modern development practices.

---

# ✨ Features

## 🔐 Authentication

- User Signup
- User Login
- JWT Authentication
- Refresh Token Rotation
- Session Management
- Protected Routes
- Logout

---

## 🏠 Room Management

- Create Rooms
- Join Rooms via Room Code
- Unique Room Codes
- Host & Guest Roles
- Participant Management
- Kick Participants
- Close Rooms

---

## ⚡ Real-Time Collaboration

- Socket.IO Integration
- Live Collaboration Infrastructure
- Online Participant Tracking

---

## 🎨 Frontend Features

- Modern Landing Page
- GSAP Animations
- Page Transitions
- Responsive Design
- Monaco Editor Integration
- Beautiful Authentication Pages

---

# 🏗️ Tech Stack

## Frontend

- Next.js 16
- React 19
- Tailwind CSS
- Redux Toolkit
- Axios
- GSAP
- Monaco Editor
- Socket.IO Client

---

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Socket.IO
- Zod
- Express Validator
- Pino Logger

---

# 🏛️ Project Architecture

```text
client/
├── src/
│   ├── app/
│   ├── components/
│   ├── features/
│   └── lib/

server/
├── src/
│   ├── modules/
│   │   ├── public/
│   │   └── private/
│   ├── shared/
│   │   ├── dao/
│   │   ├── middlewares/
│   │   ├── errors/
│   │   ├── constants/
│   │   └── utils/
```

---

# 🔄 Backend Architecture

```text
Route
 ↓
Controller
 ↓
Service
 ↓
Repository (DAO)
 ↓
MongoDB
```

This architecture ensures:

- Scalability
- Maintainability
- Testability
- Separation of concerns

---

# 🗄️ Database Models

## User

```js
{
  username,
  email,
  password
}
```

---

## Session

```js
{
  _id,
  userId,
  refreshToken,
  expiresAt
}
```

---

## Room

```js
{
  roomName,
  roomCode,
  hostId
}
```

---

## Participant

```js
{
  roomId,
  userId,
  displayName,
  role,
  isOnline,
  socketId
}
```

---

# 🔐 Authentication Flow

```text
Signup/Login
      ↓
Generate Access Token
      ↓
Generate Refresh Token
      ↓
Create Session
      ↓
Return User
```

---

# 🔄 Refresh Flow

```text
Access Token Expired
        ↓
Refresh Endpoint
        ↓
Validate Session
        ↓
Rotate Refresh Token
        ↓
Generate New Access Token
```

---

# 🏠 Room Flow

```text
Create Room
      ↓
Generate Unique Code
      ↓
Create Host Participant
      ↓
Invite Others
      ↓
Real-Time Collaboration
```

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/your-username/RIPvscode.git
cd RIPvscode
```

---

# ⚙️ Client Setup

```bash
cd client
npm install
npm run dev
```

Runs on:

```text
http://localhost:3000
```

---

# ⚙️ Server Setup

```bash
cd server
npm install
npm run dev
```

Runs on:

```text
http://localhost:5000
```

---

# 🔑 Environment Variables

## Server `.env`

```env
PORT=5000

MONGO_URI=

JWT_SECRET=
JWT_EXPIRES_IN=

REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRES_IN=

CLIENT_URL=http://localhost:3000
```

---

## Client `.env.local`

```env
NEXT_PUBLIC_BASE_URL=http://localhost:5000/api
```

---

# 📡 API Endpoints

## Authentication

| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/auth/signup` | Register User |
| POST | `/api/auth/login` | Login User |
| POST | `/api/auth/refresh` | Refresh Tokens |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get Current User |

---

## Rooms

| Method | Endpoint |
|--------|-----------|
| POST | `/api/rooms` |
| POST | `/api/rooms/join` |
| GET | `/api/rooms/:roomCode` |
| POST | `/api/rooms/leave` |
| DELETE | `/api/rooms/:roomCode` |
| GET | `/api/rooms/:roomCode/participants` |
| DELETE | `/api/rooms/:roomCode/participants/:participantId` |

---

# 📸 Screenshots

### Landing Page

_Add screenshot here_

### Login Page

_Add screenshot here_

### Room Page

_Add screenshot here_

---

# 👥 Team

### Harshit Raghuwanshi
Backend Developer • Authentication & Room Management

GitHub:
https://github.com/harshit403-pixel

---

### Bhavya Dhanwani
Frontend Developer

GitHub:
https://github.com/bhavya-dhanwani

---

### Sharat Katwa
Full Stack Developer

GitHub:
https://github.com/sharatkatwa

---

# 🚧 Future Improvements

- Shared Code Editor
- Cursor Synchronization
- Code Execution
- File System Support
- Chat System
- Voice Collaboration
- Presence Indicators
- AI Assistant Integration

---

# 🤝 Contributing

```bash
fork → branch → commit → pull request
```

---

# 📄 License

MIT License

---

<div align="center">

### Built with ❤️ by Team RIPvscode

**Code Together. Build Together.**

</div>