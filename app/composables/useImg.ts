export function useImg(path: string): string {
  return `${useRuntimeConfig().app.baseURL.replace(/\/+$/, '')}${path}`
}