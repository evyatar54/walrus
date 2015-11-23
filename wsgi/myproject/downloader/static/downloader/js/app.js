/**
 * Created by Walrus on 19/10/2015.
 */

app = angular.module('myApp', [], function ($compileProvider) {

  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|magnet):/);

});
app.controller('queryCtrl', function($scope, $filter) {

    $scope.pages = ["main_app", "results_page"];
    $scope.current_page = "main_app";

    /**
     * changing the website's div so it will fell like moving pages.
     * @param page   - string - page's name to go to.
     * @param action - string - the action the user made to change page [ click, backwards/forwards, update ].
     * @param data   - JSON   - parameter for future use.
     * @vaiable backup - JSON   - content to backup regarding the current page.
     * @vaiable keep   - JSON   - content to load regarding the next page.
     */

    $scope.page_control = function(page, action, data) //changing the page's content must go through here.
    {
        //backup:
        var image = $scope.getImage();
        var backup = {page: $scope.current_page, data: image};

        if(action == 'stay')
        {
            history.replaceState(backup, '', '/');
            return;
        }

        var keep;
        switch(page) {
            case 'main_app':
                keep = {queries: $scope.queries};
                break;
            case 'results_page':
                keep = {results: $scope.results};
                break;
            default:
                keep = {};
        }

        //reset:
        $scope.resetData(keep);

        //change div:
        $('#' + $scope.current_page).hide();
        $('#' + page).fadeIn();
        $scope.current_page = page;
        //apply command according to action:
        if(action == "click")
        {
            history.replaceState(backup, '', '/');
            history.pushState({page:page, data: keep} , '', '/');
        }
        if(action == 'backwards')
        {
        }

        try{
            $scope.$digest();
        }catch(e){}

        switch(page) {
            case 'main_app':
                //main_app adjustments
                if(action == "click")
                    $scope.queries = [];
                break;
            case 'results_page':
                //results_page adjustments
                $scope.changeTab(Object.keys($scope.results)[0]);
                break;
            default:
                keep = {};
        }
    }

    $scope.siteFields = ['queries', 'results'];

    $scope.getImage = function()
    {
        var image = {};
        for (var i in $scope.siteFields)
        {
            image[$scope.siteFields[i]] = $scope[$scope.siteFields[i]];
        }
        return image;
    }

    $scope.resetData = function(keep)
    {
        //$scope.$apply(function() {
            $scope.queries = [];
            $scope.results = [];
            for (var k in keep)
            {
                    $scope[k] = keep[k];
            }
        //});

    }

    $scope.engines = { 'KickassTorrents':{"active":1, "name": 'Kickass Torrents'},
        'ThePirateBay':{"active":1, "name": 'The Pirate Bay'}};

    $scope.queries = new Array();
    $scope.results = {'KickassTorrents': {}, 'ThePirateBay': {}};

    window.addEventListener('popstate', function(e) {
		var state = e.state;
        if(state)
        {
            //$scope.$apply(function() {
                for (var key in state['data'])
                    $scope[key] = state['data'][key];
            //});
            $scope.page_control( state.page, 'backwards', state.data );
        }
    });

    $scope.ok = function()
	{
		if(!$scope.query)
			alert("Please enter a non empty query into the list");
		else
		{
			pushOne(angular.copy($scope.query));
			$scope.query = "";
		}
    };

    $scope.addToList = function(list)
    {
        //$scope.$apply(function()
        //{
            for (var l in list)
            {
                pushOne(list[l]);
            }
        //});
    }

    function pushOne(one)
    {
        $scope.queries.push(one);
        $scope.page_control("", "stay", {});
    }

	$scope.remove = function(index)
	{
		$scope.queries.splice(index,1);
        $scope.page_control("", "stay", {});
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
        $scope.page_control("", "stay", {});
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
        //$('#myModal').modal({backdrop: 'static', keyboard: false});
        //$('#myModal').modal('show');

        var _url = URL_SEARCH;

        var handler500 = function() { alert("500: Internal Server Error"); };
        var Es = $filter('active_only')($scope.engines)
        Es = Object.keys(Es);

		//var data = {state:"inactive", "Qs": Qs, "Engines": Es};
        //searchQueries(_url, data);

        for (var q in  $scope.queries)
        {
            var data = {state: "inactive", Engines: Es, Q: $scope.queries[q] }
            //console.log(data);
            searchQuery("/downloader/singlesearch", data);
        }
        $scope.page_control('results_page', "click", {results: $scope.results} );
        $scope.changeTab(Object.keys($scope.results)[0]);
    };

    function searchQuery(_url, data)
    {
        $.get(_url, data).success(function(response){

            //$scope.results = response;
            console.log(response);
            for (var e in response)
            {
                Rs = response[e].name;
                console.log(Rs);
                for (r in Rs)
                {
                    if(! $scope.results[e])
                        $scope.results[e] = [];
                    $scope.results[e].push(r);

                }
            }
            //$('#myModal').modal('hide');
            //console.log($scope.results);
        }).fail(function(){  $('#myModal').modal('hide');});
    }

    //function searchQueries(_url, data)
    //{
    //    //window.location.href = _url+'?'+ $.param(data)
    //    $.get(_url, data).success(function(response){
    //
    //        //$scope.$apply(function(){
    //                $scope.results = response;
    //          //  });
    //         $('#myModal').modal('hide');
    //        $scope.page_control('results_page', "click", {results: $scope.results} );
    //        $scope.changeTab(Object.keys($scope.results)[0]);
    //
    //    }).fail(function(){  $('#myModal').modal('hide'); });
    //
    //}


	//function goToElement(event)
	//{
	//	var id = event.currentTarget.id;
	//	goToElementById(id)
	//};
    //
	//function goToElementById(id)
	//{
	//	$location.hash(id);
	//	$anchorScroll();
	//};

    $scope.selectEngine = function(key)
    {
        $scope.engines[key]['active'] = 1 - $scope.engines[key]['active'];
    }

    $scope.currShownDiv = "KickassTorrents";

    $scope.changeTab = function(engine) {

    $('#tab_'+$scope.currShownDiv).removeClass('active');
    $('#tab_'+engine).addClass('active');

    $('#tab_div_'+$scope.currShownDiv).css('display', 'none');
    $('#tab_div_'+engine).css('display', 'block');

    $scope.currShownDiv = engine;
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

function none(){}
