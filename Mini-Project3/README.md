Mini Project 3 — IT Incident Auto-Triage & Tracker
Name  : Shubham Santram Saptasagare
Batch : B2 — .NET with Python
=================================================

Setup
-----
1. Install dependencies:

```powershell
pip install requests
```

Config
------
Open `incident_tracker/config.py` and set:

- `MOCK_API = True` — runs without live credentials (prints payloads, returns fake ticket IDs)
- `MOCK_API = False` — makes real API calls to ServiceNow and Jira using the credentials in `config.py`

Command
-------
Run from the project root:

```powershell
python incident_tracker/main.py
```

Filter by severity (optional):

```powershell
python incident_tracker/main.py --severity critical
```

Outputs
-------
- `output/report.html` — HTML dashboard report (open in browser)
- `output/summary.json` — JSON summary with all ticket IDs


