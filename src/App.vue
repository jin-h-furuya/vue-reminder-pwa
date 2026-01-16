<template>
  <nav>
    <router-link to="/">ホーム</router-link>
  </nav>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const checkReminders = () => {
  const reminders = JSON.parse(localStorage.getItem('reminders') || '[]');
  const now = new Date();
  let hasUpdate = false;

  reminders.forEach(item => {
    const targetTime = new Date(item.time);

    if (now >= targetTime && !item.notified) {
      showNotification(item);
      item.notified = true;
      hasUpdate = true;

      // 繰り返し設定の処理
      if (item.repeat === 'daily') {
        // 次回の時間を24時間後に設定
        const nextTime = new Date(targetTime.getTime() + 24 * 60 * 60 * 1000);
        item.time = nextTime.toISOString().slice(0, 16); // format: YYYY-MM-DDTHH:mm
        item.notified = false; // 次回のためにリセット
      }
    }
  });

  if (hasUpdate) {
    localStorage.setItem('reminders', JSON.stringify(reminders));
  }
};

const showNotification = (item) => {
  // alert('通知: ' + item.content);
  if (Notification.permission === 'granted') {
    // alert('通知を表示します');
    const n = new Notification('リマインダー', {
      body: item.content,
      data: { id: item.id }
    });

    n.onclick = (e) => {
      window.focus();
      // 通知をクリックしたら詳細ページへ移動
      router.push(`reminder/${item.id}`);
    };
  }
};

onMounted(() => {
  // 10秒ごとに時間をチェック
  setInterval(checkReminders, 10000);
});
</script>