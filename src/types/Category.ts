interface ICategoryBasic {
  _id: string
  title: string
}

interface ICategoryMedium extends ICategoryBasic {
  albums: number
  avatar: string | undefined
}

export {
  ICategoryBasic,
  ICategoryMedium
}
