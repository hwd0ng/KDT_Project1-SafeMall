import axios from 'axios';
import fs from 'fs';

// ========================== 쇼핑몰 리스트 처리 ==========================

// 한글 판단 함수
function isKorean(text) {
  return /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(text);
}

// 데이터 변환 함수
function shopList_transformData(row, no) {
  let shopNameKor = '';
  let shopNameEng = '';

  // SHOP_NAME이 '/'로 구분된 경우
  if (row.SHOP_NAME.includes('/')) {
    const [part1, part2] = row.SHOP_NAME.split('/');
    if (isKorean(part1)) {
      shopNameKor = part1.trim();
      shopNameEng = part2.trim();
    } else {
      shopNameKor = part2.trim();
      shopNameEng = part1.trim();
    }
  } else {
    // 구분자가 없는 경우, 한글이면 shopNameKor에 할당
    if (isKorean(row.SHOP_NAME)) {
      shopNameKor = row.SHOP_NAME.trim();
    } else {
      shopNameEng = row.SHOP_NAME.trim();
    }
  }
  // mainItems 공백 제거
  let mainItems = row.SERVICE.split('/');
  mainItems = mainItems.map(v => v.trim());

  // detailPayment 첫번째 배열 공백 제거
  let detailPayment = row.GYULJE.split(' ');
  if (detailPayment[0] == '') detailPayment = detailPayment.slice(1);

  // detailInitScreen 첫번째 배열 공백 제거
  let detailInitScreen = row.CHOGI.split(' ');
  if (detailInitScreen[0] == '') detailInitScreen = detailInitScreen.slice(1);

  // domainName 정규식 처리
  // replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0]
  let domainName
  domainName = row.DOMAIN_NAME.replace(/^(https?:\/\/)?(www\.)?/, '')
  // businessType 전처리
  // replace(/^\s+|\s+$/g, '' );
  let businessType
  businessType = row.YPFORM.replace(/^\s+|\s+$/g, '' );

  return {
    no: no, // 순번
    company: row.COMPANY,
    shopNameKor: shopNameKor,
    shopNameEng: shopNameEng,
    domainName: domainName,
    tel: row.TEL,
    email: row.EMAIL,
    mailOrderNum: row.UPJONG_NBR,
    dateInit: new Date(row.FIRST_HEO_DATE),
    comAddress: row.COM_ADDR,
    businessType: businessType,
    mainItems: mainItems,
    businessState: row.STAT_NM,
    scoreTotal: parseInt(row.TOT_RATINGPOINT),
    scoreBusinessInfo: parseInt(row.CHOGI_RATINGPOINT),
    scoreSW: parseInt(row.CHUNG_RATINGPOINT),
    scorePayment: parseInt(row.DEAL_RATINGPOINT),
    scoreTermUse: parseInt(row.PYOJUN_RATINGPOINT),
    scorePIS: parseInt(row.SECURITY_RATINGPOINT),
    dateMonitoring: new Date(row.REG_DATE),
    dateSiteOpen: new Date(row.KAESOL_YEAR),
    possibleSW: row.CHUNG,
    detailPayment: detailPayment,
    detailTermUse: row.PYOJUN,
    detailPIS: row.P_INFO_CARE,
    detailStandardTerm: row.PER_INFO,
    detailSecurity: row.SSL_YN,
    detailWithdrawal: row.LEAVE,
    detailMark: row.INJEUNG,
    PSS: row.DEAL_CARE,
    detailDeliveryDate: row.BAESONG_YEJEONG,
    detailShippingCost: row.BAESONG,
    detailReportBoard: row.CLIENT_BBS,
    detailInitScreen: detailInitScreen
  };
}

export async function getAPIData_shopsList(apiKey, shopName = '', filePath = 'data/apidata/shopsList.json') {
  const SERVICE = 'ServiceInternetShopInfo';
  const TYPE = 'json';
  const BASE_URL = `http://openAPI.seoul.go.kr:8088/${apiKey}/${TYPE}/${SERVICE}`;
  const MAX_RESULTS = 1000;

  let startIndex = 1;
  let endIndex = MAX_RESULTS;
  let listTotalCount = 0;
  const tempFilePath = 'data/tempApiData.json';

  fs.writeFileSync(tempFilePath, '[');

  try {
    // 처음 호출하여 전체 데이터 양을 가져옴
    const initialResponse = await axios.get(`${BASE_URL}/${startIndex}/${endIndex}`, { timeout: 300000 });
    listTotalCount = initialResponse.data.ServiceInternetShopInfo.list_total_count;
    console.log(`전체 데이터: ${listTotalCount}`);

    let remainingItems = listTotalCount;

    // 데이터를 받아오는 로직
    while (startIndex <= listTotalCount) {
      endIndex = Math.min(startIndex + MAX_RESULTS - 1, listTotalCount); // endIndex를 listTotalCount로 제한
      
      const response = await axios.get(`${BASE_URL}/${startIndex}/${endIndex}/${shopName}`, { timeout: 300000 });
      const data = response.data.ServiceInternetShopInfo.row;

      // 각 배치의 데이터 처리
      const transformedData = data.map((row, index) => shopList_transformData(row, remainingItems - index));
      const jsonData = JSON.stringify(transformedData, null, 2).slice(1, -1); // 배열의 대괄호를 제거하고 추가

      if (startIndex > 1) {
        fs.appendFileSync(tempFilePath, ',');
      }
      fs.appendFileSync(tempFilePath, jsonData);

      console.log(`Fetched ${data.length} records, total fetched: ${listTotalCount - remainingItems + data.length} / ${listTotalCount}`);

      // 인덱스 업데이트 및 남은 아이템 수 감소
      startIndex += MAX_RESULTS;
      remainingItems -= data.length;
    }

    fs.appendFileSync(tempFilePath, ']');

    // 임시 파일에서 데이터를 읽고 정렬하여 최종 파일에 저장
    const rawData = fs.readFileSync(tempFilePath);
    const allData = JSON.parse(rawData);
    allData.sort((a, b) => a.no - b.no); // no 순으로 정렬

    fs.writeFileSync(filePath, JSON.stringify(allData, null, 2));

    // 임시 파일 삭제
    fs.unlinkSync(tempFilePath);

    console.log('All data fetched and saved successfully');
    return true;
  } catch (error) {
    console.error('Error fetching data:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Request data:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    fs.appendFileSync(tempFilePath, ']'); // 에러 발생 시에도 JSON 파일 닫기
    return false;
  }
}


