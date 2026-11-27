type PrettifyT<T> = {
  [K in keyof T]: T[K]
} & {};

declare global {
  type Prettify<T> = PrettifyT<T>;
}

export { };
