# Generated by Django 5.0.4 on 2024-06-15 11:02

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('e_commers', '0018_sliderimage_footwear_sliderimage'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='footwear',
            name='sliderimage',
        ),
    ]
