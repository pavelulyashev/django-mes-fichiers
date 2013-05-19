from django.views.generic import TemplateView

from rest_framework import viewsets
from src.apps.file_uploader.models import MonAlbum, MonFile
from src.apps.file_uploader.serializers import AlbumSerializer, FileSerializer, AlbumListSerializer


class RootView(TemplateView):
    template_name = 'file_uploader.html'


class AlbumViewSet(viewsets.ModelViewSet):
    queryset = MonAlbum.objects.all()
    serializer_class = AlbumSerializer

    def list(self, request, *args, **kwargs):
        self.serializer_class = AlbumListSerializer
        return super(AlbumViewSet, self).list(request, *args, **kwargs)


class FileViewSet(viewsets.ModelViewSet):
    queryset = MonFile.objects.all()
    serializer_class = FileSerializer
