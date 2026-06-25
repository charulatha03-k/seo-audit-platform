from typing import List, Dict

def calculate_deductions(issues: List[Dict[str, str]]) -> int:
    deduction = 0
    for issue in issues:
        severity = issue.get("severity", "Low")
        if severity == "Critical":
            deduction += 20
        elif severity == "High":
            deduction += 10
        elif severity == "Medium":
            deduction += 5
        elif severity == "Low":
            deduction += 2
    return deduction

def calculate_seo_score(issues: List[Dict[str, str]]) -> int:
    seo_issues = [i for i in issues if i.get("category") in ["SEO", "Technical SEO"]]
    score = 100 - calculate_deductions(seo_issues)
    return max(0, score)
