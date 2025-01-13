from crewai import Agent
from typing import List
import logging
from langchain.llms.base import BaseLLM

from utils.web_utils import WebCrawler
from utils.faiss_utils import FAISSManager

class CrawlerAgent:
    def __init__(self, llm: BaseLLM, faiss_manager: FAISSManager):
        self.agent = Agent(
            role='Web Crawler',
            goal='Crawl documentation websites and index content',
            backstory='I am an AI agent specialized in crawling and indexing web content.',
            llm=llm,
            verbose=True
        )
        self.web_crawler = WebCrawler()
        self.faiss_manager = faiss_manager
        self.logger = logging.getLogger(__name__)

    def crawl_and_index(self, sitemap_url: str, index_name: str) -> str:
        """Crawl website and create FAISS index."""
        try:
            # Crawl URLs from sitemap
            self.logger.info(f"Crawling sitemap: {sitemap_url}")
            urls = self.web_crawler.crawl_sitemap(sitemap_url)
            
            # Fetch content from each URL
            texts = []
            for url in urls:
                self.logger.info(f"Fetching content from: {url}")
                content = self.web_crawler.fetch_page_content(url)
                texts.append(content)

            # Create and save FAISS index
            self.logger.info(f"Creating FAISS index: {index_name}")
            index = self.faiss_manager.create_or_load_faiss_index(texts, index_name)
            self.faiss_manager.save_faiss_index(index, index_name)

            return f"Successfully indexed {len(texts)} pages for {index_name}"
        except Exception as e:
            self.logger.error(f"Error in crawl_and_index: {e}")
            raise