# services/jira.py — Jira REST API integration
import base64
import json
from utils.decorators import log_call, retry
import config


PRIORITY_MAP = {"critical": "Highest", "high": "High", "medium": "Medium", "low": "Low"}


def _auth_header() -> str:
    """Return a base64-encoded Basic auth header value for Jira."""
    token = base64.b64encode(
        f"{config.JIRA_EMAIL}:{config.JIRA_API_TOKEN}".encode()
    ).decode()
    return f"Basic {token}"


@log_call
@retry(times=3, delay=1)
def create_jira_ticket(incident) -> str:
    """Create a Jira issue.

    Returns the issue key (e.g. PROJ-42) and stores it as ticket_ids['jira'].
    """
    payload = {
        "fields": {
            "summary": incident.title,
            "description": {
                "type": "doc",
                "version": 1,
                "content": [
                    {
                        "type": "paragraph",
                        "content": [{"type": "text", "text": incident.description}],
                    }
                ],
            },
            "issuetype": {"name": getattr(config, "JIRA_ISSUE_TYPE", "Task")},
            "priority": {"name": PRIORITY_MAP.get(incident.severity, "Medium")},
            "project": {"key": config.JIRA_PROJECT_KEY},
            "labels": [incident.__class__.__name__, incident.assigned_team],
        }
    }

    if config.MOCK_API:
        print(f"[MOCK Jira] POST {config.JIRA_BASE_URL}")
        print(f"  Payload: {json.dumps(payload, indent=4)}")
        mock_key = f"{config.JIRA_PROJECT_KEY}-MOCK-{incident.id}"
        incident.ticket_ids["jira"] = mock_key
        return mock_key

    # --- Live call ---
    import requests

    headers = {
        "Authorization": _auth_header(),
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
    response = requests.post(
        config.JIRA_BASE_URL,
        headers=headers,
        json=payload,
        timeout=15,
    )
    response.raise_for_status()
    issue_key = response.json()["key"]
    incident.ticket_ids["jira"] = issue_key
    return issue_key
