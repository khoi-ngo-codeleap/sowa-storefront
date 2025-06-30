import { useRef } from "react";

const useCount = () => {
  const countRef = useRef(0);
  countRef.current += 1;
  return countRef.current;
};

export default useCount;
