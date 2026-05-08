# utils/helpers.py
from functools import reduce


def get_critical_incidents(incidents):
    """Return only critical-severity incidents."""
    return list(filter(lambda i: i.severity == "critical", incidents))


def build_jira_payloads(incidents):
    """Map each incident to its dict representation for Jira payload building."""
    return list(map(lambda i: i.to_dict(), incidents))


def count_by_team(incidents):
    """Reduce incidents into a dict of {team: count}."""
    return reduce(
        lambda acc, i: {**acc, i.assigned_team: acc.get(i.assigned_team, 0) + 1},
        incidents,
        {},
    )


def get_incidents_by_severity(incidents, severity: str):
    """Filter incidents by an arbitrary severity level."""
    # Using a generator expression — avoids building a full list in memory
    # when only iterating once (e.g. feeding into another map/reduce).
    return (i for i in incidents if i.severity == severity)


def summarise_by_type(incidents):
    """Return a dict of {type_name: count}."""
    return reduce(
        lambda acc, i: {
            **acc,
            i.__class__.__name__: acc.get(i.__class__.__name__, 0) + 1,
        },
        incidents,
        {},
    )
