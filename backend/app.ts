import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import routes from './src/routes';

dotenv.config({ path: './.env' });

const app: express.Application = express();

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(fileUpload());
app.use(cors());
app.use(helmet({ contentSecurityPolicy: false }));

app.use('/fear/api/user', routes.users);
app.use('/fear/api/product', routes.products);
app.use('/fear/api/cart', routes.cart);
app.use('/fear/api', routes.payment);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.locals.admin = req.admin || null;
  res.locals.currentPath = req.path;
  next();
});

const __dirname1: string = path.resolve();

app.use(express.static(path.join(__dirname1, '/dashboard/build')));
app.get('*', (req: Request, res: Response) =>
  res.sendFile(path.resolve(__dirname1, 'dashboard', 'build', 'index.html'))
);

app.use('/mailbag', express.static(path.join(__dirname, '../mailbag/dist')));

export default app;