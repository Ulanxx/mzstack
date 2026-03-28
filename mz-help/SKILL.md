---
name: mz-help
preamble-tier: 1
version: 1.0.0
description: |
  Smart skill guide — tells you which mzstack skill to use for any task.
  Shows a categorized skill reference and recommends the right skill(s) based on
  what you want to do. Also shows simplified workflow shortcuts.
  Use when asked "which skill should I use", "mz-help", "what command do I use",
  or when unsure which skill fits your task.
allowed-tools:
  - AskUserQuestion
  - Read
---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->

## Preamble (run first)

```bash
_UPD=$(~/.claude/skills/mzstack/bin/mzstack-update-check 2>/dev/null || .claude/skills/mzstack/bin/mzstack-update-check 2>/dev/null || true)
[ -n "$_UPD" ] && echo "$_UPD" || true
mkdir -p ~/.mzstack/sessions
touch ~/.mzstack/sessions/"$PPID"
_SESSIONS=$(find ~/.mzstack/sessions -mmin -120 -type f 2>/dev/null | wc -l | tr -d ' ')
find ~/.mzstack/sessions -mmin +120 -type f -delete 2>/dev/null || true
_CONTRIB=$(~/.claude/skills/mzstack/bin/mzstack-config get mzstack_contributor 2>/dev/null || true)
_PROACTIVE=$(~/.claude/skills/mzstack/bin/mzstack-config get proactive 2>/dev/null || echo "true")
_BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
echo "BRANCH: $_BRANCH"
echo "PROACTIVE: $_PROACTIVE"
source <(~/.claude/skills/mzstack/bin/mzstack-repo-mode 2>/dev/null) || true
REPO_MODE=${REPO_MODE:-unknown}
echo "REPO_MODE: $REPO_MODE"
_LAKE_SEEN=$([ -f ~/.mzstack/.completeness-intro-seen ] && echo "yes" || echo "no")
echo "LAKE_INTRO: $_LAKE_SEEN"
_TEL=$(~/.claude/skills/mzstack/bin/mzstack-config get telemetry 2>/dev/null || true)
_TEL_PROMPTED=$([ -f ~/.mzstack/.telemetry-prompted ] && echo "yes" || echo "no")
_TEL_START=$(date +%s)
_SESSION_ID="$$-$(date +%s)"
echo "TELEMETRY: ${_TEL:-off}"
echo "TEL_PROMPTED: $_TEL_PROMPTED"
mkdir -p ~/.mzstack/analytics
echo '{"skill":"mz-help","ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","repo":"'$(basename "$(git rev-parse --show-toplevel 2>/dev/null)" 2>/dev/null || echo "unknown")'"}'  >> ~/.mzstack/analytics/skill-usage.jsonl 2>/dev/null || true
# zsh-compatible: use find instead of glob to avoid NOMATCH error
for _PF in $(find ~/.mzstack/analytics -maxdepth 1 -name '.pending-*' 2>/dev/null); do [ -f "$_PF" ] && ~/.claude/skills/mzstack/bin/mzstack-telemetry-log --event-type skill_run --skill _pending_finalize --outcome unknown --session-id "$_SESSION_ID" 2>/dev/null || true; break; done
```

If `PROACTIVE` is `"false"`, do not proactively suggest mzstack skills — only invoke
them when the user explicitly asks. The user opted out of proactive suggestions.

If output shows `UPGRADE_AVAILABLE <old> <new>`: read `~/.claude/skills/mzstack/mzstack-upgrade/SKILL.md` and follow the "Inline upgrade flow" (auto-upgrade if configured, otherwise AskUserQuestion with 4 options, write snooze state if declined). If `JUST_UPGRADED <from> <to>`: tell user "Running mzstack v{to} (just updated!)" and continue.

If `LAKE_INTRO` is `no`: Before continuing, introduce the Completeness Principle.
Tell the user: "mzstack follows the **Boil the Lake** principle — always do the complete
thing when AI makes the marginal cost near-zero. Read more: https://garryslist.org/posts/boil-the-ocean"
Then offer to open the essay in their default browser:

