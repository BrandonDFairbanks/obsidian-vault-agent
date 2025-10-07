// book-note.js
// Template for generating structured book notes
//
// Key responsibilities:
// - Extract book title from user request
// - Assemble complete prompt with template structure
// - Include formatting instructions for Claude
//
// Used by: server.js (note generation endpoint)
// Returns: Complete prompt string ready to send to Claude API

/**
 * generateBookNotePrompt - Assembles a complete prompt for book note generation
 * 
 * @param {string} userRequest - The user's original request (e.g., "Create a book note for Atomic Habits")
 * @returns {string} - Complete prompt including instructions and template structure
 * 
 * This function extracts the book title from the user's request and builds a prompt
 * that instructs Claude to generate a structured book note following our template.
 */
function generateBookNotePrompt(userRequest) {
    // Extract book title from user request
    // Simple approach: look for common patterns like "for [Book Title]" or "about [Book Title]"
    const bookTitle = extractBookTitle(userRequest);
    
    // Build the complete prompt using template literals
    // This includes both instructions for Claude AND the exact markdown structure we want
    const prompt = `You are generating a structured book note for an Obsidian vault.
  
  Book title: "${bookTitle}"
  
  Generate a book note using this EXACT markdown structure:
  
  *[One-line description of the book's main focus]*
  
  #reading #[domain-tag]
  
  From: [[]]
  
  Author: [Author Name]  
  Category: [Book Category]  
  Rating: ⭐⭐⭐⭐⭐
  
  ## Key Quotes
  
  > ""
  
  > ""
  
  > ""
  
  ## Scratchpad
  
  [Initial reactions, questions, disagreements]
  
  *[What's worth applying? What seems questionable? How does this connect to existing knowledge?]*
  
  ---
  
  ## Core Insights
  
  Main Argument:
  - [[]]
  
  Supporting Evidence:
  - [[]]
  
  Practical Applications:
  - [[]]
  
  ---
  
  ## Connections
  
  **Reinforces:**
  - [[]]
  
  **Challenges:**
  - [[]]
  
  **Builds on:**
  - [[]]
  
  ---
  
  Links to explore: [[Topic-Relevant Link 1]], [[Topic-Relevant Link 2]], [[Topic-Relevant Link 3]]
  
  IMPORTANT INSTRUCTIONS:
  - Fill in the description based on the book's main focus
  - Research and fill in the correct author name
  - Choose an appropriate category (e.g., Self-Help, Business, History, etc.)
  - Leave rating at 5 stars as a placeholder
  - Leave quote sections empty (user will fill these in as they read)
  - Provide thoughtful suggestions for "Links to explore" based on the book's topic
  - Use [[Double Brackets]] for all internal links
  - Keep the exact structure and formatting shown above`;
  
    return prompt;
  }
  
  /**
   * extractBookTitle - Extracts book title from user request
   * 
   * @param {string} request - User's original request
   * @returns {string} - Extracted book title or placeholder if not found
   * 
   * Looks for common patterns:
   * - "for [Title]"
   * - "about [Title]"
   * - "[Title]" in quotes
   */
  function extractBookTitle(request) {
    // Try to find title after "for" or "about"
    const forMatch = request.match(/for ["']?([^"']+?)["']?$/i);
    if (forMatch) return forMatch[1].trim();
    
    const aboutMatch = request.match(/about ["']?([^"']+?)["']?$/i);
    if (aboutMatch) return aboutMatch[1].trim();
    
    // If we can't find it, return placeholder
    return "[Book Title]";
  }
  
  // Export the function so server.js can use it
  module.exports = {
    generateBookNotePrompt
  };