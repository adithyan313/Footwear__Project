from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes, authentication_classes, parser_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import FootwearSerializer, RegisterSerializer, SalesReportSerializer, BrandSalesReportSerializer, CategorySalesReportSerializer, OrderSerializer, CartItemSerializer, CartSerializer, OrderItemSerializer
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from .permissions import IsAdminOrReadOnly
from rest_framework.authentication import TokenAuthentication
from .models import Footwear, Brand, Category, OrderItem, Order, Cart, CartItem
from django.http import Http404
from django.shortcuts import render, get_object_or_404
from django.db.models import Sum, F
from django.db.models.functions import TruncDate
from django.db.models import Q
import razorpay
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.http import HttpResponse
from reportlab.pdfgen import canvas
from io import BytesIO
from django.conf import settings
from django.utils.timezone import now
from reportlab.lib.pagesizes import letter
from datetime import datetime
from django.core.files.base import ContentFile
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Attachment, Content, Disposition, FileContent, FileName, FileType
from django.conf import settings
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from rest_framework.parsers import MultiPartParser, FormParser
import base64
from django.contrib.admin.views.decorators import staff_member_required

@csrf_exempt
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAdminOrReadOnly])
def add_foot(request):
    serializer = FootwearSerializer(data=request.data)
    if serializer.is_valid():
        footwear = serializer.save()
        footwear.generate_qr_code()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAdminOrReadOnly])
def list_item_admin(request):
    footwear = Footwear.objects.filter(is_disabled=False)
    serializer = FootwearSerializer(footwear, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAdminOrReadOnly])
def edit_list(request, itemid):
    try:
        footwear = Footwear.objects.get(id=itemid)
        serializer = FootwearSerializer(footwear)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Footwear.DoesNotExist:
        raise Http404("Item not found")
    
@csrf_exempt
@api_view(['PUT'])
@parser_classes([MultiPartParser, FormParser])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAdminOrReadOnly])
def edit_item(request, itemid):
    try:
        footwear = Footwear.objects.get(id=itemid)
    except Footwear.DoesNotExist:
        return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = FootwearSerializer(footwear, data=request.data, partial=True)
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
'''@api_view(['PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAdminOrReadOnly])
def edit_item(request, pk):
    try:
        footwear = Footwear.objects.get(id=pk)
        serializer = FootwearSerializer(footwear, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Footwear.DoesNotExist:
        raise Http404("Item not found")'''
    
'''@api_view(['PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAdminOrReadOnly])
def edit_item(request, pk):
    try:
        footwear = Footwear.objects.get(id=pk)
    except Footwear.DoesNotExist:
        return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = FootwearSerializer(footwear, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)'''

@api_view(['DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAdminOrReadOnly])
def delete_item(request, pk):
    try:
        footwear = Footwear.objects.get(pk=pk)
    except Footwear.DoesNotExist:
        return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)
    
    footwear.delete()
    return Response({'message': 'Item deleted'}, status=status.HTTP_200_OK)

@api_view(['PATCH'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAdminOrReadOnly])
def disable_item(request, pk):
    try:
        footwear = Footwear.objects.get(id=pk)
    except Footwear.DoesNotExist:
        return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)
    
    footwear.is_disabled = True
    footwear.save()
    return Response({'message': 'Item disabled'}, status=status.HTTP_200_OK)

def footwear_detail(request, pk):
    footwear = get_object_or_404(Footwear, pk=pk)
    return render(request, 'footwear_detail.html', {'footwear': footwear})

@api_view(['GET'])
@staff_member_required
@permission_classes([IsAdminOrReadOnly])
def daily_sales_report(request):
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

@api_view(['GET'])
@staff_member_required
@permission_classes([IsAdminOrReadOnly])
def brand_sales_report(request):
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

@api_view(['GET'])
@staff_member_required
@permission_classes([IsAdminOrReadOnly])
def category_sales_report(request):
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

@api_view(['GET', 'POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAdminOrReadOnly])
def low_stock(request):
    if request.method == 'GET':
        low_stock_products = Footwear.objects.filter(stock__lte=F('in_stock'))
        serializer = FootwearSerializer(low_stock_products, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        footwear_id = request.data.get('footwear_id')
        new_stock = request.data.get('new_stock')
        try:
            footwear = Footwear.objects.get(pk=footwear_id)
        except Footwear.DoesNotExist:
            return Response({'error': 'Footwear not found'}, status=status.HTTP_404_NOT_FOUND)
        
        footwear.stock = new_stock
        footwear.save()
        return Response({'message': 'Stock updated successfully'}, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAdminOrReadOnly])
def order_list(request):
    status = request.GET.get('status')
    if status:
        orders = Order.objects.filter(status=status)
    else:
        orders = Order.objects.all()
    
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAdminOrReadOnly])
def update_order_status(request, order_id):
    try:
        order = Order.objects.get(pk=order_id)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
    
    new_status = request.data.get('status')
    if new_status not in dict(Order.STATUS_CHOICES).keys():
        return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
    
    order.status = new_status
    order.save()
    return Response({'message': 'Order status updated successfully'}, status=status.HTTP_200_OK)


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)
    if user is not None:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'username': user.username,
            'isAdmin': user.is_staff
        }, status=status.HTTP_200_OK)
    else:
        return Response({
            "error": "Invalid credentials or not an admin."
        }, status=status.HTTP_400_BAD_REQUEST)
    
