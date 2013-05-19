from rest_framework import serializers, relations
from src.apps.file_uploader.models import MonFile, MonAlbum


class FullUrlFileField(serializers.FileField):
    def to_native(self, value):
        return value.url


class ThumbnailImageField(serializers.ImageField):
    def to_native(self, value):
        return value.url


class FileSerializer(serializers.ModelSerializer):
    url = FullUrlFileField(source='file', read_only=True)
    thumbnail = ThumbnailImageField(source='file', read_only=True)

    class Meta:
        model = MonFile
        fields = ('id', 'name', 'description', 'url', 'thumbnail')


class AlbumCoverSerializer(serializers.ModelSerializer):
    thumbnail_small = ThumbnailImageField(source='file', read_only=True)
    thumbnail_medium = ThumbnailImageField(source='file', read_only=True)

    class Meta:
        model = MonFile
        fields = ('id', 'thumbnail_small', 'thumbnail_medium')


class AlbumSerializer(serializers.ModelSerializer):
    cover = AlbumCoverSerializer(required=False)
    files = FileSerializer(many=True, read_only=True)

    class Meta:
        model = MonAlbum


class AlbumListSerializer(AlbumSerializer):
    files = relations.PrimaryKeyRelatedField(many=True)
