class MainService{
    constructor() {
        // HTTP 클라이언트 설정 및 기본 URL 설정
        // this.baseUrl = 'http://localhost:8080';
        this.baseUrl = process.env.REACT_APP_BASEURL;
        this.headers = {
          'Content-Type': 'application/json',
          // 필요에 따라 인증 헤더나 기타 헤더 추가 가능
        };
      }

      //위해 사이트 불러오기
      async getWarnList(count) {
        console.log(this.baseUrl)
        // DB에서 가져올 데이터의 limit값을 정해주기 위한 count
        // 더보기 버튼을 누를때마다 limit에 3을 더해 한번에 불러오는 데이터 갯수를 정해준다
        const queryParams = `?count=${count}`;
        const response = await fetch(`${this.baseUrl}${queryParams}`, {
          method: 'GET',
          headers: this.headers,
        });
        const responseData = await response.json();
        const data = responseData.data; // 실제 데이터는 response.data에 있음
      
        console.log(responseData.message); 
        return data;
      }

      // 검색어 입력
      async getSearchResult(keyword) {
        console.log('keyword: ', keyword)
        console.log(typeof(keyword))
        keyword = keyword.trim();
        
        // urlPattern인지 확인하는 함수이다. 한글 및 urlPattern이 아니면 false를 반환
        const isDomain = (input) => {
          console.log('URL 검사기 실행')
          const urlPattern = /^(https?:\/\/(www\.)?|www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/i;
          return urlPattern.test(input);
        };
        const iskey = isDomain(keyword) //검사 실행
        console.log(iskey)
        let encodedKeyword = '';
        let type = '';

        if(iskey){ // 도메인일 경우
          const url = keyword;
          let mainDomain = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n]+)/im)[1];
          mainDomain = mainDomain.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0]
          console.log('MainDomain: ',mainDomain)
          encodedKeyword = btoa(mainDomain);
          type = 'domainName'
        }else{
          // 검색어와 타입을 정해줌
          encodedKeyword = keyword;
          type = 'shopName'
        }
        console.log('encodedKeyword: ', encodedKeyword);
        // backend에서 req.query로 keyword와 type을 가져올 수 있게 쿼리로 보네준다
        const queryParams = `?keyword=${encodedKeyword}&type=${type}`;
        const response = await fetch(`${this.baseUrl}search${queryParams}`, {
          method: 'GET',
          headers: this.headers,
        });
        const responseData = await response.json();
        const data = responseData.result; // 실제 데이터는 response.data에 있음
        console.log(data.result)
        // console.log(data); 
        return data;
      }
      
      //검색결과 상세페이지, 쇼핑몰 리스트의 id값으로 가져옴
      async getSearchResultDetail(id, type) {
        const response = await fetch(`${this.baseUrl}search/${id}?type=${type}`, {
          method: 'GET',
          headers: this.headers,
        });
        const responseData = await response.json();


        const data = responseData.data; // 실제 데이터는 response.data에 있음
      
        data.scoreTotal = Math.round((data.scoreBusinessInfo+data.scorePIS+data.scorePayment+data.scoreSW+data.scoreTermUse)/15*10)
        console.log('data.scoreTotal: ', data.scoreTotal); 
        return data;
      }
}

export default MainService;