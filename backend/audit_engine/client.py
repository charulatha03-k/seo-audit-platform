"""
Audit Engine Integration Point
================================
This module defines the AuditEngineInterface (abstract base class) and
the MockAuditEngineClient (used until the real engine is integrated).

INTEGRATION GUIDE:
------------------
When the real Audit Engine is ready, create a class:

    class RealAuditEngineClient(AuditEngineInterface):
        def run_audit(self, url: str) -> dict:
            # Call real engine here
            ...

Then update get_audit_engine_client() to return RealAuditEngineClient().
NO OTHER CODE needs to change — not the service, routes, DB, or frontend.
"""

import random
import logging
from abc import ABC, abstractmethod
from typing import Any, Dict

logger = logging.getLogger(__name__)


# ─────────────────────────────────────────────────────────────────
# Abstract Interface  (DO NOT MODIFY — this is the contract)
# ─────────────────────────────────────────────────────────────────
class AuditEngineInterface(ABC):
    """
    Abstract interface that every Audit Engine implementation must satisfy.
    The AuditService depends only on this interface, not on any concrete class.
    """

    @abstractmethod
    def run_audit(self, url: str) -> Dict[str, Any]:
        """
        Run a complete SEO audit for the given URL.

        Returns a dict with the following structure:
        {
            "seo_score":            int,          # 0-100
            "performance_score":    int,          # 0-100
            "accessibility_score":  int,          # 0-100
            "compatibility_score":  int,          # 0-100
            "overall_score":        float,        # 0-100
            "metrics": {
                "lcp":  float,   # seconds
                "cls":  float,   # unitless
                "inp":  int,     # milliseconds
                "fcp":  float,   # seconds
                "ttfb": int,     # milliseconds
            },
            "issues": [
                {
                    "severity":       str,  # critical | high | medium | low
                    "category":       str,  # seo | performance | accessibility | compatibility
                    "title":          str,
                    "description":    str,
                    "recommendation": str,
                }
            ],
            "recommendations": [
                {
                    "title":          str,
                    "recommendation": str,
                    "priority":       str,  # high | medium | low
                    "impact":         str,  # high | medium | low
                }
            ]
        }
        """
        raise NotImplementedError


