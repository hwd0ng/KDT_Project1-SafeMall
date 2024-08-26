import React, { useState, useEffect } from 'react';
import MainService from '../service/main';
import styles from "./mainPage.module.css";
import { useNavigate } from 'react-router-dom';

function MainPage() {
  const navigate  = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [cards, setCards] = useState([]);
  const [count, setCount] = useState(0);
  const [showMoreButton, setShowMoreButton] = useState(true);
  const [showDetailCard, setShowDetailCard] = useState(null);

  const handleClick = (card) => {
    setShowDetailCard((prev) => (prev && prev._id === card._id ? null : card));
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    console.log('검색어:', searchQuery);
    let keyword = searchQuery.trim()
    if(keyword == ''){  
      alert('검색어를 입력하세요');
      navigate('/');
    }else{
    console.log(typeof(keyword))
    const maintService = new MainService();
    const fetchedData = await maintService.getSearchResult(keyword);
    if (fetchedData.length === 0 || fetchedData == false) {
      alert('검색 결과가 없습니다.');
      navigate('/');
    } else {
      // 검색 결과를 service에서 받아와 검색결과페이지로 넘김(데이터는 state담아서 같이 넘김)
      navigate('/search/result', { state: { searchResults: fetchedData } });
    }}
  };
  async function btn(value){
    console.log(value)
    const maintService = new MainService();
    const fetchedData = await maintService.getSearchResultDetail(value, '1');
    navigate(`/search/${value}?type=1`);
  }
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleLoadMore = () => {
    setCount(prev => prev + 3);
  };

  const getWarnList = async () => {
    try {
      const maintService = new MainService();
      const fetchedData = await maintService.getWarnList(count);
      setCards(fetchedData);
      // console.log(fetchedData.length)
      if (fetchedData.length % 3 !== 0) { //가져온 데이터가 3의 배수가 아니면 "더보기" 버튼을 숨김.
        setShowMoreButton(false);
      }
    } catch (error) {
      console.error('Error fetching Report list:', error);
    }
  };

  useEffect(() => {
    getWarnList();
  }, [count]); //count값이 변하면 새로운 값 로드됨

  return (
    <div id={styles.container}>
      <div id={styles.title}>
      
        <h1><img src={process.env.PUBLIC_URL + '/cart.svg'} width = '300px'/><br /> SAFE MALL.</h1>
      </div>
      <form onSubmit={handleSearchSubmit}>
        <div id={styles.search}>
          <input
            type="text"
            placeholder="상호명 또는 URL 입력"
            value={searchQuery}
            onChange={handleInputChange}
          />&emsp;
          <button type="submit">🔍</button>
        </div>
      </form>

      <div id={styles.site}>
        <span className={styles.list}>🚨 피해 다발 사이트</span>
        <span className={styles.count}>( 총 접수건 / 미처리건 )</span>
      </div>

      {!cards ? (
    <div className={styles.noData}>
        <p>등록된 사이트 없음.</p>
    </div>
) : (
    cards.map(card => (
      <div key={card._id} className={styles.listcard}  >
      <p>{card.shopNameKor} ( {card.Totalreport} / {card.Unprocess}) <span style={{fontSize:"45px"}} className={styles.arrow} onClick={() => handleClick(card)}> ▼</span></p>
      {showDetailCard && card._id === showDetailCard._id && (
        <div className={`${styles.detailcard}
          ${ showDetailCard && card._id === showDetailCard._id ? 'show' : ''}`}>
          <p><b>[ 쇼핑몰명 ]</b> {showDetailCard.shopNameKor}</p>
          <p><b>[ 도메인명 ]</b> {showDetailCard.domainName}</p>
           <p><b>[ 취급품목 ]</b><br></br>{showDetailCard.MainItems.map((item, index) => (
            <span key={index}>{item} {index !== showDetailCard.MainItems.length - 1 && ', '}</span>
          ))}</p>
        <p>
          <b>[ 주요피해내용 ]</b><br /> 
          {showDetailCard.mainDamageContent.map((content, index) => (
            <span key={index}>{index + 1}. {content}<br /></span>
          ))}
        </p>
        <div className={styles.detailBtn}>
            <button className={styles.directBtn} onClick={()=>btn(card.id)}>바로가기</button>
        </div>
      </div>
    )}
    </div>
    ))
)}

      {showMoreButton && (
        <div id={styles.more}>
          <button type="button" onClick={handleLoadMore}>더보기▾</button>
        </div>
      )}
      <div className={styles.bottom}>
      </div>
    </div>
  );
}

export default MainPage;