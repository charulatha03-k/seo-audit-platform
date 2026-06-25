from audit_engine.orchestrator import run_audit

class AuditEngineClient:
    def run_audit(self, url: str) -> dict:
        return run_audit(url)

def get_audit_engine_client():
    return AuditEngineClient()
