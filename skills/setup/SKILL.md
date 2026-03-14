---
name: scopi:setup
description: Brand identity interview — deep setup wizard that captures your voice, audience, visual identity, and generates a unique theme
user_invocable: true
---

# /scopi:setup — Brand Identity Interview

You are running the Scopi Card News setup. This is NOT a simple form — it's an interview designed to capture the user's creative identity so every card news feels uniquely theirs.

## Step 1: Welcome + Language

Display this banner:

```
  ╔══════════════════════════════════════════════╗
  ║                                              ║
  ║        S C O P I   C A R D N E W S           ║
  ║        ────────────────────────────           ║
  ║        Navigate your story.                  ║
  ║                                              ║
  ║        v2.3 · 7 Expert Agents                ║
  ║        VS Design + Agent Teams               ║
  ║                                              ║
  ╚══════════════════════════════════════════════╝
```

Use AskUserQuestion:

> **언어를 선택해 주세요 / Choose your language:**
>
> 1. 한국어
> 2. English

Store as `language`. All subsequent questions should be in the chosen language.

---

## Step 2: Content Type

Use AskUserQuestion:

**Korean**:
> **어떤 종류의 콘텐츠를 만드시나요?**
>
> 1. 학술/연구 — 논문, 연구 결과, 교육 콘텐츠
> 2. 비즈니스 — 제품 소개, 케이스 스터디, 산업 인사이트
> 3. 퍼스널 브랜드 — 지식 공유, 튜토리얼, 팁
> 4. 기타 — 직접 설명해 주세요

**English**:
> **What type of content do you create?**
>
> 1. Academic — research, papers, educational content
> 2. Business — products, case studies, industry insights
> 3. Personal Brand — thought leadership, tutorials, tips
> 4. Other — tell me more

Store as `identity.contentType`.

---

## Step 3: Audience Deep-Dive

Use AskUserQuestion (free-text):

**Korean**:
> **당신의 콘텐츠를 주로 누가 읽나요?**
> (예: "교육학 박사과정 학생들, 초임 교수, AI에 관심 있는 교육 연구자들")

**English**:
> **Who reads your content?**
> (e.g., "PhD students in education, early-career faculty, researchers interested in AI")

Store as `identity.audience`.

Then use AskUserQuestion (free-text):

**Korean**:
> **그 독자들이 겪는 가장 큰 어려움은 무엇인가요?**
> (예: "문헌 리뷰에 너무 오래 걸림, APA 포맷팅이 복잡, AI 도구를 써보고 싶은데 뭘 써야 할지 모름")

**English**:
> **What's their biggest pain point?**
> (e.g., "Literature reviews take forever, APA formatting is complex, want to use AI tools but don't know which ones")

Store as `identity.audiencePainPoints`.

---

## Step 4: Voice & Tone

Use AskUserQuestion:

**Korean**:
> **당신의 소통 스타일은 어떤가요?**
>
> 1. 전문적 + 따뜻한 — 스마트한 동료에게 커피 마시며 설명하는 느낌
> 2. 전문적 + 권위적 — 학회 발표처럼 정확하고 체계적
> 3. 캐주얼 + 친근한 — 후배에게 팁 알려주는 느낌
> 4. 직접 설명할게요 (자유 입력)

**English**:
> **How would you describe your communication style?**
>
> 1. Professional + warm — like explaining to a smart colleague over coffee
> 2. Professional + authoritative — precise, systematic, conference-level
> 3. Casual + friendly — like giving tips to a junior colleague
> 4. I'll describe it myself (free input)

If they choose 4, ask for a free-text description.

Store as `identity.voice`.

---

## Step 5: Visual Identity

Use AskUserQuestion:

**Korean**:
> **시각적으로 어떤 느낌을 원하시나요?**
>
> 1. 따뜻하고 학술적 — 아이보리, 테라코타, 세리프 서체. 논문 느낌이지만 현대적
> 2. 다크 + 프리미엄 — 네이비/블랙, 골드 포인트. 밤에 읽는 학술지 느낌
> 3. 미니멀 + 클린 — 화이트, 블랙, 단일 포인트 컬러. 스위스 디자인
> 4. 테크 + 모던 — 다크 배경, 네온 포인트. 코드/터미널 미학
> 5. 직접 설명할게요 — 원하는 분위기, 컬러, 레퍼런스 알려주세요

