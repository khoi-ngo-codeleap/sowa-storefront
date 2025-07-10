import { useEffect, useRef, useState } from "react";

export default function useRenderCount() {
  const countRef = useRef(0);
  const [mount, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
  }, []);
  countRef.current = mount ? countRef.current + 1 : 0;
  return countRef.current;
}
