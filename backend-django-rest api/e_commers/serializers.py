from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from .models import Brand, Category, Footwear, Order, OrderItem, Cart, CartItem, Sliderimage

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    password_confirmation = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password_confirmation')

    def validate(self, data):
        if data['password'] != data['password_confirmation']:
            raise serializers.ValidationError("Passwords must match.")
        return data

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ['id', 'name']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class SliderimageSerializer(serializers.ModelSerializer):
    slide_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Sliderimage
        fields = ['slide_image', 'slide_image_url']

    def get_slide_image_url(self, obj):
        return obj.slide_image.url

class FootwearSerializer(serializers.ModelSerializer):
    brand = serializers.PrimaryKeyRelatedField(queryset=Brand.objects.all())
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    image = serializers.ImageField(max_length=None, use_url=True)

    class Meta:
        model = Footwear
        fields = ['id', 'brand', 'category', 'model', 'size', 'price', 'stock', 'image', 'is_disabled', 'qr_code', 'in_stock']

class OrderItemSerializer(serializers.ModelSerializer):
    footwear = FootwearSerializer(read_only=True) 
    
    class Meta:
        model = OrderItem
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    footwear = FootwearSerializer(read_only=True)

    class Meta:
        model = Order
        fields = '__all__'

class LowStockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Footwear
        fields = ('id', 'brand', 'model', 'stock', 'in_stock')

class StockUpdateSerializer(serializers.Serializer):
    footwear_id = serializers.IntegerField()
    new_stock = serializers.IntegerField()


class SalesReportSerializer(serializers.Serializer):
    date = serializers.DateField()
    total_sales = serializers.DecimalField(max_digits=10, decimal_places=2)
    
class BrandSalesReportSerializer(serializers.Serializer):
    brand = serializers.CharField(max_length=100)
    total_sales = serializers.DecimalField(max_digits=10, decimal_places=2)

class CategorySalesReportSerializer(serializers.Serializer):
    category = serializers.CharField(max_length=100)
    total_sales = serializers.DecimalField(max_digits=10, decimal_places=2)

class CartItemSerializer(serializers.ModelSerializer):
    footwear = FootwearSerializer(read_only=True)

    class Meta:
        model = CartItem
        fields = '__all__'

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = '__all__'
