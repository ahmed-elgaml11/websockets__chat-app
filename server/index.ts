import env from './env'
import { main } from './db'
import app from './app'
import type { Server } from 'http';




export let server: Server;

const startServer = async () => {
    try {
        await main();

        server = app.listen(env.PORT, async() => {
            console.log(`Server listening on port ${env.PORT}`);
            await import('./socket')
        });


    } catch (err) {
        console.error('Startup error:', err);
    }
};

startServer().catch(console.error);