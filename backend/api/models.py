# (This is backend/api/models.py)

from django.db import models
from django.contrib.auth.models import User

class UploadHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    file_name = models.CharField(max_length=255)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    # The raw file
    csv_file = models.FileField(upload_to='uploads/%Y/%m/%d/')
    
    # Summary statistics (JSON format)
    summary_stats = models.JSONField()

    def __str__(self):
        return f"{self.file_name} by {self.user.username}"
    
    class Meta:
        ordering = ['-uploaded_at'] # Show newest first