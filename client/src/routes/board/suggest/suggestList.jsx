import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import SuggestService from '../../../service/suggest';
import styles from "./suggestList.module.css";
import { AuthContext } from '../../../context/authContext';
import { useNavigate } from 'react-router-dom';

function SuggestList() {
  const navigate = useNavigate();
  const [suggestList, setSuggestList] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [lastNo, setLastNo] = useState(null);
  const [showMoreButton, setShowMoreButton] = useState(true);
  const { isLoggedIn } = useContext(AuthContext);

  const fetchSuggestList = async (reset = false) => {
    try {
      const suggestService = new SuggestService();
      const fetchedData = await suggestService.getSuggestList(lastNo);
      
      if (fetchedData) {
        if (reset) {
          setSuggestList(fetchedData);
        } else {
          setSuggestList(prevList => [...prevList, ...fetchedData]);
        }

        if (fetchedData.length > 0) {
          setLastNo(fetchedData[fetchedData.length - 1].no);
        }

        if (fetchedData.length % 5 !== 0) {
          setShowMoreButton(false);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching Report list:', error);
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (lastNo !== null) {
      try {
        const suggestService = new SuggestService();
        const fetchedData = await suggestService.getSuggestList(lastNo);
        if (fetchedData.length > 0) {
          setSuggestList(prevList => [...prevList, ...fetchedData]);
          setLastNo(fetchedData[fetchedData.length - 1].no);
        }
        if (fetchedData.length % 5 !== 0) {
          setShowMoreButton(false);
        }
      } catch (error) {
        console.error('Error fetching more Suggest list:', error);
      }
    }
  };

  useEffect(() => {
    fetchSuggestList(true);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleClick = (event) => {
    if(isLoggedIn === false){
        event.preventDefault(); // 링크 이동을 막습니다.
        alert('로그인 필요')
        navigate('/auth/login/1')
      }
  }

  return (
    <div className={styles.content}>
      <header className={styles.appheader}>
          <h1>건의사항 게시판</h1>
          <div className={styles.createBtnArea}>
            <Link to="/board/suggest/create"><button className={styles.btn}>작성하기</button></Link>
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
          {suggestList.length === 0 ? (
            <div className={styles.noData}>
              <p>등록된 건의사항 없습니다.</p>
            </div>
          ) : (
            <>
            {suggestList.map((suggest, index) => (
              <Link onClick={handleClick} className={styles.noticeitem} to={`/board/suggest/${suggest.no}`} key={`${suggest.no}-${index}`}>
                <span>{suggest.no}</span>
                <span className={styles.title}>{suggest.Title}</span>
                <span>{suggest.createdAt.split('T')[0]}</span>
                <span>{suggest.Author}</span>
                <span>{suggest.State ? '완료' : '처리중'}</span>
              </Link>
            ))}
            {showMoreButton && (
              <div className={styles.loadmore}>
                <button className={styles.moreBtn} onClick={handleLoadMore}>더보기▼</button>
              </div>
            )}
          </>
          )}
        </div>
    </div>
  );
}

export default SuggestList;
