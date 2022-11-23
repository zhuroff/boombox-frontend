export type TTOYFolder = {
  name: string;
  path: string;
  resource_id: string;
  type?: string;
  file?: string
}

export type TTOYEntity = TTOYFolder & {
  route: string;
}

export type TTOYData = {
  isFetched: boolean;
  data: TTOYEntity[];
}
