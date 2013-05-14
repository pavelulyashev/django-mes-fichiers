from django.contrib import admin
from src.apps.file_uploader.models import MonFile, MonAlbum


class FileAdmin(admin.ModelAdmin):
    pass


class AlbumAdmin(admin.ModelAdmin):
    pass


admin.site.register(MonFile, FileAdmin)
admin.site.register(MonAlbum, AlbumAdmin)