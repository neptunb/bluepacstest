import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Configure axios to use relative URLs instead of hardcoded localhost
// This will make it work with Docker and proxying
const api = axios.create({
  baseURL: '', // Empty for relative URLs
  headers: {
    'Content-Type': 'application/json',
  },
});

const App = () => {
  const [message, setMessage] = useState('');
  const [conversionType, setConversionType] = useState('uppercase');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [serverInfo, setServerInfo] = useState(null);

  // Get server info on component mount
  useEffect(() => {
    const fetchServerInfo = async () => {
      try {
        const response = await api.get('/api/info');
        setServerInfo(response.data);
      } catch (error) {
        console.error('Failed to fetch server info:', error);
      }
    };
    
    fetchServerInfo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setError(null);
    
    const endpoint = conversionType === 'uppercase' ? '/api/uppercase' : '/api/lowercase';
    
    try {
      const response = await api.post(endpoint, {
        message: message
      });
      
      setResult(response.data);
    } catch (error) {
      console.error(`Error converting message (${conversionType}):`, error);
      setError('Failed to process your message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="message-converter">
        <h1>Bluepacs Message Converter</h1>
        <p className="subtitle">Enter a message and choose conversion type</p>
        
        <form onSubmit={handleSubmit}>
          <div className="conversion-options">
            <label className={`conversion-option ${conversionType === 'uppercase' ? 'active' : ''}`}>
              <input
                type="radio"
                name="conversionType"
                value="uppercase"
                checked={conversionType === 'uppercase'}
                onChange={() => setConversionType('uppercase')}
              />
              <span>UPPERCASE</span>
            </label>
            <label className={`conversion-option ${conversionType === 'lowercase' ? 'active' : ''}`}>
              <input
                type="radio"
                name="conversionType"
                value="lowercase"
                checked={conversionType === 'lowercase'}
                onChange={() => setConversionType('lowercase')}
              />
              <span>lowercase</span>
            </label>
          </div>
          
          <div className="input-group">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              className="message-input"
              disabled={loading}
            />
            <button 
              type="submit" 
              className="submit-button"
              disabled={loading || !message.trim()}
            >
              {loading ? 'Converting...' : 'Convert'}
            </button>
          </div>
        </form>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        {result && (
          <div className="result-container">
            <div className="result-item">
              <h3>Original Message:</h3>
              <p>{result.original}</p>
            </div>
            <div className="result-item">
              <h3>{conversionType === 'uppercase' ? 'Uppercase' : 'Lowercase'} Version:</h3>
              <p className={conversionType === 'uppercase' ? 'uppercase-result' : 'lowercase-result'}>
                {conversionType === 'uppercase' ? result.uppercase : result.lowercase}
              </p>
            </div>
            {result.length && (
              <div className="result-meta">
                <span>Length: {result.length} characters</span>
              </div>
            )}
          </div>
        )}
        
        {serverInfo && (
          <div className="server-info">
            <p>Connected to: {serverInfo.name} v{serverInfo.version}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App; 