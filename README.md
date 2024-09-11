## 공공데이터를 활용한 사기의심 인터넷 쇼핑몰 조회 웹앱 제작 프로젝트

### **개요**

소셜 미디어를 통해 쇼핑을 하는 문화가 빠르게 성장하고 모바일 쇼핑을 통해 언제 어디서든 쇼핑이 가능한 시대이다.

동시에 이러한 점을 이용해 허위 정보 유포, 유령 사이트 등의 다양한 방법으로 사기 피해를 입는 소비자들도 늘어나고 있다.

'서울 열린데이터 광장'에서 제공하는 데이터를 활용하여 사기 의심 쇼핑몰 사이트 정보를 조회함으로써 소비자들의 피해를 예방할 수 있다.
<hr width="900"> 

### **활용 공공 데이터**

- [서울시 인터넷 쇼핑몰 현황](http://data.seoul.go.kr/dataList/OA-2256/S/1/datasetView.do)
- [서울시 인터넷 쇼핑몰 피해다발 업체 정보](http://data.seoul.go.kr/dataList/OA-21169/S/1/datasetView.do)
<hr width="900"> 

### **주요 기능**

- '상호명' 또는 'URL'주소로 쇼핑몰 검색
- 검색한 쇼핑몰에 대한 신뢰도 점수, 쇼핑몰 정보, 점수기준, 상세지표 확인
- 피해 다발 사이트로 등록되어 있는 쇼핑몰 리스트 확인
- 제보 게시판을 통해 사용자들이 직접 경험한 사기 의심 사이트의 최신 정보 확인
- 건의사항 게시판을 통해 해당 서비스에 대한 사용자들의 편의성 개선

<img width="800" alt="image" src="https://github.com/user-attachments/assets/3b3af749-af22-44db-b2a8-3144dde1c473">
<img width="800" alt="image" src="https://github.com/user-attachments/assets/7415a0d8-cfde-4afe-bb64-1df218d933e0">
<img width="800" alt="image" src="https://github.com/user-attachments/assets/10060457-2782-41e4-b2e3-c7db23d73be6">
<hr width="800"> 

### **사용 방법**

```bash
# 프로젝트 폴더 생성
git clone https://github.com/hwd0ng/KDT_Project1-SafeMall.git

# 백엔드 (MongoDB, MySQL 연결)
cd server 
npm i
npm start 또는 yarn start

# 프론트 엔드 (react)
cd ..  # 다시 프로젝트 루트 폴더로
cd client
npm i
npm start 또는 yarn start
```

### **활용 툴**

* **백엔드**
  - Node.js + Express
  
* **프론트엔드**
  - React

* **DataBase**
    - MongoDB (쇼핑몰 정보)
    - MySQL (회원가입 정보)
 
