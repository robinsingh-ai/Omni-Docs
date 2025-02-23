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
   - Specify the language (e.g., ```python, ```bash)
4. For lists:
   - Use - for bullet points
   - Use 1. 2. 3. for numbered steps
5. For emphasis:
   - Use **text** for bold
   - Use `code` for inline code
6. Keep paragraphs separated by blank lines

Previous Context:
{history_context}

Reference Documentation:
{context}

Question: {query}

Start with a ## heading summarizing the topic, then provide a clear and concise answer.""" 