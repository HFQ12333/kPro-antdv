---
category: Components
type: 其他
title: useRequest
subtitle: 请求
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*BrFMQ5s7AAQAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*Lp1kTYmSsgoAAAAAAAAAAAAADrJ8AQ/original
---
1. 统一中后台请求消息提示
2. 统一中后台开发规范
3. 为后续统一埋点服务


## API

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| request | 用于请求数据的函数 | AnyFn | - | - |
| immediate | 是否立即调用一次 `request` | boolean \| (() => boolean) | true | - |
| convertRequestValue | `request` 函数调用结束后触发的回调函数,可以再此函数中处理最终要返回的值 | AnyFn | - | - |
| onRequestError | 请求失败触发的回调函数 | (error: unknown) => void | - | - |
| onRequestSuccess | 请求成功触发的回调函数 | (value: any) => void | - | - |
| requestErrorTipMessage | 请求失败后提示的错误消息,默认值可以在 KProConfigProvider 中统一注入错误消息格式 | string \| ((error: unknown) => string) | '数据请求失败,请稍后重试' | - | 
| requestSuccessTipMessage | 请求成功后提示的消息,默认值可以在 KProConfigProvider 中统一注入消息格式 | string \| ((data: any) => string) | - | - |
| requestInitialValue | 初始值,如果请求失败也会将数据置为初始值 | any | - | - |

## 返回值
| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| reload | 重新调用 `request` 方法 | AnyFn | - | - |
| loading | 是否在请求中 | Ref\<boolean\> | false | - | 
| data | 返回的数据 | Ref\<T\> | - | - | 
| error | 错误内容 | Ref\<unknown\> | - | - |
