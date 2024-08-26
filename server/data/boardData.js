import mongoose from "mongoose";
import { useVirtualId, useLocalTimeStamps } from "../db/database.js"
import { where } from "sequelize";

// 공지사항 스키마
/*
Type	Name	
Int	no	순번
String	Title	공지사항 제목
Date	Date	공지사항 작성일
Int	View	조회수
String	Contents	공지사항 내용
Bool	HotTopic	중요공지여부
*/
const noticeSchema = new mongoose.Schema({
  no: { type: Number, required: true, unique: true }, // 순번
  Title: {type:String, required: true}, // 글 제목
  Author: {type:String, required: true}, // 작성자
  View: {type:Number, required: true, default:0}, // 조회수
  Contents: {type:String, required:true}, // 글 내용
  HotTopic: {type:Boolean, required:true, default:false} // 중요공지 여부 기본값은 false 0
}, { timestamps: true })
useVirtualId(noticeSchema)
useLocalTimeStamps(noticeSchema)
const Notice = mongoose.model('NoticeList', noticeSchema);

// 예방법 스키마
/*
Type	Name	
Int	no	순번
String	Title	예방법 제목
Date	Date	예방법 작성일
Int	View	조회수
String	Contents	예방법 내용
Bool	HotTopic	중요예방법 여부
*/
const preventSchema = new mongoose.Schema({
  no: { type: Number, required: true, unique: true }, // 순번
  Title: {type:String, required: true}, // 글 제목
  Author: {type:String, required: true}, // 작성자
  View: {type:Number, required: true, default:0}, // 조회수
  Contents: {type:String, required:true}, // 글 내용
  ImageURL: {type:[String], default:[]}, // 글 첨부 이미지
  HotTopic: {type:Boolean, required:true, default:0} // 중요예방법 여부 기본값은 false 0
}, { timestamps: true })
useVirtualId(preventSchema)
useLocalTimeStamps(preventSchema)
const Prevent = mongoose.model('PreventList', preventSchema);

// 건의사항 스키마
/*
Type	Name	
Int	no	순번
String	Title	제목
Date	Date	작성일
Int	View	조회수
String	Contents	내용
Bool	State	처리여부
String	Comments	답변
*/
const suggestSchema = new mongoose.Schema({
  no: { type: Number, required: true, unique: true }, // 순번
  Title: {type:String, required: true}, // 글제목
  Author: {type:String, required: true}, // 작성자
  View: {type:Number, required: true, default:0}, // 조회수
  Contents: {type:String, required:true}, // 글 내용
  State: {type:Number, required: true, default:0}, // 처리여부 기본값 0(미완료), 1(처리중), 2(완료)
  Comments: {type:String, default:''} // 답변
}, { timestamps: true })
useVirtualId(suggestSchema)
useLocalTimeStamps(suggestSchema);
const Suggest = mongoose.model('SuggestList', suggestSchema);

// 제보 스키마
/*
Type	Name	Optional
Int	no	
String	Title	제목
String	shopName  쇼핑몰명
String	domain	도메인명
String	company	사업자명 상호
String	companyNum	사업자등록번호
String	Other	기타사항
Date	Date	작성일
Int	View	조회수
Bool	State	처리여부
String	Comments	답변
*/
const reportSchema = new mongoose.Schema({
  no: { type: Number, required: true, unique: true }, // 순번
  Title: {type:String, required: true}, // 글제목
  Author: {type:String, required: true}, // 작성자
  shopName: {type:String, default:''}, // 쇼핑몰명
  domainName: {type:String, default:''}, // 도메인명
  company: {type:String, default:''}, // 사업자명(상호)
  companyNum: {type:String, default:''}, // 사업자등록번호
  Other: {type:String, default:''}, // 기타사항
  View: {type:Number, required: true, default:0}, // 조회수
  State: {type:Number, required: true, default:0}, // 처리여부 기본값 0(미완료), 1(처리중), 2(완료)
  Comments: {type:String, default: ''}, // 답변
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true })
useVirtualId(reportSchema)
useLocalTimeStamps(reportSchema)
const Report = mongoose.model('ReportList', reportSchema);

