# frontend-desktop/api_client.py
import requests

class APIClient:
    def __init__(self, base_url='http://127.0.0.1:8000/api'):
        self.base_url = base_url
        self.access_token = None
        self.session = requests.Session() # Use a session to persist headers

    def set_token(self, token):
        """Saves the token and adds it to the session headers."""
        self.access_token = token
        self.session.headers.update({'Authorization': f'Bearer {self.access_token}'})

    def clear_token(self):
        """Clears the token from the class and session headers."""
        self.access_token = None
        self.session.headers.pop('Authorization', None)

    def register(self, username, password):
        """Handles user registration."""
        url = f"{self.base_url}/register/"
        try:
            # Use raw requests.post, not self.session, as we're not auth'd
            response = requests.post(url, json={'username': username, 'password': password})
            return response.status_code == 201, response.json()
        except requests.ConnectionError:
            return False, {"error": "Connection failed"}

    def login(self, username, password):
        """Handles user login and saves the token."""
        url = f"{self.base_url}/token/"
        try:
            response = requests.post(url, json={'username': username, 'password': password})
            if response.status_code == 200:
                data = response.json()
                self.set_token(data['access']) # Save the token
                return True, data
            return False, response.json()
        except requests.ConnectionError:
            return False, {"error": "Connection failed"}

    def upload_csv(self, file_path):
        """Uploads a CSV file using the authenticated session."""
        url = f"{self.base_url}/upload-csv/"
        try:
            with open(file_path, 'rb') as f:
                # 'file' is the name the backend (UploadCsvView) expects
                files = {'file': (file_path.split('/')[-1], f, 'text/csv')}
                response = self.session.post(url, files=files)
                return response.status_code == 201, response.json()
        except Exception as e:
            return False, {"error": str(e)}

    def get_history(self):
        """Gets the user's upload history."""
        url = f"{self.base_url}/history/"
        try:
            response = self.session.get(url)
            return response.status_code == 200, response.json()
        except Exception as e:
            return False, {"error": str(e)}

    def download_report(self, history_id, save_path):
        """Downloads a PDF report to a specified path."""
        url = f"{self.base_url}/download-report/{history_id}/"
        try:
            response = self.session.get(url, stream=True)
            if response.status_code == 200:
                with open(save_path, 'wb') as f:
                    for chunk in response.iter_content(chunk_size=8192):
                        f.write(chunk)
                return True, "Download successful"
            return False, response.json()
        except Exception as e:
            return False, {"error": str(e)}