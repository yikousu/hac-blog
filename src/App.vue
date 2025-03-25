<template>
  <NavBar />
  <router-view></router-view>
</template>


<script setup lang="ts" name="App">
import { RouterLink, RouterView } from 'vue-router'
import NavBar from "@/components/NavBar.vue";
import Home from "@/components/Home.vue";
import AboutMe from "@/components/AboutMe.vue";
import SnakeGame from "@/components/SnakeGame.vue";
</script>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: 'Microsoft YaHei', Arial, sans-serif;
  background-color: #f5f5f5;
}
</style>
