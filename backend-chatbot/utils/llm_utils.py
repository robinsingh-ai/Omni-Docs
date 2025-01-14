from langchain.llms import Ollama
from langchain.embeddings import OllamaEmbeddings
from langchain.vectorstores import FAISS
import os

def get_llm(model_name="llama2"):
    """Initialize and return an Ollama LLM instance."""
    return Ollama(model=model_name)

def get_embeddings(model_name="llama2"):
    """Initialize and return Ollama embeddings."""
    return OllamaEmbeddings(model=model_name)