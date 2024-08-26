import React, {useState, useEffect, useContext} from 'react';
import { AuthContext } from '../../../context/authContext';
import styles from './myPage.module.css';
import MypageService from '../../../service/myPage';
import { Link, useNavigate } from 'react-router-dom';

export default function MyPage(){
    const [postlist, setPostlist] = useState([]);
    const [nickname, setNickname ] = useState('익명');
    const [date, setDate] = useState([]);
    const { isLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if(isLoggedIn === false){
            alert('로그인 필요')
            navigate('/auth/login/1')
        }else if(isLoggedIn === true){
            const fetchData = async () => {
            const mypageService = new MypageService();
            const fetchedData = await mypageService.getMypageList();
            setNickname(fetchedData.nickname);
            setDate([fetchedData.createdAt.split('T')[0], fetchedData.updatedAt.split('T')[0]])
            setPostlist(fetchedData.contentsId)
        };
        fetchData();}
    }, [isLoggedIn]); // 빈 배열을 두 번째 인수로 전달하여 컴포넌트가 마운트될 때 한 번만 실행
    console.log(postlist)
    return(
    <>
        <div className={styles.container}>
        <div className={styles.nickname}>{nickname}
        <span className={styles.date}>  (가입날짜 : {date[0]})</span></div>
        <div className={styles.recent}>최근 작성글</div>

        <div className={styles.title}>
            <span>게시판명</span><span>제목</span><span>작성일</span>
        </div>
        <div className={styles.mypageitem}>
            {postlist.map((post) => (
                <div className={styles.mypageRow} key={post.postNo}>
                    <Link to={`/board/${post.boardType.toLowerCase()}/${post.postNo}`}>
                        <p>{post.boardTypeKor}</p>
                        <p className={styles.myTitle}>{post.Title}</p>
                        <p>{post.createdAt.split('T')[0]}</p>
                    </Link>
                </div>
            ))}
        </div>

       {/* <div className={styles.button}>
        <button>회원정보 수정</button>
        <button>회원탈퇴</button>
        </div> */}
    </div>
    </>
    )
}