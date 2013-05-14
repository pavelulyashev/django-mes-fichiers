from django.conf.urls import patterns, url, include
from rest_framework.routers import DefaultRouter
from src.apps.file_uploader import views
from src.apps.file_uploader.views import album_detail, album_create, album_update, album_delete, file_create, file_detail, file_update, file_delete


urlpatterns1 = patterns('',
    url(r'^album/create/$', album_create, name='album_create'),
    url(r'^album/(?P<pk>[0-9]+)/$', album_detail, name='album_detail'),
    url(r'^album/(?P<pk>[0-9]+)/update/$', album_update, name='album_update'),
    url(r'^album/(?P<pk>[0-9]+)/delete/$', album_delete, name='album_delete'),

    url(r'^file/create/$', file_create, name='file_create'),
    url(r'^file/(?P<pk>[0-9]+)/$', file_detail, name='file_detail'),
    url(r'^file/(?P<pk>[0-9]+)/update/$', file_update, name='file_update'),
    url(r'^file/(?P<pk>[0-9]+)/delete/$', file_delete, name='file_delete'),

    url(r'^(?P<path>.*)$', views.RootView.as_view(), name='file_uploader_root'),
)


router = DefaultRouter()
router.register(r'albums', views.AlbumViewSet)
router.register(r'files', views.FileViewSet)


urlpatterns = patterns('',
    url(r'^', include(router.urls)),
    url(r'^(?P<path>.*)$', views.RootView.as_view(), name='file_uploader_root'),
)