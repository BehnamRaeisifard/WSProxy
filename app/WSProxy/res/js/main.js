/**
 * Created by B_Raeisifard on 2016/07/11.
 */
$ = jQuery = require('..\\WSProxy\\res\\js\\jquery-3.0.0.min.js');
var http = require('http');
const url = require('url');
// Load native UI library
var gui = require('nw.gui');
var httpswsdlurl, httpshost, httpsport, httpspath;
var started = false;
var server;
var logs = [], logCount = 0;
function createProxyServer() {
    try {
        server = http.createServer(function (request, response) {
            log("Request from: \""+request.connection.remoteAddress+"\"");
            var headers = request.headers;
            var method = request.method;
            var url = request.url;
            var body = [];
            if (url.toLowerCase() == '/favicon.ico') {
                response.end();
                return;
            }
            request.on('error', function (err) {
                log(err.toString());
                console.error(err);
            }).on('data', function (chunk) {
                body.push(chunk);
            }).on('end', function () {
                body = Buffer.concat(body).toString();
                ajax(headers, method, url, body, response);
                // At this point, we have the headers, method, url and body, and can now
                // do whatever we need to in order to respond to this request.
            });
        }).listen(httpsport); // Activates this server, listening on port 8080.
    } catch (e) {
        return false;
    }
    return true;
    function ajax(headers, method, url, body, response) {
        //var data = body;//'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:obrs="http://obrs/"><soapenv:Header/><soapenv:Body><obrs:getBankStatements><arg0>test</arg0><arg1>test123</arg1><arg2>920101</arg2><arg3>010101</arg3><arg4>941201</arg4><arg5>010101</arg5></obrs:getBankStatements></soapenv:Body></soapenv:Envelope>';
        var request = $.ajax({
            url: "https://" + httpshost + ":" + httpsport + url,//headers.host+url,//"https://192.168.160.62:8890/bmiwsv27/billing?wsdl",
            data: body,
            contentType: headers['content-type'],
            method: method,
            dataType: "xml",
            processData: false
        });

        request.done(function (msg) {
            var xmlText = new XMLSerializer().serializeToString(msg);
            response.setHeader('Content-Type', 'text/xml');
            if (method.toUpperCase() == 'GET') {
                var strsrc, strrpl;
                strsrc = 'https://'+ httpshost + ":" + httpsport;
                strrpl = 'http://localhost:' + httpsport;
                xmlText = xmlText.replace(new RegExp(strsrc, 'g'), strrpl);
            }
            response.end(xmlText);
            log("Response to: \""+request.connection.remoteAddress+"\"");
        });

        request.fail(function (jqXHR, textStatus) {
            //alert("Request failed: " + textStatus);
        });
    }
}

function runSoapClient() {
    var exec = require('child_process').execFile;
    exec('./app/WSProxy/res/exe/WebServiceStudio.exe', function callback(err, data) {
        console.log(err);
        console.log(data.toString());
    });
}

function validateWSDLUrl(urlstr) {
    urlstr = urlstr.trim();
    if (urlstr.length == 0) {
        //alert("you must enter");
        alertify.error("You must inter a valid WSDL url!");
    }
    if (urlstr.indexOf('https://') == 0 && urlstr.indexOf('?wsdl') == (urlstr.length - 5))
        return true;
    else
        //alert("The WSDL Url is not valid!\n It must be in form of \"https:\\\\\" and ends with \"?wsdl\"");
        alertify.error("The WSDL Url is not valid!\n It must be in form of \"https:\\\\\" and ends with \"?wsdl\"")
    return false;
}

function createUrlParts(httpswsdlurl) {
    var httpswsdlurlobj = url.parse(httpswsdlurl);
    httpshost = httpswsdlurlobj.hostname;
    httpsport = httpswsdlurlobj.port;
    httpspath = httpswsdlurlobj.path;
}

function getWSDLFile(httpswsdlurl) {
    $("#copyClipboard").css('visibility', 'hidden');
    $("#newserlink p").text("Your new Proxy server will be somthing like:");
    $("#newserlink a:last").text("http://localhost:8888/xxxwsv2x/billing?wsdl");
    if (validateWSDLUrl(httpswsdlurl))
        $.get(httpswsdlurl, '', function (data, textStatus, jqXHR) {
            var xmlText = new XMLSerializer().serializeToString(data);
            log("succesfuly got the WSDL file.")
            openNewWindow(xmlText);
            createUrlParts(httpswsdlurl);
            $("#newserlink p").text("Use below address as your new web service: ");
            $("#newserlink a:last").text("http://localhost:"+httpsport+httpspath);
            $("#copyClipboard").css('visibility', 'visible');
            //alert(xmlText);
            //alert( "Data Loaded: " + data );
        }, 'xml');
}

function openNewWindow(data) {
    nw.Window.open('/app/WSProxy/WSDL.html', {position: 'center', width: 800, height: 800},
        function (new_win) {
            new_win.data = data;
        });
}

function openHelpWindow() {
    nw.Window.open('./app/WSProxy/help.html');
}

function startService() {
    if(started){
        log("WS is closing...");
        server.close();
        $('#startimg').attr('src', '.\\res\\img\\start.png');
        started = false;
        log("WS is closed!");
    }else {
        log("WS is starting...");
        httpswsdlurl = $('#wsdlurl').val().trim();
        if (validateWSDLUrl(httpswsdlurl)) {
            createUrlParts(httpswsdlurl);
            if (createProxyServer()) {
                localStorage.setItem('httpswsdlurl', httpswsdlurl);
                $('#startimg').attr('src', '.\\res\\img\\stop.png');
                started = true;
                log("WS is started!");
            }else
                log("WS could not created!");
        }else
            log("WSDL path is not valid!");
    }
}

function log(str){
    var d = new Date();
    var datestring = ("0" + d.getDate()).slice(-2) + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" +
        d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
    logs.push(datestring+" "+str);
    if (logCount > 500){
       logs = logs.slice(50);
    }
    $log.val(logs.join('\n'));
    $log[0].scrollTop = $log[0].scrollHeight;
    logCount=logCount++;
}

$(function () {
    httpswsdlurl = localStorage.getItem('httpswsdlurl');
    if (httpswsdlurl != null) {
        $('#wsdlurl').val(httpswsdlurl.trim());
    }
});

function copy2Clipboard(){
// We can not create a clipboard, we have to receive the system clipboard
    var clipboard = gui.Clipboard.get();
    // Or write something
    clipboard.set("http://localhost:"+httpsport+httpspath);

}