from django.conf.urls import patterns, url, include
from rest_framework.routers import DefaultRouter
from src.apps.file_uploader import views


class CustomRouter(DefaultRouter):
    def __init__(self):
        super(CustomRouter, self).__init__()
        self.routes[0] = self.routes[0]._replace(url=r'^{prefix}/?$')


router = CustomRouter()
router.register(r'albums', views.AlbumViewSet)
router.register(r'files', views.FileViewSet)


urlpatterns = patterns('',
    url(r'^', include(router.urls)),
    url(r'^(?P<path>.*)$', views.RootView.as_view(), name='file_uploader_root'),
)