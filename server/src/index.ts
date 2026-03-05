import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './db/database.js';
import routes from './routes/index.js';

dotenv.config();

const requiredEnvVars = ['PORT', 'DATABASE_PATH'];
const missingEnvVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
  console.error('Please create a .env file in the server directory with these variables.');
  process.exit(1);
}

if (process.env.NODE_ENV === 'production' && (!process.env.TENCENT_SECRET_ID || !process.env.TENCENT_SECRET_KEY)) {
  console.warn('⚠️  Warning: TENCENT_SECRET_ID and TENCENT_SECRET_KEY are required for OCR functionality in production');
}

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api', routes);

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Initialize database and start server
async function startServer() {
  try {
    await db.initialize();
    console.log('Database initialized successfully');
    
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
