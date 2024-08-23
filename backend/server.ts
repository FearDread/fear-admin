import express, { Application } from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import db from './src/data/db';
import cloudinary from 'cloudinary';

dotenv.config({ path: './.env' });

const app: Application = express();

// connect to db //
db.run();

app.use(
  session({
    secret: process.env.SECRET as string,
    key: process.env.KEY as string,
    resave: false,
    saveUninitialized: false,
    store: db.store(),
  })
);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME as string,
  api_key: process.env.API_KEY as string,
  api_secret: process.env.API_SECRET as string,
});

const PORT: number = parseInt(process.env.PORT as string, 10) || 5000;
const server = app.listen(PORT, () => {
  console.log(`FEAR API Server is listening on PORT ${PORT}`);
  console.log('MailBag server open for requests');
});