import express from 'express';
import { engine } from 'express-handlebars';
import helmet from 'helmet';
import { InversifyExpressServer } from 'inversify-express-utils';
import { exec } from 'node:child_process';
import path from 'node:path';
import 'reflect-metadata';

import { createContainer } from './container/container';
import { type AppContainer } from './container/types';

import type { NextFunction, Request, Response } from 'express';
import type { Server } from 'node:http';

export interface ApplicationOptions {
  container?: AppContainer;
  port?: number;
  environment?: string;
}

interface CustomError extends Error {
  statusCode?: number;
  payload?: Record<string, unknown>;
  code?: string | number;
}

export class Application {
  private readonly container: AppContainer;
  private readonly expressApp: express.Application;
  private readonly options: ApplicationOptions;
  private readonly DEFAULT_PORT = 3000;

  constructor(options: ApplicationOptions = {}) {
    this.options = {
      port: process.env.PORT ? +process.env.PORT : this.DEFAULT_PORT,
      environment: process.env.NODE_ENV || 'development',
      ...options,
    };

    this.container = options.container || createContainer();
    this.expressApp = this.initExpressApp();
  }

  public get app(): express.Application {
    if (!this.expressApp) {
      throw new Error('Application is not initialized.');
    }
    return this.expressApp;
  }

  public get appContainer(): AppContainer {
    if (!this.container) {
      throw new Error('Container is not initialized.');
    }
    return this.container;
  }

  public async start(): Promise<void> {
    const listenPort = this.options.port;

    // Auto-generate Swagger
    if (this.options.environment === 'development') {
      exec('npx tsoa spec', (err, stdout, stderr) => {
        if (err) {
          console.error('Swagger generation error:', err);
        }

        if (stdout) {
          console.log(stdout);
        }

        if (stderr) {
          console.error(stderr);
        }
      });
    }

    return new Promise((resolve, reject) => {
      const server = this.expressApp.listen(listenPort, (err?: Error) => {
        if (err) {
          reject(err);
        } else {
          console.log(
            `🚀 Server running on port ${listenPort} in ${this.options.environment} mode`
          );
          resolve();
        }
      });

      this.gracefulShutdown(server);
    });
  }

  private initExpressApp(): express.Application {
    const baseApp = express();

    this.configureMiddleware(baseApp);
    this.configureViewEngine(baseApp);

    const server = new InversifyExpressServer(
      this.container,
      null,
      null,
      baseApp
    );

    const builtApp = server
      .setConfig(this.configureRoutes.bind(this))
      .setErrorConfig(this.configureErrorHandling.bind(this))
      .build();

    this.configure404Handler(builtApp);

    return builtApp;
  }

  private configureMiddleware(app: express.Application): void {
    app.use(helmet({ contentSecurityPolicy: false }));
    app.use(express.urlencoded({ extended: true, limit: '50mb' }));
    app.use(express.json({ limit: '50mb' }));
  }

  private configureViewEngine(app: express.Application): void {
    app.engine(
      'handlebars',
      engine({
        helpers: {
          eq: (a: unknown, b: unknown) => a === b,
          formatMoney: (amount: number) => {
            if (typeof amount !== 'number') return amount;

            return new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(amount);
          },
        },
      })
    );
    app.set('view engine', 'handlebars');
    app.set('views', path.join(__dirname, 'views'));
  }

  private configureRoutes(app: express.Application): void {
    app.use('/api-docs', express.static(path.join(process.cwd(), 'swagger')));
    app.use(
      '/api-docs/assets',
      express.static(path.join(process.cwd(), 'node_modules/swagger-ui-dist'))
    );
    app.get('/api-docs', this.handleSwaggerDocs.bind(this));
  }

  private configureErrorHandling(app: express.Application): void {
    app.use(this.handleErrors.bind(this));
  }

  private configure404Handler(app: express.Application): void {
    app.use((_req, res) => {
      res.render('404', { layout: 'main' });
    });
  }

  private handleSwaggerDocs(_req: Request, res: Response): void {
    res.render('swagger', { layout: 'main' });
  }

  private handleErrors(
    err: CustomError,
    _req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: NextFunction
  ): void {
    if (this.options.environment === 'development') {
      console.error('Application Error:', err);
    }

    if (!(err instanceof Error)) {
      err = new Error(String(err)) as CustomError;
    }

    const statusCode = err.statusCode || 500;
    const isProduction = this.options.environment === 'production';

    const errorResponse = {
      error: {
        name: err.name || 'InternalServerError',
        message: err.message || 'Unexpected error',
        ...(err.payload && { payload: err.payload }),
        ...(err.code && { code: err.code }),
        ...(!isProduction && err.stack && { stack: err.stack }),
        timestamp: new Date().toISOString(),
      },
    };

    res.status(statusCode).json(errorResponse);
  }

  private async gracefulShutdown(server: Server) {
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT received, shutting down gracefully...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });
  }
}
