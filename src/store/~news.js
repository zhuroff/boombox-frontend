import axios from 'axios'

const actualDatesEvents = (events) => {
  const result = events.map((el) => {
    const dates = el.dates.filter((date) => {
      if ((date.end * 1000) > new Date().getTime()) {
        return el
      }

      return false
    })
    
    /* eslint no-param-reassign: 0 */
    el.dates = dates
    return el
  })

  return result
}

const News = {
  state: () => ({
    allNews: [],
    topNews: {},
    errorMessage: null
  }),

  mutations: {
    setNews: (state, data) => {
      state.errorMessage = null
      state.topNews = data.shift()
      state.allNews = data
    },

    lastPageError: (state, value) => {
      state.errorMessage = value
    }
  },

  actions: {
    fetchNews: async ({ commit }, page) => {
      try {
        const response = await axios.post('/api/search/news', { page: Number(page) })
        commit('setNews', actualDatesEvents(response.data.results))
      } catch (error) {
        console.error(error.response.data)
        commit('setNews', [{}])
        commit('lastPageError', error.response.data.detail)
      }
    }
  },

  getters: {
    allNews: (state) => state.allNews,
    topNews: (state) => state.topNews,
    errorMessage: (state) => state.errorMessage
  }
}

export default News
