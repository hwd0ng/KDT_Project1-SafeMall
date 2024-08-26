import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PreventionForm = () => {
  const [title, setTitle] = useState('');
  const editorRef = useRef(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const handleSubmit  = async (e) => {
    e.preventDefault();

    const content = editorRef.current.getInstance().getMarkdown(); // 에디터 내용을 마크다운 형식으로 가져오기

    const data = {
        title,
        content
    };

    // 여기에서 백엔드로 데이터를 전송합니다.
    const response = await fetch('/your-backend-endpoint', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    // 응답 처리 로직
    if (response.ok) {
        // 성공 처리
    } else {
        // 오류 처리
    }
  };

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   const data = { title, content };

  //   try {
  //     if (id) {
  //       await updatePrevention(id, data);
  //     } else {
  //       await createPrevention(data);
  //     }
  //     navigate('/'); // Redirect to prevention list
  //   } catch (error) {
  //     console.error('Failed to save prevention', error);
  //   }
  // };

  return (
    <div>
      <h2>{id ? 'Edit' : 'Create'} Prevention</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label>Content:</label>
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default PreventionForm;
