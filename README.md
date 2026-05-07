# DevToolbox

![DevToolbox](https://img.shields.io/badge/DevToolbox-开发者工具箱-blue?style=for-the-badge)

**实用工具，触手可及** - 集成多种开发者常用工具的在线工具网站

## 🎯 功能特性

- 🚀 **纯前端实现**，无需安装，即开即用
- 🎨 **苹果官网设计风格**，简洁优雅
- 🌓 **支持深色/浅色主题切换**
- 📱 **完美支持响应式布局**（桌面、平板、手机）
- 🔒 **数据不离开浏览器**，安全可靠
- ⚡ **快速加载**，无服务器延迟

## 🛠️ 工具列表

本项目包含 **13个开发者常用工具**：

| 序号 | 工具名称 | 功能描述 |
|------|----------|----------|
| 1 | **进制转换** | 在 2/8/10/16/32/64 进制之间自由转换，支持大整数（BigInt） |
| 2 | **Cron 表达式解析** | 解析 Cron 表达式，查看下次执行时间，验证定时任务配置 |
| 3 | **浮点数转换** | 查看单精度/双精度浮点数的二进制表示，深入理解 IEEE 754 |
| 4 | **JSON 格式化** | 格式化、压缩、验证 JSON 数据，支持大文件和循环引用检测 |
| 5 | **正则表达式测试** | 实时测试正则表达式，高亮匹配结果，内置超时保护 |
| 6 | **时间戳转换** | Unix 时间戳与日期时间互转，支持多时区和毫秒级精度 |
| 7 | **UUID 生成器** | 生成 v1/v4 UUID，支持批量生成和自定义格式 |
| 8 | **Base64 编解码** | 文本和文件的 Base64 编码与解码，支持大文件分片处理 |
| 9 | **Markdown 预览** | 实时编辑 Markdown 并预览效果，支持导出 HTML |
| 10 | **二维码生成** | 将文本或链接转换为二维码，支持自定义尺寸和容错级别 |
| 11 | **Hash 计算** | 计算文本或文件的 MD5/SHA1/SHA256/SHA512 哈希值 |
| 12 | **URL 编解码** | URL 编码与解码，支持批量处理和组件级别编码 |
| 13 | **颜色转换** | HEX、RGB、HSL 颜色格式互转，实时预览和调色盘 |

## 🚀 在线演示

**访问在线版本：** https://yinjinqi.github.io/devtoolbox/

## 💻 本地运行

### 方法一：直接打开
直接用浏览器打开 `index.html` 文件即可。

### 方法二：本地 HTTP 服务器（推荐）
使用 Python 启动本地服务器：

```bash
# 进入项目目录
cd /c/Users/Administrator/WorkBuddy/20260507214141

# Python 3
python -m http.server 8080

# 访问 http://localhost:8080
```

或使用 Node.js：

```bash
# 安装 http-server
npm install -g http-server

# 启动服务器
http-server -p 8080

# 访问 http://localhost:8080
```

## 🛠️ 技术栈

- **前端框架**：纯 HTML5 / CSS3 / JavaScript (ES6+)
- **样式框架**：Tailwind CSS (CDN)
- **动画效果**：原生 IntersectionObserver API
- **代码高亮**：Prism.js (Markdown 预览工具)
- **二维码生成**：qrcode.js
- **Markdown 解析**：marked.js
- **无后端依赖**：所有计算在浏览器端完成

## 📱 响应式设计

- **桌面端** (>1200px)：3列网格布局
- **平板端** (768px-1200px)：2列网格布局
- **手机端** (<768px)：1列网格布局

## 🌐 浏览器兼容性

- ✅ Chrome/Edge (推荐)
- ✅ Firefox
- ✅ Safari
- ✅ 其他现代浏览器

## 🔒 隐私安全

- **纯前端实现**：所有数据和处理都在您的浏览器中完成
- **无服务器交互**：不会上传任何数据到服务器
- **无跟踪代码**：不收集任何用户数据
- **开源透明**：代码完全开源，可自行审查

## 📖 使用指南

### 首页
1. 打开网站后，可以看到所有工具的卡片网格
2. 使用顶部搜索框可以快速过滤工具
3. 点击右上角的月亮/太阳图标切换深色/浅色主题
4. 滚动页面可以看到卡片的渐现动画效果

### 工具页面
每个工具页面都包含：
- **输入区域**：输入或粘贴需要处理的数据
- **执行按钮**：点击开始处理
- **结果区域**：查看处理结果
- **复制按钮**：一键复制结果到剪贴板
- **清空按钮**：快速清空输入和输出

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 开发指南
1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 📄 许可证

本项目基于 **MIT License** 开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- 设计灵感来自 [Apple 官网](https://www.apple.com/)
- 图标使用 [Heroicons](https://heroicons.com/)
- 字体使用系统默认字体栈

## 📧 联系方式

- GitHub: [@yinjinqi](https://github.com/yinjinqi)
- 项目链接: [https://github.com/yinjinqi/devtoolbox](https://github.com/yinjinqi/devtoolbox)

---

⭐ 如果这个项目对您有帮助，请给它一个星标！
