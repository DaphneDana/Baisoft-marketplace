from django.contrib.auth.models import AbstractUser
from django.db import models


class Business(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'businesses'

    def __str__(self):
        return self.name


class Role(models.Model):
    ADMIN = 'admin'
    EDITOR = 'editor'
    APPROVER = 'approver'
    VIEWER = 'viewer'

    ROLE_CHOICES = [
        (ADMIN, 'Admin'),
        (EDITOR, 'Editor'),
        (APPROVER, 'Approver'),
        (VIEWER, 'Viewer'),
    ]

    name = models.CharField(max_length=50, choices=ROLE_CHOICES, unique=True)
    description = models.TextField(blank=True, default='')

    def __str__(self):
        return self.get_name_display()


class User(AbstractUser):
    business = models.ForeignKey(
        Business, on_delete=models.CASCADE, related_name='users', null=True, blank=True
    )
    role = models.ForeignKey(
        Role, on_delete=models.SET_NULL, related_name='users', null=True, blank=True
    )

    def is_admin(self):
        return self.role and self.role.name == Role.ADMIN

    def can_manage_products(self):
        return self.role and self.role.name in (Role.ADMIN, Role.EDITOR)

    def can_approve_products(self):
        return self.role and self.role.name in (Role.ADMIN, Role.APPROVER)

    @property
    def role_name(self):
        return self.role.name if self.role else None
