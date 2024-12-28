import { createClient } from 'redis';

// Initialize Redis client
const redisClient = createClient({
    socket: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379
    }
});

redisClient.on('connect', () => console.log('Redis Client Connected'));
redisClient.on('error', (err) => console.error('Redis Client Error:', err));

(async () => {
    await redisClient.connect(); // Connect Redis client
})();

// Middleware function
const rateLimiter = (maxRequests, windowSeconds) => {
    return async (req, res, next) => {
        try {
            const ip = req.ip; // Use IP address for identification
            const key = `rate:${ip}`;
            const currentRequests = await redisClient.get(key);

            if (currentRequests) {
                if (parseInt(currentRequests) >= maxRequests) {
                    return res.status(429).json({
                        message: "Too many requests. Please try again later.",
                    });
                }

                await redisClient.incr(key); // Increment request count
            } else {
                await redisClient.set(key, 1, {
                    EX: windowSeconds, // Set expiry time for the key
                });
            }

            next(); // Proceed to the next middleware
        } catch (err) {
            console.error('Rate Limiter Error:', err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };
};

export default rateLimiter;
