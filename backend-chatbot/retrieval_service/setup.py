# retrieval_service/setup.py
from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name="retrieval_service",
    version="0.1.0",
    author="Your Name",
    author_email="your.email@example.com",
    description="A microservice for document retrieval and LLM interaction",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/yourusername/retrieval_service",
    packages=find_packages(),  # This is crucial
    python_requires=">=3.9",
   
)