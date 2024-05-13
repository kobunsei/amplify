import React, { useEffect, useState, useRef } from 'react'; // useRef をインポート
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from './aws-exports';
import { requestForToken, onMessageListener } from './firebase';

Amplify.configure(awsExports);

function App({ signOut, user }) {
  const [isTokenFound, setTokenFound] = useState(false);
  const [notification, setNotification] = useState({ title: '', body: '' });
  const notificationShown = useRef(new Set()); // 既に表示した通知の管理

  // プッシュ通知の許可をリクエスト
  useEffect(() => {
    requestForToken(setTokenFound);
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }, []);

  // フォアグラウンドで通知を受信
  useEffect(() => {
    const unsubscribe = onMessageListener()
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

    return () => unsubscribe; // コンポーネントアンマウント時にリスナーをクリーンアップ
  }, []);

  // ネイティブ通知を表示する関数
  const showNotification = (title, body) => {
    const notificationId = `${title}|${body}`; // 通知のユニークなIDを生成
    if ('Notification' in window && window.Notification.permission === "granted" && !notificationShown.current.has(notificationId)) {
      console.log('Showing notification'); // 通知表示前にログを出力
      new Notification(title, {
        body: body,
        icon: 'logo192.png'
      });
      notificationShown.current.add(notificationId); // 表示済みの通知に追加
    } else {
      console.log('Notification permission not granted or not supported'); // 条件分岐が失敗した場合のログ
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome, {user.username}</h1>
        <button onClick={signOut}>Sign out</button>
        {isTokenFound ? <p>Notification permission enabled</p> : <p>Need notification permission</p>}
      </header>
    </div>
  );
}

export default withAuthenticator(App);
