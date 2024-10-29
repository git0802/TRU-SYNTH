import { useState, useEffect } from 'react';

export const useApiKey = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem('openai_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    } else {
      setShowModal(true);
    }
  }, []);

  const saveApiKey = (key: string) => {
    localStorage.setItem('openai_api_key', key);
    setApiKey(key);
    window.location.reload(); // Reload to apply new API key
  };

  return {
    apiKey,
    showModal,
    setShowModal,
    saveApiKey,
  };
};