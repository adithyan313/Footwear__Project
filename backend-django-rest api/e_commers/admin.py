from django.contrib import admin
from .models import Brand, Category, Footwear, OrderItem, Order, Sliderimage
from django.contrib.admin.views.decorators import staff_member_required
from django.db.models import Sum, F
from django.db.models.functions import TruncDate
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser
from django.urls import path
from .serializers import SalesReportSerializer, BrandSalesReportSerializer, CategorySalesReportSerializer

# Registering models
admin.site.register(Brand)
admin.site.register(Category)
admin.site.register(Sliderimage)

@admin.register(Footwear)
class FootwearAdmin(admin.ModelAdmin):
    list_display = ('model', 'brand', 'category', 'size', 'price', 'stock', 'is_disabled')
    actions = ['generate_qr_codes']

    def generate_qr_codes(self, request, queryset):
        for footwear in queryset:
            footwear.generate_qr_code()
        self.message_user(request, "QR codes generated successfully.")
    generate_qr_codes.short_description = "Generate QR codes for selected footwear"

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'order', 'footwear', 'quantity')

    @action(detail=False, methods=['get'], permission_classes=[IsAdminUser])
    def daily_sales_report(self, request):
        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')
        
        if not start_date or not end_date:
            return Response({"error": "start_date and end_date are required"}, status=400)

        orders = OrderItem.objects.filter(
            order__created_at__date__range=[start_date, end_date]
        ).values(
            date=TruncDate('order__created_at')
        ).annotate(
            total_sales=Sum(F('quantity') * F('footwear__price'))
        ).order_by('date')

        serializer = SalesReportSerializer(orders, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[IsAdminUser])
    def brand_sales_report(self, request):
        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')
        
        if not start_date or not end_date:
            return Response({"error": "start_date and end_date are required"}, status=400)

        orders = OrderItem.objects.filter(
            order__created_at__date__range=[start_date, end_date]
        ).values(
            brand=F('footwear__brand__name')
        ).annotate(
            total_sales=Sum(F('quantity') * F('footwear__price'))
        ).order_by('brand')

        serializer = BrandSalesReportSerializer(orders, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[IsAdminUser])
    def category_sales_report(self, request):
        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')
        
        if not start_date or not end_date:
            return Response({"error": "start_date and end_date are required"}, status=400)

        orders = OrderItem.objects.filter(
            order__created_at__date__range=[start_date, end_date]
        ).values(
            category=F('footwear__category__name')
        ).annotate(
            total_sales=Sum(F('quantity') * F('footwear__price'))
        ).order_by('category')

        serializer = CategorySalesReportSerializer(orders, many=True)
        return Response(serializer.data)
    
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'status', 'total_amount', 'created_at', 'updated_at']
    list_filter = ['status']
    search_fields = ['id', 'user__username']

    actions = ['mark_as_pending', 'mark_as_dispatched', 'mark_as_completed', 'mark_as_returned']

    def mark_as_pending(self, request, queryset):
        queryset.update(status='pending')
    mark_as_pending.short_description = "Mark selected orders as Pending"

    def mark_as_dispatched(self, request, queryset):
        queryset.update(status='dispatched')
    mark_as_dispatched.short_description = "Mark selected orders as Dispatched"

    def mark_as_completed(self, request, queryset):
        queryset.update(status='completed')
    mark_as_completed.short_description = "Mark selected orders as Completed"

    def mark_as_returned(self, request, queryset):
        queryset.update(status='returned')
    mark_as_returned.short_description = "Mark selected orders as Returned"
