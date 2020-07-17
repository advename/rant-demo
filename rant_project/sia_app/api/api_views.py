from rest_framework import status  # used to return status code
from rest_framework.views import APIView  # APIView class
from rest_framework.response import Response  # allow to send response

from sia_app.models import ABox  # import Post Model
from sia_app.api.serializers import ABoxSerializer  # import Post Serializer

# Retrieve all posts or create one new post


class ABoxHandler(APIView):

    # post function for POST requests
    def post(self, request, format=None):
        serializer = ABoxSerializer(data=request.data)

        # Validate POST data
        if serializer.is_valid():
            # Save to DB and return success status
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        # Return Error status if validation failed
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
