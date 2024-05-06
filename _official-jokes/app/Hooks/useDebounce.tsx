import { useEffect, useRef } from "react";
// Wrote custom hook for debounce
export default function useDebounce(fn: Function, delay: number) {
  const timerId: React.MutableRefObject<null | any> = useRef(null);
  useEffect(()=>{
    if (timerId.current) {
        clearTimeout(timerId.current);
        timerId.current = setTimeout(() => fn(), delay);
      } else {
        timerId.current = setTimeout(() => fn(), delay);
      }
  },[fn,delay])
  
}
