<template>
  <div class="message-board-container">
    <div class="message-form">
      <div class="form-group">
        <label for="name">您的昵称</label>
        <input type="text" id="name" v-model="newMessage.name" placeholder="请输入您的昵称" maxlength="20">
      </div>

      <div class="form-group">
        <label for="email">您的邮箱</label>
        <input type="email" id="email" v-model="newMessage.email" placeholder="请输入您的邮箱">
      </div>

      <div class="form-group">
        <label for="content">留言内容</label>
        <textarea id="content" v-model="newMessage.content" placeholder="请输入您的留言内容" rows="4" maxlength="500"></textarea>
        <div class="char-count">{{ newMessage.content.length }}/500</div>
      </div>

      <div class="form-actions">
        <button class="submit-btn" @click="addMessage" :disabled="!isFormValid || isSubmitting">
          <span v-if="isSubmitting">提交中...</span>
          <span v-else>发表留言</span>
        </button>
      </div>
    </div>

    <div v-if="showExport" class="message-list">
      <h2 class="section-title">留言列表 ({{ messages.length }})</h2>

      <div v-if="messages.length === 0" class="empty-state">
        <div class="empty-icon">💬</div>
        <p>暂无留言，成为第一个留言的人吧！</p>
      </div>

      <transition-group name="message-fade" tag="div" class="messages">
        <div v-for="message in messages" :key="message.id" class="message-card"
          :class="{ 'admin-message': message.isAdmin }">
          <div class="message-header">
            <div class="avatar" :style="{ backgroundColor: getAvatarColor(message.name) }">
              {{ message.name.charAt(0).toUpperCase() }}
            </div>
            <div class="message-info">
              <div class="message-name">{{ message.name }}</div>
              <div class="message-date">{{ formatDate(message.timestamp) }}</div>
            </div>
          </div>
          <div class="message-content">{{ message.content }}</div>
        </div>
      </transition-group>
    </div>

    <!-- 隐藏的导出按钮，只有按下特定键才会显示 -->
    <div v-if="showExport" class="export-panel">
      <div class="export-header">
        <h3>导出留言数据</h3>
        <button class="close-btn" @click="showExport = false">×</button>
      </div>
      <div class="export-actions">
        <button class="export-btn" @click="exportMessages('json')">导出为JSON</button>
        <button class="export-btn" @click="exportMessages('csv')">导出为CSV</button>
        <button class="export-btn danger" @click="clearAllMessages">清空所有留言</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { ElMessage } from 'element-plus';

interface Message {
  id: string;
  name: string;
  email: string;
  content: string;
  timestamp: number;
  isAdmin: boolean;
  signature?: string;
}

// 状态变量
const messages = ref<Message[]>([]);
const newMessage = ref<Omit<Message, 'id' | 'timestamp' | 'isAdmin' | 'signature'>>({
  name: '',
  email: '',
  content: ''
});
const isSubmitting = ref(false);
let showExport = ref(false);

// 计算属性
const isFormValid = computed(() => {
  return newMessage.value.name.trim() !== '' &&
    newMessage.value.content.trim() !== '';
});

// 密钥 - 用于签名验证
const SECRET_KEY = 'hac-blog-message-board-secret';

// 生成签名
const generateSignature = (message: Message): string => {
  const data = `${message.id}|${message.name}|${message.content}|${message.timestamp}`;
  // 简单的哈希函数，实际应用中可以使用更复杂的加密算法
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 转换为32位整数
  }
  return hash.toString(16) + SECRET_KEY.substring(0, 8);
};

// 验证签名
const verifySignature = (message: Message): boolean => {
  if (!message.signature) return false;
  const expectedSignature = generateSignature(message);
  return message.signature === expectedSignature;
};

// 从localStorage加载留言
const loadMessages = () => {
  try {
    const savedMessages = localStorage.getItem('hac-blog-messages');
    if (savedMessages) {
      const parsedMessages = JSON.parse(savedMessages) as Message[];
      // 验证每条留言的签名
      messages.value = parsedMessages.filter(msg => verifySignature(msg));
    }
  } catch (error) {
    console.error('加载留言失败:', error);
    ElMessage.error('加载留言失败，请刷新页面重试');
  }
};

// 保存留言到localStorage
const saveMessages = () => {
  try {
    localStorage.setItem('hac-blog-messages', JSON.stringify(messages.value));
  } catch (error) {
    console.error('保存留言失败:', error);
    ElMessage.error('保存留言失败，请检查浏览器存储空间');
  }
};

// 添加新留言
const addMessage = () => {
  if (!isFormValid.value) return;

  isSubmitting.value = true;

  setTimeout(() => {
    try {
      const newMsg: Message = {
        id: Date.now().toString(36) + Math.random().toString(36).substring(2, 9),
        name: newMessage.value.name.trim(),
        email: newMessage.value.email.trim(),
        content: newMessage.value.content.trim(),
        timestamp: Date.now(),
        isAdmin: false
      };

      // 添加签名
      newMsg.signature = generateSignature(newMsg);

      // 添加到留言列表
      messages.value.unshift(newMsg);
      saveMessages();

      // 重置表单
      newMessage.value = { name: '', email: '', content: '' };
      ElMessage.success('留言发表成功！');
    } catch (error) {
      console.error('添加留言失败:', error);
      ElMessage.error('添加留言失败，请重试');
    } finally {
      isSubmitting.value = false;
    }
  }, 500); // 模拟网络延迟
};

