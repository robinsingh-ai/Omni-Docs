# agents/qa_agent.py
from crewai import Agent
from langchain.chains import RetrievalQA
import logging
from typing import Any, Dict, List, AsyncGenerator
from langchain.llms.base import BaseLLM
import asyncio
import re
import json

from app.utils.faiss_utils import FAISSManager
from app.core.constants import PromptConstants
from app.core.logger import setup_logger

class QAAgent:
    def __init__(self, llm: BaseLLM, faiss_manager: FAISSManager, index_name: str):
        self.agent = Agent(
            role='Documentation Assistant',
            goal='Answer user queries about documentation with well-formatted markdown responses',
            backstory='I am an AI assistant specialized in providing clear, well-structured documentation answers in markdown format.',
            llm=llm,
            verbose=True
        )
        self.llm = llm
        self.faiss_manager = faiss_manager
        self.index_name = index_name
        self.logger = setup_logger(__name__)
        self._setup_qa_chain()

    def _setup_qa_chain(self):
        """Initialize the QA chain with FAISS retriever."""
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

    def _is_task_question(self, query: str) -> bool:
        """Determine if a question is asking about how to do something."""
        task_indicators = [
            r'how to',
            r'how do I',
            r'steps to',
            r'guide for',
            r'tutorial',
            r'create',
            r'build',
            r'implement',
            r'set up',
            r'configure',
            r'install',
            r'deploy',
            r'start',
            r'make'
        ]
        query_lower = query.lower()
        return any(re.search(pattern, query_lower) for pattern in task_indicators)

    def _create_markdown_prompt(self, query: str, context: str) -> str:
        """Create markdown-formatted prompt using template from constants."""
        return PromptConstants.MARKDOWN_PROMPT_TEMPLATE.format(
            query=query,
            context=context
        )

    async def answer_query_stream(self, query: str) -> AsyncGenerator[str, None]:
        """Stream the answer to a query with separated markdown and sources."""
        try:
            self.logger.info(f"Processing streaming query: {query}")
            
            # Get relevant documents
            index = self.faiss_manager.load_faiss_index(self.index_name)
            docs = index.similarity_search(query, k=4)
            
            # Format context from documents
            context = "\n\n".join([doc.page_content for doc in docs])
            
            # Determine if this is a task question
            is_task = self._is_task_question(query)
            
            # Initialize source documents array
            sources = []
            if is_task:
                for doc in docs:
                    sources.append({
                        "url": doc.metadata.get('source', 'Unknown'),
                        "title": doc.metadata.get('title', 'Unknown'),
                        "content_preview": doc.page_content[:200] + "..."
                    })
            
            # First, send the sources as a separate object
            if sources:
                yield json.dumps({
                    "type": "sources",
                    "content": sources
                }) + "\n"
            
            # Create markdown prompt
            prompt = self._create_markdown_prompt(query, context)
            
            # Buffer for collecting tokens into meaningful chunks
            current_chunk = ""
            
            # Stream the markdown content
            async for chunk in self.llm.astream(prompt):
                token = chunk.content if hasattr(chunk, 'content') else str(chunk)
                current_chunk += token
                
                # Send chunk when we have a complete sentence or significant content
                if any(token.endswith(p) for p in ['.', '!', '?', '\n']) and current_chunk:
                    yield json.dumps({
                        "type": "markdown",
                        "content": current_chunk
                    }) + "\n"
                    current_chunk = ""
            
            # Send any remaining content
            if current_chunk:
                yield json.dumps({
                    "type": "markdown",
                    "content": current_chunk
                }) + "\n"
            
            # Signal completion
            yield json.dumps({
                "type": "end"
            }) + "\n"
            
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
            
            index = self.faiss_manager.load_faiss_index(self.index_name)
            docs = index.similarity_search(query, k=4)
            context = "\n\n".join([doc.page_content for doc in docs])
            
            prompt = self._create_markdown_prompt(query, context)
            response = self.qa_chain({"query": prompt})
            
            is_task = self._is_task_question(query)
            source_documents = []
            
            if is_task:
                for idx, doc in enumerate(response.get('source_documents', []), 1):
                    source = {
                        "url": doc.metadata.get('source', 'Unknown'),
                        "title": doc.metadata.get('title', 'Unknown'),
                        "content_preview": doc.page_content[:200] + "..."
                    }
                    source_documents.append(source)
            
            return {
                "answer": response['result'],
                "source_documents": source_documents
            }
            
        except Exception as e:
            self.logger.error(f"Error answering query: {e}")
            raise