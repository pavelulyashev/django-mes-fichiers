from django.views.generic import TemplateView

from rest_framework import viewsets
from src.apps.file_uploader.models import MonAlbum, MonFile
from src.apps.file_uploader.serializers import AlbumSerializer, \
    FileSerializer, AlbumListSerializer, FileCreationSerializer


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

    def create(self, request, *args, **kwargs):
        self.serializer_class = FileCreationSerializer
        return super(FileViewSet, self).create(request, *args, **kwargs)

    def pre_save(self, obj):
        super(FileViewSet, self).pre_save(obj)
        obj.name = obj.file.name
