from typing import List, Dict
import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from seo_score import calculate_deductions

def calculate_performance_score(issues: List[Dict[str, str]]) -> int:
    perf_issues = [i for i in issues if i.get("category") == "Performance"]
    score = 100 - calculate_deductions(perf_issues)
    return max(0, score)