// ========================== 피해다발 쇼핑몰 리스트 처리 ==========================

function ComplaintsList_transformData(row, no) {
  // 쉼표 제거 후 숫자로 변환
  const [totalInquiries, unresolvedInquiries] = row.TOT_ACPT_CNT.split('/').map(v => Number(v.replace(/,/g, '')));

  let items = row.HDLG_ITM.split(',');
  items = items.map(v => v.trim());

  /*
  Type	Name	
  Int	no	순번
  Int	Year	년도
  Int	YearNum	연번
  String	shopName	쇼핑몰명
  String	MainItems	취급품목
  Int	Totalreport	총접수건
  Int	Unprocess	미처리건
  */
  return {
    no: no,
    Year: parseInt(row.SIGN_YEAR),
    YearNum: parseInt(row.HARM_BUSN_INH_NBR),
    shopName: row.SHP_MALL_NM.trim(),
    MainItems: items,
    Totalreport: totalInquiries,
    Unprocess: unresolvedInquiries,
  };
}

export async function getAPIData_ComplaintsList(apiKey, signYear = '', filePath = 'data/apidata/shopsComplaintsList.json') {
  const SERVICE = 'vHarmBusn';
  const TYPE = 'json';
  const BASE_URL = `http://openAPI.seoul.go.kr:8088/${apiKey}/${TYPE}/${SERVICE}`;
  const MAX_RESULTS = 1000;

  let startIndex = 1;
  let endIndex = MAX_RESULTS;
  let listTotalCount = 0;
  const tempFilePath = 'data/tempShopComplaintsData.json';

  fs.writeFileSync(tempFilePath, '[');

  try {
    // 처음 호출하여 전체 데이터 양을 가져옴
    const initialResponse = await axios.get(`${BASE_URL}/${startIndex}/${endIndex}`, { timeout: 300000 });
    listTotalCount = initialResponse.data.vHarmBusn.list_total_count;
    console.log(`전체 데이터: ${listTotalCount}`);

    let remainingItems = listTotalCount;

    // 데이터를 받아오는 로직
    while (startIndex <= listTotalCount) {
      endIndex = Math.min(startIndex + MAX_RESULTS - 1, listTotalCount); // endIndex를 listTotalCount로 제한

      const response = await axios.get(`${BASE_URL}/${startIndex}/${endIndex}/${signYear}`, { timeout: 300000 });
      const data = response.data.vHarmBusn.row;

      // 각 배치의 데이터 처리
      const transformedData = data.map((row, index) => ComplaintsList_transformData(row, remainingItems - index));
      const jsonData = JSON.stringify(transformedData, null, 2).slice(1, -1); // 배열의 대괄호를 제거하고 추가

      if (startIndex > 1) {
        fs.appendFileSync(tempFilePath, ',');
      }
      fs.appendFileSync(tempFilePath, jsonData);

      console.log(`Fetched ${data.length} records, total fetched: ${listTotalCount - remainingItems + data.length} / ${listTotalCount}`);

      // 인덱스 업데이트 및 남은 아이템 수 감소
      startIndex += MAX_RESULTS;
      remainingItems -= data.length;
    }

    fs.appendFileSync(tempFilePath, ']');

    // 임시 파일에서 데이터를 읽고 정렬하여 최종 파일에 저장
    const rawData = fs.readFileSync(tempFilePath);
    const allData = JSON.parse(rawData);
    allData.sort((a, b) => a.no - b.no); // no 순으로 정렬

    fs.writeFileSync(filePath, JSON.stringify(allData, null, 2));

    // 임시 파일 삭제
    fs.unlinkSync(tempFilePath);

    console.log('All data fetched and saved successfully');
    return true;
  } catch (error) {
    console.error('Error fetching data:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Request data:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    fs.appendFileSync(tempFilePath, ']'); // 에러 발생 시에도 JSON 파일 닫기
    return false;
  }
}