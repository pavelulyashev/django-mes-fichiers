from easy_thumbnails.exceptions import InvalidImageFormatError
from rest_framework import serializers, relations
from mes_fichiers.models import MonFichier, MonAlbum


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
        model = MonFichier
        fields = ('id', 'name', 'description', 'url',
                  'thumbnail', 'size', 'created_at')


class FileCreationSerializer(serializers.ModelSerializer):
    file = serializers.FileField()
    url = FullUrlFileField(source='file', read_only=True)

    class Meta:
        model = MonFichier
        fields = ('id', 'file', 'name', 'description',
                  'created_at', 'url')


class CoverSerializer(serializers.ModelSerializer):
    thumbnail_small = ThumbnailFileField(alias='cover_small',
                                         source='file',
                                         read_only=True)
    thumbnail_medium = ThumbnailFileField(alias='cover_medium',
                                          source='file',
                                          read_only=True)

    class Meta:
        model = MonFichier
        fields = ('id', 'thumbnail_small', 'thumbnail_medium')


class CoverField(serializers.PrimaryKeyRelatedField):

    def field_to_native(self, obj, field_name):
        cover = getattr(obj, field_name)
        if not cover:
            return None

        serializer = CoverSerializer(cover)
        return serializer.data


class BaseAlbumSerializer(serializers.ModelSerializer):
    cover = CoverField(source='cover', required=False)

    class Meta:
        model = MonAlbum
        fields = ('id', 'name', 'description', 'cover')


class AlbumSerializer(BaseAlbumSerializer):
    files = FileSerializer(many=True, read_only=True)

    class Meta:
        model = MonAlbum
        fields = ('id', 'name', 'description', 'cover', 'files')


class AlbumListSerializer(AlbumSerializer):
    files = relations.PrimaryKeyRelatedField(many=True)
