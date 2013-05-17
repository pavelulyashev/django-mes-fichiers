from django.views.generic import TemplateView

from rest_framework import viewsets
from src.apps.file_uploader.models import MonAlbum, MonFile


class RootView(TemplateView):
    template_name = 'file_uploader.html'


class AlbumViewSet(viewsets.ModelViewSet):
    queryset = MonAlbum.objects.all()
    model = MonAlbum


class FileViewSet(viewsets.ModelViewSet):
    queryset = MonFile.objects.all()
    model = MonFile
