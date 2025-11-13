# frontend-desktop/ui_login.py
import sys
from PyQt5.QtWidgets import (
    QApplication, QWidget, QVBoxLayout, QLineEdit,
    QPushButton, QLabel, QMessageBox, QDialog
)
from PyQt5.QtCore import Qt

# We use QDialog so it can be opened "modally" (blocking the main window)
class LoginWindow(QDialog):
    def __init__(self, api_client):
        super().__init__()
        self.api = api_client
        self.initUI()

    def initUI(self):
        self.setWindowTitle('Login - Chemical Visualizer')
        self.setGeometry(300, 300, 300, 200)

        layout = QVBoxLayout()

        # Username input
        self.username_input = QLineEdit()
        self.username_input.setPlaceholderText('Username')
        layout.addWidget(self.username_input)

        # Password input
        self.password_input = QLineEdit()
        self.password_input.setPlaceholderText('Password')
        self.password_input.setEchoMode(QLineEdit.Password) # Hides password
        layout.addWidget(self.password_input)

        # Login button
        self.login_button = QPushButton('Login')
        self.login_button.clicked.connect(self.handle_login)
        layout.addWidget(self.login_button)

        # Register button
        self.register_button = QPushButton('Register')
        self.register_button.clicked.connect(self.handle_register)
        layout.addWidget(self.register_button)

        # Message label for errors
        self.message_label = QLabel('')
        self.message_label.setStyleSheet("color: red;")
        self.message_label.setAlignment(Qt.AlignCenter)
        layout.addWidget(self.message_label)

        self.setLayout(layout)

    def handle_login(self):
        username = self.username_input.text()
        password = self.password_input.text()

        if not username or not password:
            self.message_label.setText('Username and Password required.')
            return

        success, data = self.api.login(username, password)

        if success:
            # self.accept() is a special QDialog function
            # It closes the dialog and signals "success"
            self.accept() 
        else:
            self.message_label.setText(f"Login failed: {data.get('detail', 'Unknown error')}")

    def handle_register(self):
        username = self.username_input.text()
        password = self.password_input.text()

        if not username or not password:
            self.message_label.setText('Username and Password required.')
            return

        success, data = self.api.register(username, password)

        if success:
            self.message_label.setStyleSheet("color: green;")
            self.message_label.setText('Registration successful! Please log in.')
        else:
            self.message_label.setStyleSheet("color: red;")
            self.message_label.setText(f"Registration failed: {data.get('username', 'Error')}")

# This block allows you to run this file directly for testing
if __name__ == '__main__':
    app = QApplication(sys.argv)

    # Create a dummy API client for testing just this window
    class DummyClient:
        def login(self, u, p): return False, {"detail": "Test mode"}
        def register(self, u, p): return True, {}

    login_win = LoginWindow(DummyClient())
    login_win.show()
    sys.exit(app.exec_())