from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView

from rest_framework import viewsets
from src.apps.file_uploader.models import MonAlbum, MonFile


class RootView(TemplateView):
    template_name = 'file_uploader.html'


class AlbumViewSet(viewsets.ModelViewSet):
    queryset = MonAlbum.objects.all()
    model = MonAlbum

album_detail = AlbumViewSet.as_view({'get': 'retrieve'})
album_create = AlbumViewSet.as_view({'post': 'create'})
album_update = AlbumViewSet.as_view({'post': 'update'})
album_delete = AlbumViewSet.as_view({'post': 'destroy'})


class FileViewSet(viewsets.ModelViewSet):
    queryset = MonFile.objects.all()
    model = MonFile

file_create = FileViewSet.as_view({'post': 'create'})
file_detail = FileViewSet.as_view({'get': 'retrieve'})
file_update = FileViewSet.as_view({'post': 'update'})
file_delete = FileViewSet.as_view({'post': 'destroy'})