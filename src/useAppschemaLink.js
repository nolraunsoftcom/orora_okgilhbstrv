import {useEffect} from 'react';
import {Linking} from 'react-native';

export const useAppSchemaLink = ({baseUrl, myWebWiew, setsourceUrl}) => {
  const appscheme = 'orora-okgilhbstrv://';
  useEffect(() => {
    // 앱이 처음 열렸을 때
    Linking.getInitialURL().then(url => {
      if (url) handleDeepLink(url);
    });
    const sub = Linking.addEventListener('url', ({url}) => {
      handleDeepLink(url);
    });
    return () => sub.remove();
  }, []);

  const handleDeepLink = url => {
    const parsed = new URL(url);
    const path = url.split('://')[1];
    const gotoUrl = `${baseUrl}/` + path;
    setTimeout(() => {
      setsourceUrl(gotoUrl);
      myWebWiew.current.injectJavaScript(`
                  window.location.href = "${gotoUrl}";
                `);
    }, 1000);
  };

  return null;
};
