# CareerBridge (clickable prototype)

An AI career coach for **international students in Latvia**. This is a front-end prototype built for a university startup pitch. It uses **demo data only**: there is no backend and no real AI call. All companies, jobs and sources are fictional, and every `example.com` link is a placeholder.

The demo student is Aykhan Dadashov, an Information Systems student at ISMA in Riga, originally from Azerbaijan, working as a software developer.

## The problem

International students in Latvia struggle to find part-time and graduate jobs. They do not know the local CV format, many job ads require Latvian, they do not know which employers hire English speakers, and they lack interview practice and knowledge of work-permit rules.

## The four agents

The idea is a small team of AI agents that work together (inspired by awesome-llm-apps, ai-employees/markus multi-agent teams and Stanford STORM).

1. **CV Agent** checks the CV, gives an ATS and match score, and rewrites bullet points for a specific job.
2. **Job Scout Agent** finds jobs and filters them: English OK, student-friendly hours, remote or hybrid, with a match percentage.
3. **Company Research Agent** (STORM-style) writes a short cited company brief before you apply or interview. It asks questions from several points of view (applicant, hiring manager, employee) and cites a numbered source for each claim.
4. **Interview Coach Agent** runs a mock interview in chat and gives feedback with scores for clarity, relevance and STAR structure.

## Screens

- **Dashboard**: career readiness ring, profile completeness, next steps and what each agent did today.
- **CV Check**: sample CV, target job, fake "agent is thinking" animation, score 62 to 84, issues and before/after bullet rewrites.
- **Jobs**: 8 fictional jobs in Riga with working filter chips. "Tailor CV" opens CV Check with that job selected, "Research company" opens the brief.
- **Company brief**: Overview, Products, Culture and hiring, Likely interview questions, with [1][2] citations linked to a Sources list.
- **Interview Coach**: four scripted questions, typed or sample answers, scored feedback and a final summary.

Actions on one screen update others (for example applying CV fixes or finishing an interview raises the readiness score).

## Run it

No build step. Open `index.html` in a browser.

Files: `index.html`, `style.css`, `app.js` (vanilla HTML, CSS and JavaScript). Screens switch by URL hash, so there are no page reloads. It works down to 375px wide and is built with semantic HTML, labelled controls, visible focus and good contrast.

## What the real product would use

- **Next.js** for the web app
- **Node.js / NestJS** for the API and agent orchestration
- **PostgreSQL + pgvector** for user data, CVs and semantic search over jobs and company sources
- An **LLM API such as Claude** for the four agents (CV analysis, matching, research, interview feedback)
- **Job-board APIs** for live postings in Latvia

The prototype fakes all of this with canned text and a few small scoring rules in `app.js`.
