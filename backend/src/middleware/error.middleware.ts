import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import multer from 'multer';

export function validateRequest(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted: Record<string, string> = {};
    errors.array().forEach((e) => {
      formatted[(e as any).path || (e as any).param || '_error'] = e.msg;
    });
    return res.status(422).json({ message: 'Validation failed', errors: formatted });
  }
  next();
}

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ message: 'Route not found' });
}

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  console.error('Error:', err.message);
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  }
  if (err?.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({ message: `Duplicate value for ${field}` });
  }
  if (err?.name === 'ValidationError') {
    const errors: Record<string, string> = {};
    for (const k of Object.keys(err.errors || {})) {
      errors[k] = err.errors[k].message;
    }
    return res.status(422).json({ message: 'Validation failed', errors });
  }
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
}
