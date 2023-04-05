
export const buildTable = (objects: {[key in string]: string | number }[], alignFn: (raws: {[key in string]: string | number }[]) => (text: string, i: number) => string) => {
    const anyRow = objects[0];
    if(!anyRow) throw new Error("At least one row must exist.")

    const align = alignFn(objects)

    const header = Object.keys(anyRow).reduce((acc,value, columnNum)=> acc + align(value, columnNum) + "|", "").slice(0, -1)
    const body = objects.map((object)=> Object.values(object).reduce<string>((acc ,value, columnNum)=> acc + align(String(value), columnNum) + "|", "").slice(0, -1))

    return [header, ...body].join("\n")
}

export const adjustCenter = (raws: {[key in string]: string | number }[]) => (text: string, i: number) => {
    const anyRow = raws[0]

    const eachColumnLengths = Object.keys(anyRow).map((key)=> key.length)
    const columnMaxLengths = raws.reduce<number[]>((lengthStore, object)=> {
        const raws = Object.values(object)
        const rawLengths = raws.map((raw)=>String(raw).length)

        const newLengthStore = []
        for(let i =0; i<lengthStore.length; i++) {
            newLengthStore.push(Math.max(lengthStore[i], rawLengths[i]))
        }

        return newLengthStore
    }, eachColumnLengths)

    const diff = (columnMaxLengths[i] - text.length) / 2;
    const leftPadding = ' '.repeat(Math.ceil(diff));
    const rightPadding = ' '.repeat(Math.floor(diff));

    return `${leftPadding}${text}${rightPadding}`;
};

const objs = [
    {abc: 'ㄱ', bef: 'ㄴ', ghi: 'ㄷ', jkl: 'ㄹ'},
    {abc: 'ㄹ', bef: 'ㄷ', ghi: 'ㄴ', jkl: 'ㄱ'},
    {abc: 1, bef: 2, ghi: 3, jkl: 4},
]

const result = buildTable(objs, adjustCenter)
console.log("result", result)