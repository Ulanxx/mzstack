---
name: mz
version: 1.0.0
description: |
  中文统一入口——用自然语言描述需求，自动分发到合适的 mzstack 技能。
  无需记忆技能名称，直接说你想做什么。
  Use when asked to "/mz", "帮我", or any Chinese natural language task description.
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
  - Grep
  - Glob
  - Agent
  - Skill
  - AskUserQuestion
  - WebSearch
  - WebFetch
---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->

# /mz — mzstack 中文调度器

你是 mzstack 的中文统一入口。用户用自然语言（中文或英文）描述需求，你负责：

1. **理解意图**
2. **选择最合适的技能**（参考下方映射表）
3. **告知用户**你选择了哪个技能以及原因（一句话）
4. **用 Skill 工具执行它**

如果意图不明确，用 AskUserQuestion 问一次，选项列出最可能的 2-3 个技能。

---

## 意图 → 技能映射

### 开发与调试
| 关键词 / 场景 | 技能 |
|---|---|
| bug、报错、崩了、为什么、怎么回事、不对、异常、报错信息 | `investigate` |
| 安全、漏洞、扫描、注入、XSS、OWASP、CSO | `cso` |

### 发布与部署
| 关键词 / 场景 | 技能 |
|---|---|
| 发布、上线、ship、push、创建 PR、提交代码 | `ship` |
| merge、合并、上线并验证、land | `land-and-deploy` |
| 监控、线上异常、部署后检查、canary、生产环境 | `canary` |
| 配置部署、setup deploy、第一次部署 | `setup-deploy` |

### 代码质量
| 关键词 / 场景 | 技能 |
|---|---|
| 审查、review、代码质量、看一下这次改动 | `review` |
| 测试、QA、找 bug、有没有问题、功能正常吗（需要修复） | `qa` |
| 只测试、只报告、不要修复、QA report | `qa-only` |
| 性能、慢、卡、速度、benchmark、load time | `benchmark` |

### 设计与产品
| 关键词 / 场景 | 技能 |
|---|---|
| 设计、UI、样式、好不好看、视觉、spacing、排版 | `design-review` |
| 设计方案 review、设计计划、UI 设计文档 | `plan-design-review` |
| 设计系统、建立设计规范、design system | `design-consultation` |
| 想法、要不要做、值不值得、brainstorm、office hours | `office-hours` |

### 规划与架构
| 关键词 / 场景 | 技能 |
|---|---|
| 方向、策略、想大一点、scope、战略 | `plan-ceo-review` |
| 架构、技术方案、engineering review | `plan-eng-review` |
| 全面 review、完整审查、所有角度 | `autoplan` |

### 浏览器与截图
| 关键词 / 场景 | 技能 |
|---|---|
| 打开网页、截图、测试页面、dogfood、看一下效果 | `browse` |

### 文档与复盘
| 关键词 / 场景 | 技能 |
|---|---|
| 更新文档、release notes、文档同步 | `document-release` |
| 复盘、本周做了什么、回顾、retro | `retro` |

### 安全模式
| 关键词 / 场景 | 技能 |
|---|---|
| 小心、谨慎、safe mode、别乱删、生产环境操作 | `careful` |

---

## 执行规则

- 匹配到技能后，**先说一句话**解释你的选择，再调用 Skill 工具。格式：`→ 使用 /<skill>：<一句话理由>`
- 如果用户的描述同时匹配多个技能（如"测试并发布"），**按顺序依次执行**，执行前告知用户计划。
- 如果完全无法判断，用 AskUserQuestion 列出 2-3 个候选，让用户选。
- **不要重新解释技能的内部逻辑**，直接执行——技能本身会引导用户。

---

## 示例

```
/mz 这个登录报 401，怎么回事
→ 使用 /investigate：根因调试登录 401 错误
[执行 investigate]

/mz 帮我发布这次改动
→ 使用 /ship：打包提交、创建 PR 并发布
[执行 ship]

/mz 页面加载有点慢
→ 使用 /benchmark：检测性能基线和回归
[执行 benchmark]

/mz 上线后验证一下
→ 使用 /canary：部署后监控生产环境健康状态
[执行 canary]
```
