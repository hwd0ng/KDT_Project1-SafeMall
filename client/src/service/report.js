import TokenStorage from '../db/token';

const tokenStorage = new TokenStorage();
class ReportService{
    constructor() {
        // HTTP 클라이언트 설정 및 기본 URL 설정
        this.baseUrl = process.env.REACT_APP_BASEURL;
        this.headers = {
          'Content-Type': 'application/json',
          // 필요에 따라 인증 헤더나 기타 헤더 추가 가능
        };
      }

      // 제보 게시판 리스트 불러오기
      async getReportList(lastNo) {
        console.log(lastNo)
        const queryParams = lastNo ? `?lastNo=${lastNo}` : '';
        const response = await fetch(`${this.baseUrl}board/report${queryParams}`, {
          method: 'GET',
          headers: this.headers,
        });
        const responseData = await response.json();
        const data = responseData.data; // 실제 데이터는 response.data에 있음
      
        console.log(responseData); // 데이터 확인
        return data;
      }

      // 제보 작성
      async submitReport(formData) {
        // HTTP 요청 전에 헤더에 토큰 추가
        tokenStorage.addTokenToHeaders(this.headers);
        try {
          const response = await fetch(`${this.baseUrl}board/report`, {
            method: 'post',
            headers: this.headers,
            body: JSON.stringify(formData)
          });
          const responseData = await response.json();
          return responseData;
        } catch (error) {
          console.error('Error creating report:', error);
        }
      }

      //제보 게시글 상세페이지
      async getReportDetail(no) {
        console.log(no)
        tokenStorage.addTokenToHeaders(this.headers);
        const response = await fetch(`${this.baseUrl}board/report/${no}`, {
          method: 'GET',
          headers: this.headers,
        });
        const responseData = await response.json();      
        console.log(responseData); // 데이터 확인
        return responseData.data;
      }

      // 제보게시글 삭제
      async deleteReport(no) {
        tokenStorage.addTokenToHeaders(this.headers);
        try {
            const response = await fetch(`${this.baseUrl}board/report/${no}`, {
                method: 'DELETE', // DELETE 메서드 사용
                headers: this.headers, // 필요한 헤더 추가
            });
        } catch (error) {
            console.error('Error deleting report:', error);
        }
    }

    // 제보게시글 수정
    async editReport(formData, no) {
      tokenStorage.addTokenToHeaders(this.headers);
      if (!formData.Comments) {
        formData.State = 0;
      }else if(formData.Comments){
        formData.State = 1;
      }
      try {
        const response = await fetch(`${this.baseUrl}board/report/${no}`, {
          method: 'PUT',
          headers: this.headers,
          body: JSON.stringify(formData)
        });
        console.log(response)
        return response
      } catch (error) {
        console.error('Error deleting report:', error);
      }
    }

};

export default ReportService;