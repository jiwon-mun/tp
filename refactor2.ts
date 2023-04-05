import { A, O, pipe, S, D } from '@mobily/ts-belt';


const unzip = <T extends { [key in string]: unknown }>(
  arr: ReadonlyArray<T>,
): ReadonlyArray<ReadonlyArray<unknown>> =>
  pipe(
    arr,
    A.head,
    O.getWithDefault({} as { [key: string]: unknown }),
    D.keys,
    (keys) =>
      A.concat(
        [keys],
        A.map(arr, (obj) => pipe(obj, Object.values)),
      ),
  );


export const joinDeep =
  <T>(separator: JoinDeepSeparatorOption = { shallow: '', deep: '' }) =>
  (table: ReadonlyArray<ReadonlyArray<T>>): string =>
    pipe(
      table,
      A.map((x) => A.join(x, separator.shallow)),
      A.join(separator.deep),
    );

type FormatDeepWithMaxLengthCallback<T> = (
  cell: T,
  maxLength: number,
) => string;

export const formatDeepWithMaxLength =
  <T>(callback: FormatDeepWithMaxLengthCallback<T>) =>
  (
    tables: ReadonlyArray<ReadonlyArray<T>>,
  ): ReadonlyArray<ReadonlyArray<string>> => {
    const zeroArr = pipe(
      tables,
      A.head,
      O.mapWithDefault([], (shallow) => A.map(shallow, (_) => 0)),
    );

    const maxLengths = pipe(
      tables,
      toStringLength,
      A.reduce(zeroArr, deepMaxLength),
    );

    return pipe(tables, A.map(A.zipWith(maxLengths, callback)));
  };

export const toStringLength = <T>(
  deep: ReadonlyArray<ReadonlyArray<T>>,
): ReadonlyArray<ReadonlyArray<number>> =>
  pipe(
    deep,
    A.map((shallow) => pipe(shallow, A.map(String), A.map(S.length))),
  );

const deepMaxLength = (
  _1: ReadonlyArray<number>,
  _2: ReadonlyArray<number>,
): ReadonlyArray<number> => A.zipWith(_1, _2, Math.max);

export const center: FormatDeepWithMaxLengthCallback<string> = (
  cell,
  maxLength,
) => {
  const diff = (maxLength - cell.length) / 2;
  const leftPadding = ' '.repeat(Math.ceil(diff));
  const rightPadding = ' '.repeat(Math.floor(diff));
  return `${leftPadding}${cell}${rightPadding}`;
};

export const buildTable = (objects: readonly { [k in string]: unknown }[]) =>
  pipe(
    objects,
    unzip,
    A.map(A.map(String)),
    formatDeepWithMaxLength(center),
    joinDeep({
      shallow: '|',
      deep: '\n',
    }),
  );

  const objs = [
    {abc: 'long1', bef: 'long1', ghi: 'long1', jkl: 'long1'},
    {abc: 'ㄹ', bef: 'ㄷ', ghi: 'ㄴ', jkl: 'ㄱ'},
    {abc: 1, bef: 2, ghi: 3, jkl: 4},
  ]
  

  console.log(buildTable(objs))

interface JoinDeepSeparatorOption {
  shallow: string;
  deep: string;
}
