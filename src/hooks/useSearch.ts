export const useSearch = () => {
  const searchSubmit = (query: string, categories?: string[]) => {
    console.log(query)
  }

  return {
    searchSubmit
  }
}
