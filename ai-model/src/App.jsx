import React, { useState } from 'react';
import axios from 'axios';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter'; // Import Syntax Highlighter
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'; // Choose a theme
import './App.css';
import LoadingSpinner from './Component/LoadingSpinner';

function App() {
  const [prompt, setPrompt] = useState(''); // State for the input prompt
  const [responseLines, setResponseLines] = useState(''); // State for storing the response text
  const [language, setLanguage] = useState('javascript'); // State for detected language
  const [loading, setLoading] = useState(false); // Loading state

  // Function to clean up response text and detect language
  const cleanResponse = (text) => {
    // Check for language patterns in the response
    const languagePattern = /```(.*?)\n/; // Detects patterns like ```python\n
    const matchedLanguage = text.match(languagePattern);

    // Extract the language name, if present
    let detectedLanguage = matchedLanguage ? matchedLanguage[1].trim() : 'javascript';

    // If the detected language is empty or unknown, default to 'javascript'
    if (!['python', 'javascript', 'java', 'cpp', 'html', 'css'].includes(detectedLanguage)) {
      detectedLanguage = 'javascript';
    }

    setLanguage(detectedLanguage); // Set the detected language

    return text
      .replace(/```[\w]*\n/g, '') // Remove the language markers (e.g., ```python)
      .replace(/[\r\n]+/g, '\n') // Remove extra line breaks
      .trim(); // Trim leading and trailing spaces
  };

  // Function to handle prompt submission
  const handleGenerate = async () => {
    if (!prompt.trim()) return; // Prevent empty submissions
    setLoading(true);

    try {
      // Make a POST request to the backend API
      const result = await axios.post('http://localhost:5000/generate', { prompt });

      // Clean the response text and detect the language before setting the state
      const cleanedText = cleanResponse(result.data.response);

      // Set the cleaned response text in the state
      setResponseLines(cleanedText);
    } catch (error) {
      console.error('Error generating content:', error);
      setResponseLines('Failed to get a response from the API.');
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  return (
    <div className="container">
      <header className="App-header">
        <h1 className='text-center'>Generative AI Model By Khushal Sharma </h1>
        <p className='text-center'>Enter a prompt below to generate content using the AI model.</p>

        {/* Input field to accept the prompt */}
        <textarea
          rows="5"
          cols="50"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Write your prompt here..."
          style={{ padding: '10px', margin: '20px 0', fontSize: '16px' }}
        />

        {/* Button to submit the prompt */}
        <button
          onClick={handleGenerate}
          style={{ padding: '10px 20px', fontSize: '18px' }}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>

        {/* Display the response from the API */}
        <div className='container'
          style={{
            marginTop: '30px',
            fontSize: '18px',
            textAlign: 'left',
            width: '90%',
            backgroundColor: '#282c34',
            color: '#ffffff',
            padding: '20px',
            borderRadius: '8px',
            overflowX: 'auto', // Set overflowX to auto
            maxHeight: '400px', // Optional: to limit the height and create a vertical scroll
          }}
        >
          <h2>Generated Response:</h2>
        
         {loading==true?<LoadingSpinner/>: <SyntaxHighlighter language={language} style={atomOneDark}>
            {responseLines}
          </SyntaxHighlighter>}
        </div>
      </header>
      <footer className='text-white text-center'> Created under Nodejs and React by @khushalsharma</footer>
    </div>
  );
}

export default App;

