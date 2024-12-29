import { verifyToken } from '../firebase-admin.js';

const authMiddleware = async (req, res, next) => {
    console.log("Auth middleware: Request received");

    const authHeader = req.headers.authorization;

    console.log("Authorization Header:", req.headers.authorization);


    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log("Auth middleware: Missing or invalid token");
        return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    try {
        const decodedToken = await verifyToken(idToken);
        req.user = decodedToken; // Attach user info to the request object

        console.log(`Incoming Request: ${req.method} ${req.originalUrl}`);
        console.log("Auth middleware: User authenticated");
        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

export default authMiddleware;
