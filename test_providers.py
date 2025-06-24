#!/usr/bin/env python3
"""
Test script to verify provider functionality for company research.
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add src to path
sys.path.append('src')

def test_provider_initialization():
    """Test that providers can be initialized correctly."""
    print("Testing provider initialization...")
    
    try:
        from services.company_researcher import CompanyResearcher
        
        # Test GROQ provider
        print("  Testing GROQ provider...")
        groq_researcher = CompanyResearcher(search_provider="groq", llm_provider="groq")
        print("    ✓ GROQ provider initialized successfully")
        
        # Test Gemini provider (if API key available)
        if os.getenv('GOOGLE_API_KEY'):
            print("  Testing Gemini provider...")
            gemini_researcher = CompanyResearcher(search_provider="gemini", llm_provider="gemini")
            print("    ✓ Gemini provider initialized successfully")
        else:
            print("    ⚠ GOOGLE_API_KEY not found, skipping Gemini test")
        
        # Test mixed providers
        print("  Testing mixed providers...")
        mixed_researcher = CompanyResearcher(search_provider="groq", llm_provider="gemini")
        print("    ✓ Mixed providers initialized successfully")
        
        return True
        
    except Exception as e:
        print(f"    ✗ Provider initialization failed: {e}")
        return False

def test_available_providers():
    """Test getting available providers."""
    print("\nTesting available providers...")
    
    try:
        from services.company_researcher import CompanyResearcher
        
        researcher = CompanyResearcher()
        providers = researcher.get_available_providers()
        
        print(f"  Available search providers: {providers['search_providers']}")
        print(f"  Available LLM providers: {providers['llm_providers']}")
        
        return True
        
    except Exception as e:
        print(f"  ✗ Getting available providers failed: {e}")
        return False

def test_search_functionality():
    """Test search functionality with different providers."""
    print("\nTesting search functionality...")
    
    try:
        from services.search.search_manager import SearchManager
        
        # Test GROQ search
        print("  Testing GROQ search...")
        groq_manager = SearchManager(primary_provider="groq")
        result = groq_manager.search_with_fallback("OpenAI company")
        print(f"    ✓ GROQ search completed: {len(result.get('content', ''))} characters")
        
        # Test Gemini search (if available)
        if os.getenv('GOOGLE_API_KEY'):
            print("  Testing Gemini search...")
            gemini_manager = SearchManager(primary_provider="gemini")
            result = gemini_manager.search_with_fallback("OpenAI company")
            print(f"    ✓ Gemini search completed: {len(result.get('content', ''))} characters")
        else:
            print("    ⚠ GOOGLE_API_KEY not found, skipping Gemini search test")
        
        return True
        
    except Exception as e:
        print(f"  ✗ Search functionality failed: {e}")
        return False

def main():
    """Run all tests."""
    print("=== Provider Functionality Test ===\n")
    
    tests = [
        test_provider_initialization,
        test_available_providers,
        test_search_functionality
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
    
    print(f"\n=== Test Results ===")
    print(f"Passed: {passed}/{total}")
    
    if passed == total:
        print("✓ All tests passed!")
        return 0
    else:
        print("✗ Some tests failed!")
        return 1

if __name__ == "__main__":
    exit(main()) 