import e from "express";
import * as mainController from "../controller/mainController.js"

const router = e.Router();

// 메인페이지
router.get('/', mainController.getMain)

// 서비스 소개
router.get('/info', mainController.getInfo)

// 쇼핑몰 검색 및 상세페이지
router.get('/search', mainController.search)

router.get('/search/:id', mainController.searchDetail)

router.get('/sns', mainController.getShopList)


export default router