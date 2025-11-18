# backend/api/serializers.py
from rest_framework import serializers
from .models import UploadHistory
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    # Explicitly define fields to ensure they are included in response
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=False)
    email = serializers.EmailField(required=False)

    class Meta:
        model = User
        # Important: These keys must match what the frontend expects
        fields = ('id', 'username', 'password', 'first_name', 'last_name', 'email')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            email=validated_data.get('email', '')
        )
        return user

class UploadHistorySerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = UploadHistory
        fields = ['id', 'user', 'file_name', 'uploaded_at', 'summary_stats']