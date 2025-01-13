import axios from "axios";

class DataUtils {
    async fetchAndCleanPageContent(url: string): Promise<string> {
        try {
            const response = await axios.get(url);
            let pageContent = response.data;

            // Clean the fetched content (e.g., remove unwanted HTML tags, scripts, etc.)
            pageContent = this.cleanContent(pageContent);
            console.log(`Cleaned content for URL: ${url}`);
            return pageContent;
        } catch (error) {
            console.error(`Failed to fetch content from URL: ${url}`, error);
            return ''; // Return empty content if fetching fails
        }
    }

    private cleanContent(content: string): string {
        // Example content cleaning (e.g., remove scripts, unwanted tags, etc.)
        // You can extend this logic based on your specific cleaning needs
        let cleanedContent = content;

        // Remove script and style tags
        cleanedContent = cleanedContent.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
        cleanedContent = cleanedContent.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

        // Remove any other unwanted HTML tags or attributes
        cleanedContent = cleanedContent.replace(/<\/?[^>]+(>|$)/g, ''); // Remove all HTML tags

        // Optionally, clean whitespace or unwanted characters
        cleanedContent = cleanedContent.trim();

        return cleanedContent;
    }

    private cleanUrls(urls: string[]): string[] {
        // Example cleaning logic for URLs:
        return urls
            .filter((url) => url.startsWith('https://')) // Only keep HTTPS URLs
            .filter((url) => !url.includes('?')) // Remove URLs with query parameters
            .filter((url) => !url.match(/\.(jpg|jpeg|png|gif|svg|pdf)$/i)) // Exclude URLs to static assets
            .filter((url, index, self) => self.indexOf(url) === index) // Remove duplicates
            .map((url) => url.trim()); // Trim whitespace
    }
}

export default DataUtils;