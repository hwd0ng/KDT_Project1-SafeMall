import TokenStorage from '../db/token';

const tokenStorage = new TokenStorage();

class MypageService{
    constructor() {
        this.baseUrl = process.env.REACT_APP_BASEURL;
        this.headers = {
          'Content-Type': 'application/json',
        };
      }
      // 마이페이지 리스트
      async getMypageList(){
        // const data = await fetch('/data/myPage.json');
        // const result = await data.json();
        // console.log(result);
        // return result;
        tokenStorage.addTokenToHeaders(this.headers)
        const response = await fetch(`${this.baseUrl}auth/mypage`,{
          method:'get',
          headers:this.headers
        });
        const responseData = await response.json();
        const user = responseData.data
        return user
      }
}
  
export default MypageService;