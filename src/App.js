import React, { useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from './aws-exports';
import { requestForToken, onMessageListener } from './firebase';
import { generateClient } from "aws-amplify/api";
import { createUserToken } from "./graphql/mutations";



Amplify.configure(awsExports);
const client = generateClient();

function App({ signOut, user }) {
  const [isTokenFound, setTokenFound] = useState(false);
  const [notification, setNotification] = useState({ title: '', body: '' });

  // プッシュ通知の許可をリクエスト
  useEffect(() => {
    requestForToken(setTokenFound).then(token => {
      if (token) {
        saveTokenToDatabase(user.userId, token);
        setTokenFound(true);
      } else {
        setTokenFound(false);
      }
    });

    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }, []);

  const saveTokenToDatabase = async (userId, token) => {
    try {
      const result = await client.graphql({
        query: createUserToken,
        variables: { input: { userId, token } }
      });
      console.log('Token saved to database:', result);
    } catch (error) {
      console.error('Error saving token to database:', error);
    }
  };
  

  // フォアグラウンドで通知を受信
  useEffect(() => {
    onMessageListener()
      .then((payload) => {
        setNotification({
          title: payload.notification.title,
          body: payload.notification.body
        });
        // ブラウザの通知を表示
        showNotification(payload.notification.title, payload.notification.body);
        console.log(payload);
      })
      .catch((err) => console.log('failed: ', err));
  }, []);

  // ネイティブ通知を表示する関数
  const showNotification = (title, body) => {
    if ('Notification' in window && window.Notification.permission === "granted") {
      console.log('Showing notification');
      new Notification(title, {
        body: body,
        icon: 'logo192.png'
      });
    } else {
      console.log('Notification permission not granted or not supported'); // 条件分岐が失敗した場合のログ
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome, {user.username}</h1>
        <button onClick={signOut}>Sign out</button>
        {/* {isTokenFound ? <p>Notification permission enabled</p> : <p>Need notification permission</p>}
        <h2>Notification:</h2>
        <p>Title: {notification.title}</p>
        <p>Body: {notification.body}</p> */}
      </header>
    </div>
  );
}

export default withAuthenticator(App);
