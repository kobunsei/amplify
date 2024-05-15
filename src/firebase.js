import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: 'AIzaSyCznRcpO0AyCJIL0qwrMGbnHQXEx27X-YI',
    authDomain: 'amplity-test.firebaseapp.com',
    projectId: 'amplity-test',
    storageBucket: "amplity-test.appspot.com",
    messagingSenderId: '1038543419902',
    appId: '1:1038543419902:web:dcea33dbe03e1aa85068af'
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export const requestForToken = (setTokenFound) => {
  return getToken(messaging, { vapidKey: 'BFCOCpO3jSxE5wSzDXR8PTq6TmBMxgMJ-6gTHWQiFEDXOVd3maBYWEGw4Kb1nYu9XqMYp_iY_UEOwf3C2BuYJKI' })
    .then((currentToken) => {
      if (currentToken) {
        console.log('current token for client: ', currentToken);
        setTokenFound(true);
        return currentToken;  // トークンを返す
      } else {
        console.log('No registration token available. Request permission to generate one.');
        setTokenFound(false);
        return null;  // トークンがない場合は null を返す
      }
    })
    .catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
      setTokenFound(false);
      return null;  // エラーが発生した場合は null を返す
    });
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
