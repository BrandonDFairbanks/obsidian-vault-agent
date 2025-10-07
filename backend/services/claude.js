const Anthropic = require('@anthropic-ai/sdk');

class ClaudeService {
  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY
    });
  }

  async generateContent(prompt) {
    try {
      const message = await this.client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [
          { role: 'user', content: prompt }
        ]
      });

      return {
        success: true,
        content: message.content[0].text
      };
    } catch (error) {
      console.error('Claude API Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new ClaudeService();