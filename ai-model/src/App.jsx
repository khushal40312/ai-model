import React, { useState } from 'react';
import axios from 'axios';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter'; 
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'; 
import './App.css';
import LoadingSpinner from './Component/LoadingSpinner';

function App() {
  const [prompt, setPrompt] = useState(''); 
  const [responseLines, setResponseLines] = useState(''); 
  const [exampleLines, setExampleLines] = useState(''); // State to store example code separately
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

    // Check if "example" is present in the response
  const exampleStart = text.indexOf("**example") !== -1 ? text.indexOf("**example") : text.indexOf("**Example");


    if (exampleStart !== -1) {
      const exampleCode = text.substring(exampleStart);
      const cleanedExample = exampleCode.replace(/```[\w]*\n/g, '').trim();
      setExampleLines(cleanedExample); // Store the example code separately
      return text.substring(0, exampleStart).trim(); // Return text without the example part
    }

    return text.replace(/```[\w]*\n/g, '').trim();
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return; 
    setLoading(true);

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
    <div className="container">
      <header className="App-header">
        <h1 className='text-center'>Generative AI Model By Khushal Sharma</h1>
        <p className='text-center'>Enter a prompt below to generate content using the AI model.</p>

        <textarea
          rows="5"
          cols="20"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Write your prompt here..."
          style={{ padding: '10px', margin: '20px 0', fontSize: '16px' }}
        />

        <button
          onClick={handleGenerate}
          style={{ padding: '10px 20px', fontSize: '18px' }}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>

        <div className='container'
          style={{
            marginTop: '30px',
            fontSize: '18px',
            textAlign: 'left',
            width: '100%',
            backgroundColor: '#282c34',
            color: '#ffffff',
            padding: '20px',
            borderRadius: '8px',
            overflowX: 'auto',
            maxHeight: '400px',
          }}
        >
          <h2>Generated Response:</h2>

          {loading ? <LoadingSpinner /> : (
            <SyntaxHighlighter language={language} style={atomOneDark}>
              {responseLines}
            </SyntaxHighlighter>
          )}
        </div>

        {/* Conditionally render the example code block */}
  <div className='example-container'
  style={{
    marginTop: '30px',
    fontSize: '18px',
    textAlign: 'left',
    width: '100%',
    backgroundColor: '#1e1f29 !important', // Darker shade for the example container
    color: '#e5e5e5', // Light gray for better readability
    padding: '20px',
    borderRadius: '8px',
    overflowX: 'auto',
    border: '1px solid #76c7c0', // Soft teal border for distinction
    boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.5)' // Enhanced shadow effect
  }}
>
  <h2 style={{ color: '#76c7c0' }}>Code Example:</h2> {/* Accent color for the heading */}
  <SyntaxHighlighter language={language} style={atomOneDark}>
    {exampleLines}
  </SyntaxHighlighter>
</div>

      </header>
      <footer className='text-white text-center'>
        Created under Nodejs and React by @khushalsharma
      </footer>
    </div>
  );
}

export default App;
