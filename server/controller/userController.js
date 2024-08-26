import * as bcrypt from 'bcrypt';
import { config } from "../config.js";
import jwt from 'jsonwebtoken';
import * as userData from '../data/userData.js';
import * as boardData from '../data/boardData.js';

const secretkey = config.jwt.secretKey;
// jwtExpiresInDays 변수를 jwtExpiresInSec로 변경하여 JWT의 만료 시간이 초 단위로 설정되도록 수정
const jwtExpiresInSec = config.jwt.expiresInSec;
const bcryptSaltRounds = config.bcrypt.saltRounds;

function createJwtToken(user) {
  return jwt.sign(user, secretkey, { expiresIn: jwtExpiresInSec }); // 초 단위로 만료 시간 설정
}

// 로그인
export async function Signin(req, res, next){
  const { email, password } = req.body;
  try {
    const user = await userData.getByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "이메일, 패스워드를 확인하세요" }); // 동일한 메시지 유지
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "이메일, 패스워드를 확인하세요" }); // 동일한 메시지 유지
    }
    const jwtToken = createJwtToken({ nickname: user.nickname, isAdmin: user.isAdmin });
    // console.log('user: ', user)
    res.status(201).json({ token: jwtToken, nickname: user.nickname, isAdmin: user.isAdmin });
  } catch (e) {
    console.error('Error during login:', e);
    next(e);
  }
}

// 회원가입
export async function SignUp(req, res, next) {
  const { email, password, nickname } = req.body;
  console.log(req.body)
  try {
    const existingEmail = await userData.getByEmail(email);
    if (existingEmail) {
      return res.status(409).json({ message: '이메일 중복' });
    }
    const existingNickname = await userData.getByNickName(nickname);
    if (existingNickname) {
      return res.status(409).json({ message: '닉네임 중복' });
    }
    const hashedPassword = await bcrypt.hash(password, bcryptSaltRounds);
    const newUser = {
      email,
      password: hashedPassword,
      nickname,
      contentsId: []
    };
    const createdUser = await userData.addUser(newUser);
    if (!createdUser) {
      throw new Error('User creation failed'); // 사용자 추가 실패 시 구체적인 에러 메시지 추가
    }
    const jwtToken = createJwtToken({ nickname: createdUser.nickname, isAdmin: createdUser.isAdmin });
    console.log(jwtToken)
    res.status(201).json({ token: jwtToken, nickname: createdUser.nickname, isAdmin: createdUser.isAdmin });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({message:"회원가입 실패",error})
    // next(error);
  }
}

// 회원정보
export async function Mypage(req, res, next) {
  const nickname = req.user; // req.jwtToken에서 req.user로 수정하여 사용자 정보 추출
  try {
    const user = await userData.getByNickName(nickname);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const postPromises = user.dataValues.contentsId.map(async (v) => {
      const post = await boardData.getPostList(v.boardType, v.postNo);
      return { ...v, boardTypeKor: post.boardtype, Title: post.Title, createdAt: post.createdAt ? post.createdAt.toISOString().split('T')[0] : '' };
    });

    const contentsId = await Promise.all(postPromises);
    console.log(contentsId);
    const data = {
      email: user.dataValues.email,
      nickname: user.dataValues.nickname,
      isAdmin: user.dataValues.isAdmin,
      createdAt: user.dataValues.createdAt,
      updatedAt: user.dataValues.updatedAt,
      contentsId
    };
    console.log(`data: `);
    console.log(data);
    res.status(200).json({ data });
  } catch (error) {
    console.error('Error fetching user information:', error);
    next(error);
  }
}
