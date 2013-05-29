from django.conf import settings
from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.conf.urls.static import static
from django.contrib import admin
from src.apps.file_uploader.views import TinymceView


admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', TinymceView.as_view()),
    url(r'^file_uploader/', include('src.apps.file_uploader.urls',
                                    namespace='uploader')),
    url(r'^tinymce/', include('tinymce.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)