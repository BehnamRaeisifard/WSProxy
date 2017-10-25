/**
 * Created by B_Raeisifard on 2016/07/11.
 */
// Load native UI library
var win = nw.Window.get();
var gui = require('nw.gui');
var manifestData = nw.App.manifest;
var fs = require('fs');
var http = require('http');
const url = require('url');
var exec = require('child_process').execFile;
//$ = jQuery = require('..\\WSProxy\\res\\js\\jquery-3.0.0.min.js');
var httpswsdlurl, httpshost, httpsport = '', httpspath = '';
var started = false;
var server;
var logs = [], logCount = 0;
var serviceName = 'WSProxy';
var serviceDesc = 'Web Service Proxy';
var execSync = require('child_process').execFileSync;
const nssmPath = './app/WSProxy/res/exe/nssm.exe';
log = global.log;