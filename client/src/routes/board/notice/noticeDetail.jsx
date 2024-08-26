import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NoticeService from '../../../service/notice';
import { useNavigate } from 'react-router-dom';
import styles from "./noticeDetail.module.css";

function NoticeDetail() {
  const navigate = useNavigate();
  const [notice, setNotice] = useState([]); //null로 하면 typeError 남
  const { id } = useParams(); // URL에서 id 파라미터 가져오기

  useEffect(() => {
    const fetchNoticeDetail = async () => {
      try {
        const noticeService = new NoticeService();
        const fetchedData = await noticeService.getNoticeDetail(id);
        setNotice(fetchedData);
      } catch (error) {
        console.error('Error fetching Notice list:', error);
      }
    };

    fetchNoticeDetail();
  }, [id]); // id가 변경될 때마다 useEffect 다시 실행

  return (
    <div>
      <div className={styles.noticeheader}>
        <div>공지사항</div>
      </div>
      <div className={styles.innercontainer}>
        <div className={styles.maintitle}>{notice.Title}</div>
        <div className={styles.dateinfo}>
          <span id={styles.date}>{notice.Date}</span>
          <span id={styles.writer}>작성자: 관리자</span>
          <span id={styles.viewCount}>조회수: {notice.View}</span>
        </div>
        <div className={styles.bodycontent}>
          <div className={styles.contentcontent}>{notice.Contents}</div>
        </div>
        {/* <div id="answer-container">
          <div id="title-section">
            <div id="answer-title">관리자 답변:</div>
            <div id="answer-date">{report.answerDate}</div>
          </div>
          <div id="answer" className="content-content">
            {report.adminAnswer}
          </div>
        </div> */}
        <div className={styles.buttonarea}>
          <button className={styles.button} onClick={() => navigate('/notice')}>목록</button>
        </div>
      </div>
    </div>
  );
}

export default NoticeDetail;
