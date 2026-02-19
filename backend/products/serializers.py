from rest_framework import serializers
from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    business_name = serializers.CharField(source='business.name', read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'status',
                  'business', 'business_name', 'created_by', 'created_by_username',
                  'created_at', 'updated_at']
        read_only_fields = ['business', 'created_by', 'status']


class PublicProductSerializer(serializers.ModelSerializer):
    business_name = serializers.CharField(source='business.name', read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'business_name', 'created_at']
