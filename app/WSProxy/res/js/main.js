/**
 * Created by B_Raeisifard on 2016/07/11.
 */

$(function () {
    httpswsdlurl = localStorage.getItem('httpswsdlurl');
    if (httpswsdlurl != null) {
        $('#wsdlurl').val(httpswsdlurl.trim());
    }
	var status = localStorage.getItem('status');
	if ( status == null)
		localStorage.setItem('status', 'stopped');
	/*else
		if (status == 'started')
			$('#startimg').attr('src', '.\\res\\img\\stop.png');*/
});
	
if (nw.App.argv.length > 0){
	var args = nw.App.argv;
	if (args[0] == "service"){
		var wurl = args[1] || "";
		var port = args[2] || "";
		createProxyServer(wurl, port);
	}
}else{
systemTry();
}

win.on('close', function() {
  this.hide(); // Pretend to be closed already
  //log.info("Main window has been closed...");
  //this.close(true);
});

/*fs.appendFile('c://1/log.txt', nw.App.argv.toString() + 'No arguments'+ "\r\n", function (err) {
		if (err) throw err;
		console.log(nw.App.argv.toString());
	});
//win.close();
*/