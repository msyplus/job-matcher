import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Production: serve frontend static files
  const isProd = process.env.NODE_ENV === 'production';
  if (isProd) {
    const clientDist = path.join(__dirname, '..', '..', 'client', 'dist');
    app.useStaticAssets(clientDist, { index: false });
    // SPA fallback: non-API routes serve index.html
    app.use((req: any, res: any, next: any) => {
      if (req.path.startsWith('/api')) return next();
      res.sendFile(path.join(clientDist, 'index.html'));
    });
  } else {
    app.enableCors({ origin: ['http://localhost:5173'], credentials: true });
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`JobMatcher running on http://localhost:${port} [${isProd ? 'production' : 'development'}]`);
}
bootstrap();
