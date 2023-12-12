import { ref } from 'vue'
import { Compilation, CompilationCreating, CompilationPayloadCreate, CompilationPayloadUpdate, CompilationUpdating } from '~/types/Compilation'
import { useStore } from 'vuex'
import { key } from '~/store'
import { useLocales } from './useLocales'
import dbServices from '~/services/database.services'
import { ResponseMessage } from '~/types/Common'

export const useCompilation = () => {
  const store = useStore(key)
  const compilationName = ref('')
  const { lang } = useLocales()
  const createNewCompilation = async ({ entityType, entityID, results }: CompilationCreating) => {
    const payload = {
      entityID,
      title: compilationName.value
    }
    try {
      const response = await dbServices.createEntity<Compilation, CompilationPayloadCreate>(entityType, payload)
      results.push(response)
      compilationName.value = ''
    } catch (error) {
      store.commit('setSnackbarMessage', {
        message: lang((error as Error).message),
        type: 'error'
      })
    }
  }

  const addToCompilation = async ({ entityType, compilationID, entityID, results }: CompilationUpdating) => {
    const targetCompilation = results.find(({ _id }) => compilationID === _id)
    if (!targetCompilation) {
      throw new Error('Compilation not found')
    }
    const payload = {
      entityID,
      compilationID,
      isInList: false,
      order: targetCompilation.albums.length + 1
    }
    try {
      const response = await dbServices.updateEntity<ResponseMessage, CompilationPayloadUpdate>(entityType, payload)
      targetCompilation.albums.push(entityID)
      store.commit('setSnackbarMessage', {
        message: lang(response.message),
        type: 'success'
      })
    } catch (error) {
      console.error(error)
    }
  }

  const setCompilationName = (name: string) => {
    compilationName.value = name
  }

  return {
    createNewCompilation,
    setCompilationName,
    compilationName,
    addToCompilation
  }
}