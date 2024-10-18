// LinkedKeys: 获取对象深层嵌套的键数组，不定长路径
type LinkedKeys<T> = T extends object 
  ? {
      [K in keyof T]: [K] | [K, ...LinkedKeys<T[K]>];
    }[keyof T]
  : never;

// LinkedValues: 根据路径数组，获取嵌套属性的类型
type LinkedValues<T, P extends any[]> = P extends [infer First, ...infer Rest]
  ? First extends keyof T
    ? Rest extends []
      ? T[First]
      : LinkedValues<T[First], Rest>
    : never
  : T; // 如果P是空数组，则返回整个对象类型

export const assignWith  =<T extends {},K extends LinkedKeys<T>>(obj:T,keys:K,value:LinkedValues<T,K>|undefined)=>{}

// assignWith({"a":{"b":{"c":0},"d":90}},['a','b'],{c:"dsd"})