import { ref } from 'vue'
import { ResponseMessage } from '~/types/Common'
import { GatheringCreateReq, GatheringCreateRes, GatheringUpdateRes } from '~/types/ReqRes'
import useGlobalStore from '~/store/global'
import useSnackbar from './useSnackbar'
import dbServices from '~/services/database.services'

export const useGathering = <T>() => {
  const {
    globalGetters: { localize }
  } = useGlobalStore()

  const { setSnackbarMessage } = useSnackbar()

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
      setSnackbarMessage({
        message: localize((error as Error).message),
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

    try {
      const response = await dbServices.updateEntity<ResponseMessage, GatheringUpdateRes>(payload.entityType, reqPayload)
      setSnackbarMessage({
        message: localize(String(response.message)),
        type: 'success'
      })
    } catch (error) {
      console.error(error)
    }
  }

  const removeFromGathering = async (payload: GatheringUpdateReq) => {
    try {
      const response = await dbServices.updateEntity<ResponseMessage, GatheringUpdateRes>(payload.entityType, payload)
      setSnackbarMessage({
        message: localize(String(response.message)),
        type: 'success'
      })
    } catch (error) {
      console.error(error)
    }
  }

  const reorder = async (entityType: string, payload: ReorderPayload) => {
    try {
      const response = await dbServices.reorderEntities<ResponseMessage, ReorderPayload>(entityType, payload.entityID, payload)
      setSnackbarMessage({
        message: localize(String(response.message)),
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
    addToGathering,
    removeFromGathering,
    reorder
  }
}
