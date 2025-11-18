# backend/api/utils.py
import pandas as pd
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Image, Paragraph
from reportlab.lib.styles import getSampleStyleSheet
import matplotlib.pyplot as plt
import io 

def analyze_csv(csv_file):
    try:
        df = pd.read_csv(csv_file)
        df.columns = df.columns.str.strip()
        
        total_count = len(df)
        avg_flowrate = df['Flowrate'].mean()
        avg_pressure = df['Pressure'].mean()
        avg_temperature = df['Temperature'].mean()
        type_distribution = df['Type'].value_counts().to_dict()
        
        # Safety Alerts Logic
        alerts = []
        MAX_PRESSURE = 120.0
        MAX_TEMP = 200.0
        
        for index, row in df.iterrows():
            if row['Pressure'] > MAX_PRESSURE:
                # Format: CRITICAL: Pump-01 (Pressure: 150.0 psi > 120.0 psi)
                alerts.append(f"CRITICAL: {row['Equipment Name']} (Pressure: {row['Pressure']} psi > {MAX_PRESSURE} psi)")
            if row['Temperature'] > MAX_TEMP:
                # Format: WARNING: Pump-01 (Temp: 250.0 °C > 200.0 °C)
                alerts.append(f"WARNING: {row['Equipment Name']} (Temp: {row['Temperature']} °C > {MAX_TEMP} °C)")
        
        alerts = alerts[:5]

        raw_data = df[['Equipment Name', 'Type', 'Flowrate', 'Pressure', 'Temperature']].fillna(0).to_dict(orient='records')

        summary = {
            'total_count': total_count,
            'avg_flowrate': round(avg_flowrate, 2),
            'avg_pressure': round(avg_pressure, 2),
            'avg_temperature': round(avg_temperature, 2),
            'type_distribution': type_distribution,
            'alerts': alerts,
            'raw_data': raw_data,
        }
        return summary
        
    except Exception as e:
        print(f"Error analyzing CSV: {e}")
        return None

def generate_matplotlib_chart(type_distribution):
    types = list(type_distribution.keys())
    counts = list(type_distribution.values())
    fig, ax = plt.subplots(figsize=(8, 5))
    ax.bar(types, counts, color='skyblue')
    ax.set_xlabel('Equipment Type')
    ax.set_ylabel('Count')
    ax.set_title('Equipment Type Distribution')
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    plt.close(fig)
    return buf

def generate_pdf_report(history_instance):
    summary = history_instance.summary_stats
    pdf_buffer = io.BytesIO()
    doc = SimpleDocTemplate(pdf_buffer, pagesize=letter)
    elements = []
    styles = getSampleStyleSheet()
    
    elements.append(Paragraph(f"Analysis Report: {history_instance.file_name}", styles['h1']))
    elements.append(Paragraph(f"Generated on: {history_instance.uploaded_at.strftime('%Y-%m-%d %H:%M')}", styles['Normal']))
    
    elements.append(Paragraph("Summary Statistics", styles['h2']))
    summary_data = [
        ['Metric', 'Value'],
        ['Total Equipment Count', summary.get('total_count', 'N/A')],
        ['Average Flowrate', f"{summary.get('avg_flowrate', 'N/A')} units"],
        ['Average Pressure', f"{summary.get('avg_pressure', 'N/A')} units"],
        ['Average Temperature', f"{summary.get('avg_temperature', 'N/A')} °C"],
    ]
    summary_table = Table(summary_data, colWidths=[2.5 * inch, 2.5 * inch])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ]))
    elements.append(summary_table)
    
    if summary.get('alerts'):
        elements.append(Paragraph("Safety Alerts", styles['h2']))
        for alert in summary['alerts']:
            elements.append(Paragraph(f"• {alert}", styles['Normal']))

    elements.append(Paragraph("Equipment Type Distribution", styles['h2']))
    type_dist = summary.get('type_distribution', {})
    type_data = [['Equipment Type', 'Count']] + list(type_dist.items())
    type_table = Table(type_data, colWidths=[2.5 * inch, 2.5 * inch])
    type_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ]))
    elements.append(type_table)
    
    elements.append(Paragraph("Distribution Chart", styles['h2']))
    chart_buffer = generate_matplotlib_chart(type_dist)
    chart_image = Image(chart_buffer, width=6*inch, height=3.75*inch)
    elements.append(chart_image)
    
    doc.build(elements)
    pdf_buffer.seek(0)
    return pdf_buffer