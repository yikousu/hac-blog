<template>
  <div class="search-container">
    <div ref="searchBox" class="search-box">
      <input type="text" v-model="searchQuery" @keyup.enter="performSearch" placeholder="输入关键词搜索..."
        class="search-input" />
      <div class="engine-selector" @click.stop="toggleDropdown">
        <span>选择搜索引擎</span>
        <i class="dropdown-icon" :class="{ 'open': isDropdownOpen }">▼</i>
      </div>
      <button @click="performSearch" class="search-button">搜索</button>

      <!-- 搜索引擎单选下拉菜单 -->
      <div v-if="isDropdownOpen" class="dropdown-menu single-select">
        <h3 class="dropdown-title">选择搜索引擎</h3>
        <div v-for="category in engineCategories" :key="category.name" class="engine-category">
          <h4 class="category-title">{{ category.name }}</h4>
          <div class="engine-list">
            <div v-for="engine in category.engines" :key="engine.id" class="dropdown-item radio-item"
              :class="{ 'active': selectedEngine === engine.id }">
              <label>
                <input type="radio" :value="engine.id" v-model="selectedEngine" @click.stop>
                {{ engine.name }}
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

// 键盘事件处理 
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === "F12" || event.ctrlKey && event.shiftKey && event.key === 'I' || event.ctrlKey && event.shiftKey && event.key === 'J') {
    document.body.innerHTML = ""; // 清空页面内容
    debugger; // 触发调试器
  }
};

// 生命周期钩子
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
interface SearchEngine {
  id: string;
  name: string;
  url: string;
}

interface EngineCategory {
  name: string;
  engines: SearchEngine[];
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

// 搜索引擎分类
const engineCategories: EngineCategory[] = [
  {
    name: '通用搜索',
    engines: searchEngines.filter(engine => ['bing', 'google', 'wikipedia', 'duckduckgo', 'yahoo', 'yandex'].includes(engine.id))
  },
  {
    name: '社交媒体',
    engines: searchEngines.filter(engine => ['twitter', 'weibo', 'douyin', 'zhihu', 'youtube', 'bilibili'].includes(engine.id))
  },
  {
    name: '开发者资源',
    engines: searchEngines.filter(engine => ['github', 'gitee', 'stackoverflow', 'csdn'].includes(engine.id))
  }
];

// 已选择的搜索引擎ID
const selectedEngine = ref<string>('bing');

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

// 执行搜索
const performSearch = () => {
  if (searchQuery.value.trim() && selectedEngine.value) {
    const query = encodeURIComponent(searchQuery.value);

    // 获取选中的搜索引擎
    const selectedEngineObject = searchEngines.find(engine =>
      engine.id === selectedEngine.value
    );

    // 在选中的搜索引擎中打开搜索结果
    if (selectedEngineObject) {
      const searchUrl = selectedEngineObject.url + query;
      window.open(searchUrl, '_blank');
    }
  }
};

// 点击外部关闭下拉菜单
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
  width: 300px;
  max-height: 400px;
  overflow-y: auto;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  z-index: 10;
  animation: fadeIn 0.2s ease;
  padding: 10px 0;
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


.dropdown-title {
  padding: 10px 15px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  border-bottom: 1px solid #eee;
  margin-bottom: 5px;
}

.category-title {
  padding: 8px 15px;
  font-size: 14px;
  color: #666;
  background-color: #f9f9f9;
  margin: 5px 0;
}

.engine-category {
  margin-bottom: 10px;
}

.engine-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

.dropdown-item {
  padding: 8px 15px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}

.dropdown-item.active {
  color: #4caf50;
}

.radio-item {
  display: flex;
  align-items: center;
}

.radio-item label {
  display: flex;
  align-items: center;
  cursor: pointer;
  width: 100%;
}

.radio-item input[type="radio"] {
  margin-right: 8px;
  cursor: pointer;
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
    width: 100%;
    max-width: 300px;
    left: 0;
    right: 0;
    margin: 0 auto;
  }

  .engine-list {
    grid-template-columns: 1fr;
  }
}
</style>
