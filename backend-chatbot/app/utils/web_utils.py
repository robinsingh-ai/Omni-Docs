# utils/web_utils.py
import requests
from bs4 import BeautifulSoup
from typing import List
import logging

class WebCrawler:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
    
    def crawl_sitemap(self, sitemap_url: str) -> List[str]:
        try:
            response = requests.get(sitemap_url)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'xml')
            urls = [loc.text for loc in soup.find_all('loc')]
            return urls
        except Exception as e:
            self.logger.error(f"Error crawling sitemap: {e}")
            raise

    def fetch_page_content(self, url: str) -> str:
        try:
            response = requests.get(url)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            
            for element in soup(['script', 'style']):
                element.decompose()
                
            return soup.get_text(separator=' ', strip=True)
        except Exception as e:
            self.logger.error(f"Error fetching page content: {e}")
            raise

    def get_page_title(self, url: str) -> str:
        try:
            response = requests.get(url)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            title = soup.title.string if soup.title else url
            return title.strip()
        except Exception as e:
            self.logger.error(f"Error fetching page title: {e}")
            return url