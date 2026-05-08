# models/incident.py
from datetime import datetime


SEVERITY_ORDER = {"critical": 0, "high": 1, "medium": 2, "low": 3}


class Incident:
    """Base class for all incident types."""

    def __init__(self, id, title, description, reported_by, timestamp, assigned_team):
        self.id = id
        self.title = title
        self.description = description
        self.reported_by = reported_by
        self.timestamp = datetime.fromisoformat(timestamp.replace("Z", "+00:00"))
        self.assigned_team = assigned_team
        self._severity = None   # private — set by classify()
        self.ticket_ids = {}    # populated after API calls

    def classify(self):
        """Must be overridden by every subclass."""
        raise NotImplementedError("Subclasses must implement classify()")

    @property
    def severity(self):
        return self._severity

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "reported_by": self.reported_by,
            "timestamp": self.timestamp.isoformat(),
            "assigned_team": self.assigned_team,
            "severity": self._severity,
            "type": self.__class__.__name__,
            "ticket_ids": self.ticket_ids,
        }

    def __str__(self):
        return (
            f"[{self.__class__.__name__}] {self.id} | {self.title} "
            f"| Severity: {self._severity} | Team: {self.assigned_team}"
        )

    def __repr__(self):
        return (
            f"{self.__class__.__name__}(id={self.id!r}, title={self.title!r}, "
            f"severity={self._severity!r})"
        )

    def __lt__(self, other):
        """Sort by severity: critical < high < medium < low."""
        return SEVERITY_ORDER.get(self._severity, 4) < SEVERITY_ORDER.get(other._severity, 4)

    @staticmethod
    def validate_schema(record: dict) -> bool:
        """Validate that a JSON record has all required fields."""
        required = {"id", "title", "description", "reported_by", "timestamp", "assigned_team"}
        missing = required - record.keys()
        if missing:
            raise ValueError(f"Incident record missing fields: {missing}")
        return True


# ---------------------------------------------------------------------------
# Subclasses
# ---------------------------------------------------------------------------

class NetworkIncident(Incident):
    """Covers network-related incidents: IP issues, protocols, VLANs, switches."""

    def __init__(self, affected_host="", protocol="", **kwargs):
        super().__init__(**kwargs)
        self.affected_host = affected_host
        self.protocol = protocol

    def classify(self):
        from utils.classifier import detect_severity
        combined = f"{self.title} {self.description}"
        self._severity = detect_severity(combined)
        return self._severity

    def escalate(self):
        """Page on-call network team."""
        print(f"[ESCALATE] Paging on-call network team for incident {self.id}: {self.title}")


class AppIncident(Incident):
    """Covers application errors: exceptions, HTTP status codes, stack traces."""

    def __init__(self, app_name="", error_code="", **kwargs):
        super().__init__(**kwargs)
        self.app_name = app_name
        self.error_code = error_code

    def classify(self):
        from utils.classifier import detect_severity
        combined = f"{self.title} {self.description}"
        self._severity = detect_severity(combined)
        return self._severity

    def get_stack_trace(self):
        """Return a log snippet (simulated)."""
        return f"[STACK TRACE] {self.id} — {self.description[:100]}..."


class SecurityIncident(Incident):
    """Covers security threats: breaches, ransomware, phishing, brute-force."""

    def __init__(self, threat_type="", source_ip="", **kwargs):
        super().__init__(**kwargs)
        self.threat_type = threat_type
        self.source_ip = source_ip

    def classify(self):
        from utils.classifier import detect_severity
        combined = f"{self.title} {self.description}"
        self._severity = detect_severity(combined)
        return self._severity

    def notify_soc(self):
        """Send SOC alert."""
        print(f"[SOC ALERT] Incident {self.id} — {self.title} | Threat: {self.threat_type}")


# ---------------------------------------------------------------------------
# Iterator
# ---------------------------------------------------------------------------

class IncidentIterator:
    """Iterates over incidents with optional severity filtering."""

    def __init__(self, incidents, severity_filter=None):
        self._incidents = incidents
        self._severity_filter = severity_filter
        self._index = 0
        if severity_filter:
            self._incidents = [i for i in incidents if i.severity == severity_filter]

    def __iter__(self):
        return self

    def __next__(self):
        if self._index >= len(self._incidents):
            raise StopIteration
        incident = self._incidents[self._index]
        self._index += 1
        return incident


# ---------------------------------------------------------------------------
# Batch generator
# ---------------------------------------------------------------------------

def batch_incidents(incidents, batch_size=3):
    """Yield incidents in batches of batch_size."""
    for i in range(0, len(incidents), batch_size):
        yield incidents[i: i + batch_size]
