import { computed, ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { useSnackbar } from '~shared/model'
import { useTranslate } from '~features/localization'
import type { BackupAction, BackupActionConfig } from '../lib/types'
import type BackupService from '../api/BackupService'

const useBackup = (action: BackupAction, backupService: BackupService, payload?: string) => {
  const isEnabled = ref(false)
  const { setSnackbarMessage } = useSnackbar()
  const { localize } = useTranslate()

  const createBackupHandler = async () => {
    try {
      await backupService.createBackup()
      setSnackbarMessage({
        message: localize('settings.snackbar.createBackupSuccess'),
        type: 'success'
      })
      return await backupService.fetchBackups()
    } catch (error) {
      setSnackbarMessage({
        message: localize('settings.snackbar.createBackupError'),
        type: 'error'
      })
    }
  }

  const restoreBackupHandler = async () => {
    try {
      await backupService.restoreBackup(payload)
      setSnackbarMessage({
        message: localize('settings.snackbar.restoreBackupSuccess'),
        type: 'success'
      })
    } catch (error) {
      setSnackbarMessage({
        message: localize('settings.snackbar.restoreBackupError'),
        type: 'error'
      })
    }
  }

  const deleteBackupHandler = async () => {
    try {
      await backupService.deleteBackup(payload)
      setSnackbarMessage({
        message: localize('settings.snackbar.deleteBackupSuccess'),
        type: 'success'
      })
      return await backupService.fetchBackups()
    } catch (error) {
      setSnackbarMessage({
        message: localize('settings.snackbar.deleteBackupError'),
        type: 'error'
      })
    }
  }

  const actionsMap = new Map<BackupAction, BackupActionConfig>([
    ['get', {
      label: 'settings.getBackups',
      handler: backupService.fetchBackups
    }],
    ['create', {
      label: 'settings.createBackup',
      handler: createBackupHandler
    }],
    ['restore', {
      label: 'settings.restoreBackup',
      handler: restoreBackupHandler
    }],
    ['delete', {
      label: 'settings.deleteBackup',
      handler: deleteBackupHandler
    }]
  ])

  const targetAction = computed(() => {
    return actionsMap.get(action)
  })

  const { data } = useQuery<any>({
    queryKey: [action, payload],
    retry: 3,
    enabled: isEnabled,
    refetchOnWindowFocus: false,
    queryFn: targetAction.value?.handler
  })

  return {
    data,
    isEnabled,
    targetAction
  }
}

export default useBackup
