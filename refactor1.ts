


const deepMap = <T>(arr: T[][], fn: (el:T)=> T ) => arr.map((_arr)=> _arr.map(fn)); 

export const joinDeep =
  <T>(separator: { shallow: string, deep: string } = { shallow: '', deep: '' }, table: T[][]): string => {
    const  { shallow, deep } = separator
    return table.map((row)=> row.join(shallow)).join(deep)
  }

type UNZIP<T extends { [key in string]: unknown }> = (arr: T[]) => unknown[][]
/**
 * Object[] => string[][]
 */

/**
 * 
 */

type KeyOrValue<T> = keyof T | T[keyof T];


const unzip2 = <T extends { [key in string]: unknown }>(arr: T[]): unknown[][] => {
  
    const first = arr[0]
    const head = first ? first : {}
    const keys =[Object.keys(head)]; 
    const values = arr.map((obj)=> Object.values(obj))
    return values.concat(keys)
}

const formatDeepWithMaxLength = (align: (maxLengths: number[], row: unknown[], i: number) => string, tables: unknown[][]): string[][]=> {
  const first = tables[0]
  const head = first ? first : []
  const zeroArr = head.map((_)=> 0)

  const maxLengths = tables.map((row)=> row.map(String).map((el)=>el.length)).reduce((maxArr, rowLength)=> {
    for(let i =0; i<rowLength.length; i++) {
      maxArr[i] = Math.max(rowLength[i], zeroArr[i])
    }
    return maxArr;
  }, zeroArr)

  return tables.map((row)=> {
    for(let i =0; i<row.length; i++) {
      row[i] = align(maxLengths, row, i);    
    }
    return row as string[];
  })
}


const center = (maxLengths: number[], row: unknown[], i: number): string => {
  const cell = String(row[i]);
  const diff = (maxLengths[i] - cell.length) / 2;
  const leftPadding = ' '.repeat(Math.ceil(diff));
  const rightPadding = ' '.repeat(Math.floor(diff));
  return `${leftPadding}${cell}${rightPadding}`;
}





const objs = [
  {abc: 'long1', bef: 'long1', ghi: 'long1', jkl: 'long1'},
  {abc: 'ㄹ', bef: 'ㄷ', ghi: 'ㄴ', jkl: 'ㄱ'},
  {abc: 1, bef: 2, ghi: 3, jkl: 4},
]


console.log(
  // joinDeep(
  //   { shallow: '|', deep: '\n' }, 
  formatDeepWithMaxLength(
      center,
      deepMap(
        unzip2(objs), String
      )
    )
  )
// )


