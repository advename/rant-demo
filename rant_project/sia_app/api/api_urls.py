from django.urls import path
from sia_app.api import api_views

from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    path("abox/", api_views.ABoxHandler.as_view(), name="ABox"),
]
