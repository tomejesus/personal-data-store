import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface UserData {
  name?: string;
  location?: string;
  age_range?: string;
  interaction_preference?: string;
  other_interaction_preference?: string;
  challenges: { id: number; name: string }[];
}

const Dashboard: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/user');
        setUserData(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch user data: ' + (err as Error).message);
        setUserData(null);
      }
    };
    fetchUserData();
  }, []);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!userData) return <p>Loading...</p>;

  return (
    <div>
      <h2>Dashboard</h2>
      <p><strong>Name:</strong> {userData.name || 'N/A'}</p>
      <p><strong>Location:</strong> {userData.location || 'N/A'}</p>
      <p><strong>Age Range:</strong> {userData.age_range || 'N/A'}</p>
      <p><strong>Interaction Preference:</strong> {userData.interaction_preference || 'N/A'}</p>
      <p><strong>Other Interaction Preference:</strong> {userData.other_interaction_preference || 'N/A'}</p>
      <h3>Challenges:</h3>
      <ul>
        {userData.challenges.map((challenge) => (
          <li key={challenge.id}>{challenge.name} (ID: {challenge.id})</li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;