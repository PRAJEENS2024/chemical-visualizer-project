# (This is backend/api/urls.py)

from django.urls import path
from . import views  # Import the views.py file from this same directory

urlpatterns = [
    # Auth
    path('register/', views.CreateUserView.as_view(), name='register'),
    
    # Core Features
    path('upload-csv/', views.UploadCsvView.as_view(), name='upload-csv'),
    path('summary/', views.LatestSummaryView.as_view(), name='latest-summary'),
    path('history/', views.HistoryListView.as_view(), name='history-list'),
    
    # The 'pk' (primary key) part means it expects an ID, e.g., /api/download-report/1/
    path('download-report/<int:pk>/', views.DownloadReportView.as_view(), name='download-report'),
]