from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Business, Role

User = get_user_model()


class BusinessSerializer(serializers.ModelSerializer):
    class Meta:
        model = Business
        fields = ['id', 'name', 'description']


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['id', 'name', 'description']


class UserSerializer(serializers.ModelSerializer):
    role_name = serializers.ReadOnlyField()
    business_name = serializers.CharField(source='business.name', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name',
                  'role', 'role_name', 'business', 'business_name']
        read_only_fields = ['business']


class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name',
                  'password', 'role']

    def create(self, validated_data):
        password = validated_data.pop('password')
        business = self.context['request'].user.business
        user = User(**validated_data, business=business)
        user.set_password(password)
        user.save()
        return user


class RegisterSerializer(serializers.Serializer):
    business_name = serializers.CharField(max_length=255)
    business_description = serializers.CharField(required=False, default='')
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)
    first_name = serializers.CharField(required=False, default='')
    last_name = serializers.CharField(required=False, default='')

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError('Username already exists.')
        return value

    def create(self, validated_data):
        business = Business.objects.create(
            name=validated_data['business_name'],
            description=validated_data.get('business_description', ''),
        )
        admin_role, _ = Role.objects.get_or_create(
            name=Role.ADMIN, defaults={'description': 'Full access'}
        )
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            business=business,
            role=admin_role,
        )
        return user
