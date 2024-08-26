import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import styles from "./navbar.module.css";
import React, { useContext } from 'react';
import { AuthContext } from '../context/authContext';

function OffcanvasExample() {
  const { isLoggedIn, logout } = useContext(AuthContext);
  console.log('isLoggedIn:', isLoggedIn)
  return (
    <>
      {[false].map((expand) => (
        <Navbar key={expand} expand={expand} className="bg-body-tertiary mb-3" id={styles.navArea}>
          <Container fluid className={styles.Container}>
            <Navbar.Brand className={styles.navbarBrand} href="/">SafeMall</Navbar.Brand>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title className={styles.offcanvastitle} id={`offcanvasNavbarLabel-expand-${expand}`}>
                  SafeMall
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3" id={styles.navitem}>
                  <Nav.Link href="/">쇼핑몰 검색</Nav.Link>
                  {/* <Nav.Link href="/info">서비스 소개</Nav.Link> */}
                  <hr className="divider" />
                  {/* <Nav.Link href="/board/notice">공지사항</Nav.Link>
                  <Nav.Link href="/board/prevent">피해예방</Nav.Link>
                  <Nav.Link href="/board/coping">대처법</Nav.Link> */}
                  <Nav.Link href="/board/suggest">건의사항</Nav.Link>
                  <Nav.Link href="/board/report">제보</Nav.Link>
                </Nav>
                <Nav className={`justify-content-end flex-grow-1 pe-3`} id={styles.navitemB}>
                {isLoggedIn ? (
                    <>
                      <Nav.Link href="/auth/mypage" ><button>마이페이지</button></Nav.Link>
                      <button onClick={logout}>로그아웃</button>
                    </>
                  ) : (
                    <>
                      <Nav.Link href="/auth/login/1"><button>로그인</button></Nav.Link>
                      <Nav.Link href="/auth/login/0"><button>회원가입</button></Nav.Link>
                    </>
                  )}
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      ))}
    </>
  );
}

export default OffcanvasExample;