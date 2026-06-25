from typing import List, Dict, Any
from .severity import Severity
from .categorizer import Category

def format_issue(severity: str, category: str, title: str, description: str) -> Dict[str, str]:
    return {
        "severity": severity,
        "category": category,
        "title": title,
        "description": description
    }

def collect_all_issues(*issue_lists: List[Dict[str, str]]) -> List[Dict[str, str]]:
    all_issues = []
    for issue_list in issue_lists:
        all_issues.extend(issue_list)
    return all_issues
