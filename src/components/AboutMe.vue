<template>
    <div class="about">
        <div class="info">
            <h2>你好呀 😃</h2>
            <h4>我是hac， 大四在校生</h4>
            <p class="job-hunting"> 目前正在找工作 Java后端开发。</p>
            <!-- <p> 大四在校生，理想主义者。</p> -->
            <p> 就读于沈阳理工大学电信科专业。</p>
            <p> 兴趣运动健身、听音乐、钻研技术。</p>
            <p>使用🛠️Java、Vue。</p>
        </div>
        <button @click="goBack" class="back-btn" style="margin-left: auto;">返回</button>
    </div>
</template>

<script setup name="AboutMe" lang="ts">
import { useRouter } from "vue-router"
import { onMounted, onUnmounted } from "vue";

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
// 获取当前组件的路由器实例
let router = useRouter()
function goBack() {
    // go 方法接收一个整数参数，表示导航的步数。在这里，-1 表示返回上一页。
    // router.go(1)：前进一步。
    // router.go(-1)：后退一步。
    // router.go(0)：刷新当前页面。
    // router.go(-1);

    // 返回首页
    router.push("/");
}
</script>

<style scoped>
.job-hunting {
    /* 设置背景颜色为橙色 (#ff5722)，醒目且吸引注意力 */
    background-color: #ff5722;

    /* 文字颜色设为白色，与橙色背景形成高对比度，确保可读性 */
    color: white;

    /* 内边距：上下 4px，左右 8px，让文字和背景之间有适当间距 */
    padding: 4px 8px;

    /* 边框圆角 4px，使背景的边角变得圆润，看起来更柔和 */
    border-radius: 4px;

    /* 应用名为 "blink" 的动画效果：
       - 持续时间 1 秒
       - 无限循环 (infinite)
       - alternate 表示动画在 0%→100%→0% 之间来回播放 */
    animation: blink 1s infinite alternate;
}

/* 定义 "blink" 动画的关键帧 */
@keyframes blink {

    /* 起始状态 (from / 0%)：完全不透明 */
    from {
        opacity: 1;
    }

    /* 结束状态 (to / 100%)：透明度降低到 70% */
    to {
        opacity: 0.5;
    }
}

/* 将 .about 容器的宽度设置为90%，并水平居中 */
.about {
    display: flex;
    flex-direction: column;
    /* 将子元素排列为列 */
    align-items: center;
    /* 在交叉轴上居中对齐 */
    width: 90%;
    /* 设置容器宽度为90% */
    padding: 20px;
    /* 添加内边距 */
}

h2 {
    font-size: 2.4rem;
    line-height: 3.2rem;
    font-weight: normal;
}

h4 {
    font-size: 1.4rem;
    line-height: 1.2rem;
    /* 取消粗体样式 */
    font-weight: normal;
}

.info {
    margin-bottom: 20px;
}

.back-btn {
    /* 元素的上下内边距为 10 像素，左右内边距为 20 像素。 */
    padding: 10px 20px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    /* 表示当按钮的背景颜色发生变化时，将以 0.3 秒的时间来渐变到新的颜色。 */
    transition: background-color 0.3s;
}

.back-btn:hover {
    background-color: #0056b3;
}



@media(min-width: 768px) {
    .about {
        /* calc() 函数用于在 CSS 中进行数学计算，这里是将父元素的宽度除以 4，以便 .about 元素占据父元素的四分之一宽度。 */
        width: calc(100%/4)
    }
}
</style>
