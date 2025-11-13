# frontend-desktop/ui_main.py
import sys
from PyQt5.QtWidgets import (
    QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
    QPushButton, QLabel, QTableWidget, QTableWidgetItem,
    QTabWidget, QFileDialog, QMessageBox, QHeaderView
)
from PyQt5.QtGui import QFont

# Imports for Matplotlib
from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg as FigureCanvas
from matplotlib.figure import Figure

class MatplotlibCanvas(FigureCanvas):
    """A custom widget for embedding Matplotlib charts."""
    def __init__(self, parent=None, width=5, height=4, dpi=100):
        fig = Figure(figsize=(width, height), dpi=dpi)
        self.axes = fig.add_subplot(111)
        super(MatplotlibCanvas, self).__init__(fig)
        self.setParent(parent)

    def plot_bar_chart(self, type_distribution):
        """Clears the old chart and plots a new bar chart."""
        self.axes.clear()

        if not type_distribution:
            self.axes.text(0.5, 0.5, 'No distribution data', horizontalalignment='center', verticalalignment='center')
            self.draw()
            return

        types = list(type_distribution.keys())
        counts = list(type_distribution.values())

        self.axes.bar(types, counts, color='skyblue')
        self.axes.set_xlabel('Equipment Type')
        self.axes.set_ylabel('Count')
        self.axes.set_title('Equipment Type Distribution')
        self.figure.autofmt_xdate(rotation=45) # Rotate labels
        self.figure.tight_layout()
        self.draw()

