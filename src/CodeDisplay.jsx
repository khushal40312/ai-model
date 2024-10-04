import React from 'react';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

// Define a component for displaying code with syntax highlighting
const CodeDisplay = ({ code, language = 'javascript' }) => {
  return (
    <div style={{ textAlign: 'left', margin: '20px 0' }}>
      {/* Use SyntaxHighlighter to display the code */}
      <SyntaxHighlighter language={language} style={docco}>
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeDisplay;
