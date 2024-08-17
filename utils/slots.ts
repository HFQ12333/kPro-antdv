import type { AnyFn } from '@vueuse/core'
import { get, isFunction } from 'lodash-es'
import type { Slots } from 'vue'

interface GetSlotOptions {
  /**
   * @description 没有获取到插槽函数时给的默认值
   * @default undefined
   */
  defaultValue?: AnyFn
}
export function getSlot(slots: Slots, name = 'default', options: GetSlotOptions = {}) {
  const { defaultValue } = options
  const slotRender = get(slots, name)
  if (!isFunction(slotRender))
    return defaultValue
  return slotRender
}

export function wrapSlots<T = any>(slots: Record<string, any>, params: T) {
  return Object.keys(slots)
    .reduce<Record<string, AnyFn>>((p, slotName) => {
      const fn = slots[slotName] as any
      if (!isFunction(fn)) {
        p[slotName] = fn
        return p
      }

      const wrapFn = (...args: any[]) => fn(params, ...args)
      p[slotName] = wrapFn
      return p
    }, {})
}
