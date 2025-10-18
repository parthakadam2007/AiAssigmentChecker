require('dotenv').config();
const express = require('express');
const { Queue } = require('bullmq');
const Redis = require('ioredis');

const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');

const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use((req, res, next) => { req.io = io; next(); });

// Redis connection
const connection = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  maxRetriesPerRequest: null,
});
//

const allowedOrigins = [
  'http://localhost',
  "https://ai-assigment-checker-wy6o.vercel.app",
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:80',
  'http://localhost:8000',
  'http://localhost',
  'http://localhost:443',
  'https://localhost',
  'https://ai-assigment-checker-rho.vercel.app',
  'https://ai-assigment-checker-zrth.vercel.app',
  'https://devaiassigmentchecker-c8bfdgd8h6bmdsad.canadacentral-01.azurewebsites.net',
  'https://ai-assigment-checker-wy6o-fpkfkq84d-parthakadam2007s-projects.vercel.app',
  'http://ec2-65-0-205-222.ap-south-1.compute.amazonaws.com',
  'https://aiclassroom.online'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}))
app.use(cookieParser());
app.use(bodyParser.json())

app.use(express.json()); // ✅ parses JSON
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

const { authMiddleware } = require('./middleware/authMiddleware');

const authRoutes = require('./routes/authRoute');
const teacherRoutes = require('./routes/teacherRoutes');
const classRoutes = require('./routes/classRoutes');
const studentRoutes = require('./routes/studentRoute')
app.use('/api/auth', authRoutes);
app.use('/api/teacher', authMiddleware('teacher'), teacherRoutes);
app.use('/api/class', authMiddleware('teacher'), classRoutes);
app.use('/api/student', authMiddleware('student'), studentRoutes)
//TESTING
// app.use('/api/teacher', teacherRoutes);
// app.use('/api/class', classRoutes);

// Create BullMQ queue
const assignmentQueue = new Queue('assignments', { connection });


// to attach socket.io
const io = new Server(server, {
  cors: {
    origin: "*", //frontend url
    methods: ["GET", "POST"]
  }
});

app.use((req, res, next) => { req.io = io; next(); });

// importing socket logic
require("./sockets/BiometricAttend")(io);

// Test endpoint: enqueue a job
// app.post('/api/check-assignment', async (req, res) => {
//   const { studentId, assignmentId } = req.body;
//   const job = await assignmentQueue.add('evaluate', { studentId, assignmentId });
//   res.json({ obId: job.id, status: 'Queued for AI evaluation' });
// });

// Simple health check
app.get('/api/health', (req, res) => {
  res.send('API is healthy!');
});

const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`API running on port ${PORT}`);
// });

server.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});