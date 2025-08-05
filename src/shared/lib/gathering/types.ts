export type NewGatheringPayload = {
  title: string
  entityID: string
}

export type UpdateGatheringPayload = {
  isInList: boolean
  gatheringID: string
  entityType: string
  entityID: string
  order: number
}
