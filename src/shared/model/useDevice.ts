import { ref, onMounted, onUnmounted } from 'vue'

const mediaQuery = '(width < 1280px)'
const isMobile = ref<boolean>((() => {
  if (typeof window !== 'undefined') {
    return window.matchMedia(mediaQuery).matches
  }
  return false
})())

const useDevice = () => {
  const deviceSetter = (e: MediaQueryListEvent) => {
    isMobile.value = e.matches
  }

  onMounted(() => {
    isMobile.value = window.matchMedia(mediaQuery).matches
    window.matchMedia(mediaQuery).addEventListener('change', deviceSetter)
  })

  onUnmounted(() => {
    window.matchMedia(mediaQuery).removeEventListener('change', deviceSetter)
  })

  return {
    isMobile
  }
}

export default useDevice