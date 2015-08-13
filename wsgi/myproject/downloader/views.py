from django.shortcuts import render

from django.http import HttpResponse

from django.shortcuts import get_object_or_404, render
from django.http import HttpResponseRedirect, HttpResponse
from django.core.urlresolvers import reverse

import sys, traceback

def index(request):
	try:
		a = render(request, 'downloader/index.html' )
		return a
	except:
		traceback.print_exc(file=sys.stdout)
		return HttpResponse("Error getting index.html, \nsee console log for exception details")