import React, { useEffect, useState } from 'react';
import { getPreventions, deletePrevention } from '../../../service/preventionService';
import PreventService from '../../../service/preventionService';
import { Link } from 'react-router-dom';

const PreventionList = () => {
  const [preventions, setPreventions] = useState([]);

  useEffect(() => {
    fetchPreventions();
  }, []);

  const fetchPreventions = async () => {
    try {
      // const preventService = new PreventService();
      const response = await getPreventions();
      console.log(response)
      setPreventions(response.data);
    } catch (error) {
      console.error('Failed to fetch preventions', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePrevention(id);
      fetchPreventions(); // Refresh list after delete
    } catch (error) {
      console.error('Failed to delete prevention', error);
    }
  };

  return (
    <div>
      <h2>Prevention List</h2>
      <Link to="/create">Create Prevention</Link>
      <ul>
        {preventions.map(prevention => (
          <li key={prevention.id}>
            <Link to={`/prevention/${prevention._id}`}>{prevention.Title}</Link>
            <button onClick={() => handleDelete(prevention._id)}>Delete</button>
            <Link to={`/edit/${prevention._id}`}>Edit</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PreventionList;
