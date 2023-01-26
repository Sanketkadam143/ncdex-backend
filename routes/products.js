import express from 'express';
import { addProduct,deleteProduct,updateProduct, } from '../controllers/products.js';
import auth from '../middleware/auth.js';

const  router=express.Router();
//add auth middleware after testing

router.post('/addproduct',addProduct);
router.patch('/updateproduct',updateProduct);
router.delete('/deleteproduct',deleteProduct);

export default router;