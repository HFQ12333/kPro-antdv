import type { KProButtonProps } from '..'

export function useLoading(props: KProButtonProps) {
  const loading = useVModel(props, 'loading', undefined, { passive: true })

  function setLoading(status: boolean) {
    loading.value = status
  }

  return {
    loading,
    setLoading,
  }
}
