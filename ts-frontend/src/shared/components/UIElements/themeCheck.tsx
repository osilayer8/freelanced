const lightTheme = {
  '--background': '#fff',
  '--backgroundGradient': '#f2f2f2',
  '--text': '#000',
};

const darkTheme = {
  '--background': '#161616',
  '--backgroundGradient': '#202020',
  '--text': '#fff',
};

export const themeCheck = (nextTheme: string) => {
  const theme: any = nextTheme === 'light' ? lightTheme : darkTheme;

  const getStorage = localStorage.getItem('userData');
  if (getStorage) {
    const json = JSON.parse(getStorage);
    json.theme = nextTheme;
    localStorage.setItem('userData', JSON.stringify(json));
  }

  Object.keys(theme).map((key) => {
    const value = theme[key];
    return document.documentElement.style.setProperty(key, value);
  });
};
