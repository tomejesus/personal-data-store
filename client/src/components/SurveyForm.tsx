import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

interface SurveyData {
  name?: string;
  location?: string;
  age_range?: string;
  interaction_preference?: string;
  other_interaction_preference?: string;
  challenges?: number[];
}

interface Challenge {
  id: number;
  name: string;
}

const SurveyForm: React.FC = () => {
  const { token } = useContext(AuthContext)!;
  const [formData, setFormData] = useState<SurveyData>({
    name: '',
    location: '',
    age_range: '',
    interaction_preference: '',
    other_interaction_preference: '',
    challenges: [],
  });
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        console.log({ token });
        const response = await axios.get('http://localhost:3000/challenges', {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Transform backend response to match Challenge interface
        const transformedChallenges: Challenge[] = response.data.map((challenge: any) => ({
          id: challenge.challenge_id,
          name: challenge.challenge_name,
        }));
        setChallenges(transformedChallenges);
      } catch (err) {
        setErrors({ api: 'Failed to fetch challenges: ' + (err as Error).message });
      }
    };
    fetchChallenges();
  }, [token]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) newErrors.name = 'Name is required';
    if (!formData.location?.trim()) newErrors.location = 'Location is required';
    if (!formData.age_range) newErrors.age_range = 'Age range is required';
    if (!formData.interaction_preference?.trim()) newErrors.interaction_preference = 'Interaction preference is required';
    if (!formData.challenges || formData.challenges.length === 0) newErrors.challenges = 'At least one challenge is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleChallengeChange = (challengeId: number) => {
    setFormData((prev) => ({
      ...prev,
      challenges: prev.challenges?.includes(challengeId)
        ? prev.challenges.filter((id) => id !== challengeId)
        : [...(prev.challenges || []), challengeId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.put('http://localhost:3000/user', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess(response.data.message);
      setErrors({});
    } catch (err) {
      setErrors({ api: 'Update failed: ' + (err as Error).message });
      setSuccess(null);
    }
  };

  const ageRanges = ['18-24', '25-34', '35-44', '45-54', '55+'];

  return (
    <div>
      <h2>Personal Data Survey</h2>
      {Object.values(errors).map((error, index) => (
        <p key={index} className="error">{error}</p>
      ))}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name || ''}
          onChange={handleChange}
          placeholder="Enter your name"
        />
        <label htmlFor="location">Location</label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location || ''}
          onChange={handleChange}
          placeholder="Enter your location"
        />
        <label htmlFor="age_range">Age Range</label>
        <select
          id="age_range"
          name="age_range"
          value={formData.age_range || ''}
          onChange={handleChange}
        >
          <option value="">Select Age Range</option>
          {ageRanges.map((range) => (
            <option key={range} value={range}>{range}</option>
          ))}
        </select>
        <label htmlFor="interaction_preference">Interaction Preference</label>
        <input
          type="text"
          id="interaction_preference"
          name="interaction_preference"
          value={formData.interaction_preference || ''}
          onChange={handleChange}
          placeholder="Enter interaction preference"
        />
        <label htmlFor="other_interaction_preference">Other Interaction Preference</label>
        <input
          type="text"
          id="other_interaction_preference"
          name="other_interaction_preference"
          value={formData.other_interaction_preference || ''}
          onChange={handleChange}
          placeholder="Enter other preference (optional)"
        />
        <label>Challenges</label>
        {challenges.map((challenge) => (
          <div key={challenge.id}>
            <input
              type="checkbox"
              id={`challenge-${challenge.id}`}
              checked={formData.challenges?.includes(challenge.id) || false}
              onChange={() => handleChallengeChange(challenge.id)}
            />
            <label htmlFor={`challenge-${challenge.id}`}>{challenge.name}</label>
          </div>
        ))}
        {errors.challenges && <p className="error">{errors.challenges}</p>}
        <button type="submit">Submit Survey</button>
      </form>
    </div>
  );
};

export default SurveyForm;