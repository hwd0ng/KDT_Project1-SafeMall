import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({authService, children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(undefined);
    const [isAdmin, setisAdmin] = useState(false);
    const [nickname, setNickname] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        // 페이지 로드 시 로컬 스토리지에서 토큰과 닉네임 가져오기
        const token = sessionStorage.getItem('token');
        const storedNickname = sessionStorage.getItem('NICKNAME');
        const storedAdmin = sessionStorage.getItem('ISADMIN');

        if (token && storedNickname) {
            // 로컬 스토리지에서 토큰과 닉네임이 있는 경우
            setIsLoggedIn(true);
            setNickname(storedNickname);
            setisAdmin(storedAdmin)
        } else {
            // 로컬 스토리지에 토큰이 없는 경우
            setIsLoggedIn(false);
            setNickname('');
        }
    }, [authService]);

    const signUp = async (data) => {
        try {
            const user = await authService.signup(data); //Promise를 반환하는 함수로 가정
            setIsLoggedIn(user); // 사용자 정보를 받아와서 로그인 상태를 설정
        } catch (error) {
            console.error('Error signing up:', error);
        }
    }

    const login = async (data) => {
        try {
            const user = await authService.login(data); //Promise를 반환하는 함수로 가정
            setIsLoggedIn(user); // 사용자 정보를 받아와서 로그인 상태를 설정
        } catch (error) {
            console.error('Error signing up:', error);
        }
    };

    const logout = () => {
        // 실제 로그아웃 로직
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('NICKNAME');
        sessionStorage.removeItem('ISADMIN');
        setIsLoggedIn(false);
        setNickname('');
        setisAdmin(false)
        navigate('/auth/login/1')
        window.location.reload();

    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout, nickname, isAdmin, signUp }}>
            {children}
        </AuthContext.Provider>
    );
};
