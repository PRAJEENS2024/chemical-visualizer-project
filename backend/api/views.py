# backend/api/views.py
from rest_framework import generics, status, views
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
import pandas as pd

from .models import UploadHistory
from .serializers import UserSerializer, UploadHistorySerializer
from .utils import analyze_csv, generate_pdf_report

# 1. User Registration View
class CreateUserView(generics.CreateAPIView):
    """
    Create a new user.
    """
    serializer_class = UserSerializer
    permission_classes = [AllowAny] # Allow anyone to register

# 2. CSV Upload View
class UploadCsvView(views.APIView):
    """
    Upload a CSV, analyze it, and save the history.
    """
    parser_classes = [MultiPartParser, FormParser] # For file uploads
    permission_classes = [IsAuthenticated] # Must be logged in

    def post(self, request, *args, **kwargs):
        csv_file = request.data.get('file')
        
        if not csv_file:
            return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)

        # Analyze the CSV using our function from utils.py
        try:
            summary = analyze_csv(csv_file)
            if summary is None:
                raise Exception("Failed to analyze CSV. Check file format.")
        except Exception as e:
            return Response({"error": f"Invalid CSV file: {e}"}, status=status.HTTP_400_BAD_REQUEST)

        # Save to history model
        history_instance = UploadHistory.objects.create(
            user=request.user,
            file_name=csv_file.name,
            csv_file=csv_file,
            summary_stats=summary
        )

        # **History Management: Keep only the last 5**
        # Get all uploads for this user, ordered by date
        user_uploads = UploadHistory.objects.filter(user=request.user).order_by('-uploaded_at')
        
        # If there are more than 5
        if user_uploads.count() > 5:
            # Get the 5th item
            last_to_keep = user_uploads[4] 
            # Delete all items *older* than the 5th item
            UploadHistory.objects.filter(user=request.user, uploaded_at__lt=last_to_keep.uploaded_at).delete()

        # Send back the summary of the file just uploaded
        serializer = UploadHistorySerializer(history_instance)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

# 3. Get Latest Summary View
class LatestSummaryView(views.APIView):
    """
    Get the summary of the most recent upload for the logged-in user.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Get the newest upload for this user
        latest_upload = UploadHistory.objects.filter(user=request.user).order_by('-uploaded_at').first()
        
        if not latest_upload:
            return Response({"error": "No data found. Please upload a CSV."}, status=status.HTTP_404_NOT_FOUND)
            
        serializer = UploadHistorySerializer(latest_upload)
        return Response(serializer.data, status=status.HTTP_200_OK)

# 4. Get History List View
class HistoryListView(generics.ListAPIView):
    """
    Get the list of the last 5 uploads for the logged-in user.
    """
    serializer_class = UploadHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Our model is already ordered by date, and our upload view
        # deletes old ones, so this automatically returns the last 5.
        return UploadHistory.objects.filter(user=self.request.user)

# 5. Download PDF Report View
class DownloadReportView(views.APIView):
    """
    Generate and download a PDF report for a specific history ID.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, pk, *args, **kwargs):
        # Get the specific history item, ensuring it belongs to the user
        history_instance = get_object_or_404(UploadHistory, pk=pk, user=request.user)
        
        # Generate the PDF using our function from utils.py
        try:
            pdf_buffer = generate_pdf_report(history_instance)
        except Exception as e:
            return Response({"error": f"Failed to generate PDF: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Create the HTTP response to send the file
        response = HttpResponse(pdf_buffer, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="report_{history_instance.file_name}_{pk}.pdf"'
        
        return response

# 6. Export Excel View
class ExportExcelView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk, *args, **kwargs):
        history_instance = get_object_or_404(UploadHistory, pk=pk, user=request.user)
        
        # Re-open the CSV file
        try:
            df = pd.read_csv(history_instance.csv_file)
            
            # Create HTTP response with Excel content type
            response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            response['Content-Disposition'] = f'attachment; filename="data_{history_instance.file_name}.xlsx"'
            
            # Write data to the response
            df.to_excel(response, index=False)
            return response
        except Exception as e:
             return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# 7. Update Profile View
class UpdateProfileView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            # We manually construct the data to ensure no serializer issues
            user_data = {
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email': user.email,
                'username': user.username
            }
            return Response(user_data, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Profile Fetch Error: {e}")
            return Response({"error": "Failed to load profile"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request):
        user = request.user
        data = request.data
        
        if 'first_name' in data: user.first_name = data['first_name']
        if 'last_name' in data: user.last_name = data['last_name']
        if 'email' in data: user.email = data['email']
        
        user.save()
        return Response({"message": "Profile updated successfully"}, status=status.HTTP_200_OK)