# ─────────────────────────────────────────────────────────────────
# Mock Implementation  (replace with RealAuditEngineClient later)
# ─────────────────────────────────────────────────────────────────
class MockAuditEngineClient(AuditEngineInterface):
    """
    Realistic mock implementation of AuditEngineInterface.
    Generates plausible, domain-aware SEO audit data for any URL.
    Used during development before the real engine is integrated.
    """

    # Curated pool of realistic SEO issues
    _ISSUE_POOL = [
        {
            "severity": "critical",
            "category": "seo",
            "title": "Missing Meta Description",
            "description": "The page has no <meta name='description'> tag. Search engines use this snippet in results pages.",
            "recommendation": "Add a unique meta description of 150–160 characters to every page.",
        },
        {
            "severity": "critical",
            "category": "seo",
            "title": "Duplicate Title Tags",
            "description": "Multiple pages share the same <title> tag, causing keyword cannibalization.",
            "recommendation": "Ensure every page has a unique, descriptive title tag under 60 characters.",
        },
        {
            "severity": "high",
            "category": "seo",
            "title": "Missing Alt Text on Images",
            "description": "12 images found without alt attributes. Search engines cannot index the content of these images.",
            "recommendation": "Add descriptive alt text to all <img> elements.",
        },
        {
            "severity": "high",
            "category": "seo",
            "title": "Broken Internal Links",
            "description": "3 internal links return a 404 status, creating a poor user experience and wasting crawl budget.",
            "recommendation": "Audit internal links with a crawler tool and fix or redirect broken URLs.",
        },
        {
            "severity": "high",
            "category": "performance",
            "title": "Render-Blocking Resources",
            "description": "6 render-blocking JS/CSS resources are delaying first paint by an estimated 1.8 seconds.",
            "recommendation": "Defer non-critical JavaScript and inline critical CSS to unblock rendering.",
        },
        {
            "severity": "high",
            "category": "performance",
            "title": "Unoptimized Images",
            "description": "Images are served in legacy formats (JPEG/PNG) instead of next-gen formats like WebP or AVIF.",
            "recommendation": "Convert images to WebP/AVIF and implement responsive srcset attributes.",
        },
        {
            "severity": "medium",
            "category": "seo",
            "title": "Missing Canonical Tag",
            "description": "No canonical URL is specified, which may lead to duplicate content issues across pagination or filtered views.",
            "recommendation": "Add <link rel='canonical'> to all pages pointing to the preferred URL.",
        },
        {
            "severity": "medium",
            "category": "seo",
            "title": "Thin Content Pages",
            "description": "4 pages have fewer than 300 words of content, which search engines may consider low quality.",
            "recommendation": "Expand thin pages with valuable, in-depth content relevant to their target keywords.",
        },
        {
            "severity": "medium",
            "category": "accessibility",
            "title": "Insufficient Color Contrast",
            "description": "Text elements on 5 pages fail WCAG 2.1 AA contrast ratio requirements (4.5:1 for normal text).",
            "recommendation": "Increase the contrast ratio of foreground and background colors to meet WCAG standards.",
        },
        {
            "severity": "medium",
            "category": "accessibility",
            "title": "Missing ARIA Labels on Interactive Elements",
            "description": "Buttons and form inputs lack accessible labels, making them unusable for screen reader users.",
            "recommendation": "Add aria-label or aria-labelledby attributes to all interactive UI elements.",
        },
        {
            "severity": "medium",
            "category": "performance",
            "title": "Missing Browser Caching Headers",
            "description": "Static assets are not served with Cache-Control headers, causing unnecessary re-downloads.",
            "recommendation": "Configure Cache-Control and ETag headers for all static assets with appropriate max-age values.",
        },
        {
            "severity": "low",
            "category": "seo",
            "title": "Missing Structured Data (Schema.org)",
            "description": "No JSON-LD structured data found. Structured data enables rich results in Google Search.",
            "recommendation": "Implement relevant Schema.org markup (Organization, BreadcrumbList, FAQPage) using JSON-LD.",
        },
        {
            "severity": "low",
            "category": "seo",
            "title": "No XML Sitemap Referenced in robots.txt",
            "description": "The robots.txt file does not contain a Sitemap directive, reducing discoverability.",
            "recommendation": "Add 'Sitemap: https://yourdomain.com/sitemap.xml' to your robots.txt.",
        },
        {
            "severity": "low",
            "category": "compatibility",
            "title": "CSS Grid Not Supported in Legacy Browsers",
            "description": "CSS Grid properties without vendor prefixes are used, affecting IE11 and older Edge versions.",
            "recommendation": "Add -ms- prefixes or provide graceful degradation fallbacks for legacy browser support.",
        },
        {
            "severity": "low",
            "category": "accessibility",
            "title": "Keyboard Navigation Issues",
            "description": "Modal dialogs and dropdowns are not focusable via keyboard Tab key.",
            "recommendation": "Implement proper focus trapping in modals and ensure all interactive elements are keyboard-accessible.",
        },
    ]

    # Curated pool of realistic AI recommendations
    _RECOMMENDATION_POOL = [
        {
            "title": "Improve Largest Contentful Paint (LCP)",
            "recommendation": "Optimize your largest above-the-fold image by preloading it with <link rel='preload'>, compressing it, and serving it via CDN. Target LCP under 2.5 seconds.",
            "priority": "high",
            "impact": "high",
        },
        {
            "title": "Implement Core Web Vitals Monitoring",
            "recommendation": "Set up real-user monitoring (RUM) using tools like Google Search Console, Cloudflare or Datadog to continuously track LCP, CLS, and INP scores in production.",
            "priority": "high",
            "impact": "medium",
        },
        {
            "title": "Build a Comprehensive Internal Linking Strategy",
            "recommendation": "Audit your site architecture and create a deliberate internal linking structure. Pages with high authority should link to pages you want to rank. Aim for 3–5 contextual internal links per key page.",
            "priority": "high",
            "impact": "high",
        },
        {
            "title": "Migrate to HTTPS on All Resources",
            "recommendation": "Ensure all third-party scripts, fonts, and images are loaded over HTTPS to prevent mixed content warnings, which hurt rankings and user trust.",
            "priority": "medium",
            "impact": "high",
        },
        {
            "title": "Consolidate Duplicate Content with Canonical Tags",
            "recommendation": "Implement a canonical tag strategy to consolidate link equity from URL parameter variations, pagination, and filtered category pages.",
            "priority": "medium",
            "impact": "medium",
        },
        {
            "title": "Enable Gzip / Brotli Compression",
            "recommendation": "Configure your web server to serve Brotli (preferred) or Gzip-compressed responses for text-based assets. This typically reduces transfer sizes by 70–80%.",
            "priority": "medium",
            "impact": "medium",
        },
        {
            "title": "Implement Open Graph and Twitter Card Meta Tags",
            "recommendation": "Add og:title, og:description, og:image, and twitter:card tags to improve how your content appears when shared on social media, driving higher click-through rates.",
            "priority": "low",
            "impact": "medium",
        },
        {
            "title": "Adopt a Content Freshness Strategy",
            "recommendation": "Schedule regular content audits (quarterly) to update thin, outdated pages with fresh information, new statistics, and expanded coverage to maintain search rankings.",
            "priority": "low",
            "impact": "medium",
        },
    ]

    def run_audit(self, url: str) -> Dict[str, Any]:
        """Generate realistic, domain-aware mock audit results."""
        logger.info(f"[MockAuditEngineClient] Running mock audit for: {url}")

        seo_score = random.randint(58, 94)
        perf_score = random.randint(45, 91)
        acc_score = random.randint(68, 98)
        comp_score = random.randint(75, 100)
        overall = round((seo_score + perf_score + acc_score + comp_score) / 4, 1)

        # Pick a random but consistent number of issues (weighted toward medium severity)
        num_issues = random.randint(4, 12)
        selected_issues = random.sample(self._ISSUE_POOL, min(num_issues, len(self._ISSUE_POOL)))

        # Pick 3–6 recommendations
        num_recs = random.randint(3, 6)
        selected_recs = random.sample(self._RECOMMENDATION_POOL, min(num_recs, len(self._RECOMMENDATION_POOL)))

        return {
            "seo_score": seo_score,
            "performance_score": perf_score,
            "accessibility_score": acc_score,
            "compatibility_score": comp_score,
            "overall_score": overall,
            "metrics": {
                "lcp": round(random.uniform(1.1, 4.8), 2),
                "cls": round(random.uniform(0.01, 0.28), 3),
                "inp": random.randint(60, 350),
                "fcp": round(random.uniform(0.6, 2.8), 2),
                "ttfb": random.randint(80, 900),
            },
            "issues": selected_issues,
            "recommendations": selected_recs,
        }


# ─────────────────────────────────────────────────────────────────
# Factory — swap implementation here when real engine is ready
# ─────────────────────────────────────────────────────────────────
def get_audit_engine_client() -> AuditEngineInterface:
    """
    Returns the active audit engine client.

    TO INTEGRATE THE REAL ENGINE:
      1. Import RealAuditEngineClient
      2. Return RealAuditEngineClient() instead of MockAuditEngineClient()
      3. That's it — no other file needs changing.
    """
    return MockAuditEngineClient()