```bash
open https://garryslist.org/posts/boil-the-ocean
touch ~/.mzstack/.completeness-intro-seen
```

Only run `open` if the user says yes. Always run `touch` to mark as seen. This only happens once.

If `TEL_PROMPTED` is `no` AND `LAKE_INTRO` is `yes`: After the lake intro is handled,
ask the user about telemetry. Use AskUserQuestion:

> Help mzstack get better! Community mode shares usage data (which skills you use, how long
> they take, crash info) with a stable device ID so we can track trends and fix bugs faster.
> No code, file paths, or repo names are ever sent.
> Change anytime with `mzstack-config set telemetry off`.

Options:
- A) Help mzstack get better! (recommended)
- B) No thanks

If A: run `~/.claude/skills/mzstack/bin/mzstack-config set telemetry community`

If B: ask a follow-up AskUserQuestion:

> How about anonymous mode? We just learn that *someone* used mzstack — no unique ID,
> no way to connect sessions. Just a counter that helps us know if anyone's out there.

Options:
- A) Sure, anonymous is fine
- B) No thanks, fully off

If B→A: run `~/.claude/skills/mzstack/bin/mzstack-config set telemetry anonymous`
If B→B: run `~/.claude/skills/mzstack/bin/mzstack-config set telemetry off`

Always run:
```bash
touch ~/.mzstack/.telemetry-prompted
```

This only happens once. If `TEL_PROMPTED` is `yes`, skip this entirely.

## Contributor Mode

If `_CONTRIB` is `true`: you are in **contributor mode**. You're an mzstack user who also helps make it better.

**At the end of each major workflow step** (not after every single command), reflect on the mzstack tooling you used. Rate your experience 0 to 10. If it wasn't a 10, think about why. If there is an obvious, actionable bug OR an insightful, interesting thing that could have been done better by mzstack code or skill markdown — file a field report. Maybe our contributor will help make us better!

**Calibration — this is the bar:** For example, `$B js "await fetch(...)"` used to fail with `SyntaxError: await is only valid in async functions` because mzstack didn't wrap expressions in async context. Small, but the input was reasonable and mzstack should have handled it — that's the kind of thing worth filing. Things less consequential than this, ignore.

**NOT worth filing:** user's app bugs, network errors to user's URL, auth failures on user's site, user's own JS logic bugs.

**To file:** write `~/.mzstack/contributor-logs/{slug}.md` with **all sections below** (do not truncate — include every section through the Date/Version footer):

```
# {Title}

Hey mzstack team — ran into this while using /{skill-name}:

**What I was trying to do:** {what the user/agent was attempting}
**What happened instead:** {what actually happened}
**Rating:** {0-10} — {one sentence on why it wasn't a 10}

## Steps to reproduce
1. {step}

## Raw output
```
{paste the actual error or unexpected output here}
```

## What would make this a 10
{one sentence: what mzstack should have done differently}

**Date:** {YYYY-MM-DD} | **Version:** {mzstack version} | **Skill:** /{skill}
```

Slug: lowercase, hyphens, max 60 chars (e.g. `browse-js-no-await`). Skip if file already exists. Max 3 reports per session. File inline and continue — don't stop the workflow. Tell user: "Filed mzstack field report: {title}"

## Completion Status Protocol

When completing a skill workflow, report status using one of:
- **DONE** — All steps completed successfully. Evidence provided for each claim.
- **DONE_WITH_CONCERNS** — Completed, but with issues the user should know about. List each concern.
- **BLOCKED** — Cannot proceed. State what is blocking and what was tried.
- **NEEDS_CONTEXT** — Missing information required to continue. State exactly what you need.

### Escalation

It is always OK to stop and say "this is too hard for me" or "I'm not confident in this result."

Bad work is worse than no work. You will not be penalized for escalating.
- If you have attempted a task 3 times without success, STOP and escalate.
- If you are uncertain about a security-sensitive change, STOP and escalate.
- If the scope of work exceeds what you can verify, STOP and escalate.

Escalation format:
```
STATUS: BLOCKED | NEEDS_CONTEXT
REASON: [1-2 sentences]
ATTEMPTED: [what you tried]
RECOMMENDATION: [what the user should do next]
```

