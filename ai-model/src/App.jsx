import React, { useState } from 'react';
import axios from 'axios';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter'; 
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'; 
import './App.css';
import LoadingSpinner from './Component/LoadingSpinner';

function App() {
  const [prompt, setPrompt] = useState(''); 
  const [responseLines, setResponseLines] = useState(''); 
  const [exampleLines, setExampleLines] = useState(''); 
  const [language, setLanguage] = useState('javascript'); 
  const [loading, setLoading] = useState(false); 

  const cleanResponse = (text) => {
    const languagePattern = /```(.*?)\n/;
    const matchedLanguage = text.match(languagePattern);
    let detectedLanguage = matchedLanguage ? matchedLanguage[1].trim() : 'javascript';

    if (!['python', 'javascript', 'java', 'cpp', 'html', 'css'].includes(detectedLanguage)) {
      detectedLanguage = 'javascript';
    }

    setLanguage(detectedLanguage);

    const exampleStart = text.indexOf("**example") !== -1 ? text.indexOf("**example") : text.indexOf("**Example");

    if (exampleStart !== -1) {
      const exampleCode = text.substring(exampleStart);
      const cleanedExample = exampleCode.replace(/```[\w]*\n/g, '').trim();
      setExampleLines(cleanedExample);
      return text.substring(0, exampleStart).trim();
    }

    return text.replace(/```[\w]*\n/g, '').trim();
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return; 
    setLoading(true);
    setResponseLines('');
    setExampleLines('');

    try {
      const result = await axios.post('https://ai-model-backend-u1cg.onrender.com/generate', { prompt });
      const cleanedText = cleanResponse(result.data.response);
      setResponseLines(cleanedText);
    } catch (error) {
      console.error('Error generating content:', error);
      setResponseLines('Failed to get a response from the API.');
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="app-container">
      <header className="App-header">
        <h1 className='text-center'>Generative AI Model By Khushal Sharma</h1>
      </header>

      <div className="output-container">
        <h2>Generated Response:</h2>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <SyntaxHighlighter language={language} style={atomOneDark}>
            {responseLines}
          </SyntaxHighlighter>
        )}

        {exampleLines && (
          <div className="example-container">
            <h2> Example:</h2>
            <SyntaxHighlighter language={language} style={atomOneDark}>
              {exampleLines}
            </SyntaxHighlighter>
          </div>
        )}
      </div>

      {/* Input Section at the Bottom */}
      <div className="input-section">
        <textarea
          rows="3"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Write your prompt here..."
          className="prompt-input"
        />

        <button onClick={handleGenerate} className="generate-button" disabled={loading}>
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </div>

      <footer className='text-white text-center'>
        Created under Nodejs and React by @khushalsharma
      </footer>
    </div>
  );
}

export default App;
