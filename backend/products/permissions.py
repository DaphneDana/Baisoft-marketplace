from rest_framework.permissions import BasePermission


class IsBusinessMember(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.business == request.user.business
