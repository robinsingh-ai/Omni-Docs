from bs4 import BeautifulSoup
from typing import List
from ...utils.logger import logger

class TextCleaner:
    """Clean and preprocess HTML content."""
    
    @staticmethod
    def remove_unwanted_elements(soup: BeautifulSoup) -> None:
        """Remove unwanted HTML elements."""
        unwanted_tags = ["script", "style", "nav", "footer", "header", "form"]
        for element in soup(unwanted_tags):
            element.decompose()
    
    @staticmethod
    def extract_text_from_html(html_content: str) -> str:
        """Extract and clean text from HTML content."""
        try:
            soup = BeautifulSoup(html_content, 'html.parser')
            TextCleaner.remove_unwanted_elements(soup)
            
            # Get text lines and clean them
            lines = [
                line.strip() 
                for line in soup.get_text().splitlines() 
                if line.strip()
            ]
            
            # Filter out short lines and join
            cleaned_text = ' '.join(
                line for line in lines 
                if len(line) > 25  # Filter out very short lines
            )
            
            return cleaned_text
            
        except Exception as e:
            logger.error(f"Error cleaning HTML content: {str(e)}")
            return ""
    
    @staticmethod
    def clean_text(text: str) -> str:
        """Clean plain text content."""
        try:
            # Split into lines and clean
            lines = [line.strip() for line in text.splitlines()]
            
            # Remove empty lines and join
            cleaned_text = ' '.join(
                line for line in lines 
                if line and len(line) > 25
            )
            
            return cleaned_text
            
        except Exception as e:
            logger.error(f"Error cleaning text: {str(e)}")
            return ""