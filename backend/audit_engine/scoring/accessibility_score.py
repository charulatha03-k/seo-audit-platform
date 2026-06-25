from typing import List, Dict
import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from seo_score import calculate_deductions

def calculate_accessibility_score(issues: List[Dict[str, str]]) -> int:
    a11y_issues = [i for i in issues if i.get("category") == "Accessibility"]
    score = 100 - calculate_deductions(a11y_issues)
    return max(0, score)
