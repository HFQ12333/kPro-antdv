import { isOutsideUrl } from "../../../../utils/index";
import { useRouter } from 'vue-router'
import type { Router } from 'vue-router';

function handleError(e: Error) {
  console.error(e);
}

export const useGo = (_router?: Router) => {

  const { push, replace } = _router || useRouter();

  function go(opt: string, isReplace = false) {
    if (!opt) return
    if (isOutsideUrl(opt)) {
      window.open(opt);
    }
    isReplace ? replace(opt).catch(handleError) : push(opt).catch(handleError);
  }

  return go
}
