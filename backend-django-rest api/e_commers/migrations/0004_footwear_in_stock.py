# Generated by Django 5.0.4 on 2024-06-01 08:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('e_commers', '0003_footwear_qr_code'),
    ]

    operations = [
        migrations.AddField(
            model_name='footwear',
            name='in_stock',
            field=models.IntegerField(default=10),
        ),
    ]