function defer(method) {
    if (window.jQuery)
        method();
    else
        setTimeout(function() {
            defer(method)
        }, 50);
}

defer(function() {
    var cors_api_url = 'https://cors-anywhere.herokuapp.com/';

    function doCORSRequest(options, printResult) {
        var x = new XMLHttpRequest();
        x.open('GET', cors_api_url + 'github.com/kevinchau321');
        x.onload = x.onerror = function() {
            var content = $(x.responseText).find('.js-contribution-graph');
            $(content).find('.contributions-setting').remove();
            $(content).find('.float-left.text-gray').remove();
            $(content).find('.contrib-legend').remove();
            $('.col-9').append(content);
        };
        x.send(options.data);
    }
    (function() {
        doCORSRequest({
            method: 'GET',
        });
    })();
});

function checkFlag() {
    if ($('body').find('.js-contribution-graph').length === 0) {
        window.setTimeout(checkFlag, 100); /* this checks the flag every 100 milliseconds*/
    } else {
        /* do something*/
        $.getScript('iso/iso.js');
        pridifyRectangles();
    }
}
checkFlag();

function pridifyRectangles() {
    var GH = ['#EEEEEE', '#D6E685', '#8CC665', '#44A340', '#1E6823'];
    var CO = ['#AE81FF', '#66D9EF', '#E6DB74', '#EEEEEE', '#F92672', '#A6E22E', '#FD971F'];

    var graph = document.getElementsByClassName('js-calendar-graph-svg')[0];
    var days = [].slice.call(graph.getElementsByTagName('rect'), 0);

    days.forEach(function(rect) {
        switch (rect.getAttribute('fill').toUpperCase()) {
            case GH[0]:
                rect.setAttribute('fill', CO[3]);
                break; // yellow
            case GH[1]:
                rect.setAttribute('fill', CO[Math.floor(Math.random() * 3)]);
                break; // purple || pink
            case GH[2]:
                rect.setAttribute('fill', CO[4]);
                break; // green
            case GH[3]:
                rect.setAttribute('fill', CO[5]);
                break; // blue
            case GH[4]:
                rect.setAttribute('fill', CO[6]);
                break; // purple
        }
    });
}
