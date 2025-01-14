# agents/qa_agent.py
from crewai import Agent
from langchain.chains import RetrievalQA
import logging
from typing import Any, Dict, List, AsyncGenerator
from langchain.llms.base import BaseLLM
import asyncio

from utils.faiss_utils import FAISSManager

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
        self.logger = logging.getLogger(__name__)
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

    def _create_markdown_prompt(self, query: str, context: str) -> str:
        return (
            "Provide a clear, structured answer in markdown format following these guidelines:\n"
            "1. Start with a main header using ###\n"
            "2. Use code blocks with language specification for any code\n"
            "3. Use bullet points or numbered lists for steps\n"
            "4. Make key terms bold using **\n"
            "5. Include properly formatted links\n"
            "6. Keep paragraphs clear and separate\n\n"
            f"Question: {query}\n\n"
            f"Context: {context}\n\n"
            "Format the entire response in clean markdown. Be concise but thorough."
        )

    async def answer_query_stream(self, query: str) -> AsyncGenerator[str, None]:
        """Stream the answer to a query in markdown format."""
        try:
            self.logger.info(f"Processing streaming query: {query}")
            
            # Get relevant documents
            index = self.faiss_manager.load_faiss_index(self.index_name)
            docs = index.similarity_search(query, k=4)
            
            # Format context from documents
            context = "\n\n".join([doc.page_content for doc in docs])
            
            # Prepare source documents
            source_documents = []
            for doc in docs:
                source_documents.append({
                    "url": doc.metadata.get('source', 'Unknown'),
                    "title": doc.metadata.get('title', 'Unknown'),
                    "content_preview": doc.page_content[:200] + "..."
                })
            
            # Create markdown prompt
            prompt = self._create_markdown_prompt(query, context)
            
            # Buffer for collecting tokens into meaningful chunks
            current_chunk = ""
            
            # Stream the response
            async for chunk in self.llm.astream(prompt):
                token = chunk.content if hasattr(chunk, 'content') else str(chunk)
                current_chunk += token
                
                # Send chunk when we have a complete sentence or significant content
                if any(token.endswith(p) for p in ['.', '!', '?', '\n']) and current_chunk:
                    yield current_chunk
                    current_chunk = ""
            
            # Send any remaining content
            if current_chunk:
                yield current_chunk
            
            # Add source references in markdown
            sources_section = "\n\n### Sources\n"
            for idx, source in enumerate(source_documents, 1):
                sources_section += f"{idx}. [{source['title']}]({source['url']})\n"
            
            yield sources_section
            
        except Exception as e:
            self.logger.error(f"Error in streaming answer: {e}")
            yield f"\n\n### Error\n{str(e)}"
            raise

    def answer_query(self, query: str) -> Dict[str, Any]:
        """Answer a user query using the QA chain with markdown formatting."""
        try:
            self.logger.info(f"Processing query: {query}")
            
            index = self.faiss_manager.load_faiss_index(self.index_name)
            docs = index.similarity_search(query, k=4)
            context = "\n\n".join([doc.page_content for doc in docs])
            
            prompt = self._create_markdown_prompt(query, context)
            response = self.qa_chain({"query": prompt})
            
            # Format source documents
            source_documents = []
            sources_markdown = "\n\n### Sources\n"
            for idx, doc in enumerate(response.get('source_documents', []), 1):
                source = {
                    "url": doc.metadata.get('source', 'Unknown'),
                    "title": doc.metadata.get('title', 'Unknown'),
                    "content_preview": doc.page_content[:200] + "..."
                }
                source_documents.append(source)
                sources_markdown += f"{idx}. [{source['title']}]({source['url']})\n"
            
            return {
                "answer": response['result'] + sources_markdown,
                "source_documents": source_documents
            }
            
        except Exception as e:
            self.logger.error(f"Error answering query: {e}")
            raise