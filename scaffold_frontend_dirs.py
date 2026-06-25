import os

dirs = [
    "app/dashboard",
    "app/audits/new",
    "app/audits/[id]",
    "app/issues",
    "app/recommendations",
    "app/comparison",
    "app/history",
    "app/reports",
    "app/login",
    "app/settings",
    "components/dashboard",
    "components/audit",
    "components/charts",
    "components/issues",
    "components/reports",
    "components/common",
    "services",
    "hooks",
    "types",
    "utils",
    "store"
]

for d in dirs:
    os.makedirs(f"frontend/{d}", exist_ok=True)
