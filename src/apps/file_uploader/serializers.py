from easy_thumbnails.exceptions import InvalidImageFormatError
from rest_framework import serializers, relations
from src.apps.file_uploader.models import MonFile, MonAlbum


class FullUrlFileField(serializers.FileField):
    def to_native(self, value):
        return value.url


class ThumbnailFileField(serializers.FileField):

    def __init__(self, alias=None, **kwargs):
        self.alias = alias
        super(ThumbnailFileField, self).__init__(**kwargs)

    def to_native(self, value):
        try:
            return value[self.alias].url
        except InvalidImageFormatError:
            return value.url


class FileSizeField(serializers.FileField):
    def to_native(self, value):
        return value.size


class FileSerializer(serializers.ModelSerializer):
    url = FullUrlFileField(source='file', read_only=True)
    thumbnail = ThumbnailFileField(alias='preview',
                                   source='file',
                                   read_only=True)
    size = FileSizeField(source='file', read_only=True)

    class Meta:
        model = MonFile
        fields = ('id', 'name', 'description', 'url',
                  'thumbnail', 'size', 'created_at')


class FileCreationSerializer(serializers.ModelSerializer):
    file = serializers.FileField()
    url = FullUrlFileField(source='file', read_only=True)

    class Meta:
        model = MonFile
        fields = ('id', 'file', 'name', 'description',
                  'created_at', 'url')


class AlbumCoverSerializer(serializers.ModelSerializer):
    thumbnail_small = ThumbnailFileField(alias='cover_small',
                                         source='file',
                                         read_only=True)
    thumbnail_medium = ThumbnailFileField(alias='cover_medium',
                                          source='file',
                                          read_only=True)

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