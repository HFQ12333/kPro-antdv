import type { AnyFn } from '@vueuse/core'
import { message } from 'ant-design-vue'
import type { Ref } from 'vue'
import { isBoolean, isFunction, isString, isUndefined } from 'lodash-es'
import { useRequestTipMessage } from '../config-provider'
import type { KProRequestProps } from './props'

interface UseRequestReturn {
  reload: AnyFn
  loading: Ref<boolean>
  data: Ref<any>
  error: Ref<unknown>
}

type MaybeStringOrFunc = string | AnyFn

export function getDynamicImmediate(immediate?: boolean | ((...args: any[]) => boolean), params?: any): boolean {
  if (isBoolean(immediate) && immediate === true)
    return true

  if (isFunction(immediate)) {
    const shouldFetch = immediate(params)
    if (isBoolean(shouldFetch) && shouldFetch === true)
      return true
  }
  return false
}

export function useRequest<T extends KProRequestProps>(options: T): UseRequestReturn {
  const {
    requestErrorTipMessage: globalRequestErrorTipMessage,
    requestSuccessTipMessage: globalRequestSuccessTipMessage,
  } = useRequestTipMessage()

  const {
    request,
    onRequestError,
    onRequestSuccess,
    convertRequestValue,
    requestInitialValue,
    requestErrorTipMessage,
    requestSuccessTipMessage,
  } = options

  const immediate = toRef(options, 'immediate')

  const fetchError = ref()
  const fetchResult = ref(requestInitialValue)
  const [loading, toggleLoading] = useToggle()

  function getMessage(message?: MaybeStringOrFunc, ...args: any[]): string | undefined {
    if (isString(message))
      return message
    if (isFunction(message))
      return message(...args)
  }

  const computedTipErrorMessage = computed(() => {
    const fetchErrorValue = unref(fetchError)
    const message = getMessage(requestErrorTipMessage, fetchErrorValue)
      ?? getMessage(globalRequestErrorTipMessage.value, fetchErrorValue)
      ?? ''
    return {
      message,
      shouldTipMessage: message.length > 0,
    }
  })

  const computedTipSuccessMessage = computed(() => {
    const fetchResultValue = unref(fetchResult)
    const message = getMessage(requestSuccessTipMessage, fetchResultValue)
      ?? getMessage(globalRequestSuccessTipMessage.value, fetchResultValue)
      ?? ''
    return {
      message,
      shouldTipMessage: message.length > 0,
    }
  })

  async function fetch(...args: any[]) {
    try {
      if (!isFunction(request))
        return
      const { message: content, shouldTipMessage } = unref(computedTipSuccessMessage)
      toggleLoading(true)
      fetchError.value = undefined
      fetchResult.value = requestInitialValue
      const result = await request(...args)
      fetchResult.value = isFunction(convertRequestValue) ? convertRequestValue(result) : result
      if (shouldTipMessage)
        message.success(content)
      onRequestSuccess?.(fetchResult.value, ...args)
    }
    catch (error) {
      const { message: content, shouldTipMessage } = unref(computedTipErrorMessage)
      fetchError.value = error
      if (shouldTipMessage)
        message.error(content)
      onRequestError?.(error)
    }
    finally {
      toggleLoading(false)
    }
    return isUndefined(fetchError.value)
  }

  function reload(...args: any[]) {
    return fetch(...args)
  }

  watch(() => getDynamicImmediate(immediate.value), (value) => {
    const shouldFetch = getDynamicImmediate(value)
    shouldFetch && reload()
  }, { immediate: true })

  return {
    reload,
    loading,
    data: fetchResult,
    error: fetchError,
  }
}
