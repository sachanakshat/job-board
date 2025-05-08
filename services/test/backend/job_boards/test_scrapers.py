import pytest
from unittest.mock import patch, MagicMock
from datetime import datetime

# Import scrapers
from app.job_boards.base import BaseScraper
from app.job_boards.indeed import IndeedScraper
from app.job_boards.linkedin import LinkedInScraper

@pytest.fixture
def mock_page():
    """Create a mock Playwright page"""
    page = MagicMock()
    page.goto = MagicMock()
    page.wait_for_selector = MagicMock()
    page.query_selector = MagicMock()
    page.query_selector_all = MagicMock()
    page.evaluate = MagicMock()
    return page

@pytest.fixture
def mock_browser():
    """Create a mock Playwright browser"""
    browser = MagicMock()
    browser.new_page = MagicMock(return_value=mock_page())
    return browser

@pytest.fixture
def mock_playwright():
    """Create a mock Playwright instance"""
    playwright = MagicMock()
    playwright.chromium = MagicMock()
    playwright.chromium.launch = MagicMock(return_value=mock_browser())
    return playwright

def test_base_scraper_initialization():
    """Test BaseScraper initialization"""
    scraper = BaseScraper("https://example.com/job/123")
    assert scraper.url == "https://example.com/job/123"
    assert scraper.job_data == {}

def test_base_scraper_abstract_methods():
    """Test BaseScraper abstract methods"""
    scraper = BaseScraper("https://example.com/job/123")
    
    with pytest.raises(NotImplementedError):
        scraper.scrape()
    
    with pytest.raises(NotImplementedError):
        scraper.parse_job_data()

@patch('app.job_boards.indeed.sync_playwright')
def test_indeed_scraper(mock_playwright, mock_page):
    """Test IndeedScraper"""
    # Mock Playwright
    mock_playwright.return_value = mock_playwright
    mock_playwright.chromium.launch.return_value.new_page.return_value = mock_page
    
    # Mock page content
    mock_page.evaluate.return_value = {
        "title": "Software Engineer",
        "company": "Example Corp",
        "location": "Remote",
        "description": "Job description",
        "salary": "$100k - $150k"
    }
    
    # Create scraper
    scraper = IndeedScraper("https://indeed.com/job/123")
    
    # Test scraping
    job_data = scraper.scrape()
    
    # Verify results
    assert job_data["title"] == "Software Engineer"
    assert job_data["company"] == "Example Corp"
    assert job_data["location"] == "Remote"
    assert job_data["description"] == "Job description"
    assert job_data["salary"] == "$100k - $150k"
    
    # Verify Playwright calls
    mock_page.goto.assert_called_once_with("https://indeed.com/job/123")
    mock_page.wait_for_selector.assert_called()

@patch('app.job_boards.linkedin.sync_playwright')
def test_linkedin_scraper(mock_playwright, mock_page):
    """Test LinkedInScraper"""
    # Mock Playwright
    mock_playwright.return_value = mock_playwright
    mock_playwright.chromium.launch.return_value.new_page.return_value = mock_page
    
    # Mock page content
    mock_page.evaluate.return_value = {
        "title": "Senior Developer",
        "company": "Tech Corp",
        "location": "San Francisco",
        "description": "Job description",
        "salary": "Not specified"
    }
    
    # Create scraper
    scraper = LinkedInScraper("https://linkedin.com/job/123")
    
    # Test scraping
    job_data = scraper.scrape()
    
    # Verify results
    assert job_data["title"] == "Senior Developer"
    assert job_data["company"] == "Tech Corp"
    assert job_data["location"] == "San Francisco"
    assert job_data["description"] == "Job description"
    assert job_data["salary"] == "Not specified"
    
    # Verify Playwright calls
    mock_page.goto.assert_called_once_with("https://linkedin.com/job/123")
    mock_page.wait_for_selector.assert_called()

def test_scraper_error_handling():
    """Test scraper error handling"""
    # Create scraper with invalid URL
    scraper = IndeedScraper("invalid-url")
    
    # Test scraping with error
    with pytest.raises(Exception):
        scraper.scrape()

def test_scraper_timeout():
    """Test scraper timeout handling"""
    # Create scraper
    scraper = IndeedScraper("https://indeed.com/job/123")
    
    # Mock page with timeout
    mock_page = MagicMock()
    mock_page.wait_for_selector.side_effect = Exception("Timeout")
    
    # Test scraping with timeout
    with pytest.raises(Exception):
        scraper.scrape()

def test_scraper_retry():
    """Test scraper retry mechanism"""
    # Create scraper
    scraper = IndeedScraper("https://indeed.com/job/123")
    
    # Mock page with initial failure then success
    mock_page = MagicMock()
    mock_page.wait_for_selector.side_effect = [
        Exception("Timeout"),
        None  # Success on retry
    ]
    
    # Test scraping with retry
    job_data = scraper.scrape()
    assert job_data is not None 