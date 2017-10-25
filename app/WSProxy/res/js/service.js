/**
 * Created by B_Raeisifard on 2016/07/11.
 */
function isServiceInstalled(){
	try{
		var res = execSync(nssmPath, ['get', serviceName, 'name']);
		var data = res.toString("ucs2").trim();
		if (data == serviceName)
			return true;
	}catch(err){
		//console.dir(err);
	}
	return false;
}

function installService(){
	try{
		execSync(nssmPath, ['install', serviceName, global.__dirname+'/nw.exe']);
		execSync(nssmPath, ['set', serviceName, 'AppDirectory', global.__dirname]);
		return true;
	}catch(err){
		console.dir(err);
		return false;
	}
}

function uninstallService(){
	try{
		execSync(nssmPath, ['remove', serviceName, 'confirm']);
		return true;
	}catch (err){
		return false;
	}
}

function getServiceStatus(){
	try{
		var res = execSync(nssmPath, ['status', serviceName]);
		return res.toString("ucs2").trim();
			
	}catch(err){
		return false;
	}
}

function startService(){
	try{
		execSync(nssmPath, ['start', serviceName]);
		return true;
	}catch (err){
		return false;
	}
}

function stopService(){
	try{
		execSync(nssmPath, ['stop', serviceName]);
		return true;
	}catch (err){
		return false;
	}
}

function isServiceStarted(){
	var stat = getServiceStatus();
	if (stat == 'SERVICE_RUNNING')
		return true;
		return false;
}

function restartService(){
	try{
		execSync(nssmPath, ['restart', serviceName]);
		return true;
	}catch (err){
		return false;
	}
}

function setServiceParams(srvUrl, srvPort){
	try{
		execSync(nssmPath, ['set', serviceName, 'AppParameters', "service " + srvUrl + " " + srvPort]);
		execSync(nssmPath, ['start', 'wsproxy']);
		return true;
	}catch (err){
		return false
	}
}