// 格式化日期
const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

// 根据名字生成头像颜色
const getAvatarColor = (name: string): string => {
  const colors = [
    '#FF5252', '#FF4081', '#E040FB', '#7C4DFF', '#536DFE',
    '#448AFF', '#40C4FF', '#18FFFF', '#64FFDA', '#69F0AE',
    '#B2FF59', '#EEFF41', '#FFFF00', '#FFD740', '#FFAB40',
    '#FF6E40'
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

// 导出留言数据
const exportMessages = (format: 'json' | 'csv') => {
  try {
    let data: string;
    let filename: string;
    let mimeType: string;

    if (format === 'json') {
      data = JSON.stringify(messages.value, null, 2);
      filename = `hac-blog-messages-${Date.now()}.json`;
      mimeType = 'application/json';
    } else {
      // CSV格式
      const headers = ['ID', '昵称', '邮箱', '内容', '时间'];
      const csvRows = [
        headers.join(','),
        ...messages.value.map(msg => {
          return [
            msg.id,
            `"${msg.name.replace(/"/g, '""')}"`,
            `"${msg.email.replace(/"/g, '""')}"`,
            `"${msg.content.replace(/"/g, '""')}"`,
            formatDate(msg.timestamp)
          ].join(',');
        })
      ];
      data = csvRows.join('\n');
      filename = `hac-blog-messages-${Date.now()}.csv`;
      mimeType = 'text/csv';
    }

    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    ElMessage.success(`留言数据已导出为${format.toUpperCase()}格式`);
  } catch (error) {
    console.error('导出留言失败:', error);
    ElMessage.error('导出留言失败，请重试');
  }
};

// 清空所有留言
const clearAllMessages = () => {
  if (confirm('确定要清空所有留言吗？此操作不可恢复！')) {
    messages.value = [];
    saveMessages();
    ElMessage.success('所有留言已清空');
    showExport = ref(false);
  }
};

// 键盘事件处理 - 隐藏的导出功能触发器
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === "F12" || event.ctrlKey && event.shiftKey && event.key === 'I' || event.ctrlKey && event.shiftKey && event.key === 'J') {
    document.body.innerHTML = ""; // 清空页面内容
    debugger; // 触发调试器
  }
  // 按下 Ctrl+Shift+E 显示导出面板
  if (event.ctrlKey && event.shiftKey && event.key === 'E') {
    event.preventDefault();
    showExport.value = !showExport.value;
  }
};

// 生命周期钩子
onMounted(() => {
  loadMessages();
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<style scoped>
.message-board-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: 'Microsoft YaHei', Arial, sans-serif;
  position: relative;
}

.message-form {
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.message-form:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

input,
textarea {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
  font-family: inherit;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #4caf50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
}

.char-count {
  text-align: right;
  font-size: 0.8rem;
  color: #999;
  margin-top: 5px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.submit-btn {
  background: linear-gradient(135deg, #4caf50, #8bc34a);
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(76, 175, 80, 0.3);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(76, 175, 80, 0.4);
}

.submit-btn:active {
  transform: translateY(1px);
  box-shadow: 0 2px 5px rgba(76, 175, 80, 0.4);
}

.submit-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.section-title {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.section-title::after {
  content: '';
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg, #e0e0e0 0%, transparent 100%);
  margin-left: 15px;
}

.empty-state {
  text-align: center;
  padding: 40px 0;
  color: #999;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 15px;
  animation: bounce 2s infinite;
}

@keyframes bounce {

  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }

  40% {
    transform: translateY(-20px);
  }

  60% {
    transform: translateY(-10px);
  }
}

.messages {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.message-card {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
}

.message-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 4px;
  background: linear-gradient(to bottom, #4caf50, #8bc34a);
}

.message-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.admin-message {
  background-color: #f8f8ff;
}

.admin-message::before {
  background: linear-gradient(to bottom, #ff9800, #ff5722);
}

.message-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
  margin-right: 15px;
  flex-shrink: 0;
}

.message-info {
  flex: 1;
}

.message-name {
  font-weight: 600;
  color: #333;
  margin-bottom: 3px;
}

.message-date {
  font-size: 0.8rem;
  color: #999;
}

.message-content {
  color: #555;
  line-height: 1.6;
  white-space: pre-line;
}

/* 动画效果 */
.message-fade-enter-active,
.message-fade-leave-active {
  transition: all 0.5s ease;
}

.message-fade-enter-from,
.message-fade-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

/* 导出面板 */
.export-panel {
  position: fixed;
  bottom: 30px;
  right: 30px;
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  width: 300px;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateY(100px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.export-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.export-header h3 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
  transition: color 0.3s;
}

.close-btn:hover {
  color: #333;
}

.export-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.export-btn {
  padding: 10px 15px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  background-color: #f0f0f0;
  color: #333;
}

.export-btn:hover {
  background-color: #e0e0e0;
}

.danger {
  background-color: #ffebee;
  color: #f44336;
}

.danger:hover {
  background-color: #ffcdd2;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .message-board-container {
    padding: 30px 15px;
  }

  .message-form,
  .message-card {
    padding: 20px;
  }

  .export-panel {
    width: calc(100% - 40px);
    right: 20px;
    bottom: 20px;
  }
}
</style>