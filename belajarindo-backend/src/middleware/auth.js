const { verifyToken } = require('../utils/jwt');

// Express middleware: verifies JWT in cookie 'token' and attaches req.userId
module.exports = function authMiddleware(req, res, next) {
  // public routes (use originalUrl so middleware works when mounted on routers)
  const publicRoutes = ['/api/auth/login', '/api/auth/register', '/api/health'];
  const url = req.originalUrl || req.url || '';
  if (publicRoutes.some(route => url.startsWith(route))) return next();

  // only protect API routes (use originalUrl which contains mount path)
  if (!url.startsWith('/api/')) return next();

  // token can come from cookie or Authorization header (Bearer)
  const tokenFromCookie = req.cookies && (req.cookies.token || req.cookies.auth_token);
  const authHeader = req.headers && req.headers.authorization;
  const tokenFromHeader = typeof authHeader === 'string' && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  const token = tokenFromCookie || tokenFromHeader;
  if (!token) {
    // Diagnostic logging: do not log token contents, only presence
    try {
      const origin = req.headers && req.headers.origin;
      const cookieNames = req.headers && req.headers.cookie ? req.headers.cookie.split(';').map(s=>s.split('=')[0].trim()) : [];
      console.warn('AUTH: missing token for request', { method: req.method, path: req.originalUrl || req.url, origin, cookieNames, hasAuthHeader: !!authHeader });
    } catch (e) {
      console.warn('AUTH: missing token and failed to compute diag info', e);
    }
    return res.status(401).json({ error: 'Unauthorized - No token provided' });
  }

  const decoded = verifyToken(token);
  if (!decoded) return res.status(401).json({ error: 'Unauthorized - Invalid token' });

  // attach user info
  req.userId = decoded.userId || decoded.sub || decoded.id;
  req.user = { userId: req.userId, email: decoded.email, name: decoded.name };
  next();
};