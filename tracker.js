var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-64308622-1']);
_gaq.push(['_trackPageview']);

(function () {
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
})();

document.addEventListener("track", function (event) {
    //console.log("EVENT IN THE MAIN WINDOW!", event);
    var category = event.detail.type.split(".")[0];
    var action = event.detail.type.split(".")[1];
    var type = event.detail.type;
    var labels = event.detail.email + ',' + event.timeStamp;
    if (typeof event.detail.to != 'undefined')
    {
        var to = "";
        var i;
        for (i = 0; i < event.detail.to.to.length; i++)
        {
            to += event.detail.to.to[i] + ',';
        }
    }
    if (type === "send.mail") {
        labels = labels + ',' + to;
        _gaq.push(['_trackEvent', category, action, labels]);
    } else if (type === "revoke.mail") {
         //console.log('revoke');
        _gaq.push(['_trackEvent', category, action, labels]);
    } else if (type === "message.view") {

        _gaq.push(['_trackEvent', category, action, labels]);
    }
})