class MainWindow(QMainWindow):
    def __init__(self, api_client):
        super().__init__()
        self.api = api_client
        self.history_data = [] # To store list of history items
        self.current_summary = None # To store full summary object
        self.initUI()
        self.load_history() # Load data as soon as window opens

    def initUI(self):
        self.setWindowTitle('Chemical Equipment Visualizer - Dashboard')
        self.setGeometry(100, 100, 1200, 700)

        main_widget = QWidget()
        self.setCentralWidget(main_widget)

        # Main layout (Horizontal)
        main_layout = QHBoxLayout(main_widget)

        # --- Left Panel (History & Upload) ---
        left_panel = QWidget()
        left_layout = QVBoxLayout(left_panel)
        left_panel.setMaximumWidth(400) # Fix width of left panel

        # Upload Button
        self.upload_button = QPushButton('Upload New CSV')
        self.upload_button.setFont(QFont('Arial', 10))
        self.upload_button.clicked.connect(self.handle_upload)
        left_layout.addWidget(self.upload_button)

        # History Table
        left_layout.addWidget(QLabel('Upload History (Last 5)'))
        self.history_table = QTableWidget()
        self.history_table.setColumnCount(3)
        self.history_table.setHorizontalHeaderLabels(['File Name', 'Date', 'Actions'])
        self.history_table.horizontalHeader().setSectionResizeMode(0, QHeaderView.Stretch) # Stretch "File Name"
        self.history_table.setEditTriggers(QTableWidget.NoEditTriggers) # Make read-only
        left_layout.addWidget(self.history_table)

        main_layout.addWidget(left_panel)

        # --- Right Panel (Tabs for Summary & Chart) ---
        right_panel = QTabWidget()
        main_layout.addWidget(right_panel)

        # === Summary Tab ===
        self.summary_tab = QWidget()
        summary_layout = QVBoxLayout(self.summary_tab)

        self.summary_filename_label = QLabel('File: N/A')
        self.summary_filename_label.setFont(QFont('Arial', 14, QFont.Bold))
        summary_layout.addWidget(self.summary_filename_label)

        # Summary Table
        self.summary_table = QTableWidget()
        self.summary_table.setColumnCount(1) # Only one column for values
        self.summary_table.setRowCount(4)
        self.summary_table.setVerticalHeaderLabels([
            'Total Equipment', 'Avg. Flowrate', 'Avg. Pressure', 'Avg. Temperature'
        ])
        self.summary_table.horizontalHeader().setSectionResizeMode(QHeaderView.Stretch)
        self.summary_table.horizontalHeader().setVisible(False) # Hide top header
        summary_layout.addWidget(self.summary_table)

        right_panel.addTab(self.summary_tab, 'Summary Statistics')

        # === Chart Tab ===
        self.chart_tab = QWidget()
        chart_layout = QVBoxLayout(self.chart_tab)
        self.chart_canvas = MatplotlibCanvas(self) # Add our custom widget
        chart_layout.addWidget(self.chart_canvas)
        right_panel.addTab(self.chart_tab, 'Distribution Chart')

    def load_history(self):
        """Fetches history from API and populates the table."""
        success, data = self.api.get_history()
        if success:
            self.history_data = data
            self.history_table.setRowCount(len(data))

            for i, item in enumerate(data):
                # Column 0: File Name
                self.history_table.setItem(i, 0, QTableWidgetItem(item['file_name']))

                # Column 1: Date
                date_str = item['uploaded_at'].split('T')[0] # Just get YYYY-MM-DD
                self.history_table.setItem(i, 1, QTableWidgetItem(date_str))

                # Column 2: Action Buttons
                btn_widget = QWidget()
                btn_layout = QHBoxLayout(btn_widget)
                btn_layout.setContentsMargins(0,0,0,0) # No margins

                load_btn = QPushButton('Load')
                # Use lambda to pass the specific 'item' to the function
                load_btn.clicked.connect(lambda _, item=item: self.update_dashboard(item))

                pdf_btn = QPushButton('PDF')
                pdf_btn.clicked.connect(lambda _, item=item: self.handle_download_pdf(item))

                btn_layout.addWidget(load_btn)
                btn_layout.addWidget(pdf_btn)

                self.history_table.setCellWidget(i, 2, btn_widget)

            # Auto-load the first item in the list
            if data:
                self.update_dashboard(data[0])
        else:
            QMessageBox.warning(self, 'Error', f"Could not load history: {data.get('error', 'Unknown')}")

    def update_dashboard(self, summary_item):
        """Updates the summary and chart tabs with data from a history item."""
        self.current_summary = summary_item
        stats = summary_item['summary_stats']

        # --- Update summary tab ---
        self.summary_filename_label.setText(f"File: {summary_item['file_name']}")

        # Populate summary table
        self.summary_table.setItem(0, 0, QTableWidgetItem(str(stats.get('total_count', 'N/A'))))
        self.summary_table.setItem(1, 0, QTableWidgetItem(str(stats.get('avg_flowrate', 'N/A'))))
        self.summary_table.setItem(2, 0, QTableWidgetItem(str(stats.get('avg_pressure', 'N/A'))))
        self.summary_table.setItem(3, 0, QTableWidgetItem(str(stats.get('avg_temperature', 'N/A'))))

        # --- Update chart tab ---
        type_dist = stats.get('type_distribution', {})
        self.chart_canvas.plot_bar_chart(type_dist)

    def handle_upload(self):
        """Opens a file dialog to upload a new CSV."""
        file_path, _ = QFileDialog.getOpenFileName(self, 'Open CSV', '', 'CSV Files (*.csv)')

        if file_path:
            success, data = self.api.upload_csv(file_path)
            if success:
                QMessageBox.information(self, 'Success', 'File uploaded and analyzed successfully.')
                # Reload history, which will auto-load the new data
                self.load_history()
            else:
                QMessageBox.warning(self, 'Upload Failed', f"Error: {data.get('error', 'Unknown')}")

    def handle_download_pdf(self, item):
        """Opens a save dialog to download the PDF report."""
        file_path, _ = QFileDialog.getSaveFileName(self, 'Save PDF Report', f"report_{item['file_name']}.pdf", 'PDF Files (*.pdf)')

        if file_path:
            success, msg = self.api.download_report(item['id'], file_path)
            if success:
                QMessageBox.information(self, 'Success', 'PDF report downloaded.')
            else:
                QMessageBox.warning(self, 'Download Failed', f"Error: {msg}")