export const toJson = (data: BigInt) => {
    return JSON.stringify(data, (_, v) =>
        typeof v === 'bigint' ? `${v}n` : v
    ).replace(/"(-?\d+)n"/g, (_, a) => a);
};
