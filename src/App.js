import React, { useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from './aws-exports';
import { requestForToken, onMessageListener } from './firebase';

Amplify.configure(awsExports);

function App({ signOut, user }) {
  const [token, setToken] = useState(''); // 登録トークンを保存するステート
  const [notification, setNotification] = useState({ title: '', body: '' });

  // プッシュ通知の許可をリクエスト
  useEffect(() => {
    requestForToken((tokenFound, tokenValue) => {
      setToken(tokenValue); // トークンをステートに保存
    });
    // ブラウザの通知許可を求める
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }, []);

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
      console.log('Showing notification'); // 通知表示前にログを出力
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
        {token ? <p>FCM Token: {token}</p> : <p>No FCM Token Found</p>}
      </header>
    </div>
  );
}

export default withAuthenticator(App);
