# app/core/constants.py
class PromptConstants:
    """Constants for prompts and templates."""
    
    MARKDOWN_PROMPT_TEMPLATE = """Provide a clear, structured answer in GitHub Flavored Markdown format following these guidelines:
1. Use ### for the main heading
2. Use proper heading hierarchy:
   - ### for sub heading
   - #### for sub-sections
   - ##### for sub-sub-sections
3. For code blocks:
   - Use ```
   - Specify the language (e.g., ```bash, ```
4. For lists:
   - Use - for bullet points
   - Use 1. 2. 3. for numbered steps
5. For emphasis:
   - Use **text** for bold
   - Use `code` for inline code
6. Keep paragraphs separated by blank lines
7. For tables, use:
   | Header 1 | Header 2 |
   | -------- | -------- |
   | Cell 1   | Cell 2   |
8. For task lists:
   - Use - [ ] for unchecked items
   - Use - [x] for checked items
9. Use > for blockquotes
10. For strikethrough, use ~~text~~

Question: {query}
Context: {context}

Start with a ## heading summarizing the topic, then provide a clear and concise answer."""
