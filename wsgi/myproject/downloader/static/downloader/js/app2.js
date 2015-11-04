/**
 * Created by Walrus on 27/10/2015.
 */


app = angular.module('myApp2', [], function ($compileProvider) {

  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|magnet):/);

});
app.factory('MyService', function(){
    return {
        pages: ["first", "second", "third"],
        current_page: "first",

        page_control: function(from_page, to_page, action, data)
        {
            //console.log(action + ": " + from_page + "->" + to_page );
            $('#' + from_page).hide();
            $('#' + to_page).fadeIn();
            if(action == 'forward')
            {
                    history.pushState(data, '', '/downloader/single');
            }
            if(action == 'stay')
            {
                history.replaceState(data, '', '/downloader/single');
            }
            if(action == 'backwards')
            {

            }
            console.log(history.state);
        }
    };
});

app.controller('pageCtrl', function($scope, $filter, MyService) {

    $scope.page_control = MyService.page_control;
    //MyService.page_control('','first', 'stay', { 'from_page':'',to_page:'first', 'data':''} );

    window.addEventListener('popstate', function(e) {
        var state = e.state;
        log(state);
        MyService.page_control(state.to_page, state.from_page, 'backwards', { 'from_page':state.from_page, to_page: state.to_page} );
    });
});


function log(obj)
{
    console.log(obj);
}
