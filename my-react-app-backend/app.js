// Import necessary modules
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const cors = require('cors'); // Import CORS middleware

// Configure environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = 5000;

// CORS configuration
const corsOptions = {
  origin: 'https://ai-model-9hqx.onrender.com, // Replace with your React frontend URL
  optionsSuccessStatus: 200, // For legacy browser support
};

// Use CORS with the configured options
app.use(cors(corsOptions));

// Middleware to parse JSON
app.use(express.json());

// Initialize GoogleGenerativeAI with API key
const genAI = new GoogleGenerativeAI("AIzaSyAGc6hEpQwvaWTCGOjrB5qfRtFBBa0GsdY");
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Define the API route for generating content
app.post('/generate', async (req, res) => {
  const { prompt } = req.body;

  try {
    // Validate if prompt is provided
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Generate content using the model
    const result = await model.generateContent(prompt);

    // Send the generated content as a response
    res.json({ response: result.response.text() });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
