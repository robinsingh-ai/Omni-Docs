import requests
import xmltodict
from typing import List, Optional
from tqdm import tqdm
from ...core.config import Config
from ...utils.logger import logger
from .cleaner import TextCleaner

class URLFetcher:
    """Fetch and process URLs from sitemaps."""
    
    def __init__(self):
        self.config = Config()
        self.timeout = self.config.processing_configs["request_timeout"]
        self.max_retries = self.config.processing_configs["max_retries"]
    
    def fetch_sitemap(self, sitemap_url: str) -> List[str]:
        """Fetch URLs from sitemap with error handling and retries."""
        urls = []
        retries = 0
        
        while retries < self.max_retries:
            try:
                logger.info(f"Fetching sitemap from {sitemap_url}")
                response = requests.get(sitemap_url, timeout=self.timeout)
                response.raise_for_status()
                
                sitemap_dict = xmltodict.parse(response.content)
                urls = [url['loc'] for url in sitemap_dict['urlset']['url']]
                
                logger.info(f"Found {len(urls)} URLs in sitemap")
                return urls
                
            except Exception as e:
                retries += 1
                logger.error(f"Error fetching sitemap (attempt {retries}/{self.max_retries}): {str(e)}")
                if retries == self.max_retries:
                    logger.error(f"Failed to fetch sitemap after {self.max_retries} attempts")
                    return []
        
        return urls
    
    def fetch_url_content(self, url: str) -> Optional[str]:
        """Fetch and clean content from a single URL."""
        retries = 0
        
        while retries < self.max_retries:
            try:
                response = requests.get(url, timeout=self.timeout)
                response.raise_for_status()
                
                # Clean the content
                cleaned_content = TextCleaner.extract_text_from_html(response.content)
                
                if not cleaned_content:
                    logger.warning(f"No content extracted from {url}")
                    return None
                    
                return cleaned_content
                
            except Exception as e:
                retries += 1
                logger.error(f"Error fetching {url} (attempt {retries}/{self.max_retries}): {str(e)}")
                if retries == self.max_retries:
                    return None
    
    def fetch_all_contents(self, urls: List[str]) -> dict:
        """Fetch content from multiple URLs with progress bar."""
        contents = {}
        
        for url in tqdm(urls, desc="Fetching URLs"):
            content = self.fetch_url_content(url)
            if content:
                contents[url] = content
        
        logger.info(f"Successfully fetched {len(contents)} out of {len(urls)} URLs")
        return contents