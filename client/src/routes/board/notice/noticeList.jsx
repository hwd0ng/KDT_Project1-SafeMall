import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NoticeService from '../../../service/notice';
import styles from "./noticeList.module.css";

function NoticeList() {
  const [noticeList, setNoticeList] = useState([]); 
  //초기에 noticeList가 비어있어서 조건부 렌더링이 "등록된 제보가 없습니다." 메시지를 먼저 보여줘 깜빡임 현상 발생
  const [loading, setLoading] = useState(true); // 로딩 상태 추가하면 데이터가 로드된 후에 실제 데이터를 표시해 해결가능
  const [lastId, setLastId] = useState(null);
  const [showMoreButton, setShowMoreButton] = useState(true);

  const fetchNoticeList = async () => {
    try {
      const noticeService = new NoticeService();
      const fetchedData = await noticeService.getNoticeList(lastId);
      setNoticeList(fetchedData);
      if (fetchedData.length > 0) {
        setLastId(fetchedData[fetchedData.length - 1]._id);
      }
      if (fetchedData.length % 5 !== 0) { //가져온 데이터가 3의 배수가 아니면 "더보기" 버튼을 숨김.
        setShowMoreButton(false);
      }
      setLoading(false); // 데이터 로드 완료 후 로딩 상태 변경
    } catch (error) {
      console.error('Error fetching Notice list:', error);
      setLoading(false); // 에러 발생 시에도 로딩 상태 변경
    }
  };

  const handleLoadMore = async () => {
    if (lastId) {
      try {
        const noticeService = new NoticeService();
        const fetchedData = await noticeService.getNoticeList(lastId); // 페이징 처리
        if (fetchedData.length > 0) {
          setNoticeList([...noticeList, ...fetchedData]);
          setLastId(fetchedData[fetchedData.length - 1]._id);
        }
        if (fetchedData.length % 5 !== 0) { //가져온 데이터가 3의 배수가 아니면 "더보기" 버튼을 숨김.
          setShowMoreButton(false);
        }
      } catch (error) {
        console.error('Error fetching more Notice list:', error);
      }
    }
  };

  useEffect(() => {
    fetchNoticeList();
  }, []);

  // 로딩 중에는 로딩 상태를 보여줌
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.content}>
      <header className={styles.appheader}>
          <h1>공지사항</h1>
          <div className={styles.searchbar}>
              <input type="search" placeholder="검색"></input>
              <button className={styles.submit} type="submit">&#128269;</button>
          </div>
          <div className={styles.createBtnArea}>
            <Link to="/notice/create" className={`${styles.btn} ${styles.createbtn}`}>작성하기</Link>
          </div>
        </header>
          <div className={styles.notices}>
            <div className={styles.noticeheader}>
                <span>No</span>
                <span>제목</span>
                <span>작성일</span>
                <span>작성자</span>
            </div>
          {noticeList.length === 0 ? (
            <div className={styles.noData}>
              <p>등록된 공지사항이 없습니다.</p>
            </div>
          ) : (
            <>
              {noticeList.map((notice) => (
                <Link className={styles.noticeitem} to={`/board/notice/${notice._id}`} key={notice.no}>
                  <span>no</span>
                  <span>{notice.Title}</span>
                  <span>{notice.Date}</span>
                  <span>관리자</span>
                </Link>
              ))}
          {showMoreButton && (
            <div className={styles.loadmore}>
              <button type="button" onClick={handleLoadMore}>더보기▼</button>
            </div>
          )}
        </>
        )}
      </div>
    </div>
  );
  
}

export default NoticeList;
