from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_delete

from easy_thumbnails.fields import ThumbnailerField
from easy_thumbnails.alias import aliases


class MonFichierManager(models.Manager):

    def get_query_set(self):
        queryset = super(MonFichierManager, self).get_query_set()
        return queryset.order_by('-created_at')


class MonFichier(models.Model):
    name = models.CharField(max_length=100, blank=True)
    file = ThumbnailerField(max_length=100, upload_to='mon-fichier/%Y-%m-%d')

    description = models.TextField(blank=True)
    user = models.ForeignKey(User, default=1, related_name='user_files')

    # automatic fields
    created_at = models.DateTimeField(auto_now_add=True, help_text=u'Created')
    updated_at = models.DateTimeField(auto_now=True, help_text=u'Updated')

    objects = MonFichierManager()

    class Meta:
        verbose_name_plural = 'Mes Fichiers'

    def __unicode__(self):
        return self.name


class MonAlbum(models.Model):
    name = models.CharField(max_length=250)
    description = models.TextField(blank=True)
    cover = models.ForeignKey(MonFichier,
                              null=True,
                              blank=True,
                              on_delete=models.SET_NULL)
    files = models.ManyToManyField(MonFichier,
                                   related_name='albums',
                                   blank=True)

    class Meta:
        verbose_name_plural = 'Mes Albums'

    def __unicode__(self):
        return self.name


def delete_file_and_thumbnails(instance, **kwargs):
    instance.file.delete()


post_delete.connect(delete_file_and_thumbnails, sender=MonFichier)


def populate_aliases(app_label):
    THUMBNAIL_ALIASES = {
        app_label: {
            'cover_medium': {'size': (270, 200), 'crop': True},
            'cover_small': {'size': (140, 140), 'crop': True},
            'preview': {'size': (158, 140), 'crop': True},
        }
    }
    for target, target_aliases in THUMBNAIL_ALIASES.iteritems():
        for alias, options in target_aliases.iteritems():
            aliases.set(alias, options, target=target)


_app_label = MonAlbum._meta.app_label
if not aliases.all(target=_app_label):
    populate_aliases(_app_label)
