# (This is backend/api/serializers.py)

from rest_framework import serializers
from .models import UploadHistory
from django.contrib.auth.models import User

# User Serializer for creating new users
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password')
        extra_kwargs = {'password': {'write_only': True}} # Hide password on read

    def create(self, validated_data):
        # Use create_user to properly hash the password
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user

# Serializer for the upload history
class UploadHistorySerializer(serializers.ModelSerializer):
    # Make user field read-only and show username instead of user ID
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = UploadHistory
        # List all fields we want in our API output
        fields = ['id', 'user', 'file_name', 'uploaded_at', 'summary_stats']