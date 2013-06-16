from django.contrib import admin
from mes_fichiers.models import MonFichier, MonAlbum


class MonFichierAdmin(admin.ModelAdmin):
    pass


class MonAlbumAdmin(admin.ModelAdmin):
    pass


admin.site.register(MonFichier, MonFichierAdmin)
admin.site.register(MonAlbum, MonAlbumAdmin)