function isType(boardtype){
  if(boardtype == 'Notice') return Notice;
  else if(boardtype == 'Prevent') return Prevent;
  else if(boardtype == 'Suggest') return Suggest;
  else if(boardtype == 'Report') return Report;
  else return false;
}
// 글 제목 리스트
export async function getPostList(boardtype, postNo){
  try {
    console.log(`PostList 호출 ${boardtype} ${postNo}`);
    const model = isType(boardtype);
    
    // Use findOne instead of find to get a single document
    const post = await model.findOne({ no: postNo });
    
    if (!post) {
      console.log(`Post not found for boardtype: ${boardtype} and postNo: ${postNo}`);
      return false;
    }

    console.log(post);

    if(boardtype == 'Notice') boardtype = '공지사항'
    else if(boardtype == 'Prevent') boardtype = '예방법'
    else if(boardtype == 'Suggest') boardtype = '건의사항'
    else if(boardtype == 'Report') boardtype = '제보'
    else boardtype = '확인 불가'


    // Ensure the document has the properties you're trying to access
    const result = {
      boardtype,
      Title: post.Title,
      createdAt: post.createdAt
    };

    return result;
  } catch (e) {
    console.log('Error in getPostList: ', e);
    return false;
  }
}


// 글 목록
export async function getboardList(boardtype, lastNo) {
  try {
    const model = isType(boardtype);
    let query = {};
    // lastNo가 0일 경우, 가장 최신 게시글의 no를 할당
    if (lastNo === 0) {
      const latestPost = await model.findOne().sort({ no: -1 });
      if (latestPost) {
        lastNo = latestPost.no + 1;  // 현재 최신 게시글도 포함해야 하므로 +1
      } else {
        return [];  // 게시글이 하나도 없을 경우 빈 배열 반환
      }
    }
    // lastNo가 0이 아닌 경우, 해당 no보다 작은 게시글들을 조회
    query = { no: { $lt: lastNo } };
    return await model.find(query).sort({ no: -1 }).limit(5);
  } catch (e) {
    console.log('Error boardList: ', e);
    return false;
  }
}

// 글 상세
export async function getBypostId(boardtype, postNo){
  try{
    const post = await isType(boardtype).findOne({no:postNo});
    if (post) {
      post.View += 1; // 조회수 증가
      await post.save(); // 변경된 조회수 저장
    }
    return post;
  }catch(e){
    console.log('Error postDetail: ', e);
    return false;
  }
}

// 새로운 문서의 순번을 찾는 함수
async function getNextSequenceValue(boardtype) {
  const model = isType(boardtype);
  const lastDocument = await model.findOne().sort({ no: -1 });
  return lastDocument ? lastDocument.no + 1 : 1;
}

// 글 작성
export async function Create(boardtype, post){
  try{
    const no = await getNextSequenceValue(boardtype);
    post.no = no;
    console.log('post: ', post)
    const result = await new (isType(boardtype))(post).save();

    return result.no;
    // return new (isType(boardtype))(post).save().then((data)=>{
    //   console.log('글 작성 완료')
    //   return data.no;
    // });
  }catch(e){
    console.log('Error create: ', e);
    return false;
  }
}

// 글 수정 / 답변 수정 / 답변 삭제
export async function Edit(boardtype, post, data){
  console.log('post: ', post)
  try{
    return await isType(boardtype).updateOne({ no: post }, { $set: data });
  }catch(e){
    console.log('Error edit: ', e);
    return false;
  }
}

// 글 삭제
export async function Deletepost(boardtype, postNo){
  try{
    console.log(postNo)
    return await isType(boardtype).findOneAndDelete({no:postNo});
  }catch(e){
    console.log('Error Deletepost: ', e);
    return false;
  }
}

// 공지사항 목록
// 공지사항 상세
// 예방법 목록
// 예방법 상세
// 피해 대처법(리엑트에서 처리되는 로직)
// 건의사항 목록
// 건의사항 작성
// 건의사항 상세
// 건의사항 상세 수정
// 건의사항 상세 삭제
// 제보
// 제보 작성
// 제보 상세
// 제보 수정
// 제보 삭제
// boardController
//     게시글 목록 가져오기
//     게시글 상세 가져오기
//     게시글 수정 가져오기
//     게시글 삭제 가져오기