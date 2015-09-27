from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
	url(r'^search$', views.search, name='search'),
    url(r'^try$', views.tryIt, name='tryIt'),
    url(r'^amm$', views.amm, name='amm')
]