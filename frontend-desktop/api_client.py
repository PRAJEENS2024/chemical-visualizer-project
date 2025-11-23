# frontend-desktop/api_client.py
import requests

class APIClient:
    # CHANGED: Pointing to the LIVE Render Backend
    def __init__(self, base_url='https://chemical-api-74nj.onrender.com/api'):
        self.base_url = base_url
        self.access_token = None
        self.session = requests.Session()

    def set_token(self, token):
        self.access_token = token
        self.session.headers.update({'Authorization': f'Bearer {self.access_token}'})

    def clear_token(self):
        self.access_token = None
        self.session.headers.pop('Authorization', None)

    def register(self, username, password):
        url = f"{self.base_url}/register/"
        try:
            response = requests.post(url, json={'username': username, 'password': password})
            return response.status_code == 201, response.json()
        except requests.ConnectionError:
            return False, {"detail": "Connection failed. Check internet."}

    def login(self, username, password):
        url = f"{self.base_url}/token/"
        try:
            response = requests.post(url, json={'username': username, 'password': password})
            if response.status_code == 200:
                data = response.json()
                self.set_token(data['access'])
                return True, data
            # Return the error details from the server
            return False, response.json()
        except requests.ConnectionError:
            return False, {"detail": "Connection failed. Check internet."}

    def upload_csv(self, file_path):
        url = f"{self.base_url}/upload-csv/"
        try:
            with open(file_path, 'rb') as f:
                files = {'file': (file_path.split('/')[-1], f, 'text/csv')}
                response = self.session.post(url, files=files)
                return response.status_code == 201, response.json()
        except Exception as e:
            return False, {"detail": str(e)}

    def get_history(self):
        url = f"{self.base_url}/history/"
        try:
            response = self.session.get(url)
            return response.status_code == 200, response.json()
        except Exception as e:
            return False, {"detail": str(e)}

    def download_report(self, history_id, save_path):
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
            return False, {"detail": str(e)}