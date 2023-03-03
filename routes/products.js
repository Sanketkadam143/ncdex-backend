import express from 'express';
import { addProduct,deleteProduct,updateProduct} from '../controllers/products.js';
import auth from '../middleware/auth.js';

const  router=express.Router();
//add auth middleware after testing

router.post('/addproduct',auth,addProduct);
router.post('/updateproduct',auth,updateProduct);
router.delete('/deleteproduct',auth,deleteProduct);



export default router;