'use strict';

const electron = require('electron');
const app = electron.app;  
const BrowserWindow = electron.BrowserWindow;  

var mainWindow = null;

var shouldQuit = app.makeSingleInstance(function(commandLine, workingDirectory){});

if (shouldQuit){
  app.quit();
  return;
}

app.on('ready', function() {

  const Menu = electron.Menu;
  const Tray = electron.Tray;
  const path = require('path');

  var wp = require(path.join(__dirname, 'wallpaper'))(app);
  wp.init();

  var appIcon = new Tray(path.join(__dirname, 'assets', 'ui', 'img', 'icon_small.png'));
  var contextMenu = Menu.buildFromTemplate([
    {label: 'Refresh', click:function(){
      wp.refreshWallpaper(true);
    }},
    { label: 'Quit',  click:function(){
      process.exit(0);
    }},

    ]);

appIcon.on('click', function(){
  return false;
});

appIcon.setToolTip('Earth real-time bg');
appIcon.setContextMenu(contextMenu);
if (process.platform == 'darwin'){
  app.dock.hide();
}

});