## Telemetry (run last)

After the skill workflow completes (success, error, or abort), log the telemetry event.
Determine the skill name from the `name:` field in this file's YAML frontmatter.
Determine the outcome from the workflow result (success if completed normally, error
if it failed, abort if the user interrupted).

**PLAN MODE EXCEPTION — ALWAYS RUN:** This command writes telemetry to
`~/.mzstack/analytics/` (user config directory, not project files). The skill
preamble already writes to the same directory — this is the same pattern.
Skipping this command loses session duration and outcome data.

Run this bash:

```bash
_TEL_END=$(date +%s)
_TEL_DUR=$(( _TEL_END - _TEL_START ))
rm -f ~/.mzstack/analytics/.pending-"$_SESSION_ID" 2>/dev/null || true
~/.claude/skills/mzstack/bin/mzstack-telemetry-log \
  --skill "SKILL_NAME" --duration "$_TEL_DUR" --outcome "OUTCOME" \
  --used-browse "USED_BROWSE" --session-id "$_SESSION_ID" 2>/dev/null &
```

Replace `SKILL_NAME` with the actual skill name from frontmatter, `OUTCOME` with
success/error/abort, and `USED_BROWSE` with true/false based on whether `$B` was used.
If you cannot determine the outcome, use "unknown". This runs in the background and
never blocks the user.

## Plan Status Footer

When you are in plan mode and about to call ExitPlanMode:

1. Check if the plan file already has a `## GSTACK REVIEW REPORT` section.
2. If it DOES — skip (a review skill already wrote a richer report).
3. If it does NOT — run this command:

\`\`\`bash
~/.claude/skills/mzstack/bin/mzstack-review-read
\`\`\`

Then write a `## GSTACK REVIEW REPORT` section to the end of the plan file:

- If the output contains review entries (JSONL lines before `---CONFIG---`): format the
  standard report table with runs/status/findings per skill, same format as the review
  skills use.
- If the output is `NO_REVIEWS` or empty: write this placeholder table:

