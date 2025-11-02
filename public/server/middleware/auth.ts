import type { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized - Missing token' });
    }

    const token = authHeader.substring(7);

    if (!supabase) {
      // Fallback for when Supabase is not configured (development mode)
      console.warn('Supabase not configured - bypassing auth check');
      req.user = {
        id: 'dev-user',
        email: 'dev@example.com',
        role: 'customer',
      };
      return next();
    }

    const { data, error } = await supabase.auth.getUser(token);
    
    if (error || !data.user) {
      return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }

    req.user = {
      id: data.user.id,
      email: data.user.email || '',
      role: data.user.user_metadata?.role || 'customer',
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication error' });
  }
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  await requireAuth(req, res, () => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden - Admin access required' });
    }
    next();
  });
}
