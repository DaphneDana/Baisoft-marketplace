from django.urls import path
from . import views

urlpatterns = [
    path('public/', views.PublicProductListView.as_view(), name='public-products'),
    path('manage/', views.ProductListCreateView.as_view(), name='product-list'),
    path('manage/<int:pk>/', views.ProductDetailView.as_view(), name='product-detail'),
    path('manage/<int:pk>/submit/', views.submit_product, name='product-submit'),
    path('manage/<int:pk>/approve/', views.approve_product, name='product-approve'),
    path('manage/<int:pk>/reject/', views.reject_product, name='product-reject'),
]
