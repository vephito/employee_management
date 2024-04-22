import { createClient } from 'redis';

// const client = createClient({
//     password: 'Tuw5PtUJNBzeKsLrNpRx8BqQc2zWLX2p',
//     socket: {
//         host: 'redis-15942.c265.us-east-1-2.ec2.cloud.redislabs.com',
//         port: 15942
//     }
// });


// const client = createClient({
//     socket: {
//         host: 'redis',
//         port: 6389
//     }
// });
const client = createClient({
    socket: {
        host: 'localhost',
        port: 6399
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