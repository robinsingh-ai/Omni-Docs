# agents/qa_agent.py
from crewai import Agent
from langchain.chains import RetrievalQA
from langchain.callbacks.base import BaseCallbackHandler
import logging
from typing import Any, Dict, List
from langchain.llms.base import BaseLLM
import json
import asyncio

from utils.faiss_utils import FAISSManager

class StreamingCallbackHandler(BaseCallbackHandler):
    """Custom callback handler for streaming."""
    def __init__(self):
        self.tokens = []
        self.streaming_complete = False
        self.response_queue = asyncio.Queue()

    async def on_llm_new_token(self, token: str, **kwargs) -> None:
        """Run on new LLM token."""
        await self.response_queue.put({"type": "token", "content": token})

    async def on_llm_end(self, response: Any, **kwargs) -> None:
        """Run when LLM ends."""
        await self.response_queue.put({"type": "end"})
        self.streaming_complete = True

class QAAgent:
    def __init__(self, llm: BaseLLM, faiss_manager: FAISSManager, index_name: str):
        self.streaming_handler = StreamingCallbackHandler()
        self.agent = Agent(
            role='Documentation Assistant',
            goal='Answer user queries about documentation',
            backstory='I am an AI assistant specialized in answering queries about software documentation.',
            llm=llm,
            verbose=True
        )
        self.llm = llm
        self.faiss_manager = faiss_manager
        self.index_name = index_name
        self.logger = logging.getLogger(__name__)
        self._setup_qa_chain()

    def _setup_qa_chain(self):
        try:
            index = self.faiss_manager.load_faiss_index(self.index_name)
            self.qa_chain = RetrievalQA.from_chain_type(
                llm=self.llm,
                chain_type="stuff",
                retriever=index.as_retriever(
                    search_kwargs={"k": 4}
                ),
                return_source_documents=True,
                verbose=True
            )
        except Exception as e:
            self.logger.error(f"Error setting up QA chain: {e}")
            raise

    async def answer_query_stream(self, query: str):
        """Stream the answer to a query."""
        try:
            self.logger.info(f"Processing streaming query: {query}")
            
            # Get relevant documents
            index = self.faiss_manager.load_faiss_index(self.index_name)
            docs = index.similarity_search(query, k=4)
            
            # Format context from documents
            context = "\n\n".join([doc.page_content for doc in docs])
            
            # Prepare source documents info
            source_documents = []
            for doc in docs:
                source_documents.append({
                    "url": doc.metadata.get('source', 'Unknown'),
                    "title": doc.metadata.get('title', 'Unknown'),
                    "content_preview": doc.page_content[:200] + "..."
                })
            
            # Stream the answer
            prompt = f"Based on the following context, answer the question: {query}\n\nContext: {context}"
            
            # Process the stream
            async for token in self.llm.astream(prompt):
                yield json.dumps({
                    "type": "token",
                    "content": token.content if hasattr(token, 'content') else str(token)
                }) + "\n"
            
            # Send source documents at the end
            yield json.dumps({
                "type": "sources",
                "content": source_documents
            }) + "\n"
            
            # Signal completion
            yield json.dumps({"type": "end"}) + "\n"
            
        except Exception as e:
            self.logger.error(f"Error in streaming answer: {e}")
            yield json.dumps({
                "type": "error",
                "content": str(e)
            }) + "\n"
            raise

    def answer_query(self, query: str) -> Dict[str, Any]:
        """Answer a user query using the QA chain."""
        try:
            self.logger.info(f"Processing query: {query}")
            result = self.qa_chain({"query": query})
            
            source_documents = []
            for doc in result.get('source_documents', []):
                source_documents.append({
                    "url": doc.metadata.get('source', 'Unknown'),
                    "title": doc.metadata.get('title', 'Unknown'),
                    "content_preview": doc.page_content[:200] + "..."
                })
            
            return {
                "answer": result['result'],
                "source_documents": source_documents
            }
            
        except Exception as e:
            self.logger.error(f"Error answering query: {e}")
            raise