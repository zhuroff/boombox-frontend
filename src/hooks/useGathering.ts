import { ref } from 'vue'
import { ResponseMessage } from '~/types/Common'
import { GatheringCreateReq, GatheringCreateRes, GatheringEntityRes, GatheringUpdateReq, GatheringUpdateRes } from '~/types/ReqRes'
import { useLocales } from './useLocales'
import dbServices from '~/services/database.services'
import store from '~/store'

export const useGathering = <T>() => {
  const { actions } = store
  const { lang } = useLocales()
  const gatheringName = ref('')

  const createNewGathering = async (payload: GatheringCreateReq<T>) => {
    const reqPayload = {
      entityID: payload.entityID,
      title: gatheringName.value
    }

    try {
      const response = await dbServices.createEntity<T, GatheringCreateRes>(payload.entityType, reqPayload)
      payload.results.push(response)
      gatheringName.value = ''
    } catch (error) {
      actions.setSnackbarMessage({
        message: lang((error as Error).message),
        type: 'error'
      })
    }
  }

  const setGatheringName = (name: string) => {
    gatheringName.value = name
  }
  
  const addToGathering = async (payload: GatheringUpdateReq) => {
    if (!payload.order) {
      throw new Error('Compilation not found')
    }

    const reqPayload = {
      entityID: payload.entityID,
      gatheringID: payload.gatheringID,
      order: payload.order,
      isInList: false
    }
    console.log(reqPayload)

    try {
      const response = await dbServices.updateEntity<ResponseMessage, GatheringUpdateRes>(payload.entityType, reqPayload)
      actions.setSnackbarMessage({
        message: String(response.message),
        type: 'success'
      })
    } catch (error) {
      console.error(error)
    }
  }

  return {
    createNewGathering,
    setGatheringName,
    gatheringName,
    addToGathering
  }
}
