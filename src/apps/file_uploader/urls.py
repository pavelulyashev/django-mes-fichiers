from django.conf.urls import patterns, url, include
from rest_framework.routers import DefaultRouter
from src.apps.file_uploader import views


class CustomRouter(DefaultRouter):
    include_root_view = False

    def __init__(self):
        super(CustomRouter, self).__init__()
        routes = self.routes
        routes[0] = routes[0]._replace(url=r'^{prefix}/?$')
        routes[1] = routes[1]._replace(
            url=r'^{prefix}/{lookup}/?$',
            mapping={
                'get': 'retrieve',
                'put': 'partial_update',
                'delete': 'destroy'
            }
        )


router = CustomRouter()
router.register(r'albums', views.AlbumViewSet)
router.register(r'files', views.FileViewSet)


urlpatterns = patterns('',
    url(r'^rest/', include(router.urls)),
    url(r'^(?P<path>.*)$', views.RootView.as_view(), name='file_uploader_root'),
)