import { config } from '../config.js';
import SQ from 'sequelize';
import mongoose from 'mongoose';

// Sequelize 설정 (MySQL)
const { host, user, database, password, port } = config.MySQL;

export const sequelize = new SQ.Sequelize(database, user, password, {
  host,
  port,
  dialect: 'mysql',
  logging: false
});

// Mongoose 설정 (MongoDB)
async function connectDB() {
  return mongoose.connect(config.mongoDB.host);
}

// 공통 데이터베이스 연결 함수
export async function connectDatabases() {
  try {
    await sequelize.authenticate();
    console.log('Sequelize MySQL connected.');
    await sequelize.sync();
    await connectDB();
    console.log('Mongoose MongoDB connected.');
  } catch (error) {
    console.error('Unable to connect to the databases:', error);
    throw error;
  }
}


// mongoose 혹 정의
// _id 가상 필드 생성
export function useVirtualId(schema) {
  schema.virtual('id').get(function () {
    return this._id.toString();
  });
  schema.set('toJSON', { virtuals: true });
  schema.set('toObject', { virtuals: true });
}

// createdAt과 updatedAt 필드를 로컬 시간으로 설정하는 pre-save 훅
export function useLocalTimeStamps(schema) {
  schema.pre('save', function(next) {
    const now = new Date();
    const localTime = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
    this.createdAt = localTime;
    this.updatedAt = localTime;
    next();
  });
}
