from django.shortcuts import render
from django.shortcuts import render_to_response

from django.http import HttpResponse

from django.shortcuts import get_object_or_404, render
from django.http import HttpResponseRedirect, HttpResponse
from django.core.urlresolvers import reverse
from django.template.context_processors import csrf
import sys, traceback
#from KickassAPI import search

def index(request):
	
	try:
		a = render(request, 'downloader/index.html' )
		return a
	except:
		traceback.print_exc(file=sys.stdout)
		return HttpResponse("Error getting index.html, \nsee console log for exception details")
	
	
def search(request):
	if request.method == 'POST':
		if 'Qs[]' in request.POST:
			Qs = request.POST.getlist('Qs[]')
			return render(request, 'downloader/index.html' )
			return HttpResponse('success')
		else:
			pass
			
	if request.method == 'GET':
		if 'Qs[]' in request.GET:
			Qs = request.GET.getlist('Qs[]')
			return render(request, 'downloader/index.html' )
			return HttpResponse('success')
		else:
			pass
	return HttpRepsonse('FAIL!!!!!')