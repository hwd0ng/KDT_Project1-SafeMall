import React, { useState } from 'react';
import NoticeService from '../../../service/notice';
import { useNavigate } from 'react-router-dom';
import styles from "./noticeForm.module.css";

function NoticeForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Title: '',
    Contents: ''
  });
  
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
      const noticeService = new NoticeService();
      await noticeService.submitNotice(formData);
      // 제출 성공 시 사용자에게 알림 또는 리다이렉션 등 추가 작업 수행
      alert('제출되었습니다.');
      navigate('/notice');
    } catch (error) {
      console.error('Error submitting notice:', error);
      // 오류 처리 로직 추가 가능
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.formheader}>
        <div>공지사항</div>
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
        <label htmlFor="Contents" className={styles.formlabel}>
          내용
        </label>
        <textarea
          id={styles.Contents}
          name="Contents"
          className={styles.forminput}
          placeholder="내용을 입력해 주세요"
          value={formData.Contents}
          onChange={handleChange}
        />
      </div>
      <div>
          <strong>중요공지 여부 : </strong>
          <label>
            <input
              type="radio"
              name="HotTopic"
              value="true"
              checked={formData.HotTopic === true}
              onChange={handleChange}
            />
            선택
          </label>
          <label>
            <input
              type="radio"
              name="HotTopic"
              value="false"
              checked={formData.HotTopic === false}
              onChange={handleChange}
            />
            선택 안함
          </label>
        </div>

      </div>
      <div className={styles.formactions}>
        <button type="submit" className={styles.formbutton}>제출</button>
      </div>
    </form>
  );
}

export default NoticeForm;
