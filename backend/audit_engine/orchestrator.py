import asyncio
import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from bs4 import BeautifulSoup

from crawler.playwright_crawler import crawl_page
from browser_manager.manager import get_browser

from extractor.metadata import extract_metadata
from extractor.headings import extract_headings
from extractor.images import extract_images
from extractor.links import extract_links
from extractor.schema import extract_schema

from seo.title_checker import check_title
from seo.meta_checker import check_meta_description
from seo.heading_checker import check_headings as check_seo_headings
from seo.canonical_checker import check_canonical
from seo.robots_checker import check_robots_txt
from seo.sitemap_checker import check_sitemap
from seo.link_checker import check_links as check_seo_links

from performance.page_speed import analyze_performance

from accessibility.aria_checker import check_aria
from accessibility.keyboard_navigation import check_keyboard_nav
from accessibility.contrast_checker import check_contrast

from compatibility.browser_comparison import run_compatibility_analysis

from issue_detector.detector import collect_all_issues

from scoring.seo_score import calculate_seo_score
from scoring.performance_score import calculate_performance_score
from scoring.accessibility_score import calculate_accessibility_score
from scoring.compatibility_score import calculate_compatibility_score
from scoring.overall_score import calculate_overall_score

from ai.recommendation_generator import generate_recommendations


async def crawl_with_browser(url: str, browser_type: str):
    browser, pw = await get_browser(browser_type)
    data = await crawl_page(url, browser)
    await pw.stop()
    return data

async def analyze_perf(url: str):
    browser, pw = await get_browser("chrome")
    results = await analyze_performance(url, browser)
    await pw.stop()
    return results

async def async_run_audit(url: str) -> dict:
    # Step 1 & 2: Launch Browsers & Crawl concurrently
    chrome_data, edge_data, firefox_data, perf_results = await asyncio.gather(
        crawl_with_browser(url, "chrome"),
        crawl_with_browser(url, "edge"),
        crawl_with_browser(url, "firefox"),
        analyze_perf(url)
    )

    browser_results = {
        "chrome": chrome_data,
        "edge": edge_data,
        "firefox": firefox_data
    }

    # Step 3: Extract HTML Data (using Chrome's HTML as base)
    html = chrome_data.get("html", "")
    soup = BeautifulSoup(html, "lxml")
    
    metadata = extract_metadata(soup)
    headings = extract_headings(soup)
    images = extract_images(soup)
    links_data = extract_links(soup, url)
    schemas = extract_schema(soup)
    
    # Step 4: Run SEO Analysis
    seo_issues = collect_all_issues(
        check_title(metadata),
        check_meta_description(metadata),
        check_seo_headings(headings),
        check_canonical(metadata),
        await check_robots_txt(url),
        await check_sitemap(url),
        check_seo_links(links_data, chrome_data.get("network_requests", []))
    )
    
    # Step 5: Run Performance Analysis
    perf_issues = perf_results.get("issues", [])
    metrics = perf_results.get("metrics", {})
    
    # Step 6: Run Accessibility Analysis
    a11y_issues = collect_all_issues(
        check_aria(soup),
        check_keyboard_nav(soup),
        check_contrast(soup)
    )
    
    # Step 7: Run Browser Compatibility Analysis
    comp_results = run_compatibility_analysis(browser_results)
    comp_issues = comp_results.get("browser_differences", [])
    
    # Step 8: Detect Issues
    all_issues = collect_all_issues(seo_issues, perf_issues, a11y_issues, comp_issues)
    
    # Step 9: Calculate Scores
    seo_score = calculate_seo_score(all_issues)
    perf_score = calculate_performance_score(all_issues)
    a11y_score = calculate_accessibility_score(all_issues)
    comp_score = calculate_compatibility_score(all_issues)
    overall_score = calculate_overall_score(seo_score, perf_score, a11y_score, comp_score)
    
    # Step 10: Generate AI Recommendations
    recommendations = await generate_recommendations(all_issues)
    
    # Step 11: Return Final JSON
    return {
        "url": url,
        "seo_score": seo_score,
        "performance_score": perf_score,
        "accessibility_score": a11y_score,
        "compatibility_score": comp_score,
        "overall_score": overall_score,
        "issues": all_issues,
        "recommendations": recommendations,
        "metrics": metrics,
        "browser_results": {
            "chrome": {
                "screenshot": chrome_data.get("screenshot")
            },
            "edge": {
                "screenshot": edge_data.get("screenshot")
            },
            "firefox": {
                "screenshot": firefox_data.get("screenshot")
            }
        }
    }

def run_audit(url: str) -> dict:
    return asyncio.run(async_run_audit(url))
