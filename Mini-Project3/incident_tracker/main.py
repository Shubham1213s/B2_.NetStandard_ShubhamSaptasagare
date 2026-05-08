# main.py — CLI entry point; orchestrates the full pipeline
"""
Usage:
    python main.py
    python main.py --severity critical
    python main.py --severity high
"""

import argparse
import json
import os
import sys
import logging

# Add project root to sys.path so all packages resolve correctly
sys.path.insert(0, os.path.dirname(__file__))

from utils.classifier import detect_type, detect_severity
from models.incident import (
    NetworkIncident,
    AppIncident,
    SecurityIncident,
    Incident,
    IncidentIterator,
    batch_incidents,
)
from models.report import ReportGenerator
from services.servicenow import create_snow_ticket
from services.jira import create_jira_ticket
from services.azure_boards import create_azure_ticket
from utils.helpers import get_critical_incidents, count_by_team, summarise_by_type

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)

DATA_FILE = os.path.join(os.path.dirname(__file__), "data", "incidents.json")


def load_incidents(path: str) -> list:
    """Load raw JSON records and return classified Incident objects."""
    with open(path, "r", encoding="utf-8") as f:
        records = json.load(f)

    incidents = []
    for record in records:
        Incident.validate_schema(record)
        combined = f"{record['title']} {record['description']}"
        inc_type = detect_type(combined)

        kwargs = {k: record[k] for k in
                  ("id", "title", "description", "reported_by", "timestamp", "assigned_team")}

        if inc_type == "network":
            inc = NetworkIncident(**kwargs)
        elif inc_type == "security":
            inc = SecurityIncident(**kwargs)
        elif inc_type == "app":
            inc = AppIncident(**kwargs)
        else:
            # Fallback: use AppIncident for general/unknown types
            inc = AppIncident(**kwargs)

        inc.classify()
        incidents.append(inc)

    return incidents


def push_tickets(incidents: list) -> None:
    """Push each incident to all three platforms (batched in groups of 3)."""
    for batch in batch_incidents(incidents, batch_size=3):
        for inc in batch:
            create_snow_ticket(inc)
            create_jira_ticket(inc)
            create_azure_ticket(inc)


def print_summary(incidents: list) -> None:
    """Print a console summary after processing."""
    print("\n" + "=" * 60)
    print("  INCIDENT TRIAGE SUMMARY")
    print("=" * 60)
    print(f"  Total incidents processed : {len(incidents)}")

    criticals = get_critical_incidents(incidents)
    print(f"  Critical incidents        : {len(criticals)}")

    by_team = count_by_team(incidents)
    print(f"  By team                   : {by_team}")

    by_type = summarise_by_type(incidents)
    print(f"  By type                   : {by_type}")
    print("=" * 60)

    print("\n  Sorted by severity:")
    for inc in sorted(incidents):
        snow = inc.ticket_ids.get("snow", "—")
        jira = inc.ticket_ids.get("jira", "—")
        azure = inc.ticket_ids.get("azure", "—")
        print(f"  [{inc.severity.upper():8s}] {inc.id} | {inc.title[:50]}")
        print(f"              SNOW={snow}  JIRA={jira}  AZURE={azure}")
    print()


def main():
    parser = argparse.ArgumentParser(
        description="IT Incident Auto-Triage & Tracker"
    )
    parser.add_argument(
        "--severity",
        choices=["critical", "high", "medium", "low"],
        default=None,
        help="Only push incidents matching this severity level",
    )
    args = parser.parse_args()

    logging.info("Loading incidents from %s", DATA_FILE)
    all_incidents = load_incidents(DATA_FILE)

    if args.severity:
        logging.info("Filtering to severity=%s", args.severity)
        incidents_to_process = list(IncidentIterator(all_incidents, severity_filter=args.severity))
        print(f"\n[FILTER] Processing only '{args.severity}' incidents "
              f"({len(incidents_to_process)} of {len(all_incidents)} total)\n")
    else:
        incidents_to_process = all_incidents

    logging.info("Pushing %d incidents to all platforms", len(incidents_to_process))
    push_tickets(incidents_to_process)

    print_summary(incidents_to_process)

    report = ReportGenerator(incidents_to_process)
    report.generate_html("output/report.html")
    report.export_json("output/summary.json")

    logging.info("Pipeline complete.")


if __name__ == "__main__":
    main()
