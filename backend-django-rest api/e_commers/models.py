from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
import qrcode
from django.conf import settings
from django.urls import reverse
from io import BytesIO
from django.core.files import File

def validate_pincode(value):
    if not value.isdigit() or len(value) != 6:
        raise ValidationError("Pincode must be a 6 digit number")

class Brand(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    
class Sliderimage(models.Model):
    slide_image = models.ImageField(upload_to='footwear_sideerimages/')

    def __str__(self):
        return self.slide_image.url

class Footwear(models.Model):
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    model = models.CharField(max_length=100)
    size = models.FloatField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField()
    image = models.ImageField(upload_to='footwear_images/')
    is_disabled = models.BooleanField(default=False)
    qr_code = models.ImageField(upload_to='qr_codes/', blank=True, null=True)
    in_stock = models.IntegerField(default=10) 

    def __str__(self):
        return f"{self.brand.name} {self.model}"
    
    def generate_qr_code(self):
        url = f"{settings.SITE_URL}{reverse('footwear_detail', args=[self.id])}"
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(url)
        qr.make(fit=True)
        img = qr.make_image(fill='black', back_color='white')

        buffer = BytesIO()
        img.save(buffer, format="PNG")
        file_name = f'qr_code_{self.id}.png'
        self.qr_code.save(file_name, File(buffer), save=False)
        self.save()

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('dispatched', 'Dispatched'),
        ('completed', 'Completed'),
        ('returned', 'Returned'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    razorpay_order_id = models.CharField(max_length=100, blank=True, null=True)
    razorpay_payment_id = models.CharField(max_length=100, blank=True, null=True)
    payment_date = models.DateTimeField(blank=True, null=True)
    delivery_address = models.TextField()
    pincode = models.CharField(max_length=6, validators=[validate_pincode], default='000000')
    qr_image = models.ImageField(blank=True, null=True, upload_to='QRCode')

    def __str__(self):
        return f"Order {self.id} by {self.user.username}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    footwear = models.ForeignKey(Footwear, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.quantity} of {self.footwear.model} in order {self.order.id}"
    

class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"Cart of {self.user.username}"

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name='items', on_delete=models.CASCADE)
    footwear = models.ForeignKey(Footwear, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} of {self.footwear.model} in cart of {self.cart.user.username}"
