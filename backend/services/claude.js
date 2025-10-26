// claude.js
// Service layer for Claude API integration
//
// Key responsibilities:
// - Authenticate with Anthropic API using environment variables
// - Send structured prompts to Claude
// - Handle API errors and format responses
// - Provide singleton instance for app-wide use
//
// Used by: server.js (Note Generation API endpoints)
// Dependencies: @anthropic-ai/sdk, dotenv for environment config

const Anthropic = require('@anthropic-ai/sdk');

class ClaudeService {
  /**
   * Constructor initializes the Anthropic API client
   * API key is loaded from environment variables (set in .env file)
   * This runs once when the singleton instance is created
   */
  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY  // Must be set before this service loads
    });
  }

  /**
   * generateContent - Sends a prompt to Claude API and returns formatted response
   * 
   * @param {string} prompt - The text prompt to send to Claude
   * @returns {object} { success: boolean, content: string } or { success: false, error: string }
   * 
   * This method handles the complete request/response cycle including error handling.
   * The response format is consistent whether the API call succeeds or fails.
   */
  async generateContent(prompt) {
    try {
      // Call Claude API with the messages format they expect
      // Using claude-sonnet-4 model with 1024 token limit
      const message = await this.client.messages.create({
        model: 'claude-sonnet-4-20250514',      // Latest Sonnet model
        max_tokens: 1024,                       // Sufficient for most note templates
        messages: [
          { role: 'user', content: prompt }     // Simple single-turn conversation
        ]
      });

      // Extract text from Claude's response structure
      // Claude returns: { content: [{ type: 'text', text: '...' }], ... }
      return {
        success: true,
        content: message.content[0].text
      };
    } catch (error) {
      // Log full error for debugging but only return message to client
      // This prevents exposing sensitive API details in responses
      console.error('Claude API Error:', error);
      
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Export singleton instance for app-wide use
// This ensures all parts of the app share the same API client and configuration
// More efficient than creating new instances in each file that needs Claude
module.exports = new ClaudeService();