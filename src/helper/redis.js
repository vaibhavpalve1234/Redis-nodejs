const Redis = require('ioredis');

// Environment variables for Redis configuration
const REDISHOST = process.env.REDISHOST || 'localhost';
const REDISPORT = process.env.REDISPORT || 6379;
const REDISPASSWORD = process.env.REDISPASSWORD || ''; // Use environment variables for sensitive data

// Create a Redis client instance using ioredis
const redisClient = new Redis({
    host: REDISHOST,
    port: REDISPORT,
    password: REDISPASSWORD,
    connectTimeout: 10000,
});

// Handle Redis connection events
redisClient.on('connect', () => {
    console.log('Connected to Redis server successfully');
});

redisClient.on('error', (error) => {
    console.error('Error connecting to Redis server:', error);
});

// Example key generation function
const generateKey = (ip, port, serviceName) => `${ip}_${port}_${serviceName}`;

// Redis-based operations using the new key format
// --------------------------------------------------

// Insert new messages into the Redis cache with the key structure `ip_port_serviceName`
const addMessageToCache = async (ip, port, serviceName, msgId, msg) => {
  try {
    const key = generateKey(ip, port, serviceName);
    let messages = await getRoomFromCache(key);
    if (!messages) {
      messages = {};
    }
    messages[msgId] = msg;
    await redisClient.hset(`${key}`, 'messages', JSON.stringify(messages));
  } catch (err) {
    console.error('Error adding message to cache:', err);
  }
};

// Insert a single message into the Redis cache
const addSingleMessageToCache = async (ip, port, serviceName, msgId, msg) => {
  try {
    const key = generateKey(ip, port, serviceName);
    // Add single message directly without fetching the entire cache
    await redisClient.hset(`${key}`, msgId, JSON.stringify(msg));
    console.log(`Message ${msgId} added to room ${key}`);
  } catch (err) {
    console.error('Error adding single message to cache:', err);
  }
};

// Fetch all messages for a room from Redis cache
const getRoomFromCache = async (ip, port, serviceName) => {
  try {
    const key = generateKey(ip, port, serviceName);
    const data = await redisClient.hget(`${key}`, 'messages');
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error('Error fetching room from cache:', err);
    return null;
  }
};

// Fetch a single message for a room from Redis cache
const getSingleMessageFromCache = async (ip, port, serviceName, msgId) => {
  try {
    const key = generateKey(ip, port, serviceName);
    const message = await redisClient.hget(`${key}`, msgId);
    return message ? JSON.parse(message) : null;
  } catch (err) {
    console.error('Error fetching single message from cache:', err);
    return null;
  }
};

// Update message status in Redis cache
const updateMessageStatusInCache = async (ip, port, serviceName, msgId, status) => {
  try {
    const key = generateKey(ip, port, serviceName);
    let messages = await getRoomFromCache(ip, port, serviceName);
    if (messages) {
      messages[msgId].status = status;
      await redisClient.hset(`${key}`, 'messages', JSON.stringify(messages));
    } else {
      throw new Error('Room not found in cache');
    }
  } catch (err) {
    console.error('Error updating message status in cache:', err);
  }
};

// Connection count operations for rooms
// --------------------------------------------------

// Increment connection count for a room
const incrementConnectionCount = async (ip, port, serviceName) => {
  const key = generateKey(ip, port, serviceName);
  return await redisClient.hincrby('connection_counts', key, 1);
};

// Decrement connection count for a room
const decrementConnectionCount = async (ip, port, serviceName) => {
  const key = generateKey(ip, port, serviceName);
  return await redisClient.hincrby('connection_counts', key, -1);
};

// Get connection count for a room
const getConnectionCount = async (ip, port, serviceName) => {
  const key = generateKey(ip, port, serviceName);
  const count = await redisClient.hget('connection_counts', key);
  return count ? parseInt(count, 10) : 0;
};

// Export Redis utilities
module.exports = {
  redisClient,
  addMessageToCache,
  addSingleMessageToCache,  // Export single message add function
  getRoomFromCache,
  getSingleMessageFromCache, // Export single message get function
  updateMessageStatusInCache,
  incrementConnectionCount,
  decrementConnectionCount,
  getConnectionCount,
};
