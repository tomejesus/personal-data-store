import React, { useState } from 'react';
import axios from 'axios';

interface SurveyData {
  name?: string;
  location?: string;
  age_range?: string;
  interaction_preference?: string;
  other_interaction_preference?: string;
  challenges?: number[];
}

const SurveyForm: React.FC = () => {
  const [formData, setFormData] = useState<SurveyData>({
    name: '',
    location: '',
    age_range: '',
    interaction_preference: '',
    other_interaction_preference: '',
    challenges: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.age_range) newErrors.age_range = 'Age range is required';
    if (!formData.interaction_preference) newErrors.interaction_preference = 'Interaction preference is required';
    if (formData.challenges && formData.challenges.length === 0) newErrors.challenges = 'At least one challenge is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'challenges') {
      setFormData({ ...formData, challenges: value.split(',').map((id) => parseInt(id.trim(), 10)).filter(Number.isFinite) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.put('http://localhost:3000/user', formData);
      setSuccess(response.data.message);
      setErrors({});
    } catch (err) {
      setErrors({ api: 'Update failed: ' + (err as Error).message });
      setSuccess(null);
    }
  };

  return (
    <div>
      <h2>Personal Data Survey</h2>
      {Object.values(errors).map((error, index) => (
        <p key={index} className="error">{error}</p>
      ))}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name || ''}
          onChange={handleChange}
          placeholder="Name"
        />
        <input
          type="text"
          name="location"
          value={formData.location || ''}
          onChange={handleChange}
          placeholder="Location"
        />
        <input
          type="text"
          name="age_range"
          value={formData.age_range || ''}
          onChange={handleChange}
          placeholder="Age Range (e.g., 25-34)"
        />
        <input
          type="text"
          name="interaction_preference"
          value={formData.interaction_preference || ''}
          onChange={handleChange}
          placeholder="Interaction Preference"
        />
        <input
          type="text"
          name="other_interaction_preference"
          value={formData.other_interaction_preference || ''}
          onChange={handleChange}
          placeholder="Other Interaction Preference"
        />
        <input
          type="text"
          name="challenges"
          value={formData.challenges?.join(',') || ''}
          onChange={handleChange}
          placeholder="Challenge IDs (e.g., 1,3)"
        />
        <button type="submit">Submit Survey</button>
      </form>
    </div>
  );
};

export default SurveyForm;