\`\`\`markdown
## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|--------|---------|-----|------|--------|----------|
| CEO Review | \`/plan-ceo-review\` | Scope & strategy | 0 | — | — |
| Codex Review | \`/codex review\` | Independent 2nd opinion | 0 | — | — |
| Eng Review | \`/plan-eng-review\` | Architecture & tests (required) | 0 | — | — |
| Design Review | \`/plan-design-review\` | UI/UX gaps | 0 | — | — |

**VERDICT:** NO REVIEWS YET — run \`/autoplan\` for full review pipeline, or individual reviews above.
\`\`\`

**PLAN MODE EXCEPTION — ALWAYS RUN:** This writes to the plan file, which is the one
file you are allowed to edit in plan mode. The plan file review report is part of the
plan's living status.

# /mz-help — 告诉你用哪个技能

---

## Step 1: 你想做什么？

Use AskUserQuestion with this prompt:

```
你想做什么？
```

Options:
- 我有一个想法，想探索和规划
- 我写完了代码，准备提 PR / 合并
- 我想测试 / QA 一个页面
- 我的代码有 bug，需要调试
- 我想做设计审查或视觉优化
- 我想做安全审查
- 我想看回顾 / 统计最近工作
- 查看完整技能列表

---

## Step 2: 根据回答推荐技能

### 场景 A：我有一个想法，想探索和规划

推荐 **精简规划流程**（见下方 Step 3）。

---

### 场景 B：我写完了代码，准备提 PR / 合并

按顺序执行：

| 步骤 | 指令 | 说明 |
|------|------|------|
| 1 | `/review` | 代码审查，检查 SQL 安全、逻辑问题 |
| 2 | `/ship` | 运行测试、bump 版本、创建 PR |
| 3 | `/land-and-deploy` | 合并、等待 CI、验证上线 |

---

### 场景 C：我想测试 / QA 一个页面

| 需求 | 指令 |
|------|------|
| 测试并自动修复 bug | `/qa` |
| 只生成 bug 报告，不修改代码 | `/qa-only` |
| 上线后持续监控 | `/canary` |
| 性能 / 加载速度测试 | `/benchmark` |

---

### 场景 D：我的代码有 bug，需要调试

用 `/investigate`。

它会先找根因，再修复。绝不跳过根因分析。

---

### 场景 E：我想做设计审查或视觉优化

| 需求 | 指令 |
|------|------|
| 审查已有页面的视觉问题并修复 | `/design-review` |
| 从零创建设计系统 | `/design-consultation` |
| 审查 PLAN.md 中的设计方案 | `/plan-design-review` |

---

### 场景 F：我想做安全审查

用 `/cso`。

支持两种模式：日常扫描（高置信度）和月度深度审计。

---

### 场景 G：我想看回顾 / 统计最近工作

用 `/retro`。

分析 commit 历史、工作模式、代码质量，支持团队成员维度。

---

### 场景 H：查看完整技能列表

打印完整参考表（见下方）。

---

## Step 3: 精简规划流程

原始流程太长：`/office-hours` → `/brainstorming` → `/plan-ceo-review` → `/plan-eng-review`

**精简版只需两步：**

```
步骤 1：/office-hours     ← 把想法变成设计文档（PLAN.md）
步骤 2：/autoplan         ← 自动串联 CEO + 设计 + 工程 三轮审查
```

`/autoplan` 内置自动决策，不会反复问你问题。它读取 PLAN.md，完成全部评审，
只在真正需要你判断的"品味决策"时才提问。

**如果想法还很模糊，可以先加 `/brainstorming`：**

```
/brainstorming → /office-hours → /autoplan
```

---

## 完整技能速查表

### 规划 & 策略

| 技能 | 用途 |
|------|------|
| `/office-hours` | 验证想法，6 个强制问题，输出设计文档 |
| `/brainstorming` | 探索功能需求，发散思维 |
| `/plan-ceo-review` | CEO 视角审查计划，扩展或聚焦范围 |
| `/plan-design-review` | 设计师视角审查计划 |
| `/plan-eng-review` | 工程视角审查计划，架构和边界情况 |
| `/autoplan` | **推荐** 自动串联 CEO+设计+工程审查 |

### 代码质量 & 合并

| 技能 | 用途 |
|------|------|
| `/review` | PR 代码审查（SQL 安全、逻辑问题等） |
| `/ship` | 创建 PR（运行测试+版本+CHANGELOG） |
| `/land-and-deploy` | 合并 PR + 等待 CI + 验证上线 |
| `/codex` | 第二意见（独立代码审查或对话） |

### 测试 & QA

| 技能 | 用途 |
|------|------|
| `/qa` | 全自动 QA：测试+找 bug+修复 |
| `/qa-only` | 只报告 bug，不修改代码 |
| `/benchmark` | 性能基线测试，检测回归 |
| `/canary` | 上线后持续监控 |

### 调试 & 安全

| 技能 | 用途 |
|------|------|
| `/investigate` | 系统性 debug，强制根因分析 |
| `/cso` | OWASP Top 10 + STRIDE 安全审计 |

### 设计

| 技能 | 用途 |
|------|------|
| `/design-review` | 视觉 QA + 修复（已有页面） |
| `/design-consultation` | 从零创建设计系统 |
| `/plan-design-review` | 审查计划中的设计方案 |

### 文档 & 回顾

| 技能 | 用途 |
|------|------|
| `/document-release` | 上线后同步文档（README/CHANGELOG 等） |
| `/retro` | 每周工程回顾 |

### 安全模式 & 工具

| 技能 | 用途 |
|------|------|
| `/careful` | 危险操作前警告 |
| `/freeze` | 限制编辑范围到指定目录 |
| `/guard` | 完整安全模式（careful + freeze） |
| `/setup-deploy` | 配置一次性部署设置 |
| `/find-skills` | 搜索和安装新技能 |
| `/mz-help` | 本帮助（你现在在用的） |

---

## Step 4: 确认推荐

根据用户的回答，用一句话总结推荐的技能，并说明原因。
如果流程有多个步骤，列出有序步骤。
