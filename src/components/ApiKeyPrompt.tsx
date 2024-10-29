import React, { useState } from 'react';

interface ApiKeyPromptProps {
  onApiKeySubmit: (apiKey: string) => void;
}

const ApiKeyPrompt: React.FC<ApiKeyPromptProps> = ({ onApiKeySubmit }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onApiKeySubmit(apiKey.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="api-key-form">
      <label htmlFor="apiKey">Enter your OpenAI API Key:</label>
      <input
        type="password"
        id="apiKey"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        required
      />
      <button type="submit">Continue</button>
    </form>
  );
};

export default ApiKeyPrompt;
