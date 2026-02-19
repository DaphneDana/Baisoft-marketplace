from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import Business, Role, User


@admin.register(Business)
class BusinessAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ['name', 'description']


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'business', 'role']
    list_filter = ['business', 'role']
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Marketplace', {'fields': ('business', 'role')}),
    )
