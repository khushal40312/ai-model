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
    const exampleStart = text.indexOf("**example"||"**Example");

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
      {exampleLines && (
  <div className='example-container'
    style={{
      marginTop: '30px',
      fontSize: '18px',
      textAlign: 'left',
      width: '100%',
      backgroundColor: 'black', // Slightly lighter background
      color: '#dcdcdc', // Lighter text color for contrast
      padding: '20px',
      borderRadius: '8px',
      overflowX: 'auto',
      boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)' // Subtle shadow for depth
    }}
  >
    <h2 style={{ color: '#76c7c0' }}>Code Example:</h2> {/* Soft accent color for heading */}
    <SyntaxHighlighter language={language} style={atomOneDark}>
      {exampleLines}
    </SyntaxHighlighter>
  </div>
)}

      </header>
      <footer className='text-white text-center'>
        Created under Nodejs and React by @khushalsharma
      </footer>
    </div>
  );
}

export default App;
