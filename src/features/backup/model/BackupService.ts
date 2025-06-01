import api from '~/app/api'

export default class BackupService {
  fetchBackups = async () => {
    try {
      const response = await api.get('/api/backup')
      return response.data
    } catch (error) {
      throw error
    }
  }

  createBackup = async () => {
    try {
      await api.post('/api/backup/save')
    } catch (error) {
      throw error
    }
  }

  restoreBackup = async (timestamp?: string) => {
    if (!timestamp) {
      throw new Error('Backup timestamp is not defined')
    }

    try {
      await api.post(`/api/backup/restore/${timestamp}`)
    } catch (error) {
      throw error
    }
  }

  deleteBackup = async (timestamp?: string) => {
    if (!timestamp) {
      throw new Error('Backup timestamp is not defined')
    }

    try {
      await api.delete(`/api/backup/${timestamp}`)
    } catch (error) {
      throw error
    }
  }
}
