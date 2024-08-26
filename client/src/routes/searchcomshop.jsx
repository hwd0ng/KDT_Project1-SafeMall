import React, { useState, useEffect } from 'react';
import styles from './search.module.css';
import { useParams, useLocation } from 'react-router-dom';
import MainService from '../service/main';
import Spinner from 'react-bootstrap/Spinner';

export default function Searchcomshop() {
    const [result, setResult] = useState({
        id:'',
        shopNameKor:'',
        domainName:'',
        Totalreport:0,
        Unprocess:0,
        MainItems:[],
        mainDamageContent:[]
    }); 

    const { id } = useParams();
    const type = useLocation().search;
    const [showContent1, setShowContent1] = useState(true); 
    const [showContent2, setShowContent2] = useState(false); 
    const [showContent3, setShowContent3] = useState(false);
    const [loading, setLoading] = useState(true);

    const handleClick1 = () => {
        setShowContent1(true); 
        setShowContent2(false);
        setShowContent3(false);
    };

    const handleClick2 = () => {
        setShowContent1(false); 
        setShowContent2(true);
        setShowContent3(false);
    };

    const handleClick3 = () => {
        setShowContent1(false); 
        setShowContent2(false);
        setShowContent3(true);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        console.log('type');
        console.log(type[type.length - 1]);
        const fetchSearchDetail = async () => {
            try {
                const maintService = new MainService();
                const fetchedData = await maintService.getSearchResultDetail(id, type[type.length - 1]);
                setResult(fetchedData);
                console.log(fetchedData);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.error('Error fetching Report list:', error);
            }
        };
    
        fetchSearchDetail();
    }, [id]); 

    const handleClick = () => {
        const url = result.domainName.startsWith('http') ? result.domainName : `http://${result.domainName}`;
        window.open(url, '_blank');
    };

    if (loading) {
      return (
          <div className={styles.loadingArea}>
              로딩중
              <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
              </Spinner>
          </div>
        );
    }

    return (
      <>
        <div className={styles.container}>
          <div className={styles.title}>
              <div className={styles.search}>
                <input disabled={true} value={result.shopNameKor || ''} type="text" />&emsp;
                <button onClick={handleClick} type="submit" id={styles.linkBtn}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-right-circle" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"/>
                  </svg>
                  바로가기
                </button>
              </div>
          </div>

          <div className={styles.score}>
            <span className={styles.number}>{result.Totalreport} / {result.Unprocess}</span>
            <hr />
            <span>총 신고 접수건 / 미처리건</span>
          </div>

          <div className={styles.date}>
            <span style={{color:'red'}}>피해 신고 다발 업체</span>
          </div>

          <div className={styles.info}>
            <div className={styles.tab}>
              <button className={styles.menu1} onClick={handleClick1}>쇼핑몰 정보</button>
              <button className={styles.menu3} onClick={handleClick3}>상세지표</button>
            </div>

            <div className={styles.pointer} style={{ display: 'none' }}>
              <div className={styles.pointer1}>▾</div>
              <div id="pointer2">▾</div>
              <div className={styles.pointer3}>▾</div>
            </div>

            <div className={styles.content1} style={{ display: showContent1 ? 'block' : 'none' }}>
              <table>
                <tbody>
                  <tr>
                    <td className={styles.col}>쇼핑몰명</td>
                    <td className={styles.row}>{result.shopNameKor}</td>
                  </tr>
                  <tr>
                    <td className={styles.col}>도메인명</td>
                    <td className={styles.row}>{result.domainName}</td>
                  </tr>
                  <tr>
                    <td className={styles.col}>취급품목</td>
                    <td className={styles.row}>
                      {/* {result.MainItems} */}
                      {result.MainItems.map((content, i) => (
                        <React.Fragment key={i}> 
                        <span key={i}>{content} / </span>
                        </React.Fragment> 
                      ))}
                    </td>
                  </tr>
                  <tr>
                    <td className={`${styles.lb} ${styles.col}`}>업소상태</td>
                    <td className={`${styles.rb} ${styles.row}`}>{result.businessState}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* <div className={styles.content2} style={{ display: showContent2 ? 'block' : 'none' }}>
              <table>
                <tbody>
                  <tr>
                    <td className={styles.col}>사업자정보표시</td>
                    <td className={styles.row}>{result.scoreBusinessInfo}</td>
                  </tr>
                  <tr>
                    <td className={styles.col}>청약철회</td>
                    <td className={styles.row}>{result.scoreSW}</td>
                  </tr>
                  <tr>
                    <td className={styles.col}>결제방법</td>
                    <td className={styles.row}>{result.scorePayment}</td>
                  </tr>
                  <tr>
                    <td className={styles.col}>이용약관평가</td>
                    <td className={styles.row}>{result.scoreTermUse}</td>
                  </tr>
                  <tr>
                    <td className={`${styles.lb} ${styles.col}`}>개인정보보안</td>
                    <td className={`${styles.rb} ${styles.row}`}>{result.scorePIS}</td>
                  </tr>
                </tbody>
              </table>
            </div> */}

            <div className={styles.content3} style={{ display: showContent3 ? 'block' : 'none' }}>
              <table>
                <tbody>
                  <tr>
                    <td className={`${styles.lb} ${styles.col}`}>주요피해내용</td>
                    <td className={`${styles.rb} ${styles.row}`}>
                        {result.mainDamageContent.map((content, i)=>(
                          // <></>와 동일한 기능을 하는 React.Fragment 태그 사용 ==> 해당 태그는 props를 받을 수 있음
                          <React.Fragment key={i}> 
                          <div >{content}</div>
                          <hr />
                          </React.Fragment>
                        ))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </>
    );
}
