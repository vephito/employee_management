import { createClient } from 'redis';
import redis = require('redis')
// const client = createClient({
//     password: 'Tuw5PtUJNBzeKsLrNpRx8BqQc2zWLX2p',
//     socket: {
//         host: 'redis-15942.c265.us-east-1-2.ec2.cloud.redislabs.com',
//         port: 15942
//     }
// });
// 
const client = createClient({
    socket: {
        host: 'redis',
        port: 6379
    }
});
client.on('connect', function() {
    console.log('Connected to Redis');
});
// const client = redis.createClient();
// client.on('connect', function() {
//     console.log('Connected to Redis');
// });


module.exports = client