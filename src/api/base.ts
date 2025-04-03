export const baseUrl = process.env.NEXT_PUBLIC_NEST_URL

export type Res<T> = {
  code: number,
  msg: string,
  data: T
}