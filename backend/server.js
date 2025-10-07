// server.js
// Basic Express server for Note Generation API

require('dotenv').config();
const claudeService = require('./services/claude');
const express = require('express');
const cors = require('cors');
const bookNoteTemplate = require('./templates/book-note');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Note Generation API is running',
    timestamp: new Date().toISOString()
  });
});

// POST /api/generate-note
// Main endpoint for generating structured notes
//
// Request body: { content: string, noteType: string }
// Response: { success: boolean, content: string, noteType: string }
//
// This endpoint:
// 1. Receives user request and note type
// 2. Uses appropriate template to build intelligent prompt
// 3. Calls Claude API via service layer
// 4. Returns formatted note content
app.post('/api/generate-note', async (req, res) => {
  try {
    const { content, noteType } = req.body;
    
    // For now, we only support book notes
    // TODO: Add support for decision logs, MOCs, and general notes
    if (noteType !== 'book') {
      return res.status(400).json({
        success: false,
        error: 'Only book notes are supported in this version'
      });
    }
    
    // Use book note template to build intelligent prompt
    const prompt = bookNoteTemplate.generateBookNotePrompt(content);
    
    // Send assembled prompt to Claude via service layer
    const result = await claudeService.generateContent(prompt);
    
    // Return the formatted note to the client
    if (result.success) {
      res.json({
        success: true,
        content: result.content,
        noteType: 'book'
      });
    } else {
      res.status(500).json(result);
    }
    
  } catch (error) {
    console.error('Note generation error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Test Claude integration Endpoint
app.post('/api/test-claude', async (req, res) => {
  try {
    const result = await claudeService.generateContent('Write a haiku about backend development');
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Note Generation API running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
});



