import React, { useState, useContext, useEffect } from 'react';
import styles from "./signup.module.css";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';

function SignUp() {
    const navigate = useNavigate();
    const { isLoggedIn, signUp } = useContext(AuthContext); // 로그인 함수 사용
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        nickname: ''
    });

    useEffect(() => { //로그인되어 있으면(isLoggedIn이 true일 때) 메인 페이지(/)로 자동으로 리다이렉트
        if (isLoggedIn) {
            navigate('/');
        }
    }, [isLoggedIn, navigate]);

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
            await signUp(formData); 
            // navigate('/');
        } catch (error) {
            console.error('Error submitting report:', error);
        }
    };

    return (
        <main>
            <div className={styles.main}>
                <h1>회원가입</h1>
            </div>
            <form onSubmit={handleSubmit}>
                <div className={styles.testLogin}>
                    <label htmlFor="email" className={styles.formlabel}>이메일: </label>
                    <input
                        type="email"
                        name="email"
                        className={styles.forminput}
                        placeholder="이메일을 입력해 주세요"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        autoComplete="email"
                    />
                    <label htmlFor="password" className={styles.formlabel}>비밀번호: </label>
                    <input
                        type="password"
                        name="password"
                        className={styles.forminput}
                        placeholder="비밀번호를 입력해 주세요"
                        value={formData.password}
                        onChange={handleChange}
                        autoComplete="current-password"
                        required
                    />
                    <label htmlFor="nickname" className={styles.formlabel}>닉네임: </label>
                    <input
                        type="text"
                        name="nickname"
                        className={styles.forminput}
                        placeholder="닉네임을 입력해 주세요"
                        value={formData.nickname}
                        onChange={handleChange}
                        required
                    />
                    <div className={styles.NewRegist}>
                        <button type="submit" className={styles.NewRegistbtn}>제출</button>
                    </div> 
                </div>
            </form>
        </main>
    );
}

export default SignUp;
