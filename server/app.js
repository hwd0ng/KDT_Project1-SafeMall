import e from "express";
import cors from 'cors';
import { config } from "./config.js";
import { connectDatabases } from "./db/database.js";
import mainRouter from './router/mainRouter.js'
import adminRouter from  './router/adminRouter.js'
import boardRouter from './router/boardRouter.js'
import authRouter from './router/authRouter.js'

const app = e();

app.use(e.json());
app.use(cors());

app.use('/', mainRouter)
app.use('/auth', authRouter)
app.use('/board', boardRouter)
app.use('/admin', adminRouter)

// 데이터베이스 연결 및 서버 시작
connectDatabases().then(() => {
  app.listen(config.host.port, () => {
    console.log(`Server listening on http://localhost:${config.host.port}`);
  });
}).catch(error => {
  console.error('Failed to start the server:', error);
});


/**
 * 사용되는 페이지의 대분류
 * 메인페이지
 *      auth
 *      info
 *      search
 *      detail
 * 게시판(board)
 *      notice
 *      suggest
 *      prevent
 *      coping
 *      report
 * 관리자(admin)
 *      게시판관리(board)
 *      데이터베이스관리(db)
 *      회원관리(users)
 */