import { Request, Response, NextFunction } from 'express';
const cloudinary = require('cloudinary');

import ProductModel from '../models/product';
import DataError from '../middleware/error-handler';
//import Review from './review';

//export const Review = Review;

export const create = async (req: Request, res: Response): Promise<void> => {
  let images: string[] = []; 
  if (req.body.images) {
    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }

    const imagesLinks: { product_id: string; url: string; }[] = [];
    const chunkSize: number = 3;
    const imageChunks: string[][] = [];
    while (images.length > 0) {
      imageChunks.push(images.splice(0, chunkSize));
    }
    for (let chunk of imageChunks) {
      const uploadPromises: Promise<any>[] = chunk.map((img: string) =>
        cloudinary.v2.uploader.upload(img, {
          folder: "Products",
        })
      );

      const results: any[] = await Promise.all(uploadPromises);

      for (let result of results) { 
        imagesLinks.push({
          product_id: result.public_id,
          url: result.secure_url,
        });
      }
    }

    req.body.id = req.body.user;
    req.body.images = imagesLinks;
  }

  await ProductModel.create(req.body)
    .then((product: any) => {
      res.status(200).json({ success: true, product });
    })
    .catch((error: any) => {
      DataError(res, error);
    });
};

export const list = async (req: Request, res: Response): Promise<void> => {
  await ProductModel.find()
    .then((products: any[]) => {
      res.status(200).send({ success: true, products });
    })
    .catch((error: any) => {
      DataError(res, error);
    });
};

export const categories = async (req: Request, res: Response): Promise<void> => {
  let categories: string[] = ["All"];
  const products: any[] = await ProductModel.find({});

  products.map((product: any) => {
     const { category } = product;
     categories.push(category);
  });

  categories = [...new Set(categories)];

  return res.status(200).json(categories);
}

export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!req.params.id) {
    return next(new Error("Product not found"));
  }

  let product: any = await ProductModel.findById(req.params.id);
  let images: string[] = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].product_id);
    }

    const imagesLinks: { product_id: string; url: string; }[] = [];
    for (let img of images) {
      const result: any = await cloudinary.v2.uploader.upload(img, {
        folder: "Products",
      });

      imagesLinks.push({
        product_id: result.public_id,
        url: result.secure_url,
      });
    }
    req.body.images = imagesLinks;
  }

  await ProductModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    })
    .then((data: any) => {
      res.status(200).json({ product: data });
    })
    .catch((error: any) => {
      DataError(res, error);
    });
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let product: any = await ProductModel.findById(req.params.id);

  if (!product) {
    return next(new Error("Product not found"));
  }

  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].product_id);
  }

  await product.remove();

  res.status(201).json({
    success: true,
    message: "Product delete successfully",
  });
};

export const read = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  console.log('Product Details request ::', req.params);
  const id: string = req.params.id;
  if (!id) return next(DataError(res, { status: 404, message: "No Product ID" }));
  
  await ProductModel.findById(id)
    .then((product: any) => {
      console.log("Product found ::", product);
      res.status(201).send({
        success: true,
        product
      });
      return;
    })
    .catch((error: any) => {
      DataError(res, error);
    });
};