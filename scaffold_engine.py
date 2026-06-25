import os

files = {
    'backend/audit_engine/client.py': '''import random
from typing import Dict, Any

class AuditEngineClient:
    def __init__(self):
        pass

    def run_audit(self, url: str) -> Dict[str, Any]:
        """
        Simulates running an SEO audit on a URL and returns realistic random data.
        """
        seo_score = random.randint(60, 95)
        perf_score = random.randint(50, 90)
        acc_score = random.randint(70, 98)
        comp_score = random.randint(80, 100)
        
        overall = (seo_score + perf_score + acc_score + comp_score) / 4

        return {
            "seo_score": seo_score,
            "performance_score": perf_score,
            "accessibility_score": acc_score,
            "compatibility_score": comp_score,
            "overall_score": overall,
            "metrics": {
                "lcp": round(random.uniform(1.0, 4.5), 1),
                "cls": round(random.uniform(0.01, 0.25), 2),
                "inp": random.randint(50, 300),
                "fcp": round(random.uniform(0.5, 2.5), 1),
                "ttfb": random.randint(100, 800)
            },
            "issues": [
                {
                    "severity": random.choice(["critical", "high", "medium", "low"]),
                    "category": random.choice(["seo", "performance", "accessibility", "compatibility"]),
                    "title": f"Sample Issue {i}",
                    "description": "This is a detailed description of the simulated issue found during the audit.",
                    "recommendation": "Here is the recommended action to fix this issue."
                } for i in range(random.randint(3, 10))
            ],
            "recommendations": [
                {
                    "title": f"Recommendation {i}",
                    "recommendation": "This is an AI generated recommendation based on the issues found.",
                    "priority": random.choice(["high", "medium", "low"]),
                    "impact": random.choice(["high", "medium", "low"])
                } for i in range(random.randint(2, 5))
            ]
        }
'''
}

for filepath, content in files.items():
    os.makedirs(os.path.dirname(filepath), exist_ok=True) if os.path.dirname(filepath) else None
    with open(filepath, 'w') as f:
        f.write(content)
