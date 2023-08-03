export const shuffle = (strArray: string[]): string[] => {
  const arrCopy = [...strArray];

  let currentIndex = arrCopy.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [arrCopy[currentIndex], arrCopy[randomIndex]] = [
      arrCopy[randomIndex],
      arrCopy[currentIndex],
    ];
  }

  return arrCopy;
};