If they choose 5, ask: "원하는 분위기, 대표 컬러, 참고 브랜드 등을 자유롭게 알려주세요."

Store as `identity.visualStyle`.

---

## Step 6: Content Priority

Use AskUserQuestion:

**Korean**:
> **카드뉴스에서 가장 중요하게 생각하는 것은?** (복수 선택 가능, 쉼표로 구분)
>
> 1. 정보 전달 — 정확하고 체계적인 내용
> 2. 감성/스토리 — 공감과 감정적 연결
> 3. 비주얼 임팩트 — 스크롤을 멈추는 시각적 충격
> 4. 브랜딩 — 일관된 브랜드 인식 구축

Store as `identity.priority`.

---

## Step 7: Capture Targets

Use AskUserQuestion (free-text):

**Korean**:
> **자주 소개하거나 리뷰하는 서비스/도구/웹사이트가 있나요?**
> 실제 화면 캡처를 통해 카드뉴스에 포함할 수 있습니다.
> (예: "elicit.com, consensus.app, claude.ai")
> 없으면 "없음"이라고 입력해 주세요.

**English**:
> **Do you frequently feature or review specific tools/services/websites?**
> We can capture real screenshots to include in your card news.
> (e.g., "elicit.com, consensus.app, claude.ai")
> Type "none" if not applicable.

Parse URLs and store as `identity.captureTargets` array.

---

## Step 8: Brand Basics

Use AskUserQuestion:

**Korean**:
> **브랜드 기본 정보를 알려주세요:**
> - 브랜드 이름 (예: Scopi Lab)
> - 소셜 핸들 (예: @scopi.lab)
> - 저자 이름 (슬라이드에 표시됨)
> - 태그라인 (선택, 예: "AI × Academia")
>
> 형식: 이름, 핸들, 저자, 태그라인

**English**:
> **Brand basics:**
> - Brand name (e.g., Scopi Lab)
> - Social handle (e.g., @scopi.lab)
> - Author name (shown on slides)
> - Tagline (optional, e.g., "AI × Academia")
>
> Format: name, handle, author, tagline

Parse and store as `brand`.

---

## Step 9: Platform

Use AskUserQuestion:

**Korean**:
> **주 타겟 플랫폼은?**
>
> 1. Instagram (1080×1350, 4:5 세로)
> 2. LinkedIn (1920×1080, 16:9 가로)
> 3. Twitter/X (1600×900)
> 4. 멀티플랫폼 (기본 1080×1350)

**English**: Same options in English.

Set dimensions accordingly. Store as `platform` and `dimensions`.

---

## Step 10: Agent Teams (Optional)

Use AskUserQuestion:

**Korean**:
> **에이전트 팀 모드를 활성화할까요?**
>
> 활성화하면 카드뉴스 생성 시 에이전트들이 실시간으로 토론하며 품질을 높입니다.
> (예: GYEOL이 디자인하면 JURI가 즉시 저작권 확인, MARU가 독자 반응 예측)
>
> - 토큰 비용 ~3-5배 증가
> - 학술/연구 콘텐츠에 특히 유용
> - Claude Code v2.1.32+ 필요
>
> 1. 활성화 (추천: 학술 콘텐츠)
> 2. 건너뛰기 (일반 순차 파이프라인 사용)

**English**:
> **Enable Agent Teams mode?**
>
> When enabled, agents debate and refine each other's work in real-time.
> (e.g., GYEOL designs → JURI checks copyright immediately → MARU predicts audience reaction)
>
> - Token cost ~3-5x higher
> - Especially useful for academic/research content
> - Requires Claude Code v2.1.32+
>
> 1. Enable (recommended for academic content)
> 2. Skip (use standard sequential pipeline)

If the user chooses 1:
1. Check if `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` is already set in `~/.claude/settings.json`
2. If NOT set, ask: "settings.json에 Agent Teams 플래그를 추가할까요? (한 번만 설정하면 됩니다)"
3. If user agrees, read `~/.claude/settings.json`, add `"env": { "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1" }` to it, and write back
4. Store `pipeline.teamMode = true` in config

