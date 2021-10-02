export const indentName = (name: string, level: number) => {
  const numberSpaces = level * 2;
  const padding = "".padStart(numberSpaces, " ");
  return `${padding}${name}`;
};

export const backspaces = "".padStart(5, "\u0008");
