import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import ReportService from '../../../service/report';
import { useNavigate } from 'react-router-dom';
import styles from "./reportDetail.module.css";
import { AuthContext } from '../../../context/authContext';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function ReportDetail() {
  const navigate = useNavigate();
  const { isLoggedIn, nickname, isAdmin } = useContext(AuthContext);
  const [report, setReport] = useState([null]); 
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
    if(isLoggedIn === false){
      alert('로그인 필요')
      navigate('/auth/login/1')
    }
  }, []);

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const reportService = new ReportService();
      const response = await reportService.deleteReport(no);
      alert('삭제되었습니다.'); 
      navigate('/board/report'); 
    } catch (error) {
      console.error('Error submitting report:', error);
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
      const reportService = new ReportService();
      const response = await reportService.editReport(formData, no);
      console.log('handleSubmit-response:', response)
     if(response){
       alert('답변되었습니다.');
      //  navigate(`/board/report/${no}`);
       window.location.reload();
     }
    } catch (error) {
      console.error('Error submitting report:', error);
      // 오류 처리 로직 추가 가능
    }
  };

  const handleAnswerDelete = async (e) => {
    e.preventDefault();
    try {
      const reportService = new ReportService();
      const response = await reportService.editReport(forDelete, no);
      console.log('handleSubmit-response:', response)
     if(response){
       alert('삭제 되었습니다.');
       window.location.reload();
     }
    } catch (error) {
      console.error('Error submitting report:', error);
      // 오류 처리 로직 추가 가능
    }
  };
  
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchReportDetail = async () => {
      try {
        const reportService = new ReportService();
        console.log(`no: ${no}`)
        const fetchedData = await reportService.getReportDetail(no);
        console.log(fetchedData)
        setReport(fetchedData);
      } catch (error) {
        console.error('Error fetching Report list:', error);
      }
    };

    fetchReportDetail();
  }, []); 

  return (
    <div className={styles.container}>
      <div className={styles.reportheader}>
        <div>제보 게시판</div>
      </div>
      <div className={styles.innercontainer}>
        <div className={styles.maintitle}>{report.Title}</div>
        <div className={styles.dateinfo}>
          <span id={styles.date}>{report.createdAt}</span>
          <span id={styles.writer}>작성자: {report.Author}</span>
          <span id={styles.viewCount}>조회수: {report.View}</span>
        </div>
        <div className={styles.bodycontent}>
          <div className={styles.contenttitle}>쇼핑몰 명</div>
          <div className={styles.contentcontent}>{report.shopName}</div>
        </div>
        <div className={styles.bodycontent}>
          <div className={styles.contenttitle}>도메인 주소</div>
          <div className={styles.contentcontent}>{report.domainName}</div>
        </div>
        <div className={styles.bodycontent}>
          <div className={styles.contenttitle}>사업자 명</div>
          <div className={styles.contentcontent}>{report.company}</div>
        </div>
        <div className={styles.bodycontent}>
          <div className={styles.contenttitle}>기타사항</div>
          <div className={styles.contentcontent}>{report.Other}</div>
        </div>

        {report.Comments && (
          <div id={styles.answercontainer}>
            <div id={styles.titlesection}>
              <div id={styles.answertitle}>관리자 답변:</div>
              <div id={styles.answerbtnmanager}>
                <div id={styles.answerdate}>{report.updatedAt}</div>
                {isAdmin === 'true' && (
                  <div><button id={styles.del} onClick={handleAnswerDelete}>삭제</button></div>
                )}
              </div>
            </div>
            <div id={styles.answer} className={styles.contentcontent}>
              {report.Comments}
            </div>
          </div>
        )}

        {isAdmin === 'true' && (
          <div id={styles.managerarea}>
            <div className={styles.buttonarea} id={styles.answerbtn}>
            {values.map((v, idx) => (
              <Button id={styles.buttonId} key={idx} className="me-2 mb-2" onClick={() => handleShow(v)}>
                {report.Comments ? (
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

        <div className={styles.buttonarea}>
          <button className={styles.button} onClick={() => navigate('/board/report')}>목록</button>
        </div>
        {(nickname === report.Author || isAdmin == 'true') ?(
          <div className={styles.buttonarea2}>
            <button className={styles.button} onClick={() => navigate(`/board/report/edit/${no}`)}>수정하기</button>
            <button className={styles.button} onClick={handleDelete}>삭제하기</button>
          </div>
        ):(
        <>
        </>
        )}
      </div>
    </div>
  );
}

export default ReportDetail;

