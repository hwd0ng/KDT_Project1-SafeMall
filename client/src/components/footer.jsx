import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import styles from "./navbar.module.css";
import React, { useContext } from 'react';
import { AuthContext } from '../context/authContext';

function Footer() {
  const { isLoggedIn, logout } = useContext(AuthContext);
  console.log('isLoggedIn:', isLoggedIn)
  return (
    <>
      {[false].map((expand) => (
        <Navbar key={expand} expand={expand} className="bg-body-tertiary mb-3" id={styles.navArea} style={{position: 'fixed', width:'768px', height:'auto', zIndex: 1000, bottom: 0 }}>
          <Container fluid className={styles.Container} id={styles.arrange}>
            <Navbar.Brand className={styles.navbarBrand} href="/">
              <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="white" className="bi bi-search" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
              </svg>
            </Navbar.Brand>
            <Navbar.Brand className={styles.navbarBrand} href="/">
              <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="white" className="bi bi-house" viewBox="0 0 16 16">
                <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z"/>
              </svg>
            </Navbar.Brand>
            <Navbar.Brand className={styles.navbarBrand} href="/auth/mypage">
              <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="white" className="bi bi-person" viewBox="0 0 16 16">
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
              </svg>
            </Navbar.Brand>
          </Container>
        </Navbar>
      ))}
    </>
  );
}

export default Footer;