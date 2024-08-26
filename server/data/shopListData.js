import mongoose from "mongoose"
import fs from "fs/promises";
import { useVirtualId } from "../db/database.js"

const shopSchema = new mongoose.Schema({
  no: { type: Number, required: true, unique: true }, // 순번
  company: { type: String, required: true, default: '' }, // 상호
  shopNameKor: { type: String, required: true, default: '' }, // 쇼핑몰명(국문)
  shopNameEng: { type: String, required: true, default: '' }, // 쇼핑몰명(영문)
  domainName: { type: String, required: true, default: '' }, // 도메인명
  tel: { type: String, required: true, default: '' }, // 전화번호
  email: { type: String, required: true, default: '' }, // 운영자이메일
  mailOrderNum: { type: String, required: true, default: '' }, // 통신판매번호
  dateInit: { type: Date, required: true, default: '' }, // 최초신고일자
  comAddress: { type: String, required: true, default: '' }, // 회사주소
  businessType: { type: String, required: true, default: '' }, // 영업형태
  mainItems: { type: [String], required: true, default: [] }, // 주요취급품목
  businessState: { type: String, required: true, default: '' }, // 업소상태
  scoreTotal: { type: Number, required: true, default: 0 }, // 전체평가
  scoreBusinessInfo: { type: Number, required: true, default: 0 }, // 사업자정보표시평가
  scoreSW: { type: Number, required: true, default: 0 }, // 청약철회평가
  scorePayment: { type: Number, required: true, default: 0 }, // 결제방법평가
  scoreTermUse: { type: Number, required: true, default: 0 }, // 이용약관평가
  scorePIS: { type: Number, required: true, default: 0 }, // 개인정보보안평가
  dateMonitoring: { type: Date, required: true}, // 모니터링날짜
  dateSiteOpen: { type: Date, required: true, default: '' }, // 사이트개설년도
  possibleSW: { type: String, required: true, default: '' }, // 청약철회가능여부
  detailPayment: { type: [String], required: true, default: [] }, // 결제방법
  detailTermUse: { type: String, required: true, default: '' }, // 이용약관 준수도
  detailPIS: { type: String, required: true, default: '' }, // 개인정보취급방침
  detailStandardTerm: { type: String, required: true, default: '' }, // 표준약관이상개인정보항목요구
  detailSecurity: { type: String, required: true, default: '' }, // 보안서버설치
  detailWithdrawal: { type: String, required: true, default: '' }, // 회원탈퇴방법
  detailMark: { type: String, required: true, default: '' }, // 인증마크
  PSS: { type: String, required: true, default: '' }, // 구매안전서비스
  detailDeliveryDate: { type: String, required: true, default: '' }, // 배송예정일표시
  detailShippingCost: { type: String, required: true, default: '' }, // 철회시배송비부담여부
  detailReportBoard: { type: String, required: true, default: '' }, // 고객불만게시판운영
  detailInitScreen: { type: [String], required: true, default: [] } // 초기화면필수항목중표시사항
}, { timestamps: true });

useVirtualId(shopSchema)
const Shop = mongoose.model('shopsList', shopSchema)

export async function updateDB() {
  try {
    // JSON 파일에서 데이터 읽기
    const data = await fs.readFile('data/apidata/shopsList.json', 'utf-8');
    const shops = JSON.parse(data);

    // 데이터 하나씩 MongoDB에 삽입
    for (const shop of shops) {
      try {
        await Shop.updateOne({ no: shop.no }, shop, { upsert: true });
        console.log(`Shop no ${shop.no} updated successfully.`);
      } catch (error) {
        console.error(`Error updating shop no ${shop.no}:`, error);
      }
    }
    console.log('All data has been updated to MongoDB.');
    return true;
  } catch (error) {
    console.error('Error reading JSON file or updating MongoDB:', error);
    return false;
  }
}

export async function getByShopName(keyword) {
  // return await Shop.find({ shopNameKor: { $regex: keyword } }).sort({ businessState: -1 });
  return await Shop.aggregate([
    { $match: { shopNameKor: { $regex: keyword } } }, // 필터링 조건
    {
      $addFields: {
        // businessState가 '영업중'인 경우 sortKey에 0을, 그렇지 않은 경우 1을 할당합니다.
        sortKey: { $cond: { if: { $eq: ['$businessState', '영업중'] }, then: 0, else: 1 } }
      }
    },
    { $sort: { sortKey: 1 } }, // sortKey를 기준으로 오름차순 정렬합니다. (0이 먼저 오도록)
    { $unset: 'sortKey' } // sortKey 필드를 삭제하여 반환될 문서에서 제거합니다.
  ]);
}

export async function getByDomainName(domain){
  console.log(domain)
  const data =  Shop.find({ domainName:domain})
  // console.log(data)
  return data
}

export async function getDetail(id) {
  return await Shop.findById(id)
}

export async function ShopList() {
  return await Shop.find().limit(10);
}