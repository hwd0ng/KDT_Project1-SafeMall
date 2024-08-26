import React, { useState, useContext, useEffect } from 'react';
// import ReportService from '../../../service/report';
import ReportService from '../../../service/report';
import { useNavigate } from 'react-router-dom';
import styles from "./reportForm.module.css";
import { AuthContext } from '../../../context/authContext';

function ReportForm() {
  const navigate = useNavigate();
  const { isLoggedIn, nickname } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    Title: '',
    shopName: '',
    domainName: '',
    company: '',
    Other: ''
  });

  // nickname이 변경될 때마다 formData 업데이트
  // useEffect(() => {
  //   setFormData(prevState => ({
  //     ...prevState,
  //     Author: nickname // nickname으로 Writer 필드 업데이트
  //   }));
  // }, [nickname]);

  useEffect(() => {
    console.log(isLoggedIn)
    if(isLoggedIn === false){
      alert('로그인 필요')
      navigate('/auth/login/1')
    }
  }, []);
  
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
      const response = await reportService.submitReport(formData);
      //제출 성공 시 사용자에게 알림 또는 리다이렉션 등 추가 작업 수행
      console.log(response)
      if(response.message == '인증에러'){
        navigate('/login');
      }else{
        alert('제보 작성 성공');
        navigate(`/board/report/${response.data.no}`);
      }

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
        <button type="submit" className={styles.formbutton}>제출</button>
      </div>
    </form>
  );
}

export default ReportForm;
