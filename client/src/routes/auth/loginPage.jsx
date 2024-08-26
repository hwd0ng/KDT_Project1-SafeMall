import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import { Button } from 'react-bootstrap'; // 부트스트랩 컴포넌트 임포트
import 'bootstrap/dist/css/bootstrap.min.css'; // 부트스트랩 CSS 파일 임포트
import styles from "./loginPage.module.css";
import Login from '../../components/signin'
import SignUp from '../../components/signup';

function App() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1); // 'login' 또는 'signup'
  const { isLoggedIn } = useContext(AuthContext); // 로그인 상태 가져오기
  const state = useParams();
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
    setCurrentPage(state.state)
  }, [isLoggedIn, navigate]);

  return (
    <div className="App">
      <header className={styles.Appheader}>
          {/* 조건부 렌더링을 사용하여 현재 페이지에 맞는 컴포넌트를 보여줍니다. */}
          {currentPage == 1 ? <Login /> : <SignUp />}
      </header>
    </div>
  );
}

export default App;
