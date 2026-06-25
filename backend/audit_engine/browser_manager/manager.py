from .chrome import launch_chrome
from .edge import launch_edge
from .firefox import launch_firefox

async def get_browser(browser_name: str):
    browser_name = browser_name.lower().strip()
    if browser_name == "chrome":
        return await launch_chrome()
    elif browser_name == "edge":
        return await launch_edge()
    elif browser_name == "firefox":
        return await launch_firefox()
    else:
        raise ValueError(f"Unsupported browser: {browser_name}. Supported: chrome, edge, firefox")
