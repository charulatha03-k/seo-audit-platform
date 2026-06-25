def calculate_overall_score(seo: int, perf: int, a11y: int, comp: int) -> int:
    return int((seo + perf + a11y + comp) / 4)