If the user chooses 2:
- Store `pipeline.teamMode = false` in config
- The pipeline will always use sequential subagent mode

Note: Even with `teamMode = true`, `/scopi:generate` auto-detects the best mode per content. Simple topics still use the faster sequential pipeline.

---

## Step 11: Dynamic Theme Generation (GYEOL)

Now, based on ALL the interview answers, dispatch GYEOL (Visual Architect) to generate a unique theme.

GYEOL should consider:
- `identity.contentType` → academic = warm/serif, business = clean/sans, tech = dark/mono
- `identity.visualStyle` → user's stated preference
- `identity.voice` → formal = structured palette, casual = playful accents
- `identity.priority` → visual impact = bolder contrasts, information = cleaner hierarchy
- `brand` → brand name/personality influences color choices

GYEOL generates a complete color palette and font pairing:

```json
{
  "name": "[Generated theme name]",
  "description": "[One-line description reflecting the brand]",
  "colors": {
    "warmBg": "#...",
    "accent": "#...",
    "accentBg": "#...",
    "accentText": "#...",
    "accentTextSoft": "rgba(...)",
    "textPrimary": "#...",
    "textSecondary": "#...",
    "textTertiary": "#...",
    "cardBg": "#...",
    "accentSoft": "rgba(...)",
    "accentMedium": "rgba(...)",
    "accentBorder": "rgba(...)",
    "termBg": "#...",
    "termHeader": "#...",
    "termPrompt": "#...",
    "termText": "#...",
    "termGreen": "#...",
    "termYellow": "#...",
    "termComment": "#..."
  },
  "fonts": {
    "heading": "...",
    "body": "...",
    "code": "..."
  }
}
```

Present the generated theme to the user with a brief description:

> 🎨 **GYEOL이 당신의 브랜드 테마를 생성했습니다:**
>
> **[Theme Name]** — [description]
> 배경: [warmBg] · 액센트: [accent] · 텍스트: [textPrimary]
> 헤딩: [heading font] · 본문: [body font]
>
> 마음에 드시나요? (yes / 수정할 부분을 알려주세요)

If user wants changes, GYEOL adjusts. If yes, proceed.

---

## Step 12: Generate Config

Write `scopi.config.json` with the FULL interview data:

```json
{
  "language": "ko",
  "brand": { "name": "...", "handle": "...", "author": "...", "tagline": "..." },
  "identity": {
    "contentType": "...",
    "audience": "...",
    "audiencePainPoints": "...",
    "voice": "...",
    "visualStyle": "...",
    "priority": "...",
    "captureTargets": ["..."]
  },
  "theme": {
    "name": "...",
    "description": "...",
    "colors": { ... },
    "fonts": { ... }
  },
  "dimensions": { "width": 1080, "height": 1350 },
  "platform": "instagram",
  "agents": {
    "active": ["nara", "gyeol", "gana", "dari", "binna", "juri", "maru"],
    "custom": []
  },
  "series": [],
  "pipeline": {
    "retina": true,
    "format": ["png", "pdf"],
    "capture": true,
    "teamMode": false,
    "teamDisplay": "auto",
    "teamDebate": true,
    "strictQA": true,
    "minQAScore": 3.0
  }
}
```

---

## Step 13: Confirmation

**Korean**:
```
  ✅ 브랜드 설정 완료!

  📋 요약:
     브랜드: [name] ([handle])
     언어: [한국어/English]
     테마: [theme name] — [description]
     플랫폼: [platform] ([width]×[height])
     에이전트: 7명 활성
     팀 모드: [활성/비활성] — [활성 시: "에이전트 실시간 토론"]
     캡처 대상: [count]개 등록

  🚀 시작할 준비가 됐습니다!
     /scopi:content  — 콘텐츠 아이디어 브레인스토밍
     /scopi:generate — 카드뉴스 생성 (자동 모드 감지)
     /scopi:help     — 전체 명령어 보기
```

**English**: Same in English.
