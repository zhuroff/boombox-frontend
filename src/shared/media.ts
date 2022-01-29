const hostString = (pathname: string) => {
  const host = process.env.NODE_ENV === 'development'
    ? process.env.VUE_APP_DEV_HOST
    : process.env.VUE_APP_LIVE_HOST

  return `${host}${pathname}`
}

export {
  hostString
} 
