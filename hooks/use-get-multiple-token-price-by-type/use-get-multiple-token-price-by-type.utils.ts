export const getPrices = (types: ReadonlyArray<string>) =>
  fetch(
    encodeURI(`https://rates-api-production.up.railway.app/api/fetch-quote`),
    {
      method: 'POST',
      next: { revalidate: 1800 },
      headers: { accept: '*/*', 'Content-Type': 'application/json' },
      body: JSON.stringify({ coins: types }),
    }
  )
    .then((res) => res.json?.())
    .then((data) =>
      types.reduce(
        (acc, type, index) =>
          data[index].price > 0
            ? {
                ...acc,
                [type]: data[index].price,
              }
            : acc,
        {} as Record<string, number>
      )
    )
    .catch(() => ({}) as Record<string, number>);

export const getAllCoinsPrice = async (types: ReadonlyArray<string>) => {
  if (!types.length) return {};

  return getPrices(types);
};
