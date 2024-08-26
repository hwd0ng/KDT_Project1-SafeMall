import e from 'express';
import { isAuth } from '../middleware/isAuth.js'
import * as boardController from '../controller/boardController.js';

const router = e.Router();

// 공지사항 목록
router.get('/notice', boardController.getNoticeList);

// 공지사항 상세
router.get('/notice/:no', boardController.getNoticeDetail);

// 예방법 목록
router.get('/prevent', boardController.getPreventList);

// 예방법 상세
router.get('/prevent/:no', isAuth, boardController.getPreventDetail);

// 피해 대처법 (리액트에서 처리되는 로직)

// 건의사항 목록
router.get('/suggest', boardController.getSuggestList);
// 건의사항 작성
router.post('/suggest', isAuth, boardController.createSuggest);
// 건의사항 상세
router.get('/suggest/:no', isAuth, boardController.getSuggestDetail);
// 건의사항 상세 수정
router.put('/suggest/:no', isAuth, boardController.editSuggest);
// 건의사항 상세 삭제
router.delete('/suggest/:no', isAuth, boardController.deleteSuggest);

// 제보 목록
router.get('/report', boardController.getReportList);
// 제보 작성
router.post('/report', isAuth, boardController.createReport);
// 제보 상세
router.get('/report/:no', isAuth, boardController.getReportDetail);
// 제보 수정
router.put('/report/:no', isAuth, boardController.editReport);
// 제보 삭제
router.delete('/report/:no', isAuth, boardController.deleteReport);

export default router;

// boardController
//     게시글 목록 가져오기
//     게시글 상세 가져오기
//     게시글 수정 가져오기
//     게시글 삭제 가져오기
