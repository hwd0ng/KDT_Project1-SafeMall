import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import Navbar from "./components/navbar.jsx";
import Footer from './components/footer.jsx';
import { AuthProvider } from './context/authContext.js';
import TokenStorage from './db/token.js';
import AuthService from './service/authService.js';

const tokenStorage = new TokenStorage();
const authService = new AuthService(tokenStorage);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <AuthProvider authService={authService}>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
        integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
        crossOrigin="anonymous"
      />
      <Navbar />
      <App />
      <Footer />
    </AuthProvider>
  </BrowserRouter>
);

