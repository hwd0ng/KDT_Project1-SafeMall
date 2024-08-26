import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SuggestService from '../../../service/suggest';
import styles from './suggestDetail.module.css';
import { AuthContext } from '../../../context/authContext';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function SuggestDetail() {
  const navigate = useNavigate();
  const { isLoggedIn, nickname, isAdmin } = useContext(AuthContext);
  const [suggest, setSuggest] = useState([null]); 
  const { no } = useParams(); // URL에서 no 파라미터 가져오기
  const values = [true];
  const [fullscreen, setFullscreen] = useState(true);
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    Comments: ''
  });
  const [forDelete, setforDelete] = useState({
    Comments: ''
  });

  function handleShow(breakpoint) {
    setFullscreen(breakpoint);
    setShow(true);
  }

  useEffect(() => {
    console.log(isLoggedIn)
    if(isLoggedIn === false){
      alert('로그인 필요')
      navigate('/auth/login/1')
    }
  }, [isLoggedIn]);

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const suggestService = new SuggestService();
      const response = await suggestService.deleteSuggest(no);
      alert('삭제되었습니다.'); 
      navigate('/board/suggest'); 
    } catch (error) {
      console.error('Error submitting suggest:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const suggestService = new SuggestService();
      const response = await suggestService.editSuggest(formData, no);
      console.log('handleSubmit-suggest:', response)
     if(response){
       alert('답변되었습니다.');
      //  navigate(`/board/suggest/${no}`);
       window.location.reload();
     }
    } catch (error) {
      console.error('Error submitting suggest:', error);
      // 오류 처리 로직 추가 가능
    }
  };

  const handleAnswerDelete = async (e) => {
    e.preventDefault();
    try {
      const suggestService = new SuggestService();
      const response = await suggestService.editSuggest(forDelete, no);
      console.log('handleSubmit-suggest:', response)
     if(response){
       alert('삭제 되었습니다.');
       window.location.reload();
     }
    } catch (error) {
      console.error('Error submitting suggest:', error);
      // 오류 처리 로직 추가 가능
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchSuggestDetail = async () => {
      try {
        const suggestService = new SuggestService();
        const fetchedData = await suggestService.getSuggestDetail(no);
        console.log(fetchedData)
        setSuggest(fetchedData);
      } catch (error) {
        console.error('Error fetching suggest list:', error);
      }
      
    };

    fetchSuggestDetail();
  }, []); 

  

  return (
    <div className={styles.container}>
      <div className={styles.reportheader}>
        <div>건의사항 게시판</div>
      </div>
      <div className={styles.innercontainer}>
        <div className={styles.maintitle}>{suggest.Title}</div>
        <div className={styles.dateinfo}>
        <span id={styles.date}>{suggest.createdAt}</span>
          <span id={styles.writer}>작성자: {suggest.Author}</span>
          <span id={styles.viewCount}>조회수: {suggest.View}</span>
        </div>
        {/* <div className={styles.bodycontent}>
          <div className={styles.contenttitle}>제목</div>
          <div className={styles.contentcontent}>{suggest.Title}</div>
        </div> */}
        <div className={styles.bodycontent}>
          {/* <div className={styles.contenttitle}>내용</div> */}
          <div className={styles.contentcontent}>{suggest.Contents}</div>
        </div>

        {suggest.Comments && (
          <div id={styles.answercontainer}>
            <div id={styles.titlesection}>
              <div id={styles.answertitle}>관리자 답변:</div>
              <div id={styles.answerbtnmanager}>
                <div id={styles.answerdate}>{suggest.updatedAt}</div>
                {isAdmin === 'true' && (
                  <div><button id={styles.del} onClick={handleAnswerDelete}>삭제</button></div>
                )}
              </div>
            </div>
            <div id={styles.answer} className={styles.contentcontent}>
              {suggest.Comments}
            </div>
          </div>
        )}

        {isAdmin === 'true' && (
          <div id={styles.managerarea}>
            <div className={styles.buttonarea} id={styles.answerbtn}>
            {values.map((v, idx) => (
              <Button id={styles.buttonId} key={idx} className="me-2 mb-2" onClick={() => handleShow(v)}>
                {suggest.Comments ? (
                  '수정하기'
                ) : (
                  '답변하기'
                )}
                {typeof v === 'string' && `below ${v.split('-')[0]}`}
              </Button>
              ))}
            </div>
          </div>
        )}

        <Modal show={show} fullscreen={fullscreen} onHide={() => setShow(false)}>
          <Modal.Header closeButton>
            <Modal.Title>관리자 답변</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <textarea
            name="Comments"
            id={styles.Etc}
            className={styles.formtextarea}
            cols="30"
            rows="10"
            placeholder="답변을 입력해 주세요"
            value={formData.Comments}
            onChange={handleChange}
          ></textarea>
          </Modal.Body>
          <div className={styles.buttonarea}>
            <button className={styles.button} onClick={handleSubmit}>입력</button>
          </div>
        </Modal>

        <div className={styles.buttonarea1}>
          <button className={styles.button} onClick={() => navigate('/board/suggest')}>목록</button>
        </div>
        {(nickname === suggest.Author || isAdmin == 'true') ?(
          <div className={styles.buttonarea2}>
            <button className={styles.button} onClick={() => navigate(`/board/suggest/edit/${no}`)}>수정하기</button>
            <button className={styles.button} onClick={handleDelete}>삭제하기</button>
          </div>
        ):(
        <>
        </>)}
      </div>
    </div>
  );
}

export default SuggestDetail;