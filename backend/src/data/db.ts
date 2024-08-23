import mongoose, { ConnectOptions } from 'mongoose';
import MongoStore from 'connect-mongo';
import dotenv from 'dotenv';

dotenv.config({ path: __dirname + "/../.env" });

export const run = (): void => {
  mongoose.set("strictQuery", false); 
  mongoose
      .connect(process.env.DB_LINK as string, {
        useNewUrlParser: true,
        dbName: process.env.DB_NAME as string
      } as ConnectOptions)
      .then((): void => {
          console.log("You successfully connected to MongoDB! Using :: " + process.env.DB_NAME);
      })
      .catch((err: Error): void => {
          console.log("Error connecting to MongoDB", err);
      });
};

export const store = (): void => {
  MongoStore.create({ mongoUrl: process.env.DB_LINK as string });
};