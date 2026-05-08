# config.py - API credentials and flags

import os

MOCK_API = True  # Set to False to use real API credentials
MOCK_AZURE = True  # Keep Azure mocked for now (set to False with valid PAT/org/project)

# ServiceNow
SNOW_INSTANCE = "dev391598"
SNOW_USERNAME = os.getenv("SNOW_USERNAME", "")
SNOW_PASSWORD = os.getenv("SNOW_PASSWORD", "")
SNOW_BASE_URL = f"https://{SNOW_INSTANCE}.service-now.com/api/now/table/incident"

# Jira
JIRA_DOMAIN = "saptsagare2020"
JIRA_EMAIL = os.getenv("JIRA_EMAIL", "")
JIRA_API_TOKEN = os.getenv("JIRA_API_TOKEN", "")
JIRA_PROJECT_KEY = "KAN"
JIRA_ISSUE_TYPE = "Task"
JIRA_BASE_URL = f"https://{JIRA_DOMAIN}.atlassian.net/rest/api/3/issue"

# Azure Boards
AZURE_ORG = "your-org"
AZURE_PROJECT = "your-project"
AZURE_PAT = os.getenv("AZURE_PAT", "")
AZURE_BASE_URL = (
    f"https://dev.azure.com/{AZURE_ORG}/{AZURE_PROJECT}"
    "/_apis/wit/workitems/$Bug?api-version=7.1"
)
