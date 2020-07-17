from django.shortcuts import render
from django.shortcuts import render, get_object_or_404, get_list_or_404

# Create your views here.
from .models import WorkStream, SIA, Label


def index(request):
    wstream = get_object_or_404(WorkStream, id=1)
    sias = get_list_or_404(SIA, wstream=wstream)
    labels = get_list_or_404(Label, wstream=wstream)
    print("========================")
    print(labels[0].name)
    print("========================")
    context = {
        "wstream": wstream,
        "sias": sias,
        "labels": labels,
    }
    return render(request, "sia_app/sia.html", context)
