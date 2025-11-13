# (This is backend/api/utils.py)

import pandas as pd
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Image, Paragraph
from reportlab.lib.styles import getSampleStyleSheet
import matplotlib.pyplot as plt
import io # For saving images in memory

def analyze_csv(csv_file):
    """
    Analyzes the uploaded CSV file using Pandas.
    Returns a dictionary of summary statistics.
    """
    try:
        # Read the CSV file into a Pandas DataFrame
        df = pd.read_csv(csv_file)
        
        # 1. Total equipment count
        total_count = len(df)
        
        # 2. Averages (make sure column names match your CSV)
        avg_flowrate = df['Flowrate'].mean()
        avg_pressure = df['Pressure'].mean()
        avg_temperature = df['Temperature'].mean()
        
        # 3. Equipment Type distribution
        type_distribution = df['Type'].value_counts().to_dict()
        
        # Build the summary dictionary
        summary = {
            'total_count': total_count,
            'avg_flowrate': round(avg_flowrate, 2),
            'avg_pressure': round(avg_pressure, 2),
            'avg_temperature': round(avg_temperature, 2),
            'type_distribution': type_distribution,
        }
        return summary
        
    except Exception as e:
        print(f"Error analyzing CSV: {e}")
        # Return None or raise an exception if analysis fails
        return None

def generate_matplotlib_chart(type_distribution):
    """
    Generates a Matplotlib bar chart from the type distribution
    and returns it as an in-memory image buffer.
    """
    types = list(type_distribution.keys())
    counts = list(type_distribution.values())
    
    # Create a figure and an axis
    fig, ax = plt.subplots(figsize=(8, 5))
    ax.bar(types, counts, color='skyblue')
    ax.set_xlabel('Equipment Type')
    ax.set_ylabel('Count')
    ax.set_title('Equipment Type Distribution')
    plt.xticks(rotation=45, ha='right') # Rotate x-axis labels
    plt.tight_layout() # Adjust layout to prevent labels cutoff
    
    # Save plot to a memory buffer
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0) # Rewind the buffer to the beginning
    plt.close(fig) # Close the figure to free memory
    
    return buf

def generate_pdf_report(history_instance):
    """
    Generates a PDF report for a given UploadHistory instance.
    """
    summary = history_instance.summary_stats
    
    # Create an in-memory buffer for the PDF
    pdf_buffer = io.BytesIO()
    
    # Create the PDF document using ReportLab's SimpleDocTemplate
    doc = SimpleDocTemplate(pdf_buffer, pagesize=letter)
    elements = [] # A list to hold all parts of the PDF
    styles = getSampleStyleSheet()
    
    # 1. Title
    elements.append(Paragraph(f"Analysis Report: {history_instance.file_name}", styles['h1']))
    elements.append(Paragraph(f"Generated on: {history_instance.uploaded_at.strftime('%Y-%m-%d %H:%M')}", styles['Normal']))
    
    # 2. Summary Statistics Table
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
    
    # 3. Equipment Type Distribution Table
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
    
    # 4. Chart Image
    elements.append(Paragraph("Distribution Chart", styles['h2']))
    # Generate the chart from our other function
    chart_buffer = generate_matplotlib_chart(type_dist)
    
    # Add chart image to PDF
    chart_image = Image(chart_buffer, width=6*inch, height=3.75*inch)
    elements.append(chart_image)
    
    # Build the PDF
    doc.build(elements)
    
    pdf_buffer.seek(0)
    return pdf_buffer