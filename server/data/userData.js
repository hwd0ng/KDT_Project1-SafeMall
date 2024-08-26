import { DataTypes } from 'sequelize';
import { sequelize } from '../db/database.js';

const User = sequelize.define('User', {
  no: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  password: {
    type: DataTypes.STRING(60),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(254),
    allowNull: false,
    unique: true
  },
  nickname: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  contentsId: {
    type: DataTypes.JSON,
    allowNull: true, // 기본값 설정을 제거
  }
}, {
  timestamps: true,
  tableName: 'users',
  hooks: {
    beforeCreate: (user, options) => {
      if (!user.contentsId) {
        user.contentsId = []; // 기본값으로 빈 배열 설정
      }
    }
  }
});

// 회원 검색(닉네임)
export async function getByNickName(nickname) {
  try {
    const user = await User.findOne({ where: { nickname } });
    return user || null;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching user'); // 회원 조회 시 발생하는 오류 처리
  }
}

// 이메일 중복성 체크
export async function getByEmail(email) {
  try {
    const user = await User.findOne({ where: { email } });
    return user || null;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching user by email'); // 이메일 조회 시 발생하는 오류 처리
  }
}

// 회원 추가
export async function addUser(user) {
  try {
    const newUser = await User.create(user);
    return newUser; // newUser.user_nickname을 newUser로 수정하여 전체 객체 반환
  } catch (error) {
    console.error(error);
    throw new Error('Error adding user'); // 회원 추가 시 발생하는 오류 처리
  }
}

// 회원 수정
export async function editUser(nickname, updates) {
  try {
    const user = await getByNickName(nickname);
    if (user) {
      const updatedUser = await user.update(updates);
      return updatedUser.nickname; // 수정된 닉네임 반환
    } else {
      return false; // 유저가 없을 경우 false 반환
    }
  } catch (error) {
    console.error(error);
    throw new Error('Error updating user'); // 회원 수정 시 발생하는 오류 처리
  }
}

// 회원 삭제
export async function deleteUser(nickname) {
  try {
    const user = await getByNickName(nickname);
    if (user) {
      await user.destroy();
      return true; // 삭제 성공 시 true 반환
    } else {
      return false; // 유저가 없을 경우 false 반환
    }
  } catch (error) {
    console.error(error);
    throw new Error('Error deleting user'); // 회원 삭제 시 발생하는 오류 처리
  }
}
