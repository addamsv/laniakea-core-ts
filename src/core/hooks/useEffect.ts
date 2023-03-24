export const useEffectFnArr: any[] = [];

export const useEffect = (fn: (args?: any) => any, varsArr: any[]) => {
  useEffectFnArr.push(fn);
  useEffect.callsCounter++;
};

useEffect.callsCounter = 0;
