from typing import Dict, Any, List
from .javascript_errors import compare_js_errors
from .network_failures import compare_network_failures
from .dom_comparison import compare_dom

def run_compatibility_analysis(browser_results: Dict[str, Dict[str, Any]]) -> Dict[str, Any]:
    issues = []
    
    js_issues = compare_js_errors(browser_results)
    net_issues = compare_network_failures(browser_results)
    dom_issues = compare_dom(browser_results)
    
    issues.extend(js_issues)
    issues.extend(net_issues)
    issues.extend(dom_issues)
    
    return {
        "browser_differences": issues
    }
