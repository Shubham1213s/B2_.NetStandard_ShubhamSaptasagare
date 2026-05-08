# utils/classifier.py — Regex-based type and severity detection
import re

# --- Pre-compiled patterns ---
_NETWORK_RE = re.compile(
    r"\b(\d{1,3}\.){3}\d{1,3}\b"          # IP address
    r"|TCP|UDP|ICMP|VLAN|switch|firewall"
    r"|DNS|packet\s+loss|routing|subnet|bandwidth|latency|ping",
    re.IGNORECASE,
)

_SECURITY_RE = re.compile(
    r"breach|ransomware|brute[- ]force|malware|phishing"
    r"|unauthorized|intrusion|exploit|vulnerability|CVE|threat"
    r"|suspicious\s+login|attack",
    re.IGNORECASE,
)

_APP_RE = re.compile(
    r"error\s*code|NullPointerException|HTTP[- ]\d{3}"
    r"|stack\s*trace|exception|timeout|crash|500|503|404"
    r"|service\s+returning|API\s+response|latency|P95"
    r"|checkout|payment|gateway",
    re.IGNORECASE,
)

# Severity keyword patterns
_CRITICAL_RE = re.compile(
    r"outage|down|breach|ransomware|production|prod[- ]|critical",
    re.IGNORECASE,
)
_HIGH_RE = re.compile(
    r"timeout|failing|unavailable|unreachable|NullPointerException|HTTP[- ]503",
    re.IGNORECASE,
)
_MEDIUM_RE = re.compile(
    r"slow|degraded|warning|intermittent|packet\s+loss|phishing|latency",
    re.IGNORECASE,
)


def detect_type(text: str) -> str:
    """Return 'network', 'security', 'app', or 'general'."""
    if _SECURITY_RE.search(text):
        return "security"
    if _NETWORK_RE.search(text):
        return "network"
    if _APP_RE.search(text):
        return "app"
    return "general"


def detect_severity(text: str) -> str:
    """Return 'critical', 'high', 'medium', or 'low'."""
    if _CRITICAL_RE.search(text):
        return "critical"
    if _HIGH_RE.search(text):
        return "high"
    if _MEDIUM_RE.search(text):
        return "medium"
    return "low"
