# Generated by Django 5.0.4 on 2024-06-01 05:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('e_commers', '0002_rename_images_footwear_image_order_pincode_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='footwear',
            name='qr_code',
            field=models.ImageField(blank=True, null=True, upload_to='qr_codes/'),
        ),
    ]