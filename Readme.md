# API Docs Chatbot

### Running the App

##### Running the Backend

> ensure you have .env created for backend, refer `.env.example` in the `backend-chatbot` directory

```bash
- cd backend-chatbot
- source chain-env/bin/activate # use the correct virtual env name
- python main.py

or for multi-threaded server:

- uvicorn app.api_router:app --host 127.0.0.1 --port 8000 --workers 4 --reload
```

- Ensure Ollama is running in the background with the required models downloaded.
  Supported models:
- llama3.1(8b),
- llama 3
- llama 2

> The Swagger documentation can be found at http://localhost:8000/docs

#### Running the Client

See the client [README](client/README.md) for instructions on running the client.

## Overview

The API Docs Chatbot is a conversational AI tool designed to help developers learn and navigate API documentation in an intuitive and engaging way. By utilizing advanced language models, this chatbot offers real-time, up-to-date information from a variety of API docs, including popular technologies like

- [Crustdata API Docs](https://crustdata.notion.site/Crustdata-Discovery-And-Enrichment-API-c66d5236e8ea40df8af114f6d447ab48)
- [NextJS Api Docs](https://nextjs.org/docs)
- [Flutter Api Docs](https://docs.flutter.dev/)

### Sitemap Urls

- Flutter: https://docs.flutter.dev/sitemap.xml
- NextJS: https://nextjs.org/sitemap.xml

As new technologies emerge, our chatbot evolves to become a one-stop solution for API documentation, allowing users to learn about frameworks and libraries through seamless conversations.

## Why We Are Building This

In today's fast-paced development world, staying up-to-date with the latest documentation can be challenging. API docs are often lengthy, dense, and hard to digest. As new technologies keep coming up, developers find it increasingly difficult to keep track of everything.

This chatbot solves that problem by offering a **conversational interface** that provides relevant, up-to-date information from official API docs. Whether you're learning a new technology or troubleshooting an issue, this bot will provide **instant** answers based on the latest documentation available. It will **save time** by making it easier to find answers and help developers keep their knowledge current.

### Key Features:

- **Up-to-date Information**: The chatbot will pull the latest data from API docs (refreshed every month) ensuring that users get relevant and accurate responses.
- **Conversational Learning**: Instead of reading through pages of docs, users can ask questions in a natural language format and receive responses that are easy to understand.
- **Support for Multiple Technologies**: The bot will support a growing list of technologies, starting with **Next.js**, **Flutter**, **React**, and more to come in the future.

## Problems We Are Solving

- **Fragmented Learning**: Developers often have to switch between different resources to understand various parts of the documentation. Our chatbot consolidates all that information into one place, providing context and answers tailored to each user's needs.
- **Outdated Information**: APIs frequently get updated, and keeping track of all changes can be daunting. This bot ensures users always have access to the latest API documentation, refreshed every month.
- **Time-consuming Search**: Instead of scrolling through long docs, the bot provides concise, accurate answers, saving valuable time for developers.

## Potential Users

- **Developers**: From beginners to experienced developers, anyone working with evolving technologies like React, Next.js, Flutter, etc., can benefit from this chatbot to quickly retrieve relevant information.
- **Tech Enthusiasts**: Those passionate about keeping up with the latest trends and learning about new frameworks and libraries can use the chatbot to stay ahead of the curve.
- **Educators & Mentors**: The chatbot can be used as a supplementary learning tool to help developers understand key concepts from API docs and ask questions on the go.
- **Tech Support Teams**: For teams managing client requests related to documentation or troubleshooting, this bot can help respond to common API-related queries quickly.

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Python Fast API, LangChain (for querying large text content from API docs), and a LLM such as LLama3.1, GPT-4 or Gemini 1.5 Flash for conversational AI.
- **Data**: API docs Vectorized and stored in Pinecone DB for fast retrieval.

Here's the modified "How It Works" section based on your inputs:

---

## How It Works

1. **User Signup**: To get started, users must sign up for an account using **Google Sign-In**. This ensures a smooth authentication process and keeps everything tied to their Google account.

2. **Credit System**:

   - **Free Plan**: Upon signing up, users receive **10 free credits** to explore the chatbot's functionality.
   - **Subscription Plan**: Users can subscribe for **$10/month** to access up to **50 daily credits**. The pricing may be adjusted once we have accurate calculations.
   - Users will use credits to initiate chats, and credits will be deducted based on usage.

3. **Creating Chats**:

   - The chatbot is organized by **API documentation**. Users can start a **new chat** for each technology or API (e.g., one chat for Flutter, another for Next.js).
   - **One chat is dedicated per API doc**—if a user wants to chat about Next.js after discussing Flutter, they will need to create a new chat specifically for Next.js.

4. **Chat Retention**:

   - All user chats are **retained for context**, so users can continue their discussions or revisit previous questions and answers at any time. This context helps the bot provide more relevant and accurate responses over multiple interactions.

5. **Continuous Learning**: As the bot learns from previous interactions, the conversations get progressively more relevant, helping users navigate and learn the API docs in a more efficient and personalized manner.

### Future Enhancements

In the future We will allow users to provide their own Data Source in the form of

- Url
- Vector Database
- Text File
- PDF File

This will allow users to use the chatbot for their own API docs or any other text data they want to query.
