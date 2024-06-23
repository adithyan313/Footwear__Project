from django.contrib import admin
from django.urls import path
from e_commers import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('addfoot/', views.add_foot, name='addfootwear'),
    path('listitemadmin/', views.list_item_admin, name='adminlist'),
    path('editlist/<int:itemid>/', views.edit_list, name='editlistitem'),
    path('edititem/<int:itemid>/', views.edit_item, name='edititems'),
    path('delete/<int:pk>/', views.delete_item, name='deleteitems'),
    path('disable/<int:pk>/', views.disable_item, name='disableitems'),
    path('footweardetail/<int:pk>/', views.footwear_detail, name='footwear_detail'),
    path('reports/daily_sales/', views.daily_sales_report, name='daily_sales_report'),
    path('reports/brand_sales/', views.brand_sales_report, name='brand_sales_report'),
    path('reports/category_sales/', views.category_sales_report, name='category_sales_report'),
    path('low_stock/', views.low_stock, name='low_stock'),
    path('orders/', views.order_list, name='order_list'),
    path('orders/<int:order_id>/', views.update_order_status, name='update_order_status'),

    path('register/', views.register, name='register'),
    path('login/', views.login, name='userlogin'),
    path('logout/', views.logout, name='userlogout'),
    path('listitem/', views.list_item, name='list_item'),
    path('search/', views.search_products, name='search_products'),
    path('filter_products/', views.filter_products, name='filter_products'),
    path('product_details/<int:pk>/', views.product_detail, name='products_details'),
    path('cart/add/<int:footwear_id>/', views.add_to_cart, name='add_to_cart'),
    path('cart/view/', views.view_cart, name='view_cart'),
    path('cart/remove/<int:cart_item_id>/', views.remove_from_cart, name='remove_from_cart'),
    path('place_order/', views.place_order, name='place_order'),
    path('confirm_payment/', views.confirm_payment, name='confirm_payment'),
    path('myorder/', views.order_history, name='order_history'),
    path('download/<int:order_id>/', views.download_receipt, name='download_receipt')

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
