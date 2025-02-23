import argparse
from pathlib import Path
import sys

# Add project root to Python path
project_root = Path(__file__).parent.parent
sys.path.append(str(project_root))

from app.core.enums import DocSource
from app.retrieval.base import RetrievalPipeline
from app.utils.logger import logger

def parse_args():
    parser = argparse.ArgumentParser(
        description="Initialize documentation sources for retrieval pipeline"
    )
    parser.add_argument(
        '--sources',
        nargs='+',
        choices=[source.value for source in DocSource],
        help='Specific sources to initialize (default: all sources)'
    )
    parser.add_argument(
        '--force',
        action='store_true',
        help='Force reprocessing even if data exists'
    )
    return parser.parse_args()

def main():
    args = parse_args()
    pipeline = RetrievalPipeline()
    
    # Determine which sources to process
    sources_to_process = (
        [DocSource(source) for source in args.sources]
        if args.sources
        else list(DocSource)
    )
    
    for source in sources_to_process:
        try:
            logger.info(f"\nProcessing {source.value} documentation...")
            
            if not args.force and pipeline.data_manager.check_data_exists(source):
                logger.info(f"Data already exists for {source.value}. Use --force to reprocess.")
                continue
                
            pipeline.process_documents(source)
            
            # Verify the processed data
            pipeline.load_source(source)
            stats = pipeline.get_source_stats()
            
            logger.info(f"\nSuccessfully processed {source.value}:")
            logger.info(f"- Total chunks: {stats['total_chunks']}")
            logger.info(f"- Total URLs: {stats['total_urls']}")
            logger.info(f"- Embedding dimension: {stats['embedding_dimension']}")
            logger.info(f"- Device: {stats['device']}")
            
        except Exception as e:
            logger.error(f"Error processing {source.value}: {str(e)}")
            continue
    
    logger.info("\nInitialization complete!")

if __name__ == "__main__":
    main()