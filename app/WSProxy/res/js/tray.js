/**
 * Created by B_Raeisifard on 2016/07/11.
 */
function systemTry(){
		try{
		// Create a tray icon
		var tray = new nw.Tray({ title: 'Tray', icon: './app/WSProxy/res/img/smallicon.png' });
		tray.tooltip = 'WSProxy System';
		// Give it a menu
		var menu = new nw.Menu();
		/*menu.append(new nw.MenuItem({ type: 'checkbox', label: 'box1' ,click: function(event){
			console.log('someone clicked me!!');
		}}));*/
		var item;
		item = new nw.MenuItem({  icon: './app/WSProxy/res/img/miniwindow.png', label: '     WS Studio' ,click: function(event){
			//console.log('someone clicked me!!');
			//win.enterKioskMode();
			//log.info('Kiosk mode activated.');
			runSoapClient();
		}})
		menu.append(item);

		/*var submenu = new nw.Menu();
		submenu.append(new nw.MenuItem({ label: 'Kiosk', function(){
			
		} }));
		submenu.append(new nw.MenuItem({ label: 'Window', function(){
			console.log('Window hitted!');
		} })); 
		submenu.append(new nw.MenuItem({ label: 'Tray', function(){
			console.log('Tray hitted!');
		} }));
		item.submenu = submenu;*/

		menu.append(new nw.MenuItem({  icon: './app/WSProxy/res/img/miniprocess.png', label: '     Help file' ,click: function(event){
			//console.log('someone clicked me!!');
			/*listWin = nw.Window.open('./help.html', {
				  position: 'center',
				  width: 300,
				  height: 400,
				  min_width: 300,
				  min_height: 400,
				  toolbar: true, 
				  icon: "./main/img/miniicon.png"
				})*/
			//log.info('Process List Window Opened.');
			openHelpWindow();
		}}));

		menu.append(new nw.MenuItem({ type: 'separator' }));

		menu.append(new nw.MenuItem({  icon: './app/WSProxy/res/img/minishutdown.png', label: '     Shutdown' ,click: function(event){
			console.log('Application Shutting down...');
			var confirm = window.confirm("Are you sure to exit WSProxy?\nby exiting WSProxy all process will terminated.");
			if (confirm) {
				// Quit current app	
				 	
				//log.info('Start system shotdown...');
				nw.App.closeAllWindows();
				win.hide();
				nw.App.quit();
			}
		}}));

		tray.menu = menu;
		tray.on('click', function(){
			win.show();
		})
		// Remove the tray
		//tray.remove();
		//tray = null;
		//log.trace('System tray hes been made.');
	}catch(e){
		//log.fatal('Making system tray got some errors!',e)
	}
}