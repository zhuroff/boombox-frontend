import { useActionsPlayer } from './actions.player'
import { useActionsCommon } from './actions.common'
import { AppStateInterface } from '~/types/Common'

export const useActions = (state: AppStateInterface) => {
  const { ...commonActions } = useActionsCommon(state)
  const { ...playerActions } = useActionsPlayer(state)

  return {
    ...commonActions,
    ...playerActions
  }
}
