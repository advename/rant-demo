# Generated by Django 3.0.8 on 2020-07-17 10:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sia_app', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sia',
            name='img_height',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='sia',
            name='img_width',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
    ]
