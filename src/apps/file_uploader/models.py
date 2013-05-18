from django.contrib.auth.models import User
from django.db import models


class MonFile(models.Model):
    name = models.CharField(max_length=100, null=True, blank=True)
    file = models.FileField(max_length=100, upload_to='monfile/%Y-%m-%d')

    description = models.TextField(null=True, blank=True)
    user = models.ForeignKey(User, default=1, related_name='user_files')

    # automatic fields
    created_at = models.DateTimeField(auto_now_add=True, help_text=u'Created')
    updated_at = models.DateTimeField(auto_now=True, help_text=u'Updated')

    class Meta:
        verbose_name_plural = 'Mes Files'

    def __unicode__(self):
        return self.name


class MonAlbum(models.Model):
    name = models.CharField(max_length=250)
    description = models.TextField(blank=True)
    cover = models.ForeignKey(MonFile,
                              null=True,
                              blank=True,
                              on_delete=models.SET_NULL)
    files = models.ManyToManyField(MonFile,
                                   related_name='albums',
                                   blank=True)

    class Meta:
        verbose_name_plural = 'Mes Albums'

    def __unicode__(self):
        return self.name
