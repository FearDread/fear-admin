import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { productService } from "./service";
import FeatureFactory from "@feardread/feature-factory";

const {reducer: productReducer, asyncActions: product } = FeatureFactory('product', 'all', {})

export { productReducer, product };