from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from accounts.permissions import CanApproveProducts, CanManageProducts
from .models import Product
from .serializers import ProductSerializer, PublicProductSerializer


class PublicProductListView(generics.ListAPIView):
    serializer_class = PublicProductSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Product.objects.filter(status=Product.APPROVED).select_related('business')


class ProductListCreateView(generics.ListCreateAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Product.objects.filter(
            business=self.request.user.business
        ).select_related('business', 'created_by')

    def get_permissions(self):
        if self.request.method == 'POST':
            return [CanManageProducts()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(
            business=self.request.user.business,
            created_by=self.request.user,
        )


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProductSerializer
    permission_classes = [CanManageProducts]

    def get_queryset(self):
        return Product.objects.filter(
            business=self.request.user.business
        ).select_related('business', 'created_by')


@api_view(['POST'])
@permission_classes([CanManageProducts])
def submit_product(request, pk):
    try:
        product = Product.objects.get(pk=pk, business=request.user.business)
    except Product.DoesNotExist:
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

    if product.status != Product.DRAFT:
        return Response(
            {'detail': 'Only draft products can be submitted for approval.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    product.status = Product.PENDING_APPROVAL
    product.save()
    return Response(ProductSerializer(product).data)


@api_view(['POST'])
@permission_classes([CanApproveProducts])
def approve_product(request, pk):
    try:
        product = Product.objects.get(pk=pk, business=request.user.business)
    except Product.DoesNotExist:
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

    if product.status != Product.PENDING_APPROVAL:
        return Response(
            {'detail': 'Only pending products can be approved.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    product.status = Product.APPROVED
    product.save()
    return Response(ProductSerializer(product).data)


@api_view(['POST'])
@permission_classes([CanApproveProducts])
def reject_product(request, pk):
    try:
        product = Product.objects.get(pk=pk, business=request.user.business)
    except Product.DoesNotExist:
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

    if product.status != Product.PENDING_APPROVAL:
        return Response(
            {'detail': 'Only pending products can be rejected.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    product.status = Product.DRAFT
    product.save()
    return Response(ProductSerializer(product).data)
