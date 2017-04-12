function defer(method) {
    if (window.jQuery)
        method();
    else
        setTimeout(function() {
            defer(method)
        }, 50);
}

defer(function() {
    // var cors_api_url = 'https://kevins-cors-anywhere.herokuapp.com/';
    var cors_api_url = 'https://cors-anywhere.herokuapp.com/';

    function doCORSRequest(options, printResult) {
        var x = new XMLHttpRequest();
        x.open('GET', cors_api_url + 'github.com/kevinchau321');
        x.onload = x.onerror = function() {
            var content = $(x.responseText).find('.js-contribution-graph');
            $(content).find('.contributions-setting').remove();
            $(content).find('.float-left.text-gray').remove();
            $('.col-9').append(content);
            var content = $(x.responseText).find('.js-pinned-repos-reorder-container');
            $(content).html(function () { return $(this).html().replace(/href=\"\//gi, "/href=\"https:\/\/www.github.com\/"); });
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
        $('.legend').html('<ul class="legend"><li style="background-color: #eee"></li> <li style="background-color: #E6DB74"></li> <li style="background-color: #66D9EF"></li> <li style="background-color: #AE81FF"></li> <li style="background-color: #F92672"></li> <li style="background-color: #A6E22E"></li> <li style="background-color: #FD971F"></li> </ul>');
    }
}
checkFlag();

function pridifyRectangles() {
    var GH = ['#EBEDF0', '#C6E48B', '#7BC96F', '#239A3B', '#196127'];
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

window.mobilecheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

if(window.mobilecheck()) {
  console.log("mobile user detected");
  $('.col-9.float-left.pl-2').append('<img src="iso/screenshot.png" style="width: 100%;"></img>');
}

// if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
//   console.log("mobile user detected");
//   $('.col-9.float-left.pl-2').append('<img src="iso/screenshot.png"></img>');
// }
