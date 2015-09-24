from django.shortcuts import render
from django.shortcuts import render_to_response

from django.http import HttpResponse

from django.shortcuts import get_object_or_404, render
from django.http import HttpResponseRedirect, HttpResponse
from django.core.urlresolvers import reverse
from django.template.context_processors import csrf
import sys, traceback
import json
from .Searchers import TPB_Searcher
from .Searchers import Kickass_Searcher


def index(request):
    try:
        a = render(request, 'downloader/index.html' )
        return a
    except:
        traceback.print_exc(file=sys.stdout)
        return HttpResponse("Error getting index.html, \nsee console log for exception details")


def search(request):
    try:
        if request.method == 'POST':
            if 'Qs[]' in request.POST:

                engine = "Default"
                if 'Engine' in request.POST:
                    engine = request.POST["Engine"]

                Qs = request.POST.getlist('Qs[]')
                Results = {}
                if Qs:
                    t = getSearcherByEngine(engine)
                    # ### t = Kickass_Searcher.Kickass_Searcher()#TPB_Searcher.TPB_Searcher()
                    Results = t.search_queries(Qs)
                else:
                    pass
                return HttpResponse(json.dumps(Results), content_type="application/json")
            return HttpResponse(json.dumps({}), content_type="application/json")
        else:
            return HttpResponse(json.dumps({}), content_type="application/json")
    except:
        print(traceback.format_exc())
    print('wrong !!')
    return HttpRepsonse('request method must be POST')


def getSearcherByEngine(engine):
    if engine == "Default":
        return TPB_Searcher.TPB_Searcher()
    if engine == "ThePirateBay":
        return TPB_Searcher.TPB_Searcher()
    elif engine == "KickassTorrents":
        return Kickass_Searcher.Kickass_Searcher()
    else:
        return TPB_Searcher.TPB_Searcher()
