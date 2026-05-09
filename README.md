# Kxiang 八字 — AI 智能八字排盘分析

基于 Next.js 构建的 AI 八字命理分析工具，使用 DeepSeek V4 Pro 大模型进行八字排盘与命理解读。

## 功能

- **八字排盘** — 输入出生年月日时，AI 自动推算八字四柱
- **深度分析** — 五行旺衰、十神格局、性格财运、感情婚姻、健康运势
- **实时流式** — SSE 流式输出，逐字显示分析结果
- **历史记录** — localStorage 保存所有分析记录，支持展开查看与删除

## 技术栈

- **Next.js 16** (App Router + Turbopack)
- **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion** — 页面动效与布局动画
- **react-markdown** — AI 输出 Markdown 渲染
- **DeepSeek V4 Pro API** — 大语言模型
- **localStorage** — 前端数据持久化

## 快速开始

```bash
# 安装依赖
npm install

# 配置 API Key
cp .env.example .env.local
# 编辑 .env.local，填入你的 DeepSeek API Key

# 启动开发服务器
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 即可使用。

## 环境变量

```bash
DEEPSEEK_API_KEY=your_api_key_here
```

## 项目结构

```
src/
├── app/
│   ├── api/chat/route.ts    # DeepSeek API SSE 代理
│   ├── bazi/page.tsx         # 八字排盘页面
│   ├── history/page.tsx      # 历史记录页面
│   ├── globals.css           # 全局样式
│   ├── layout.tsx            # 根布局
│   └── page.tsx              # 首页
├── components/
│   ├── ChatPanel.tsx          # AI 对话面板
│   ├── Navbar.tsx             # 导航栏
│   └── ResultCard.tsx         # 历史记录卡片
└── lib/
    ├── storage.ts             # localStorage 工具
    └── types.ts               # 类型定义
```

## 免责声明

本工具仅供娱乐参考，不构成任何人生决策建议。八字命理分析结果由 AI 生成，请理性看待。
