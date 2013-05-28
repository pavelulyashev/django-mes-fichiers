from django.views.generic import TemplateView

from rest_framework import viewsets
from src.apps.file_uploader.models import MonAlbum, MonFile
from src.apps.file_uploader.serializers import AlbumSerializer, \
    FileSerializer, AlbumListSerializer, FileCreationSerializer, BaseAlbumSerializer


class RootView(TemplateView):
    template_name = 'file_uploader.html'


class AlbumViewSet(viewsets.ModelViewSet):
    queryset = MonAlbum.objects.all()
    serializer_class = AlbumSerializer

    def list(self, request, *args, **kwargs):
        self.serializer_class = AlbumListSerializer
        return super(AlbumViewSet, self).list(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        self.serializer_class = BaseAlbumSerializer
        return super(AlbumViewSet, self).partial_update(request, *args,
                                                        **kwargs)


class FileViewSet(viewsets.ModelViewSet):
    queryset = MonFile.objects.all()
    serializer_class = FileSerializer

    def create(self, request, *args, **kwargs):
        self.album_id = request.DATA.get('album')
        self.serializer_class = FileCreationSerializer
        return super(FileViewSet, self).create(request, *args, **kwargs)

    def pre_save(self, obj):
        super(FileViewSet, self).pre_save(obj)
        obj.name = obj.name or obj.file.name

    def post_save(self, obj, created=False):
        super(FileViewSet, self).post_save(obj, created)
        if created:
            album = MonAlbum.objects.get(id=self.album_id)
            album.files.add(self.object)
