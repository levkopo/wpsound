import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import fs from 'fs'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  let promise: Promise<any>
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    promise = mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    promise = mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  promise.finally(() => {
    const filePath = process.argv.at(-1);
    if(filePath && fs.lstatSync(filePath).isFile() && filePath.endsWith('.wps')) {
      mainWindow.webContents.send('file-input', {
        project: fs.readFileSync(filePath)
      })
    }
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('ru.levkopo.wpsound')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('open-file', (e) => {
    dialog
      .showOpenDialog({
        title: 'Открытие файла',
        filters: [{ name: 'WPSound File', extensions: ['wps'] }]
      })
      .then((it) => {
        if (it.filePaths.length != 0) {
          const filePath = it.filePaths[0]
          e.sender.send('file-input', {
            project: fs.readFileSync(filePath)
          })
        }
      })
  })

  ipcMain.on('save-file', (e, args) => {
    const project = args.project

    dialog
      .showSaveDialog({
        title: 'Сохранение файла',
        filters: [{ name: 'WPSound File', extensions: ['wps'] }]
      })
      .then((it) => {
        if (it.filePath) {
          fs.writeFileSync(it.filePath, project)
          e.sender.send('saved')
        }
      })
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
