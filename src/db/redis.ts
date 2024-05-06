import { createClient } from 'redis';

// const client = createClient({
//     password: 'Tuw5PtUJNBzeKsLrNpRx8BqQc2zWLX2p',
//     socket: {
//         host: 'redis-15942.c265.us-east-1-2.ec2.cloud.redislabs.com',
//         port: 15942
//     }
// });

// services docker port 
// const client = createClient({
//     socket: {
//         host: 'redis',
//         port: 6389
//     }
// });
// local docker port
const client = createClient({
    socket: {
        host: 'localhost',
        port: 6399
    }
});
// console.log(process.env.REDIS_URL)
// const client = createClient();
client.on('connect', function() {
    console.log('Connected to Redis');
});

module.exports = client