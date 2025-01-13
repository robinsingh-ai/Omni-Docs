from crewai import Agent
from langchain.chains import RetrievalQA
import logging
from typing import Any, Dict
from langchain.llms.base import BaseLLM

from utils.faiss_utils import FAISSManager

class QAAgent:
    def __init__(self, llm: BaseLLM, faiss_manager: FAISSManager, index_name: str):
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
        """Initialize the QA chain with FAISS retriever."""
        try:
            # Load the index with safe deserialization
            index = self.faiss_manager.load_faiss_index(self.index_name)
            
            # Create the QA chain
            self.qa_chain = RetrievalQA.from_chain_type(
                llm=self.llm,
                chain_type="stuff",  # Using "stuff" chain for simplicity
                retriever=index.as_retriever(
                    search_kwargs={"k": 4}
                ),
                return_source_documents=True,  # Include source documents in response
                verbose=True
            )
        except Exception as e:
            self.logger.error(f"Error setting up QA chain: {e}")
            raise

    def answer_query(self, query: str) -> str:
        """Answer a user query using the QA chain."""
        try:
            self.logger.info(f"Processing query: {query}")
            result = self.qa_chain({"query": query})
            
            # Format the response with source information
            answer = result['result']
            sources = [doc.metadata.get('source', 'Unknown') for doc in result.get('source_documents', [])]
            
            response = f"{answer}\n\nSources: {', '.join(sources)}"
            return response
            
        except Exception as e:
            self.logger.error(f"Error answering query: {e}")
            raise