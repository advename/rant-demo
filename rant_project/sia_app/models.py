from django.db import models
from django.contrib.auth.models import User

# Create your models here.

# A single Annotation task of a picture (Single Image Annotation)


class WorkStream(models.Model):
    title = models.CharField(max_length=300)
    description = models.TextField()
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="assigned_user")
    owner = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="owner_user")


class SIA(models.Model):
    img_height = models.PositiveIntegerField(null=True, blank=True)
    img_width = models.PositiveIntegerField(null=True, blank=True)
    img = models.ImageField(
        upload_to='sias', height_field='img_height', width_field='img_width')
    wstream = models.ForeignKey(WorkStream, on_delete=models.CASCADE)
# Image upload and calculation should be done with a task queue
# See-> http://www.johanneshoppe.com/django-stdimage/


class Label(models.Model):
    name = models.CharField(max_length=200)
    wstream = models.ForeignKey(WorkStream, on_delete=models.CASCADE)


class ABox(models.Model):
    orig_x = models.DecimalField(max_digits=25, decimal_places=15)
    orig_y = models.DecimalField(max_digits=25, decimal_places=15)
    w = models.DecimalField(max_digits=25, decimal_places=15)
    h = models.DecimalField(max_digits=25, decimal_places=15)
    sia = models.ForeignKey(SIA, on_delete=models.CASCADE)
