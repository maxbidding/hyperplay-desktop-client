import { ipcRenderer } from 'electron'
import {
  Runner,
  InstallParams,
  LaunchParams,
  SideloadGame,
  ImportGameArgs,
  GameStatus,
  HyperPlayGameOS
} from 'common/types'

export const removeFolder = (args: [path: string, folderName: string]) =>
  ipcRenderer.send('removeFolder', args)

export const openDialog = async (args: Electron.OpenDialogOptions) =>
  ipcRenderer.invoke('openDialog', args)

export const uninstall = async (
  appName: string,
  runner: Runner,
  shouldRemovePrefix: boolean,
  shouldRemoveSetting: boolean
) => {
  ipcRenderer.invoke('trackEvent', {
    event: 'Game Uninstall Requested',
    game_name: appName,
    store_name: runner
  })
  if (runner === 'sideload' || runner === 'hyperplay') {
    return ipcRenderer.invoke('removeApp', {
      appName,
      shouldRemovePrefix,
      runner
    })
  } else {
    return ipcRenderer.invoke(
      'uninstall',
      appName,
      runner,
      shouldRemovePrefix,
      shouldRemoveSetting
    )
  }
}

export const repair = async (appName: string, runner: Runner) =>
  ipcRenderer.invoke('repair', appName, runner)

export const launch = async (args: LaunchParams) =>
  ipcRenderer.invoke('launch', args)

export const importGame = async (args: ImportGameArgs) =>
  ipcRenderer.invoke('importGame', args)

export const handleGameStatus = (
  onChange: (e: Electron.IpcRendererEvent, status: GameStatus) => void
) => {
  ipcRenderer.on('gameStatusUpdate', onChange)
  return () => {
    ipcRenderer.removeListener('gameStatusUpdate', onChange)
  }
}

export const onProgressUpdate = (
  appName: string,
  onChange: (e: Electron.IpcRendererEvent, status: GameStatus) => void
) => {
  ipcRenderer.on(`progressUpdate-${appName}`, onChange)
  return () => {
    ipcRenderer.removeListener(`progressUpdate-${appName}`, onChange)
  }
}

export const handleLaunchGame = (
  callback: (
    event: Electron.IpcRendererEvent,
    appName: string,
    runner: Runner
  ) => Promise<{ status: 'done' | 'error' }>
) => ipcRenderer.on('launchGame', callback)

export const handleInstallGame = (
  callback: (event: Electron.IpcRendererEvent, args: InstallParams) => void
) => ipcRenderer.on('installGame', callback)

export const handleRefreshLibrary = (
  callback: (event: Electron.IpcRendererEvent, runner: Runner) => void
) => ipcRenderer.on('refreshLibrary', callback)

export const removeRecentGame = async (appName: string) =>
  ipcRenderer.invoke('removeRecent', appName)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleRecentGamesChanged = (callback: any) => {
  ipcRenderer.on('recentGamesChanged', callback)
  return () => {
    ipcRenderer.removeListener('recentGamesChanged', callback)
  }
}

export const addNewApp = (args: SideloadGame) =>
  ipcRenderer.send('addNewApp', args)

export const launchApp = async (
  appName: string,
  runner: 'hyperplay' | 'sideload'
): Promise<boolean> => ipcRenderer.invoke('launchApp', appName, runner)

export const getHyperPlayInstallInfo = async (
  appName: string,
  platform: HyperPlayGameOS
) => ipcRenderer.invoke('getHyperPlayInstallInfo', appName, platform)
