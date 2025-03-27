<template>
  <div class="search-container">
    <div ref="searchBox" class="search-box">
      <input type="text" v-model="searchQuery" @keyup.enter="performSearch" placeholder="输入关键词搜索..."
        class="search-input" />
      <div class="engine-selector" @click.stop="toggleDropdown">
        <span>{{ currentEngine.name }}</span>
        <i class="dropdown-icon" :class="{ 'open': isDropdownOpen }">▼</i>
      </div>
      <button @click="performSearch" class="search-button">搜索</button>

      <!-- 搜索引擎下拉菜单 -->
      <div v-if="isDropdownOpen" class="dropdown-menu">
        <div v-for="engine in searchEngines" :key="engine.id" @click.stop="handleEngineSelection(engine)"
          class="dropdown-item" :class="{ 'active': currentEngine.id === engine.id }">
          {{ engine.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface SearchEngine {
  id: string;
  name: string;
  url: string;
}

// 搜索引擎列表
const searchEngines: SearchEngine[] = [
  { id: 'bing', name: 'Bing', url: 'https://www.bing.com/search?q=' },
  { id: 'google', name: 'Google', url: 'https://www.google.com/search?q=' },
  { id: 'bilibili', name: 'Bilibili', url: 'https://search.bilibili.com/all?keyword=' },
  { id: 'douyin', name: '抖音', url: 'https://www.douyin.com/search/' },
  { id: 'github', name: 'GitHub', url: 'https://github.com/search?q=' },
  { id: 'gitee', name: 'Gitee', url: 'https://search.gitee.com/?q=' },
  { id: 'csdn', name: 'CSDN', url: 'https://so.csdn.net/so/search?q=' },
  { id: 'stackoverflow', name: 'Stack Overflow', url: 'https://stackoverflow.com/search?q=' },
  { id: 'zhihu', name: '知乎', url: 'https://www.zhihu.com/search?q=' },
  { id: 'weibo', name: '微博', url: 'https://s.weibo.com/weibo?q=' },
  { id: 'twitter', name: 'Twitter', url: 'https://twitter.com/search?q=' },
  { id: 'youtube', name: 'YouTube', url: 'https://www.youtube.com/results?search_query=' },
  { id: 'wikipedia', name: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Special:Search?search=' },
  { id: 'yandex', name: 'Yandex', url: 'https://yandex.com/search/?text=' },
  { id: 'duckduckgo', name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=' },
  { id: 'yahoo', name: 'Yahoo', url: 'https://search.yahoo.com/search?p=' },
];


// 当前选中的搜索引擎
const currentEngine = ref<SearchEngine>(searchEngines[0]);

// 搜索关键词
const searchQuery = ref('');

// 下拉菜单状态
const isDropdownOpen = ref(false);

// 绑定搜索框的 DOM 元素
const searchBox = ref<HTMLElement | null>(null);

// 切换下拉菜单显示状态
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

// 选择搜索引擎
const handleEngineSelection = (engine: SearchEngine) => {
  setTimeout(() => {
    currentEngine.value = engine;
    isDropdownOpen.value = false;
  }, 100);
};

// 执行搜索
const performSearch = () => {
  if (searchQuery.value.trim()) {
    const searchUrl = currentEngine.value.url + encodeURIComponent(searchQuery.value);
    window.open(searchUrl, '_blank');
  }
};

// 点击外部关闭下拉菜单（避免与 handleEngineSelection 冲突）
const handleClickOutside = (event: MouseEvent) => {
  if (searchBox.value && !searchBox.value.contains(event.target as Node)) {
    setTimeout(() => {
      isDropdownOpen.value = false;
    }, 150);
  }
};

// 组件挂载时添加点击事件监听
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

// 组件卸载时移除点击事件监听
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.search-container {
  display: flex;
  justify-content: center;
  margin: 20px 0;
  width: 100%;
}

.search-box {
  display: flex;
  position: relative;
  width: 100%;
  max-width: 600px;
  border-radius: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  background-color: white;
  transition: all 0.3s ease;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: auto;
  right: 0;
  width: 160px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  z-index: 10;
  overflow: hidden;
  animation: fadeIn 0.2s ease;
}


.search-box:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.search-input {
  flex: 1;
  padding: 12px 20px;
  border: none;
  outline: none;
  font-size: 16px;
}

.engine-selector {
  display: flex;
  align-items: center;
  padding: 0 15px;
  background-color: #f5f5f5;
  cursor: pointer;
  user-select: none;
  border-left: 1px solid #e0e0e0;
  transition: background-color 0.2s;
}

.engine-selector:hover {
  background-color: #e8e8e8;
}

.dropdown-icon {
  margin-left: 8px;
  font-size: 10px;
  transition: transform 0.3s ease;
}

.dropdown-icon.open {
  transform: rotate(180deg);
}

.search-button {
  padding: 0 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.search-button:hover {
  background-color: #3d8b40;
}


.dropdown-item {
  padding: 12px 15px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}

.dropdown-item.active {
  background-color: #e8f5e9;
  color: #4caf50;
  font-weight: bold;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .search-box {
    flex-direction: column;
    border-radius: 15px;
    overflow: visible;
  }

  .engine-selector {
    width: 100%;
    justify-content: space-between;
    border-left: none;
    border-top: 1px solid #e0e0e0;
  }

  .search-button {
    width: 100%;
    padding: 12px;
  }

  .dropdown-menu {
    min-width: 150px;
  }
}
</style>
