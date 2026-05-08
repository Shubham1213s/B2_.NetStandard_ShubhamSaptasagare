# models/report.py
import json
import os
from datetime import datetime


class ReportGenerator:
    """Generates HTML and JSON summary reports from processed incidents."""

    def __init__(self, incidents):
        self.incidents = incidents
        self.generated_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    def generate_html(self, output_path="output/report.html"):
        os.makedirs(os.path.dirname(output_path), exist_ok=True)

        # compute summary counts
        severity_colors = {
            "critical": "#e74c3c",
            "high":     "#ff9900",
            "medium":   "#f1c40f",
            "low":      "#2ecc71",
        }

        totals = {"critical": 0, "high": 0, "medium": 0, "low": 0}
        type_counts = {}
        for inc in self.incidents:
            s = inc.severity or "low"
            totals[s] = totals.get(s, 0) + 1
            t = inc.__class__.__name__
            type_counts[t] = type_counts.get(t, 0) + 1

        # Build cards and breakdowns
        cards_html = ""
        cards_html += f"<div class='card total'><div class='big'>{len(self.incidents)}</div><div class='label'>Total</div></div>"
        cards_html += f"<div class='card'><div class='big' style='color:{severity_colors['critical']}'>{totals['critical']}</div><div class='label'>Critical</div></div>"
        cards_html += f"<div class='card'><div class='big' style='color:{severity_colors['high']}'>{totals['high']}</div><div class='label'>High</div></div>"
        cards_html += f"<div class='card'><div class='big' style='color:{severity_colors['medium']}'>{totals['medium']}</div><div class='label'>Medium</div></div>"
        cards_html += f"<div class='card'><div class='big' style='color:{severity_colors['low']}'>{totals['low']}</div><div class='label'>Low</div></div>"

        type_rows = ""
        for t, c in type_counts.items():
            type_rows += f"<li>{t}: <strong>{c}</strong></li>"

        # Build styled severity rows (badge + count) to match dashboard UI
        severity_rows = ""
        severity_rows += (
            f"<li class='sev-item'><span class='badge' style='background:{severity_colors['critical']};'>Critical</span>"
            f"<span class='sev-count'>— {totals['critical']}</span></li>"
        )
        severity_rows += (
            f"<li class='sev-item'><span class='badge' style='background:{severity_colors['high']};'>High</span>"
            f"<span class='sev-count'>— {totals['high']}</span></li>"
        )
        severity_rows += (
            f"<li class='sev-item'><span class='badge' style='background:{severity_colors['medium']};'>Medium</span>"
            f"<span class='sev-count'>— {totals['medium']}</span></li>"
        )
        severity_rows += (
            f"<li class='sev-item'><span class='badge' style='background:{severity_colors['low']};'>Low</span>"
            f"<span class='sev-count'>— {totals['low']}</span></li>"
        )
        # Build table rows for incidents
        rows = ""
        for inc in self.incidents:
            snow = inc.ticket_ids.get('snow', '') if hasattr(inc, 'ticket_ids') else ''
            jira = inc.ticket_ids.get('jira', '') if hasattr(inc, 'ticket_ids') else ''
            azure = inc.ticket_ids.get('azure', '') if hasattr(inc, 'ticket_ids') else ''
            sev = inc.severity or ''
            rows += (
                "<tr>"
                f"<td>{inc.id}</td>"
                f"<td class='title'>{inc.title}</td>"
                f"<td>{inc.__class__.__name__}</td>"
                f"<td><span class='badge' style='background:{severity_colors.get(sev,'#999')};'>{sev}</span></td>"
                f"<td>{inc.assigned_team}</td>"
                f"<td class='mono'>{snow}</td>"
                f"<td class='mono'>{jira}</td>"
                f"<td class='mono'>{azure}</td>"
                f"<td>{inc.timestamp.strftime('%Y-%m-%d %H:%M')}</td>"
                "</tr>"
            )
        html_template = """<!doctype html>
<html lang='en'>
<head>
    <meta charset='utf-8'/>
    <title>IT Incident Auto-Triage Report</title>
    <meta name='viewport' content='width=device-width,initial-scale=1' />
    <style>
        body {{ font-family: 'Segoe UI', Roboto, Arial, sans-serif; margin:0; background:#f5f7fb; color:#333 }}
        header {{ background:#174a6e; color:#fff; padding:18px 36px; box-shadow:0 2px 6px rgba(0,0,0,.08) }}
        header h1 {{ margin:0; font-size:18px }}
        .container {{ max-width:1400px; margin:28px auto; padding:0 36px }}
        .meta {{ color:#9fb0bf; margin-top:6px }}
        .cards {{ display:flex; gap:20px; margin:24px 0 28px; flex-wrap:wrap }}
        .card {{ background:#fff; padding:18px 22px; border-radius:8px; box-shadow:0 2px 6px rgba(0,0,0,.06); flex:1; text-align:center; min-width:130px }}
        .card.total {{ flex:2 }}
        .card .big {{ font-size:28px; font-weight:700 }}
        .card .label {{ color:#6b7280; margin-top:8px }}
        .breakdowns {{ display:flex; gap:32px; margin-bottom:24px; align-items:flex-start; flex-wrap:wrap }}
        .breakdowns .box {{ background:#fff; padding:20px; border-radius:8px; box-shadow:0 2px 6px rgba(0,0,0,.06); flex:1; min-width:280px }}
        ul {{ margin:0; padding-left:18px }}
        .severity-list li.sev-item {{ display:flex; align-items:center; gap:12px; margin:10px 0 }}
        .severity-list .badge {{ padding:8px 12px; border-radius:18px; font-size:0.95em; font-weight:700 }}
        .severity-list .sev-count {{ color:#374151; margin-left:8px; font-weight:700 }}
        table {{ width:100%; border-collapse:collapse; background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,.06); font-size:14px }}
        th {{ text-align:left; padding:14px 18px; background:#0b3b5a; color:#fff; font-weight:700 }}
        td {{ padding:12px 18px; border-bottom:1px solid #f0f2f5; vertical-align:middle }}
        .badge {{ color:#fff; padding:6px 10px; border-radius:12px; font-weight:700; text-transform:capitalize; display:inline-block }}
        .mono {{ font-family: Consolas, monospace; color:#0b5394 }}
        .title {{ max-width:640px }}
        footer {{ text-align:center; color:#9aa3af; padding:18px 0; font-size:12px }}

        @media (max-width: 900px) {{
            .container {{ padding:0 18px }}
            .cards {{ gap:12px }}
            .card .big {{ font-size:22px }}
            .breakdowns {{ gap:18px }}
            .breakdowns .box {{ padding:14px }}
            th, td {{ padding:10px 12px }}
        }}
    </style>
</head>
<body>
    <header>
        <div class='container'>
            <h1>IT Incident Auto-Triage Report</h1>
            <div class='meta'>Generated: {generated_at} &nbsp;|&nbsp; Total incidents: {total}</div>
        </div>
    </header>

    <main class='container'>
        <div class='cards'>
            {cards_html}
        </div>

        <div class='breakdowns'>
            <div class='box'>
                <h3>Breakdown by Type</h3>
                <ul>
                    {type_rows}
                </ul>
            </div>
            <div class='box'>
                <h3>Breakdown by Severity</h3>
                <ul class='severity-list'>
                    {severity_rows}
                </ul>
            </div>
        </div>

        <section>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Type</th>
                        <th>Severity</th>
                        <th>Assigned Team</th>
                        <th>ServiceNow</th>
                        <th>Jira</th>
                        <th>Azure</th>
                        <th>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        </section>
    </main>

    <footer>
        Generated by IT Incident Auto-Triage & Tracker — {generated_at}
    </footer>
</body>
</html>"""

        html = html_template.format(
            generated_at=self.generated_at,
            total=len(self.incidents),
            cards_html=cards_html,
            type_rows=type_rows,
            severity_rows=severity_rows,
            sc_critical=severity_colors['critical'],
            sc_high=severity_colors['high'],
            sc_medium=severity_colors['medium'],
            sc_low=severity_colors['low'],
            totals_critical=totals['critical'],
            totals_high=totals['high'],
            totals_medium=totals['medium'],
            totals_low=totals['low'],
            rows=rows,
        )
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(html)
        print(f"[REPORT] HTML report written to {output_path}")

    def export_json(self, output_path="output/summary.json"):
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        data = {
            "generated_at": self.generated_at,
            "total": len(self.incidents),
            "incidents": [i.to_dict() for i in self.incidents],
        }
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, default=str)
        print(f"[REPORT] JSON summary written to {output_path}")
