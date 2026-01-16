<template>
  <div v-if="reminder">
    <h2>リマインダー詳細</h2>
    <hr />
    <p><strong>内容:</strong> {{ reminder.content }}</p>
    <p><strong>時間:</strong> {{ reminder.time }}</p>
    <p><strong>繰り返し:</strong> {{ reminder.repeat }}</p>
    <button @click="$router.push('/')">戻る</button>
  </div>
  <div v-else>
    <p>データが見つかりません</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps(['id']);
const reminder = ref(null);

onMounted(() => {
  const reminders = JSON.parse(localStorage.getItem('reminders') || '[]');
  // IDが一致するものを探す
  reminder.value = reminders.find(r => r.id === props.id);
});
</script>