@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    token = request.auth

    if token:
        token.delete()
        return Response({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)
    return Response({'error': 'Invalid token or token not provider'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_item(request):
    footwear = Footwear.objects.filter(is_disabled=False)
    serializer = FootwearSerializer(footwear, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_products(request):
    query = request.GET.get('q', '')
    if not query:
        return Response({"error": "No search query provided"}, status=status.HTTP_400_BAD_REQUEST)

    results = Footwear.objects.filter(
        Q(model__icontains=query) |
        Q(brand__name__icontains=query) |
        Q(category__name__icontains=query)
    ).distinct()

    serializer = FootwearSerializer(results, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def filter_products(request):
    brand = request.GET.get('brand')
    category = request.GET.get('category')
    min_price = request.GET.get('min_price')
    max_price = request.GET.get('max_price')
    size = request.GET.get('size')

    products = Footwear.objects.filter(is_disabled=False)

    if brand:
        products = products.filter(brand__name__icontains=brand)
    if category:
        products = products.filter(category__name__icontains=category)
    if min_price:
        products = products.filter(price__gte=min_price)
    if max_price:
        products = products.filter(price__lte=max_price)
    if size:
        products = products.filter(size=size)

    serializer = FootwearSerializer(products, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def product_detail(request, pk):
    try:
        footwear = Footwear.objects.get(id=pk)
    except Footwear.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = FootwearSerializer(footwear)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def add_to_cart(request, footwear_id):
    user = request.user
    footwear = get_object_or_404(Footwear, id=footwear_id)

    cart, created = Cart.objects.get_or_create(user=user) 

    cart_item, created = CartItem.objects.get_or_create(cart=cart, footwear=footwear)
    if not created:
        cart_item.quantity += 1
        cart_item.save()

    return Response({'message': 'Item added to cart'}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def view_cart(request):
    user = request.user
    cart = get_object_or_404(Cart, user=user)
    serializer = CartSerializer(cart)
    return Response(serializer.data)

@api_view(['DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def remove_from_cart(request, cart_item_id):
    user = request.user
    cart_item = get_object_or_404(CartItem, id=cart_item_id, cart__user=user)
    cart_item.delete()
    return Response({'message': 'Item removed from cart'}, status=status.HTTP_200_OK)


# Function to generate PDF receipt
def generate_pdf_receipt(order):
    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    p.drawString(100, 750, f"Order Receipt - Order ID: {order.id}")
    p.drawString(100, 735, f"Date: {order.created_at.strftime('%Y-%m-%d %H:%M:%S')}")
    p.drawString(100, 720, f"Total Amount: ${order.total_amount}")
    
    p.drawString(100, 705, "Items:")
    y = 690
    for item in order.items.all():
        p.drawString(100, y, f"{item.quantity} x {item.footwear.model} - ${item.footwear.price}")
        y -= 15

    p.showPage()
    p.save()
    buffer.seek(0)
    return buffer

'''def send_order_confirmation_email(order):
    # Generate the PDF receipt
    pdf_buffer = generate_pdf_receipt(order)
    
    # Check if the PDF buffer is empty or None
    if not pdf_buffer:
        print("PDF generation failed or returned an empty result.")
        return
    
    # Convert the PDF buffer to a Django ContentFile
    pdf_file = ContentFile(pdf_buffer.getvalue())
    
    # Save the PDF file temporarily to the default storage system
    temp_pdf_path = default_storage.save(f'order_receipt_{order.id}.pdf', pdf_file)
    
    # Construct the full path to the temporary file
    full_temp_pdf_path = default_storage.path(temp_pdf_path)
    
    email_subject = f"Order Confirmation - Order ID: {order.id}"
    email_body = render_to_string('order_confirmation_email.html', {'order': order})

    message = Mail(
        from_email='your_email@example.com',
        to_emails=[order.user.email],
        subject=email_subject,
        plain_text_content=email_body,
        html_content=email_body
    )

    # Create an Attachment instance
    attachment = Attachment()
    attachment.file_content = pdf_file.read()
    attachment.filename = f'order_receipt_{order.id}.pdf'
    attachment.type = "application/pdf"
    attachment.disposition = "attachment"
    
    # Add the attachment to the message
    message.attach_files([attachment])  # Corrected method to add attachments
    
    try:
        sg = SendGridAPIClient(settings.SENDGRID_API_KEY)
        response = sg.send(message)
        print(response.status_code, response.body, response.headers)
    except Exception as e:
        print(str(e))
    
    # Clean up the temporary file
    default_storage.delete(temp_pdf_path)'''


def send_order_confirmation_email(order):
    pdf_buffer = generate_pdf_receipt(order)
    email_subject = f"Order Confirmation - Order ID: {order.id}"
    email_body = render_to_string('order_confirmation_email.html', {'order': order})

    email = EmailMessage(
        email_subject,
        email_body,
        'your_email@example.com',
        [order.user.email],
    )
    email.attach(f'order_receipt_{order.id}.pdf', pdf_buffer.getvalue(), 'application/pdf')
    email.send()


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def place_order(request):
    user = request.user
    cart = get_object_or_404(Cart, user=user)
    cart_items = cart.items.all()
    if not cart_items.exists():
        return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

    delivery_address = request.data.get('delivery_address')
    pincode = request.data.get('pincode')
    if not delivery_address or not pincode:
        return Response({'error': 'Delivery address and pincode are required'}, status=status.HTTP_400_BAD_REQUEST)

    
    total_amount = sum(item.quantity * item.footwear.price for item in cart_items)
    
    
    client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
    razorpay_order = client.order.create({
        'amount': int(total_amount * 100),
        'currency': 'INR',
        'payment_capture': '1'
    })

    order = Order.objects.create(
        user=user,
        total_amount=total_amount,
        delivery_address=delivery_address,
        pincode=pincode,
        razorpay_order_id=razorpay_order['id']
    )

    for item in cart_items:
        OrderItem.objects.create(order=order, footwear=item.footwear, quantity=item.quantity)

    
    cart.items.all().delete()

    return Response({
        'order_id': order.id,
        'razorpay_order_id': razorpay_order['id'],
        'amount': razorpay_order['amount'],
        'currency': razorpay_order['currency']
    }, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def confirm_payment(request):
    user = request.user
    razorpay_order_id = request.data.get('razorpay_order_id')
    razorpay_payment_id = request.data.get('razorpay_payment_id')
    razorpay_signature = request.data.get('razorpay_signature')

    client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

    try:
        client.utility.verify_payment_signature({
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature
        })
        order = get_object_or_404(Order, razorpay_order_id=razorpay_order_id, user=user)
        order.razorpay_payment_id = razorpay_payment_id
        order.status = 'completed'
        order.payment_date = datetime.now()
        order.save()

        generate_pdf_receipt(order)
        order.qr_image
        order.save()

        send_order_confirmation_email(order)

        
        return Response({'status': 'Payment successful'}, status=status.HTTP_200_OK)
    except razorpay.errors.SignatureVerificationError:
        return Response({'error': 'Payment verification failed'}, status=status.HTTP_400_BAD_REQUEST)

'''@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def confirm_payment(request):
    user = request.user
    razorpay_order_id = request.data.get('razorpay_order_id')
    razorpay_payment_id = request.data.get('razorpay_payment_id')
    razorpay_signature = request.data.get('razorpay_signature')

    client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

    try:
        client.utility.verify_payment_signature({
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature
        })
        order = get_object_or_404(Order, razorpay_order_id=razorpay_order_id, user=user)
        order.razorpay_payment_id = razorpay_payment_id
        order.status = 'completed'
        order.payment_date = datetime.now()
        order.save()

        # Generate PDF receipt
        buffer = BytesIO()
        p = canvas.Canvas(buffer, pagesize=letter)
        p.drawString(100, 750, f"Order Receipt")
        p.drawString(100, 730, f"Order ID: {order.id}")
        p.drawString(100, 710, f"User: {order.user.username}")
        p.drawString(100, 690, f"Total Amount: {order.total_amount}")
        p.drawString(100, 670, f"Payment ID: {order.razorpay_payment_id}")
        p.drawString(100, 650, f"Payment Date: {order.payment_date.strftime('%Y-%m-%d %H:%M:%S')}")
        p.drawString(100, 630, f"Delivery Address: {order.delivery_address}")
        p.drawString(100, 610, f"Pincode: {order.pincode}")
        p.showPage()
        p.save()
        buffer.seek(0)

        email = EmailMessage(
            'Order Confirmation',
            f'Hi {order.user.username},\n\nThank you for your purchase. Please find attached the receipt for your order.\n\nBest Regards,\nYour Company',
            settings.EMAIL_HOST_USER,
            [order.user.email]
        )
        email.attach(f'Order_{order.id}_Receipt.pdf', buffer.read(), 'application/pdf')
        email.send()

        return Response({'status': 'Payment successful'}, status=status.HTTP_200_OK)
    except razorpay.errors.SignatureVerificationError:
        return Response({'error': 'Payment verification failed'}, status=status.HTTP_400_BAD_REQUEST)'''

'''@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def confirm_payment(request):
    user = request.user
    razorpay_order_id = request.data.get('razorpay_order_id')
    razorpay_payment_id = request.data.get('razorpay_payment_id')
    razorpay_signature = request.data.get('razorpay_signature')

    client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

    try:
        client.utility.verify_payment_signature({
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature
        })
        order = get_object_or_404(Order, razorpay_order_id=razorpay_order_id, user=user)
        order.razorpay_payment_id = razorpay_payment_id
        order.status = 'completed'
        order.payment_date = datetime.now()
        order.save()

        send_order_confirmation_email(order)

        return Response({'status': 'Payment successful'}, status=status.HTTP_200_OK)
    except razorpay.errors.SignatureVerificationError:
        return Response({'error': 'Payment verification failed'}, status=status.HTTP_400_BAD_REQUEST)'''


'''@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def confirm_payment(request):
    payment_id = request.data.get('razorpay_payment_id')
    order_id = request.data.get('order_id')
    order = get_object_or_404(Order, id=order_id, user=request.user)

    if order.razorpay_payment_id:
        return Response({'error': 'Payment already confirmed'}, status=status.HTTP_400_BAD_REQUEST)

    client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
    try:
        payment = client.payment.fetch(payment_id)
        if payment['order_id'] != order.razorpay_order_id:
            return Response({'error': 'Invalid payment for this order'}, status=status.HTTP_400_BAD_REQUEST)

        order.razorpay_payment_id = payment_id
        order.payment_date = now()
        order.status = 'completed'
        order.save()

        # Send confirmation email
        send_order_confirmation_email(order)

        generate_pdf_receipt(order)

        return Response({'message': 'Payment confirmed and order placed'}, status=status.HTTP_200_OK)
    except razorpay.errors.BadRequestError as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)'''
    
'''@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def order_history(request):
    user = request.user
    orders = Order.objects.filter(order__user=user).order_by('order__created_at')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)'''
@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def order_history(request):
    user = request.user
    orders = OrderItem.objects.filter(order__user=user).order_by('order_id')
    serializer = OrderItemSerializer(orders, many=True)
    return Response(serializer.data)

'''@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def download_receipt(request, order_id):
    orderitem = OrderItem.objects.get(id=order_id, user=request.user)
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="order_{order_id}_receipt.pdf"'
    
    p = canvas.Canvas(response, pagesize=letter)
    width, height = letter

    p.drawString(100, height - 50, f"Order Receipt - Order ID: {orderitem.id}")
    p.drawString(100, height - 80, f"User: {orderitem.user.username}")
    p.drawString(100, height - 110, f"Status: {orderitem.order.status}")
    p.drawString(100, height - 140, f"Total Amount: {orderitem.footwear.total_amount}")
    p.drawString(100, height - 170, f"Delivery Address: {orderitem.order.delivery_address}")
    p.drawString(100, height - 200, f"Pincode: {orderitem.footwear.pincode}")

    y = height - 240
    for item in orderitem.items.all():
        p.drawString(100, y, f"{item.quantity} x {item.footwear.model} @ {item.footwear.price}")
        y -= 30

    p.showPage()
    p.save()
    return response'''
@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def download_receipt(request, order_id):
    try:
        orderitem = OrderItem.objects.get(id=order_id, order__user=request.user)
    except OrderItem.DoesNotExist:
        return Response({'error': 'Order item not found or you do not have permission to view this receipt.'}, status=404)

    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="order_{order_id}_receipt.pdf"'

    p = canvas.Canvas(response, pagesize=letter)
    width, height = letter

    p.drawString(100, height - 50, f"Order Receipt - Order ID: {orderitem.order.id}")
    p.drawString(100, height - 80, f"User: {orderitem.order.user.username}")
    p.drawString(100, height - 110, f"Status: {orderitem.order.status}")
    p.drawString(100, height - 140, f"Total Amount: {orderitem.footwear.price * orderitem.quantity}")
    p.drawString(100, height - 170, f"Delivery Address: {orderitem.order.delivery_address}")

    y = height - 210
    for item in orderitem.order.items.all():
        p.drawString(100, y, f"{item.quantity} x {item.footwear.model} @ {item.footwear.price}")
        y -= 30

    p.showPage()
    p.save()
    return response