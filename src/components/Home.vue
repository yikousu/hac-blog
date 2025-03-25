<template>
    <div>
        <header>
            <div class="header-container">
                <h1>Hey there! I am Hac</h1>
                <h1 class="wave">👋</h1>
            </div>
        </header>
        <div class="container">
            <p style="line-height: 0.8">Where to find me</p>
            <ul class="findMe">
                <li>
                    <p>
                        Email:
                        <a href="mailto:hac1322@163.com" style="text-decoration: none;">hac1322@163.com</a>
                    </p>
                </li>
                <!-- <li>
                    <p>Phone: 183-0246-7889</p>
                </li> -->
                <li>
                    <p>WeChat: VM47331</p>
                </li>
            </ul>

            <blockquote>
                <p>唯 一 值 得 恐 惧 的 就 是 恐 惧 本 身。</p>
            </blockquote>

        </div>
    </div>
</template>

<script setup name="Home" lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from "vue-router"

const router = useRouter();
function aboutMe() {
    router.push({ name: "about" })
}
function toSearchUrl() {
    router.push({ name: "search" })
}

function handleClick(clickFunction: string) {
    switch (clickFunction) {
        case 'aboutMe':
            aboutMe();
            break;
        case 'toSearchUrl':
            toSearchUrl();
            break;
        default:
            console.warn(`No handler for ${clickFunction}`);
    }
}
</script>


<style scoped>
.button-gap {
    display: flex;
    gap: 10px;
    line-height: 20px;
    /* 设置按钮之间的间距为 10px */
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.findMe {
    line-height: 2.6;
}


header {
    background-color: #4caf50;
    /* 设置标题头部的背景颜色为 #4CAF50（深绿色） */
    color: #fff;
    /* 设置标题头部的文本颜色为白色 */
    padding: 20px;
    /* 设置标题头部的内边距为 20px */
    text-align: center;
    /* 设置标题头部内的文本居中对齐 */
}

.container {
    max-width: 60%;
    /* 设置容器最大宽度为页面宽度的60% */
    margin: 20px auto;
    /* 居中显示，上下外边距为20像素 */
    padding: 20px;
    /* 内边距为20像素 */
    background-color: #fff;
    /* 背景色为白色 */
    border-radius: 10px;
    /* 圆角半径为8像素 */
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.05);
    /* 添加轻微阴影效果 */
    transition: all 0.3s ease-in-out;
    /* 添加所有属性的平滑过渡效果，持续时间为0.3秒，缓动函数为 ease-in-out */
}

.container:hover {
    transform: translateY(-2px);
    /* 鼠标悬停时向上移动5像素 */
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
    /* 鼠标悬停时增加更深的阴影 */
}

ul {
    display: block;
    /* 设置列表为块级元素 */
    list-style-type: disc;
    /* 设置列表项前的符号为实心圆 */
    margin-block-start: 1em;
    /* 设置块级元素的上外边距为1个em */
    margin-block-end: 1em;
    /* 设置块级元素的下外边距为1个em */
    margin-inline-start: 0px;
    /* 设置块级元素的行内起始外边距为0像素 */
    margin-inline-end: 0px;
    /* 设置块级元素的行内结束外边距为0像素 */
    padding-inline-start: 40px;
    /* 设置块级元素的行内起始内边距为40像素 */
    unicode-bidi: isolate;
    /* 控制列表项之间的双向文字重定向 */
}


blockquote {
    border-left: 4px solid rgba(0, 150, 191, 0.67);
    margin: 1.5em 0;
    padding: 0.5em 1em;
    font-style: italic;
    background-color: #f9f9f9;
}

/* 媒体查询（Media Queries）是CSS3的一个强大特性，它允许你根据设备的特性或者用户的偏好来自适应网页样式 */

/* 当屏幕宽度小于等于768像素时应用以下样式 */
@media (max-width: 768px) {

    /* 缩小容器的内边距为10像素 */
    .container {
        max-width: 90%;
        padding: 15px;
    }

    /* 缩小标题头部的内边距为10像素 */
    header {
        padding: 10px;
    }

    /* 当按钮在移动设备上需要换行时，使用 flex-wrap 属性来让按钮自动换行 */
    /* 按钮靠左对齐 */
    .button-gap {
        display: flex;
        flex-wrap: wrap;
        /* 允许按钮自动换行 */
        justify-content: flex-start;
        /* 按钮靠左对齐 */
    }

    /* 让按钮在一行内排列，直到放不下为止 */
    /* 按钮之间和按钮行之间添加间距 */
    .button-gap .el-button {
        /* 将按钮显示为行内块元素，使其在同一行内排列 */
        display: inline-block;

        /* 避免按钮文本换行 */
        white-space: nowrap;

        /* 按钮右边距离为10像素，用于与相邻按钮之间的间隔 */
        margin-right: 8px;

        /* 按钮底边距离为10像素，用于与下方按钮行之间的间隔 */
        margin-bottom: 10px;
    }
}

/* 挥手图标 */

/* 定义名为 .wave 的类 */
.wave {
    /* 将元素显示为内联块级元素，使其按行排列 */
    display: inline-block;
    /* 使用名为 wave 的动画，持续 1 秒，无限循环 */
    animation: wave 1s infinite;
    /* 设置左外边距为 10px，产生间隔 */
    margin-left: 10px;
}

/* 定义名为 wave 的关键帧动画 */
@keyframes wave {

    /* 在动画开始和结束时的样式 */
    0%,
    100% {
        /* 旋转 -10 度 */
        transform: rotate(-10deg);
        /* 动画时间函数为 ease-in-out，动画以平滑的速度开始和结束 */
        animation-timing-function: ease-in-out;
    }

    /* 在动画中点的样式 */
    50% {
        /* 旋转 20 度 */
        transform: rotate(20deg);
        /* 动画时间函数为 ease-in-out，动画以平滑的速度开始和结束 */
        animation-timing-function: ease-in-out;
    }
}


/* 标题栏header */
.header-container {
    display: flex;
    /* 使用 Flexbox 布局 */
    align-items: center;
    /* 垂直居中对齐 */
    justify-content: center;
}

/* 分割线 */
.custom-divider {
    display: flex;
    align-items: center;
    text-align: center;
}

.custom-divider hr {
    flex: 1;
    border: none;
    height: 0.1px;
    background-color: #aaa;
    margin: 0 0;
}

.divider-text {
    font-weight: bold;
    color: #aaa;
}
</style>