import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

interface UserData {
  name?: string;
  location?: string;
  age_range?: string;
  interaction_preference?: string;
  other_interaction_preference?: string;
  challenges: { id: number; name: string }[];
}

const Dashboard: React.FC = () => {
  const { token } = useContext(AuthContext)!;
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch user data: ' + (err as Error).message);
        setUserData(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, [token]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!userData) return <p>Loading...</p>;

  return (
    <div className="dashboard">
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