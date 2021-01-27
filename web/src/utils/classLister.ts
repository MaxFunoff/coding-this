
export const classes = (...cl: Array<boolean|string>): string => {
    let _cl: string[] = [];

    cl.forEach((c: any) => typeof c === 'string' && _cl.push(c))



    return _cl.join(" ")
}