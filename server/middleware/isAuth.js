import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import * as userData from '../data/userData.js'

const AUTH_ERROR = {message:"인증에러"};

export const isAuth = async(req, res, next)=>{
  const authHeader = req.get('Authorization');
  if(!(authHeader && authHeader.startsWith('Bearer '))){
    console.log(authHeader)
    console.log('에러!!')
    return res.status(401).json(AUTH_ERROR)
  }else{
    const token = authHeader.split(' ')[1];
    jwt.verify(
      token, config.jwt.secretKey, async(err, decoded)=>{
        if(err){
          console.log(`에러! ${err}`)
          return res.status(401).json(AUTH_ERROR)
        }
        const user = await userData.getByNickName(decoded.nickname);
        if(!user){
          console.log(user)
          console.log('에러3')
          return res.status(401).json(AUTH_ERROR);
        }
        req.token = authHeader
        req.user = user.nickname
        req.isAdmin = user.isAdmin
        // console.log(`token:${req.token}\nuser:${req.user}\nisAdmin:${req.isAdmin}`)
        next();
      }
    )
  }
}