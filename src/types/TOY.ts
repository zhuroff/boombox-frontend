export type TTOYFolder = {
  name: string;
  path: string;
  resource_id: string;
} & { [index: string]: any }

export type TTOYEntity = TTOYFolder & {
  route: string;
}

export type TTOYData = {
  isFetched: boolean;
  data: TTOYEntity[];
}
