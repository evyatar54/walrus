/**
 * Created by Walrus on 19/10/2015.
 */


function handlePaste(elem, e)
{
    e.preventDefault();
    if (e.clipboardData && e.clipboardData.getData) {
        var text = "";
        if (/text\/html/.test(e.clipboardData.types)) {
            text = e.clipboardData.getData('text/plain');
        }
        else if (/text\/plain/.test(e.clipboardData.types)) {
            text = e.clipboardData.getData('text/plain');
        }
        //console.log(text)
        var data =  renderText(text);
        var scope = angular.element('[ng-controller="queryCtrl"]').scope();
        scope.addToList(data);
    }
    else{}
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    //console.log(ev.dataTransfer);
    var text = ev.dataTransfer.getData("Text");
    var files = ev.dataTransfer.files;

    renderDarggedData(text,files);
}

function renderDarggedData(text, files)
{
    if(text)
    {
        var data =  renderText(text);
        var scope = angular.element('[ng-controller="queryCtrl"]').scope();
        scope.addToList(data);
    }

    if(files)
    {
        if (window.File && window.FileReader && window.FileList && window.Blob)
        {
            for (var i = 0, f; f = files[i]; i++)
            {
                if (!f.type.match('text*'))
                    continue;


                var reader = new FileReader();
                reader.onload = (function(theFile) {
                    return function(e)
                    {
                        var data =  renderText(e.target.result);
                        var scope = angular.element('[ng-controller="queryCtrl"]').scope();
                        //console.log(data);
                        scope.addToList(data);
                    };
                })(f);

                reader.readAsText(f);
            }
        }
        else
        {
          alert('The File APIs are not fully supported in this browser.');
        }
    }
}

function renderText(text)
{
    var ret = new Array();
    arr = text.split("\n");
    //console.log(arr);
    for (var i in arr)
    {
        line = arr[i].replace(/\s+/g,' ');
        if(line != ' ' && line != '')
        {
            ret.push(line);
        }
    }
    return ret;
}

var app = angular.module('myApp', [], function ($compileProvider) {

  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|magnet):/);

});
app.controller('queryCtrl', function($scope, $location, $anchorScroll, $filter) {

    $scope.engines = { 'KickassTorrents':{"active":1, "name": 'Kickass Torrents'},
        'ThePirateBay':{"active":1, "name": 'The Pirate Bay'}};

    $scope.queries = new Array();
    $scope.results = {};

    $scope.ok = function()
	{
		if(!$scope.query)
			alert("Please enter a non empty query into the list");
		else
		{
			$scope.queries.push(angular.copy($scope.query));
			$scope.query = "";
		}
    };

    $scope.addToList = function(list)
    {
        $scope.$apply(function()
        {
            for (var l in list)
            {
                $scope.queries.push(list[l]);
            }
        });
    }

	$scope.remove = function(index)
	{
		$scope.queries.splice(index,1);
	};

    	$scope.updateQuery = function(index)
	{
		var input = '#query_input_' + index;
		var label = '#query_text_'  + index;

		$(input).val($(label).text());
		$(input).show();

		$(label).hide();
	};

	$scope.submited_query = function(index)
	{
		var input = '#query_input_' + index;
		var label = '#query_text_'  + index;

		var text = $(input).val();
		$(label).text(text);
		$(input).hide();
		$(label).show();

		$scope.queries[index] = text;
	}

    $scope.clearAll = function()
    {
        $scope.queries = [];
    }

	$scope.go = function(Qs) {
        if (Qs.length == 0)
        {
            alert('Please enter some queries into the list')
            return;
        }
        $('#myModal').modal({backdrop: 'static', keyboard: false});
		$('#myModal').modal('show');

        var _url = URL_SEARCH;

        var handler500 = function() { alert("500: Internal Server Error"); };
        var Es = $filter('active_only')($scope.engines)
        Es = Object.keys(Es);

		var data = {state:"inactive", "Qs": Qs, "Engines": Es};

        searchQueries(_url, data);
    };

    function searchQueries(_url, data)
    {
        window.location.href = _url+'?'+ $.param(data)
    }


	function goToElement(event)
	{
		var id = event.currentTarget.id;
		goToElementById(id)
	};

	function goToElementById(id)
	{
		$location.hash(id);
		$anchorScroll();
	};

    $scope.selectEngine = function(key)
    {
        $scope.engines[key]['active'] = 1 - $scope.engines[key]['active'];
    }

})
.directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if(event.which === 13) {
                    scope.$apply(function(){
                        scope.$eval(attrs.ngEnter, {'event': event});
                    });

                    event.preventDefault();
                }
            });
        };
    });

app.filter('active_only', function() {

    return function(input) {

        var output = {};

        for (var e in input)
        {
            if(input[e]['active'] == 1)
                output[e] = input[e]
        }
        return output;

    }

});
