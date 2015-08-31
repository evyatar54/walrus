# python PirateBay query searcher:

from lxml import html
import requests
import sys, traceback

class TPB_Searcher:
	
	def __init__(self):
		self.TPB_URL = "http://thepiratebay.org"
	
	def search_queries(self, queries):
		results = {}
		for query in queries:
			result = self.search(query)
			results[query] = result
		return results
	
	def search(self, query):
		page = requests.get(self.TPB_URL + '/search/' + query + '/0/99/0')
		tree = html.fromstring(page.text)
		torrents = self.get_results_from_tree(tree)
		return torrents		
		
	def get_results_from_tree(self, tree):
		searchResult = tree.xpath('//table[@id="searchResult"]')
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
				name 	= line.xpath('.//a[@class="detLink"]')
				if name:
					name = name[0].text
				
				info 	= line.xpath('.//font')
				if info:
					info = info[0]
				
				seeds	= line.getchildren[2].text
				leeches = line.getchildren[3].text
				
				magnet	= line.xpath('.//a[startswith(@href, "magnet:")]')
				if magnet:
					magnet = magnet[0].values()[0]
				######
				torrent.append(name)
				torrent.append(info)
				torrent.append(seeds)
				torrent.append(leeches)
				torrent.append(magnet)
				results.append(torrent)
			return results
		else:
			# There were no results.
			return {}
"""		
if __name__ == "main":
	searcher = TPB_Searcher()
	Ts = searcher.search("arrow")
	print Ts
"""