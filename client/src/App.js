import './App.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import MainPage from './routes/mainPage';
import SearchResultList from './routes/searchResultList';
import SearchDetail from './routes/search';
import Info from './routes/info';

import LoginPage from './routes/auth/loginPage';
import MyPage from './routes/auth/mypage/myPage';


import NoticeList from './routes/board/notice/noticeList';
import NoticeForm from './routes/board/notice/noticeForm';
import NoticeDetail from './routes/board/notice/noticeDetail';

import PreventionList from './routes/board/prevent/PreventionList';
import PreventionForm from './routes/board/prevent/PreventionForm';
import PreventionDetail from './routes/board/prevent/PreventionDetail';

import SuggestList from './routes/board/suggest/suggestList';
import SuggestForm from './routes/board/suggest/suggestForm';
import SuggestDetail from './routes/board/suggest/suggestDetail';
import SuggestEditForm from './routes/board/suggest/suggestEditForm'

import ReportList from './routes/board/report/reportList';
import ReportForm from './routes/board/report/reportForm';
import ReportDetail from './routes/board/report/reportDetail';
import ReportEditForm from './routes/board/report/reportEditForm';

function App() {
  
  return (
    <Routes>
      <Route path="/" element={<MainPage/>}/>
      <Route path="/search/:id" element={<SearchDetail />} />
      <Route path="/search/result" element={<SearchResultList />} />
      {/* <Route path='/info' element={<Info />} /> */}
      
      <Route path='/board' >
        {/* <Route path="notice" element={<NoticeList />} />
        <Route path="notice/:no" element={<NoticeDetail />} />

        <Route path="prevent" element={<PreventionList />} />
        <Route path="prevent/:no" element={<PreventionDetail />} /> */}

        <Route path="suggest" element={<SuggestList />} />
        <Route path="suggest/create" element={<SuggestForm />} />
        <Route path="suggest/edit/:no" element={<SuggestEditForm/>} />
        <Route path="suggest/:no" element={<SuggestDetail />} />

        <Route path="report" element={<ReportList/>}/>
        <Route path="report/create" element={<ReportForm/>}/>
        <Route path="report/:no" element={<ReportDetail />} />
        <Route path="report/edit/:no" element={<ReportEditForm/>} />
      </Route>
      
      <Route path='/auth'>
        <Route path="login/:state" element={<LoginPage/>}/>
        <Route path='mypage' element={<MyPage />} />
      </Route>
    </Routes>
  );
}

export default App;
