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
        #print(request.POST)
        Results = {}
        if request.method == 'POST':
            if 'Qs[]' in request.POST and 'Engines[]' in request.POST:

                Es = request.POST.getlist('Engines[]')
                Qs = request.POST.getlist('Qs[]')
                for engine in Es:
                    print("Engine: ", engine)
                    t = getSearcherByEngine(engine)
                    Results[engine] = t.search_queries(Qs)

        return render(request, 'downloader/results.html', {
            'Answer': Results,
            'error_message': "Error...",
            })
        # return HttpResponse(json.dumps(Results), content_type="application/json")
    except:
        print(traceback.format_exc())
    print('wrong !!')
    return HttpResponse('Rendering error')


def getSearcherByEngine(engine):
    if engine == "Default":
        return TPB_Searcher.TPB_Searcher()
    elif engine == "ThePirateBay":
        return TPB_Searcher.TPB_Searcher()
    elif engine == "KickassTorrents":
        return Kickass_Searcher.Kickass_Searcher()
    else:
        return TPB_Searcher.TPB_Searcher()


def tryIt(request):
    Results = { 'a':[1,2,3], 'b':[4,5,6], 'c':[7,8,9]}
    return render(request, 'downloader/try.html', {
            'Answer': Results,
            'error_message': "Error...",
        })
