# python Kickass Torrents query searcher:

from lxml import html
import requests
import sys, traceback
import urllib
import threading
import time


class Kickass_Searcher:
    def __init__(self):
        self.Kickass_URL = "http://kat.cr"

    def search_queries(self, queries):
        results = {}
        thread_pull = []
        for query in queries:
            t = threading.Thread(target=search,kwargs={"URL":self.Kickass_URL, "query":query, "result_dict":results} )
            thread_pull.append(t)
            t.start()
            #result = self.search(query)
            #results[query] = result
        for t in thread_pull:
            t.join()
        return {"KickassTorrents": results}

def search(URL, query, result_dict):
    url_query = urllib.parse.quote(query)
    page = requests.get(URL + '/usearch/' + url_query)
    print("got url: ", page.url)
    tree = html.fromstring(page.text)
    torrents = get_results_from_tree(tree)
    result_dict[query] = torrents
    #return torrents

def get_results_from_tree(tree):
    searchResult = tree.xpath('//table[@class="data"]')
    #if found
    if searchResult:
        # it's the only item in the array
        searchResult = searchResult[0]
        #exclude the header line of table:
        lines = searchResult.getchildren()[1:]
        #iterate over the lines and extract general info and link to magnet
        results = []
        for line in lines:
            torrent = []
            name 	= ""
            info 	= ""
            seeds	= ""
            leeches = ""
            magnet	= ""
            ### assign values to torrents fields ###
            name 	= line.xpath('.//a[@class="cellMainLink"]')
            if name:
                name = name[0].text_content()


            #info 	= line.xpath('.//font')
            #if info:
            #info = info[0].text

            seeds	= line.getchildren()[4].text
            leeches = line.getchildren()[5].text

            magnet	= line.xpath('.//a[starts-with(@href, "magnet")]')
            if magnet:
                magnet = magnet[0].values()[2]
            ######
            torrent.append(name)
            torrent.append(info)
            torrent.append(seeds)
            torrent.append(leeches)
            torrent.append(magnet)
            results.append(torrent)
        return results[:15]
    else:
        # There were no results.
        return {}