import { ICategoryBasic } from '~/types/Category'
import api from '~/api'

export default class CategoryService {
  static async create(category: string, value: string) {
    const response = await api.post<ICategoryBasic>(`/api/${category}/create`, { value })
    
    if (response?.status === 200) {
      return response.data
    }
    
    throw new Error()
  }
}
