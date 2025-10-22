import { api } from '~shared/api'

export default class BackupService {
  fetchBackups = async () => {
    const response = await api.get('/api/backup')
    return response.data
  }

  createBackup = async () => {
    await api.post('/api/backup/save')
  }

  restoreBackup = async (timestamp?: string) => {
    if (!timestamp) {
      throw new Error('Backup timestamp is not defined')
    }

    await api.post(`/api/backup/restore/${timestamp}`)
  }

  deleteBackup = async (timestamp?: string) => {
    if (!timestamp) {
      throw new Error('Backup timestamp is not defined')
    }

    await api.delete(`/api/backup/${timestamp}`)
  }
}
