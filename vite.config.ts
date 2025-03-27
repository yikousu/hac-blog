import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'node:fs'
import path from 'node:path'

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'message-board-middleware',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          // 处理留言数据保存请求
          if (req.url === '/__update_messages' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
              body += chunk.toString();
            });

            req.on('end', () => {
              try {
                const { filePath, content } = JSON.parse(body);
                const fullPath = path.resolve(__dirname, filePath);
                
                // 安全检查：确保文件路径在项目目录内
                if (!fullPath.startsWith(path.resolve(__dirname))) {
                  res.statusCode = 403;
                  res.end(JSON.stringify({ error: '禁止访问项目目录外的文件' }));
                  return;
                }

                // 确保目录存在
                const dir = path.dirname(fullPath);
                if (!fs.existsSync(dir)) {
                  fs.mkdirSync(dir, { recursive: true });
                }

                // 写入文件
                fs.writeFileSync(fullPath, content, 'utf-8');
                res.statusCode = 200;
                res.end(JSON.stringify({ success: true }));
              } catch (error) {
                console.error('保存留言数据失败:', error);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: '保存留言数据失败' }));
              }
            });
          } else {
            next();
          }
        });
      }
    }
  ],
  base: "/hac-blog/",
  // server: {
  //   host: "0.0.0.0",
  // },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
