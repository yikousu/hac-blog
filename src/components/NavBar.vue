<template>
  <nav class="navbar">
    <div class="nav-container">
      <router-link to="/home" class="nav-link">首页</router-link>
      <div class="nav-links">
        <!-- <router-link to="/home" class="nav-link">首页</router-link> -->
        <router-link to="/about" class="nav-link">关于我</router-link>
        <a href="https://blog.csdn.net/m0_64289188" class="nav-link" target="_blank">CSDN博客</a>
        <router-link to="/snake" class="nav-link">贪吃蛇游戏</router-link>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
// 导航栏组件
</script>

<style scoped>
.navbar {
  background-color: #4caf50;
  padding: 15px 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.logo {
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-links {
  display: flex;
  gap: 20px;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.router-link-active {
  background-color: rgba(255, 255, 255, 0.3);
}

@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    gap: 10px;
  }

  .nav-links {
    width: 100%;
    justify-content: center;
  }
}
</style>