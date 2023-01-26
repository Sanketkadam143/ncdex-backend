import express from "express";
import { signIn,signUp,resetPass } from "../controllers/adminauth.js";

const  router=express.Router();

router.post('/signin',signIn);
router.post('/signup',signUp);
router.post('/resetpass',resetPass);

export default router;