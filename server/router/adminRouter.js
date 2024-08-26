import e from "express";
import * as adminController from "../controller/adminController.js"

const router = e.Router();

// 관리자 메인페이지
router.get('/')

router.get('/updatedbshopslist', adminController.updateDB_shopsList)

router.get('/updatedbcomplaintslist', adminController.updateDB_ComplaintsList)

// 관리자 게시판
// 관리자 공지사항 목록
router.get('/board/notice')
// 관리자 공지사항 작성
router.post('/board/notice')
// 관리자 공지사항 상세
router.get('/board/notice/:id')
// 관리자 공지사항 수정
router.put('/board/notice/:id')
// 관리자 공지사항 삭제
router.delete('/board/notice/:id')

// 관리자 예방법 목록
router.get('/board/notice')
// 관리자 예방법 작성
router.post('/board/notice')
// 관리자 예방법 상세
router.get('/board/notice/:id')
// 관리자 예방법 수정
router.put('/board/notice/:id')
// 관리자 예방법 삭제
router.delete('/board/notice/:id')

// 관리자 대처법 목록
router.get('/board/notice')
// 관리자 대처법 작성
router.post('/board/notice')
// 관리자 대처법 상세
router.get('/board/notice/:id')
// 관리자 대처법 수정
router.put('/board/notice/:id')
// 관리자 대처법 삭제
router.delete('/board/notice/:id')

// 관리자 건의사항 목록
router.get('/board/notice')
// 관리자 건의사항 작성
router.post('/board/notice')
// 관리자 건의사항 상세
router.get('/board/notice/:id')
// 관리자 건의사항 수정
router.put('/board/notice/:id')
// 관리자 건의사항 삭제
router.delete('/board/notice/:id')

// 관리자 제보 목록
router.get('/board/notice')
// 관리자 제보 작성
router.post('/board/notice')
// 관리자 제보 상세
router.get('/board/notice/:id')
// 관리자 제보 수정
router.put('/board/notice/:id')
// 관리자 제보 삭제
router.delete('/board/notice/:id')


// 관리자 회원관리
// 관리자 회원 목록
router.get('/users')
// 관리자 회원 추가
router.post('/users')
// 관리자 회원 상세
router.get('/users/:id')
// 관리자 회원 수정
router.put('/users/:id')
// 관리자 회원 삭제
router.delete('/users/:id')

export default router