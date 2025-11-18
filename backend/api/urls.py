from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.CreateUserView.as_view(), name='register'),
    path('upload-csv/', views.UploadCsvView.as_view(), name='upload-csv'),
    path('summary/', views.LatestSummaryView.as_view(), name='latest-summary'),
    path('history/', views.HistoryListView.as_view(), name='history-list'),
    path('download-report/<int:pk>/', views.DownloadReportView.as_view(), name='download-report'),
    path('export-excel/<int:pk>/', views.ExportExcelView.as_view(), name='export-excel'),
]