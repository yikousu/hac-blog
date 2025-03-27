<template>
  <div class="ai-tools-container">
    <h1 class="page-title">AI 工具导航</h1>
    <p class="page-description">发现并使用最流行的AI工具，提升你的工作效率</p>
    
    <div class="categories">
      <div 
        v-for="category in categories" 
        :key="category.id" 
        class="category-section"
      >
        <h2 class="category-title">{{ category.name }}</h2>
        <div class="tools-grid">
          <div 
            v-for="tool in category.tools" 
            :key="tool.id" 
            class="tool-card"
            @click="openTool(tool.url)"
          >
            <div class="tool-icon" :style="{ backgroundColor: tool.color }">
              <span>{{ tool.icon }}</span>
            </div>
            <div class="tool-info">
              <h3 class="tool-name">{{ tool.name }}</h3>
              <p class="tool-description">{{ tool.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface AITool {
  id: string;
  name: string;
  description: string;
  url: string;
  icon: string;
  color: string;
}

interface Category {
  id: string;
  name: string;
  tools: AITool[];
}

// AI工具数据
const categories = ref<Category[]>([
  {
    id: 'chatbots',
    name: '聊天机器人',
    tools: [
      {
        id: 'grok',
        name: 'Grok',
        description: 'X平台推出的AI助手，擅长幽默和创意回答',
        url: 'https://x.com/i/grok?focus=1',
        icon: '🤖',
        color: '#1DA1F2'
      },
      {
        id: 'chatgpt',
        name: 'ChatGPT',
        description: 'OpenAI开发的对话式AI，擅长自然语言处理',
        url: 'https://chatgpt.com/',
        icon: '💬',
        color: '#10A37F'
      },
      {
        id: 'deepseek',
        name: 'DeepSeek',
        description: '深度学习驱动的AI助手，擅长复杂问题解答',
        url: 'https://chat.deepseek.com/',
        icon: '🔍',
        color: '#6236FF'
      },
      {
        id: 'kimi',
        name: 'Kimi',
        description: '月之暗面推出的AI助手，擅长中文交流',
        url: 'https://kimi.moonshot.cn/',
        icon: '🌙',
        color: '#4B0082'
      },
      {
        id: 'doubao',
        name: '豆包',
        description: '字节跳动推出的AI助手，擅长创意和内容生成',
        url: 'https://www.doubao.com/chat/',
        icon: '🫘',
        color: '#0066FF'
      },
      {
        id: 'qianwen',
        name: '通义千问',
        description: '阿里巴巴推出的AI助手，擅长知识问答',
        url: 'https://tongyi.aliyun.com/qianwen',
        icon: '🧠',
        color: '#FF6A00'
      },
      {
        id: 'claude',
        name: 'Claude',
        description: 'Anthropic开发的AI助手，注重安全和有益回答',
        url: 'https://claude.ai/',
        icon: '🎭',
        color: '#8A2BE2'
      },
      {
        id: 'gemini',
        name: 'Gemini',
        description: 'Google推出的多模态AI，擅长跨领域理解',
        url: 'https://gemini.google.com/',
        icon: '♊',
        color: '#4285F4'
      },
      {
        id: 'perplexity',
        name: 'Perplexity',
        description: '基于搜索的AI助手，提供实时信息和引用',
        url: 'https://www.perplexity.ai/',
        icon: '🔎',
        color: '#5436DA'
      },
      {
        id: 'baichuan',
        name: '百川',
        description: '百川智能推出的AI助手，擅长中文理解',
        url: 'https://www.baichuan-ai.com/chat',
        icon: '🌊',
        color: '#3B82F6'
      }
    ]
  },
  {
    id: 'creative',
    name: '创意生成',
    tools: [
      {
        id: 'midjourney',
        name: 'Midjourney',
        description: '强大的AI图像生成工具，擅长艺术风格创作',
        url: 'https://www.midjourney.com/',
        icon: '🎨',
        color: '#0B0F1A'
      },
      {
        id: 'dalle',
        name: 'DALL-E',
        description: 'OpenAI的图像生成AI，可根据文本创建图像',
        url: 'https://openai.com/dall-e-3',
        icon: '🖼️',
        color: '#FF4500'
      },
      {
        id: 'stable-diffusion',
        name: 'Stable Diffusion',
        description: '开源的图像生成模型，支持本地部署',
        url: 'https://stability.ai/',
        icon: '🌈',
        color: '#7B68EE'
      },
      {
        id: 'runway',
        name: 'Runway',
        description: '视频生成和编辑AI工具，支持多种创意效果',
        url: 'https://runwayml.com/',
        icon: '🎬',
        color: '#FF6347'
      },
      {
        id: 'synthesia',
        name: 'Synthesia',
        description: 'AI视频生成平台，可创建逼真的数字人视频',
        url: 'https://www.synthesia.io/',
        icon: '👤',
        color: '#4169E1'
      },
      {
        id: 'mubert',
        name: 'Mubert',
        description: 'AI音乐生成工具，可创建各种风格的音乐',
        url: 'https://mubert.com/',
        icon: '🎵',
        color: '#32CD32'
      }
    ]
  },
  {
    id: 'productivity',
    name: '生产力工具',
    tools: [
      {
        id: 'notion-ai',
        name: 'Notion AI',
        description: 'Notion集成的AI助手，提升笔记和文档效率',
        url: 'https://www.notion.so/product/ai',
        icon: '📝',
        color: '#000000'
      },
      {
        id: 'jasper',
        name: 'Jasper',
        description: 'AI内容创作平台，帮助创建营销文案',
        url: 'https://www.jasper.ai/',
        icon: '✍️',
        color: '#FF7F50'
      },
      {
        id: 'grammarly',
        name: 'Grammarly',
        description: 'AI写作助手，提供语法检查和写作建议',
        url: 'https://www.grammarly.com/',
        icon: '📊',
        color: '#15C39A'
      },
      {
        id: 'codeium',
        name: 'Codeium',
        description: 'AI代码助手，提供代码补全和建议',
        url: 'https://codeium.com/',
        icon: '💻',
        color: '#007ACC'
      },
      {
        id: 'github-copilot',
        name: 'GitHub Copilot',
        description: 'AI编程助手，帮助开发者编写代码',
        url: 'https://github.com/features/copilot',
        icon: '👨‍💻',
        color: '#6E5494'
      },
      {
        id: 'descript',
        name: 'Descript',
        description: 'AI音频和视频编辑工具，支持文本编辑视频',
        url: 'https://www.descript.com/',
        icon: '🎙️',
        color: '#FF8C00'
      }
    ]
  }
]);

// 打开工具链接
const openTool = (url: string) => {
  window.open(url, '_blank');
};
</script>

<style scoped>
.ai-tools-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: 'Microsoft YaHei', Arial, sans-serif;
}

.page-title {
  font-size: 2.5rem;
  color: #333;
  text-align: center;
  margin-bottom: 10px;
}

.page-description {
  font-size: 0.9rem;
  color: #666;
  text-align: center;
  margin-bottom: 20px;
}

.categories {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.category-section {
  margin-bottom: 20px;
}

.category-title {
  font-size: 1.8rem;
  color: #4caf50;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.tool-card {
  display: flex;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  height: 120px;
}

.tool-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.tool-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  font-size: 2rem;
  color: white;
}

.tool-info {
  flex: 1;
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.tool-name {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #333;
}

.tool-description {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
  line-height: 1.4;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .tools-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .category-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .tools-grid {
    grid-template-columns: 1fr;
  }
  
  .tool-card {
    height: auto;
    min-height: 100px;
  }
}
</style>