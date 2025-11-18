from django.contrib import admin
from .models import UploadHistory

# This "registers" your model with the admin site
@admin.register(UploadHistory)
class UploadHistoryAdmin(admin.ModelAdmin):
    # These are the fields you'll see in the list
    list_display = ('file_name', 'user', 'uploaded_at')
    # This adds a filter on the side
    list_filter = ('user', 'uploaded_at')