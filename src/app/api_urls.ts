export const api = 'https://superheroapi.com/api/3607973142568938/';
export const getApiHeroByNameEndPoint = (name: string) => {
  return `${api}search/${name}`;
};
