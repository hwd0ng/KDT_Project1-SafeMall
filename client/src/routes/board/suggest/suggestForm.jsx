import React, { useState, useContext, useEffect } from 'react';
import SuggestService from '../../../service/suggest';
import { useNavigate } from 'react-router-dom';
import styles from './suggestForm.module.css';
import { AuthContext } from '../../../context/authContext';

function SuggestForm() {
  const navigate = useNavigate();
  const { isLoggedIn, nickname } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    Title: '',
    Contents: ''
  });
  
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
      const suggestService = new SuggestService();
      const response = await suggestService.submitSuggest(formData);
      // 제출 성공 시 사용자에게 알림 또는 리다이렉션 등 추가 작업 수행
      if(response.message == '인증에러'){
        navigate('/login');
      }else{
        alert('건의사항 작성 성공');
        navigate(`/board/suggest/${response.data.no}`);
      }

    } catch (error) {
      console.error('Error submitting report:', error);
      // 오류 처리 로직 추가 가능
    }
  };

  return (
    <>
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formheader}>
        <div>건의사항 작성</div>
      </div>
      <div className={styles.formbody}>
        <div className={styles.bodycontainer}>
          <label htmlFor="Title" className={styles.formlabel}>제목
            <span className={styles.required}>(필수)</span>
          </label>
          <input
            type="text"
            id="Title"
            name="Title"
            className={styles.forminput}
            placeholder="제목을 입력해 주세요"
            value={formData.Title}
            onChange={handleChange}
            required
          />
        </div>  
        <div className={styles.bodycontainer}>
          <label htmlFor="Content" className={styles.formlabel}>내용</label>
          <textarea
            type="text"
            id="Contents"
            name="Contents"
            className={styles.forminput2}
            placeholder="내용을 입력해 주세요"
            value={formData.Contents}
            onChange={handleChange}
          />
        </div>
        
      </div>
      <div className={styles.formactions}>
        <button type="submit" className={styles.formbutton}>제출</button>
      </div>
    </form>
    </>
  );
}

export default SuggestForm;