import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import ReportService from '../../../service/report';
import styles from "./reportList.module.css";
import { AuthContext } from '../../../context/authContext';
import { useNavigate } from 'react-router-dom';

function ReportList() {
  const navigate = useNavigate();
  const [reportList, setReportList] = useState([]); 
  // 초기에 reportList가 비어있어서 조건부 렌더링이 "등록된 제보가 없습니다." 메시지를 먼저 보여줘 깜빡임 현상 발생
  const [loading, setLoading] = useState(true); // 로딩 상태 추가하면 데이터가 로드된 후에 실제 데이터를 표시해 해결가능
  const [lastNo, setLastNo] = useState(0);
  const [showMoreButton, setShowMoreButton] = useState(true);
  const { isLoggedIn } = useContext(AuthContext);

  const fetchReportList = async () => {
    try {
      const reportService = new ReportService();
      const fetchedData = await reportService.getReportList(lastNo);
      setReportList(fetchedData);
      if(fetchedData){
        if (fetchedData.length > 0) {
          setLastNo(fetchedData[fetchedData.length - 1].no);
        }
        if (fetchedData.length % 5 !== 0) { //가져온 데이터가 5의 배수가 아니면 "더보기" 버튼을 숨김.
          setShowMoreButton(false);
        }
      }
      setLoading(false); // 데이터 로드 완료 후 로딩 상태 변경
    } catch (error) {
      console.error('Error fetching Report list:', error);
      setLoading(false); // 에러 발생 시에도 로딩 상태 변경
    }
  };

  const handleLoadMore = async () => {
    if (lastNo) {
      try {
        const reportService = new ReportService();
        const fetchedData = await reportService.getReportList(lastNo); // 페이징 처리
        if (fetchedData.length > 0) {
          setReportList([...reportList, ...fetchedData]);
          setLastNo(fetchedData[fetchedData.length - 1].no);
        }
        if (fetchedData.length % 5 !== 0) { //가져온 데이터가 3의 배수가 아니면 "더보기" 버튼을 숨김.
          setShowMoreButton(false);
        }
      } catch (error) {
        console.error('Error fetching more Report list:', error);
      }
    }
  };

  useEffect(() => {
    fetchReportList();
  }, []);

  // 로딩 중에는 로딩 상태를 보여줌
  if (loading) {
    return <div>Loading...</div>;
  }

  const handleClick = (event) => {
    // 여기서 필요한 조건을 확인하고 조건에 따라 페이지 이동을 막을 수 있습니다.
    if(isLoggedIn === false){
        event.preventDefault(); // 링크 이동을 막습니다.
        alert('로그인 필요')
        navigate('/auth/login/1')
      }
  }

  return (
    <div className={styles.content}>
      <header className={styles.appheader}>
          <h1>제보 게시판</h1>
          {/* <div className={styles.searchbar}>
              <input type="search" placeholder="검색"></input>
              <button className={styles.submit} type="submit">&#128269;</button>
          </div> */}
          <div className={styles.createBtnArea}>
            <Link to="/board/report/create" className={`${styles.btn} ${styles.createbtn}`}>작성하기</Link>
          </div>
        </header>
          <div className={styles.notices}>
            <div className={styles.noticeheader}>
                <span>No</span>
                <span>제목</span>
                <span>작성일</span>
                <span>작성자</span>
                <span>처리여부</span>
            </div>
            {reportList.length === 0 ? (
              <div className={styles.noData}>
                <p>등록된 제보가 없습니다.</p>
              </div>
            ) : (
              <>
              {reportList.map((report) => (
                <Link onClick={handleClick} className={styles.noticeitem} to={`/board/report/${report.no}`} key={report.no}>
                  <span>{report.no}</span>
                  <span className={styles.title}>{report.Title}</span>
                  <span>{report.createdAt}</span>
                  <span>{report.Author}</span>
                  <span>{report.State ? '완료' : '처리중'}</span>
                </Link>
              ))}
          {showMoreButton && (
            <div className={styles.loadmore}>
              <button className={styles.moreBtn} type="button" onClick={handleLoadMore}>더보기▼</button>
            </div>
          )}
        </>
      )}
      </div>
    </div>
  );
  
}

export default ReportList;
