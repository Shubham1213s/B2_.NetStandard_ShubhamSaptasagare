# services/azure_boards.py — Azure Boards REST API integration
import base64
import json
from utils.decorators import log_call, retry
import config


PRIORITY_MAP = {"critical": 1, "high": 1, "medium": 2, "low": 3}


def _pat_header() -> str:
    """Return a base64-encoded PAT Basic auth header for Azure DevOps."""
    token = base64.b64encode(f":{config.AZURE_PAT}".encode()).decode()
    return f"Basic {token}"


@log_call
@retry(times=3, delay=1)
def create_azure_ticket(incident) -> str:
    """Create an Azure Boards Bug work item.

    Returns the work-item ID and stores it as ticket_ids['azure'].
    """
    payload = [
        {"op": "add", "path": "/fields/System.Title", "value": incident.title},
        {
            "op": "add",
            "path": "/fields/Microsoft.VSTS.Common.Priority",
            "value": PRIORITY_MAP.get(incident.severity, 2),
        },
        {
            "op": "add",
            "path": "/fields/System.AssignedTo",
            "value": incident.assigned_team,
        },
        {
            "op": "add",
            "path": "/fields/System.Description",
            "value": incident.description,
        },
    ]

    if config.MOCK_API or config.MOCK_AZURE:
        print(f"[MOCK Azure Boards] POST {config.AZURE_BASE_URL}")
        print(f"  Payload: {json.dumps(payload, indent=4)}")
        mock_id = f"MOCK-AZURE-{incident.id}"
        incident.ticket_ids["azure"] = mock_id
        return mock_id

    # --- Live call ---
    import requests

    headers = {
        "Authorization": _pat_header(),
        "Content-Type": "application/json-patch+json",
        "Accept": "application/json",
    }
    response = requests.post(
        config.AZURE_BASE_URL,
        headers=headers,
        json=payload,
        timeout=15,
    )
    response.raise_for_status()
    work_item_id = str(response.json()["id"])
    incident.ticket_ids["azure"] = work_item_id
    return work_item_id
