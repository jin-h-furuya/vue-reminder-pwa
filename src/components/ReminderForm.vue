<template>
  <div class="form-container">
    <h3>新規リマインダー</h3>
    <input v-model="form.content" type="text" placeholder="何をする？" />
    <input v-model="form.time" type="datetime-local" />
    <select v-model="form.repeat">
      <option value="none">繰り返しなし</option>
      <option value="daily">毎日</option>
    </select>
    <button @click="addReminder">保存</button>

    <hr />
    <h4>登録済みリスト</h4>
    <ul>
      <li v-for="item in list" :key="item.id">
        {{ item.time }} - {{ item.content }}
        <button @click="deleteReminder(item.id)">削除</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const form = ref({ content: '', time: '', repeat: 'none' });
const list = ref([]);

// データの読み込み
const loadData = () => {
  const data = localStorage.getItem('reminders');
  list.value = data ? JSON.parse(data) : [];
};

// 通知許可を求める関数
const requestPermission = async () => {
  // 1. Service Workerが準備できているか確認
  if (!('serviceWorker' in navigator)) {
    alert("Service Workerに対応していません");
    return;
  }

  const registration = await navigator.serviceWorker.ready;

  // 2. showNotification が存在するかでチェック
  if (!('showNotification' in registration)) {
    alert("このブラウザは通知の表示に対応していません（PWAとして追加してください）");
    return;
  }

  // 3. 許可を求める（Promiseとコールバック両対応）
  const permission = await Notification.requestPermission();
  
  if (permission === 'granted') {
    alert("通知が許可されました！");
    // Service Worker経由でテスト通知を出す
    registration.showNotification("テスト通知", {
      body: "通知が届くようになりました",
      icon: "/icon.png"
    });
  } else {
    alert("拒否されました: " + permission);
  }
};

// データの追加
const addReminder = () => {
  if (!form.value.content || !form.value.time) return alert('入力してください');

  const newReminder = {
    id: crypto.randomUUID(), // 一意のIDを生成
    content: form.value.content,
    time: form.value.time,
    repeat: form.value.repeat,
    notified: false // 通知済みかどうかの管理用
  };

  list.value.push(newReminder);
  localStorage.setItem('reminders', JSON.stringify(list.value));
  
  // フォームをリセット
  form.value = { content: '', time: '', repeat: 'none' };
  alert('保存しました！');
};

// データの削除
const deleteReminder = (id) => {
  list.value = list.value.filter(item => item.id !== id);
  localStorage.setItem('reminders', JSON.stringify(list.value));
};

onMounted(() => {
  loadData();
  requestPermission();
});
</script>