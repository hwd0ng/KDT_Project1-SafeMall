import React, { useState, useContext, useEffect } from 'react';
import ReportService from '../../../service/report';
import { useNavigate } from 'react-router-dom';
import styles from "./reportForm.module.css";
import { AuthContext } from '../../../context/authContext';
import { useParams } from 'react-router-dom';

function ReportEditForm() {
  const navigate = useNavigate();
  const { isLoggedIn, nickname } = useContext(AuthContext);
  const { no } = useParams();
  const [formData, setFormData] = useState({
    Title: '',
    Author: '',
    shopName: '',
    domainName: '',
    company: '',
    Other: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchReportDetail = async () => {
        try {
          const reportService = new ReportService();
          const fetchedData = await reportService.getReportDetail(no);
          setFormData(fetchedData);
          
        } catch (error) {
          console.error('Error fetching Report list:', error);
        }
    }
    fetchReportDetail()
  }, []);

  useEffect(() => {
    setFormData(prevState => ({
      ...prevState,
      Author: nickname // nickname으로 Writer 필드 업데이트
    }));
  }, [nickname]);
  
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
      await reportService.editReport(formData, no);
      // 제출 성공 시 사용자에게 알림 또는 리다이렉션 등 추가 작업 수행
      alert('수정되었습니다.');
      navigate(`/board/report/${no}`);
    } catch (error) {
      console.error('Error submitting report:', error);
      // 오류 처리 로직 추가 가능
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formheader}>
        <div>제보하기</div>
      </div>
      <div className={styles.formbody}>
        <div className={styles.bodycontainer}>
          <label htmlFor="Title" className={styles.formlabel}>제목
            <span className={styles.required}>(필수)</span>
          </label>
          <input
            type="text"
            id={styles.Title}
            name="Title"
            className={styles.forminput}
            placeholder="제목을 입력해 주세요"
            value={formData.Title}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.bodycontainer}>
          <label htmlFor="shopName" className={styles.formlabel}>쇼핑몰 명</label>
          <input
            type="text"
            id={styles.ShopName}
            name="shopName"
            className={styles.forminput}
            placeholder="쇼핑몰 명을 입력해 주세요"
            value={formData.shopName}
            onChange={handleChange}
          />
        </div>
        <div className={styles.bodycontainer}>
          <label htmlFor="domainName" className={styles.formlabel}>도메인 주소
            <span className={styles.required}>(필수)</span>
          </label>
          <input
            type="text"
            id={styles.Domain}
            name="domainName"
            className={styles.forminput}
            placeholder="도메인 주소를 입력해 주세요"
            value={formData.domainName}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.bodycontainer}>
          <label htmlFor="company" className={styles.formlabel}>사업자 명</label>
          <input
            type="text"
            id={styles.Owner}
            name="company"
            className={styles.forminput}
            placeholder="사업자 명을 입력해 주세요"
            value={formData.company}
            onChange={handleChange}
          />
        </div>
        <div className={styles.bodycontainer}>
          <label htmlFor="Other" className={styles.formlabel}>기타사항</label>
          <textarea
            name="Other"
            id={styles.Etc}
            className={styles.forminput}
            cols="30"
            rows="10"
            placeholder="기타 사항을 입력해 주세요"
            value={formData.Other}
            onChange={handleChange}
          ></textarea>
        </div>
      </div>
      <div className={styles.formactions}>
        <button type="submit" className={styles.formbutton}>수정 완료</button>
      </div>
    </form>
  );
}

export default ReportEditForm;
