import React from 'react';
import styles from "./info.module.css";
import { Link } from 'react-router-dom';

export default function Info() {
return (
    <div id={styles.container}>
      <div id={styles.title}>
        <h1>쇼핑몰 신뢰도 검색기</h1>
      </div>

      <div id={styles.top}>
        <p>
          SafeMall은 쇼핑 중 사기 사이트를 식별하는 데 도움을 주는 도구입니다. 
          쇼핑몰 공공데이터를 활용하여 구축한 데이터베이스를 기반으로, 
          우리의 앱은 사용자들이 쇼핑몰의 신뢰성을 검증할 수 있게 해줍니다. 
          안전한 온라인 쇼핑을 위해, SafeMall과 함께하세요!
        </p>
      </div>

      <div className={styles.middle}>
        <ul>
          <li>서울시 공공데이터 활용: 13만건의 서울시 온라인 쇼핑몰 데이터</li>
          <li>해외 쇼핑 피해 방지: 다양한 피싱 사이트 정보 수집</li>
          <li>피해 업체 경고: 다발 피해 업체 식별</li>
          <li>사용자 참여: 건의 시스템 및 자체 DB 구축</li>
          <li>통합 검색 기능: 쇼핑몰 명, 도메인 등 다양한 검색 가능</li>
        </ul>
      </div>

      <div className={styles.bottom}>
        <p className={styles.intro3_1}>피해 발생시 대처방안</p>
        <p className={styles.intro3_2}>피해 사실 정보를 바탕으로 소비자 지원</p>
        <Link href="#"> 바로가기 -`&gt;` </Link>
      </div>
    </div>
  );
}

