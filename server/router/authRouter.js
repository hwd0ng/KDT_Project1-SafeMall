import e from "express";
import * as userController from '../controller/userController.js'
import { isAuth } from "../middleware/isAuth.js";


const router = e.Router();

// 회원 로그인
router.post('/signin', userController.Signin)

// 회원 회원가입
router.post('/signup', userController.SignUp)

// 마이페이지
router.get('/mypage', isAuth, userController.Mypage)

export default router