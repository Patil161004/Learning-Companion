import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  try {
    // Check if the Authorization header exists
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided, authorization denied' });
    }

    // Extract the token from the Authorization header
    const token = req.headers.authorization.split(' ')[1];

    // Verify the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user information (like id) to the request object for later use
    req.user = { id: decodedToken.id };

    // Call the next middleware or route handler
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);

    // Return a more specific message based on the type of error
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({ error: 'Token expired' });
    } else if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ error: 'Invalid token' });
    } else {
      res.status(500).json({ error: 'Server error during authentication' });
    }
  }
};

export default auth;
