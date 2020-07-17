from django.contrib import admin

# Register your models here.
from django.contrib import admin

from .models import WorkStream, SIA, Label, ABox  # add this line

admin.site.register(WorkStream)
admin.site.register(SIA)
admin.site.register(Label)
admin.site.register(ABox)
