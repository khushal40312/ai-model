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

// CORS configuration (Replace with your React frontend URL)
const corsOptions = {
  origin:  ['https://ai-model-9hqx.onrender.com'],
  optionsSuccessStatus: 200, // For legacy browser support
};

// Use CORS with the configured options
app.use(cors(corsOptions));

// Middleware to parse JSON
app.use(express.json());

// Initialize GoogleGenerativeAI with API key from environment variables
const genAI = new GoogleGenerativeAI({ apiKey: process.env.GOOGLE_API_KEY });

// Define the API route for generating content
app.post('/generate', async (req, res) => {
  const { prompt } = req.body;

  try {
    // Validate if prompt is provided
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Use the correct method to generate content (verify with documentation)
    const result = await genAI.generateText({
      model: 'models/text-bison-001', // Use the appropriate model name
      prompt: prompt,
      temperature: 0.5, // Optional: Adjust generation parameters as needed
    });

    // Send the generated content as a response
    res.json({ response: result.candidates[0].output });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
