const electron = require('electron')
// Module to control application life.
const app = electron.app

const ipcMain = electron.ipcMain;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

var ipc = require('electron').ipcRenderer
function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({height:800, width:1200, fullscreen: false, minimizable:false, frame:false, kiosk:true, closable:false})
  // mainWindow.maximize()
  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`)

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.on('details', (event, data) => {
  var fs = require('fs')
  fs.exists("userdata.json",function(exists){
    if(!exists){
      // fs.writeFile("userdata.json",JSON.stringify(data),function(err){});
      var writeStream = fs.createWriteStream("userdata.json");
      writeStream.write(JSON.stringify(data));
      writeStream.end();
    }
    fs.readFile("userdata.json", function(err, userdetails){
    userdetails = JSON.parse(userdetails);
    var username = userdetails['username']
    var password = userdetails['password']
    if (username == 'vy@fju.us' && password == 'veda1997'){
      mainWindow.loadURL('file://' + __dirname + '/module.html');
    }
    else{
      mainWindow.loadURL('file://' + __dirname + '/index.html');
    }
  });
  });
});

ipcMain.on('keypress', (event, data) => {
  if (data.ctrl==true && (data.key == '118' || data.key == '86')) {
    event.sender.send('reply', true);
  }
});

ipcMain.on('load', (event, data) => {
  var fs = require('fs')
  fs.readFile("quiz.json", function(err, data){
    data = JSON.parse(data);
    event.sender.send('loaded', data);
  });
});

ipcMain.on('requestProgram', (event, params) => {
  var fs = require('fs')
  var filename = (params.option).replace(/ /g, '_')+".py";
  fs.exists('programs/'+filename, function(exists){
    if(exists){
      fs.readFile('programs/'+filename,'utf8',function(err, contents){
        var questionobj = {}
        questionobj.name = params.option;
        questionobj.program = contents;
        event.sender.send('resultProgram', questionobj);
      });
    }
    else{
      fs.readFile("quiz.json", function(err, data){
      data = JSON.parse(data);
      var questionobj = {}
      questionobj.name = params.option;
      questionobj.program = data['programs'][params.id]['program'];
      event.sender.send('resultProgram', questionobj);
    });
    }
  });
});

ipcMain.on('execute', (event,content) => {
  var nodeexec = require('child_process').exec;
  nodeexec('cd programs && git init && git add . && git commit -m "'+(Date.now() / 1000 | 0).toString()+'"', function callback(error, stdout, stderr){
    console.log(stdout);
  });
  var progname = content.replace(/ /g, '_');
  nodeexec('python programs/'+progname+'.py', {timeout: 5000, killSignal: 'SIGKILL'}, function callback(error, stdout, stderr){
    if(error){
      event.sender.send('executed', stderr);
    }else{
      event.sender.send('executed', stdout);
    }
  });
});

ipcMain.on('reset', (event, content) => {
  var fs = require('fs')
  fs.readFile("quiz.json", function(err, data){
    data = JSON.parse(data);
    var questionobj = {}
    questionobj.name = content.option;
    questionobj.program = data['programs'][content.id]['program'];
    event.sender.send('resetres', questionobj);
  });
});

ipcMain.on('save', (event, program) => {
  var fs = require('fs');
  var name = (program.name).replace(/ /g, '_');
  var writeStream = fs.createWriteStream('programs/'+name+".py");
  writeStream.write(program.text);
  writeStream.end();
  // var nodeexec = require('child_process').exec;
  // nodeexec('cd programs && git init && git add . && git commit -m "'+(Date.now() / 1000 | 0).toString()+'"', {timeout: 5000, killSignal: 'SIGKILL'}, function callback(error, stdout, stderr){
  //   console.log(stdout);
  // });
  event.sender.send('saved', true);
});


app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
