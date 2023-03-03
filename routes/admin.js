import express from "express";
import { signIn,signUp,resetPass,getAdmins,deleteAdmins} from "../controllers/adminauth.js";
import auth from '../middleware/auth.js';

const  router=express.Router();

router.post('/signin',signIn);
router.post('/signup',auth,signUp);
router.post('/resetpass',resetPass);

//add auth middleware after  completing redux setup on frontend
router.get('/getadmins',auth,getAdmins);
router.delete('/deleteadmin/:id',auth,deleteAdmins)

export default router;