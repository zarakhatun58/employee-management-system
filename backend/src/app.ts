import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { config } from '../src/config/env';
import authRoutes from '../src/routes/auth.routes';
import employeeRoutes from '../src/routes/employee.routes';
import organizationRoutes from '../src/routes/organization.routes';
import dashboardRoutes from '../src/routes/dashboard.routes';
import { errorHandler, notFound } from './middleware/error.middleware';

export function createApp() {
  const app = express();

  app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
  })
);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('dev'));

  app.use('/uploads', express.static(path.resolve(config.uploadDir)));

  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
  app.use('/api/auth', authRoutes);
  app.use('/api/employees', employeeRoutes);
  app.use('/api/organization', organizationRoutes);
  app.use('/api/dashboard', dashboardRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
