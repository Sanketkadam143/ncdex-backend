import express from "express";
import {productDetails,getProduct,getLastPrice,getLiveQuotes} from "../controllers/productDetails.js";
import auth from '../middleware/auth.js';

const  router=express.Router();

router.get('/',productDetails);
router.get('/all',getProduct);
router.get('/livequotes',getLiveQuotes);
router.get('/getlastprice',auth,getLastPrice);

export default router;