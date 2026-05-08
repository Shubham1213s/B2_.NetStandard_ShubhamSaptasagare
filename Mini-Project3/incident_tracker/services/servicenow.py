# services/servicenow.py — ServiceNow REST API integration
import json
from utils.decorators import log_call, retry
import config


URGENCY_MAP = {"critical": 1, "high": 1, "medium": 2, "low": 3}


@log_call
@retry(times=3, delay=1)
def create_snow_ticket(incident) -> str:
    """Create a ServiceNow incident ticket.

    Returns the sys_id (or mock ID) and stores it as ticket_ids['snow'].
    """
    payload = {
        "short_description": incident.title,
        "description": incident.description,
        "urgency": URGENCY_MAP.get(incident.severity, 2),
        "category": incident.__class__.__name__.replace("Incident", "").lower(),
        "assignment_group": incident.assigned_team,
    }

    if config.MOCK_API:
        print(f"[MOCK ServiceNow] POST {config.SNOW_BASE_URL}")
        print(f"  Payload: {json.dumps(payload, indent=4)}")
        mock_id = f"MOCK-SNOW-{incident.id}"
        incident.ticket_ids["snow"] = mock_id
        return mock_id

    # --- Live call ---
    import requests
    from requests.auth import HTTPBasicAuth

    headers = {"Content-Type": "application/json", "Accept": "application/json"}
    response = requests.post(
        config.SNOW_BASE_URL,
        auth=HTTPBasicAuth(config.SNOW_USERNAME, config.SNOW_PASSWORD),
        headers=headers,
        json=payload,
        timeout=15,
    )
    response.raise_for_status()
    sys_id = response.json()["result"]["sys_id"]
    incident.ticket_ids["snow"] = sys_id
    return sys_id
