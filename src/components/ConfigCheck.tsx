import React, { useEffect, useState } from 'react';
import { getOpenAIConfig } from '../config/openai';

const ConfigCheck: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConfigValid, setIsConfigValid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const config = getOpenAIConfig();
      if (config.apiKey.startsWith('sk-')) {
        setIsConfigValid(true);
      } else {
        setError('Invalid API key format. Please check your .env file.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Configuration error');
    }
  }, []);

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
        <div className="bg-black/80 border border-primary/20 rounded-lg p-6 max-w-md w-full">
          <h2 className="text-xl font-light text-primary mb-4">Configuration Error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <div className="bg-primary/10 border border-primary/20 rounded p-4">
            <p className="text-sm text-gray-400">
              Please create a <code className="text-primary">.env</code> file in your project root with:
            </p>
            <pre className="mt-2 p-2 bg-black/50 rounded text-sm overflow-x-auto">
              <code>{`VITE_OPENAI_API_KEY=your-api-key
VITE_OPENAI_MODEL=gpt-4-turbo-preview
VITE_MAX_TOKENS=500`}</code>
            </pre>
          </div>
        </div>
      </div>
    );
  }

  if (!isConfigValid) {
    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4">
        <div className="animate-pulse text-primary">Checking configuration...</div>
      </div>
    );
  }

  return <>{children}</>;
};