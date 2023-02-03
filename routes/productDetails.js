import express from "express";
import {productDetails,getProduct } from "../controllers/productDetails.js";

const  router=express.Router();

router.get('/',productDetails);
router.get('/all',getProduct);

export default router;