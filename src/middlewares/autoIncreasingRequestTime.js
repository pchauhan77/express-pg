const redis = require('redis');
const redisClient = redis.createClient({
  enable_offline_queue: false,
});