import * as boardData from '../data/boardData.js'
import * as userData from '../data/userData.js'

// 공지사항 목록
export async function getNoticeList(req, res){
  try {
    const lastNo = parseInt(req.query.lastNo) || 0;  // query에서 lastNo 파싱 없으면 0
    const data = await boardData.getboardList('Notice', lastNo);
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ message: 'No notices found' });
    }
  } catch (e) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// 공지사항 상세
export async function getNoticeDetail(req, res){
  try {
    const data = await boardData.getBypostId('Notice', req.params.no);
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ message: 'Notice not found' });
    }
  } catch (e) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// 예방법 목록
export async function getPreventList(req, res){
  try {
    const lastNo = parseInt(req.query.lastNo) || 0;
    const data = await boardData.getboardList('Prevent', lastNo);
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ message: 'No preventions found' });
    }
  } catch (e) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// 예방법 상세
export async function getPreventDetail(req, res){
  try {
    const data = await boardData.getBypostId('Prevent', req.params.no);
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ message: 'Prevention not found' });
    }
  } catch (e) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// 건의사항 목록
export async function getSuggestList(req, res){
  try {
    const lastNo = parseInt(req.query.lastNo) || 0;
    const data = await boardData.getboardList('Suggest', lastNo);
    if (data) {
      res.status(200).json({message:"ok",data});
    } else {
      res.status(404).json({ message: 'No suggestions found' });
    }
  } catch (e) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// 건의사항 작성
export async function createSuggest(req, res){
  try {
    // jwt 토큰에서 nickname 값을 추출
    const nickname = req.user
    req.body.Author = nickname
    // boardData.Create 로직 실행
    const postNo = await boardData.Create('Suggest', req.body);
    // userData.editUser 로직 실행 => contents_id 배열에 {게시판, 글번호} 추가
    const user = await userData.getByNickName(nickname);
    console.log(`user:${user}`)
    user.contentsId.push({boardType:'Suggest',postNo:postNo})
    console.log(user.contentsId)
    const updatedUser = {
      contentsId: user.contentsId
    };
    const result = await userData.editUser(nickname, updatedUser)
    console.log(result)
    if(!result)
      throw new Error;
    res.status(201).redirect(`/board/suggest/${postNo}`);
  } catch (e) {
    res.status(500).json({ message: 'Internal Server Error',e });
  }
};

// 건의사항 상세
export async function getSuggestDetail(req, res){
  try {
    if(!req.params.no)
      res.status(304).json({message:"Post Number plz"})
    const data = await boardData.getBypostId('Suggest', req.params.no);
    if (data) {
      const date = data.createdAt ? data.createdAt.toISOString().split('T')[0] : '';
      const update = data.updatedAt ? data.updatedAt.toISOString().split('T')[0] : '';
      res.status(200).json({data: { ...data.toObject(), createdAt: date ,updatedAt: update }});
    } else {
      res.status(404).json({ message: 'Suggestion not found' });
    }
  } catch (e) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// 건의사항 수정
export async function editSuggest(req, res){
  try {
    const result = await boardData.Edit('Suggest', req.params.no, req.body);
    if (result.nModified > 0) {
      res.status(200).redirect(`/board/suggest/${result.no}`);
    } else {
      res.status(404).json({ message: 'Suggestion not found' });
    }
  } catch (e) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// 건의사항 삭제
export async function deleteSuggest(req, res){
  try {
    const postNo = req.params.no;
    console.log('제보삭제 시작')
    const post = await boardData.getBypostId('Suggest', postNo);
    const user = await userData.getByNickName(post.Author);
    const updatedContentsId = user.contentsId.filter(
      content =>!(content.boardType == 'Suggest' && content.postNo == postNo)
    );
    const updatedUser = {
      contentsId: updatedContentsId
    };
    const updated = await userData.editUser(post.Author, updatedUser);
    console.log(updated)
    if(!updated){
      console.log('에러처리', updated)
      throw new Error
    }
    const result = await boardData.Deletepost('Suggest', postNo);
    if (!result){
      res.status(404).json({ message: 'Report not found' });
    }
    res.redirect(303,`/board/Suggest`);
  } catch (e) {
    console.log('에러발생 : ',e)
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// 제보 목록
export async function getReportList(req, res){
  try {
    const lastNo = parseInt(req.query.lastNo) || 0;
    const data = await boardData.getboardList('Report', lastNo);
    if (data) {
      const formattedData = data.map(report => {
        const date = report.createdAt.toISOString().split('T')[0];
        return { ...report.toObject(), createdAt: date };
      });
      res.status(200).json({data:formattedData});
    } else {
      res.status(404).json({ message: 'No reports found' });
    }
  } catch (e) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// 제보 작성
export async function createReport(req, res){
  try {
    const nickname = req.user
    req.body.Author = nickname
    const postNo = await boardData.Create('Report', req.body); 
    //user 부분
    const user = await userData.getByNickName(nickname);
    console.log(`user:${user}`)
    user.contentsId.push({boardType:'Report',postNo:postNo})
    console.log(user.contentsId)
    const updatedUser = {
      contentsId: user.contentsId
    };
    const result = await userData.editUser(nickname, updatedUser)
    console.log(result)
    if(!result)
      throw new Error;
    res.redirect(303, `/board/report/${postNo}`);
  } catch (e) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// 제보 상세
export async function getReportDetail(req, res){
  try {
    const data = await boardData.getBypostId('Report', req.params.no);
    if (data) {
      const date = data.createdAt ? data.createdAt.toISOString().split('T')[0] : '';
      const update = data.updatedAt ? data.updatedAt.toISOString().split('T')[0] : '';
      res.status(200).json({data: { ...data.toObject(), createdAt: date ,updatedAt: update }});
    } else {
      res.status(404).json({ message: 'Report not found' });
    }
  } catch (e) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// 제보 수정
export async function editReport(req, res){
  try {
    const result = await boardData.Edit('Report', req.params.no, req.body);
    if (result.nModified > 0) {
      // res.status(200).redirect(`/board/report/${result.no}`);
      res.redirect(303, `/board/report/${result.no}`);
    } else {
      res.status(404).json({ message: 'Report not found' });
    }
  } catch (e) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// 제보 삭제
export async function deleteReport(req, res){
  try {
    const postNo = req.params.no;
    console.log('제보삭제 시작')
    const post = await boardData.getBypostId('Report', postNo);
    const user = await userData.getByNickName(post.Author);
    const updatedContentsId = user.contentsId.filter(
      content =>!(content.boardType == 'Report' && content.postNo == postNo)
    );
    const updatedUser = {
      contentsId: updatedContentsId
    };
    const updated = await userData.editUser(post.Author, updatedUser);
    console.log(updated)
    if(!updated){
      console.log('에러처리', updated)
      throw new Error
    }
    const result = await boardData.Deletepost('Report', postNo);
    if (!result){
      res.status(404).json({ message: 'Report not found' });
    }
    res.redirect(303,`/board/report`);
  } catch (e) {
    console.log('에러발생 : ',e)
    res.status(500).json({ message: 'Internal Server Error' });
  }
};