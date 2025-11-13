# frontend-desktop/app.py
import sys
from PyQt5.QtWidgets import QApplication

# Import our two window classes
from api_client import APIClient
from ui_login import LoginWindow
from ui_main import MainWindow

def main():
    # 1. Initialize the main application
    app = QApplication(sys.argv)

    # 2. Create the API client that both windows will share
    client = APIClient()

    # 3. Show the Login Window first
    login_win = LoginWindow(client)

    # .exec_() shows the dialog modally and waits until it's closed
    # It returns QDialog.Accepted (which is 1) if self.accept() was called
    if login_win.exec_() == 1:
        # 4. If login was successful (returned 1), show the Main Window
        main_win = MainWindow(client)
        main_win.show()

        # 5. Start the application's main event loop
        sys.exit(app.exec_())
    else:
        # 6. If login failed or was closed, exit the app
        sys.exit()

if __name__ == '__main__':
    main()