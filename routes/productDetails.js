import express from "express";
import {productDetails } from "../controllers/productDetails.js";

const  router=express.Router();

router.get('/',productDetails);

export default router;