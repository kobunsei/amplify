// src/App.js
import React, { useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from './aws-exports';
import { requestForToken, onMessageListener } from './firebase';

Amplify.configure(awsExports);

function App({ signOut, user }) {
  const [isTokenFound, setTokenFound] = useState(false);
  const [notification, setNotification] = useState({ title: '', body: '' });

  // プッシュ通知の許可をリクエスト
  useEffect(() => {
    requestForToken(setTokenFound);
  }, []);

  // フォアグラウンドで通知を受信
  useEffect(() => {
    onMessageListener()
      .then((payload) => {
        setNotification({
          title: payload.notification.title,
          body: payload.notification.body
        });
        console.log(payload);
      })
      .catch((err) => console.log('failed: ', err));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome, {user.username}</h1>
        <button onClick={signOut}>Sign out</button>
        {isTokenFound ? <p>Notification permission enabled</p> : <p>Need notification permission</p>}
        <h2>Notification:</h2>
        <p>Title: {notification.title}</p>
        <p>Body: {notification.body}</p>
      </header>
    </div>
  );
}

export default withAuthenticator(App);
