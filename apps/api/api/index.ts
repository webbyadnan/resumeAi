import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import * as express from 'express';
import { Request, Response } from 'express';

const server = express();

let app: any;
let isInitialized = false;

async function bootstrap() {
    if (isInitialized) return app;

    try {
        app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
            logger: ['error', 'warn', 'log'],
        });

        app.use(express.json({ limit: '10mb' }));
        app.use(express.urlencoded({ extended: true, limit: '10mb' }));

        app.enableCors({
            origin: '*', // Temporarily wildcards to rule out CORS issues
            credentials: true,
        });

        app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

        await app.init();
        isInitialized = true;
        return app;
    } catch (err) {
        console.error('FAILED TO BOOTSTRAP NESTJS:', err);
        throw err;
    }
}

export default async (req: Request, res: Response) => {
    await bootstrap();
    server(req, res);
};
