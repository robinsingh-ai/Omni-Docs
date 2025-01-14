
MARKDOWN_PROMPT_TEMPLATE = """Provide a clear, structured answer in markdown format following these guidelines:
1. Use a single ### for the main heading
2. Use proper heading hierarchy (### for main, #### for sub-sections)
3. For code blocks:
   - Use ```language-name for code blocks
   - Specify the language (e.g., ```bash, ```javascript)
4. For lists:
   - Use * for bullet points
   - Use 1. 2. 3. for numbered steps
5. For emphasis:
   - Use **text** for bold
   - Use `code` for inline code
6. Keep paragraphs separated by blank lines

Question: {query}

Context: {context}

Start with a ### heading summarizing the topic, then provide a clear and concise answer."""