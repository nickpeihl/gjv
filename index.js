'use strict'
const electron = require('electron')
const getStdin = require('./get-stdin')
const argv = require('./argv')
const app = electron.app
// prevent window being garbage collected
let mainWindow

// report crashes to the Electron project
require('crash-reporter').start({
  productName: 'vgj',
  companyName: 'none',
  submitURL: 'https://github.com/anandthakker/vgj/issues'
})

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')()

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (!mainWindow) {
    mainWindow = createMainWindow()
  }
})

app.on('ready', () => {
  mainWindow = createMainWindow()
  const protocol = electron.protocol
  protocol.registerStringProtocol('stdin', function (req, callback) {
    getStdin(callback)
  })
})

function onClosed () {
  // dereference the window
  // for multiple windows store them in an array
  mainWindow = null
}

function createMainWindow () {
  const win = new electron.BrowserWindow({
    width: 900,
    height: 600
  })

  win.loadURL(`file://${__dirname}/index.html`)
  win.on('closed', onClosed)
  if (argv.showJson) { win.webContents.openDevTools() }

  return win
}

