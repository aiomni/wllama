import { useState, useEffect, useCallback, useRef } from "react";

interface RequestState<T> {
  loading: boolean;
  data: T | null;
  error: any;
}

export const useRequest = <T = any>(requestFn: () => Promise<T>) => {
  const [state, setState] = useState<RequestState<T>>({
    loading: true,
    data: null,
    error: null,
  });

  const requestFnRef = useRef(requestFn);
  requestFnRef.current = requestFn;


  const fetchData = useCallback(() => {
    setState({ loading: true, data: null, error: null });

    requestFnRef.current()
      .then(data => {
        setState({ loading: false, data, error: null })
      })
      .catch(err => {
        setState({ loading: false, data: null, error: err })
      })

  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refresh: fetchData };
}
