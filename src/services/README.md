# Company Research Services

This directory contains the modular company research services broken down into focused components for better maintainability and testability.

## Structure

```
src/services/
├── company_researcher.py          # Main orchestrator
├── utils/
│   ├── __init__.py
│   └── url_extractor.py          # URL extraction utilities
├── search/
│   ├── __init__.py
│   ├── groq_search.py            # GROQ web search implementation
│   ├── playwright_search.py      # Playwright fallback search
│   └── search_manager.py         # Search coordination and fallback logic
└── research/
    ├── __init__.py
    ├── llm_processor.py          # LLM processing and prompt management
    └── structured_researcher.py  # Structured research with multiple queries
```

## Components

### Main Orchestrator (`company_researcher.py`)
- **Purpose**: Main entry point that coordinates all research operations
- **Methods**:
  - `research_company()`: Comprehensive research with structured JSON output
  - `get_quick_company_info()`: Quick research with markdown output
  - `research_company_structured()`: Structured research with multiple queries per section

### Search Module (`search/`)
- **`groq_search.py`**: Handles GROQ compound-beta web search
- **`playwright_search.py`**: Playwright-based Google search fallback
- **`search_manager.py`**: Coordinates between GROQ and Playwright with fallback logic

### Research Module (`research/`)
- **`llm_processor.py`**: LLM processing, prompt management, and JSON parsing
- **`structured_researcher.py`**: Multi-query structured research per section

### Utils Module (`utils/`)
- **`url_extractor.py`**: URL extraction from text using regex

## Usage

```python
from src.services.company_researcher import CompanyResearcher

# Initialize the researcher
researcher = CompanyResearcher()

# Quick research
result = researcher.get_quick_company_info("OpenAI", "San Francisco")

# Comprehensive research (structured JSON)
result = researcher.research_company("OpenAI", "San Francisco")

# Structured research (multiple queries per section)
result = researcher.research_company_structured("OpenAI", "San Francisco")
```

## Benefits of Modular Structure

1. **Separation of Concerns**: Each module has a specific responsibility
2. **Testability**: Individual components can be tested in isolation
3. **Maintainability**: Easier to modify or extend specific functionality
4. **Reusability**: Components can be reused in different contexts
5. **Error Isolation**: Issues in one component don't affect others

## Dependencies

- `groq`: GROQ API client
- `langchain-groq`: LangChain integration with GROQ
- `playwright`: Web scraping and automation
- `langchain`: LLM framework and utilities 