import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser"
import cors from "cors"
import { connectToDatabase, disconnectFromDatabase } from "./utils/database";
import logger from "./utils/logger";
import { CORS_ORIGIN } from "./constants";
import userRoute from './modules/user/user.route'
import helmet from "helmet";
const app = express();

// middlewares
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json())
app.use(cors({
    origin: CORS_ORIGIN,
    credentials: true
}))
app.use(helmet())

app.use('/api/users', userRoute)

const port = process.env.PORT || 4000;

const server = app.listen(port, async () => {
    await connectToDatabase();
    logger.info("server running on the port " + port);
})

// graceful shutdown

const signals = ['SIGTERM', 'SIGINT'];

const gracefulShutdown = (signal: string) => {
    process.on(signal, async () => {
        logger.info(`Received ${signal}. Shutting down gracefully.`);
        server.close();

        // disconnect from the db
        await disconnectFromDatabase()
        logger.info("server work is done!");
        process.exit(0);

    })
}
for (let i = 0; i < signals.length; i++) {
    gracefulShutdown(signals[i]);
}