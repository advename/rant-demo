from rest_framework import serializers
from sia_app.models import ABox

# Post serializer


class ABoxSerializer(serializers.ModelSerializer):
    class Meta:
        model = ABox
        fields = '__all__'
