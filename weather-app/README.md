## weather-app README 应该写的内容：

### 项目简介
基于和风天气API的天气预报应用，支持实时天气、7日预报、城市搜索、收藏管理

### 技术选型及原因
| 技术 | 为什么选它 | 不选什么 |
|-----|-----------|---------|
| React Query | 自动缓存、轮询、错误处理，减少手写逻辑 | 原生fetch需要手写所有状态管理 |
| Zustand | 轻量（1KB）、无Provider包裹、persist内置 | Redux配置复杂、学习成本高 |
| TypeScript | 类型安全，减少运行时错误 | JS重构时容易出bug |
| Vite | HMR快、配置简单 | Webpack配置复杂 |

### 核心难点与解决
1. 经纬度定位API返回延迟 → 用React Query的staleTime缓存5分钟
2. 城市搜索防抖 → 自定义useDebouncedValue hook
3. 收藏列表持久化 → Zustand persist middleware
4. 主题切换全局生效 → Zustand + DOM class同步

### 性能优化
- 骨架屏减少白屏时间
- React Query缓存减少重复请求
- Zustand精准订阅避免不必要的重渲染