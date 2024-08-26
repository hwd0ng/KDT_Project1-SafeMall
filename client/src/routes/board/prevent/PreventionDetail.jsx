import React, { useEffect, useState } from 'react';
import { getPreventionById } from '../../../service/preventionService';
import { useParams } from 'react-router-dom';


const PreventionDetail = () => {
  const [prevention, setPrevention] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetchPrevention();
  }, [id]);

  const fetchPrevention = async () => {
    try {
      const response = await getPreventionById(id);
      setPrevention(response.data);
    } catch (error) {
      console.error('Failed to fetch prevention', error);
    }
  };

  if (!prevention) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{prevention.title}</h2>
      <p>{prevention.content}</p>
    </div>
  );
};

export default PreventionDetail;
