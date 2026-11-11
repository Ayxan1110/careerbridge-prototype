/* CareerBridge prototype
   Vanilla JS, demo data only. There is no backend and no AI call anywhere:
   every "agent" answer below is canned text or a tiny scoring rule. */

(() => {
  "use strict";

  /* ------------------------------------------------------------------
     Helpers
  ------------------------------------------------------------------ */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wait = (ms) => new Promise((r) => setTimeout(r, reduceMotion ? Math.min(ms, 60) : ms));
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const icon = (id) => `<svg aria-hidden="true"><use href="#${id}"/></svg>`;

  let toastTimer;
  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg;
    el.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-on"), 3200);
  }

  function setRing(el, value, label) {
    el.style.setProperty("--pct", "0");
    requestAnimationFrame(() => requestAnimationFrame(() => el.style.setProperty("--pct", String(value))));
    if (label) el.setAttribute("aria-label", label);
  }

  /* ------------------------------------------------------------------
     Demo data (all companies are fictional)
  ------------------------------------------------------------------ */
  const JOBS = [
    {
      id: "j1", title: "Junior Frontend Developer", company: "Amberline Software", initials: "AS",
      place: "Riga, Centrs", mode: "Hybrid", hours: "Part-time 20h", level: "Junior", english: true,
      match: 92, pay: "€9 to €11 per hour", posted: "2 days ago",
      summary: "Build customer-facing screens in JavaScript and CSS with a friendly product team. A mentor is assigned from week one.",
      kw: ["JavaScript", "React", "responsive design", "Git", "accessibility"],
      brief: {
        sector: "workflow software for small shops and cafes", founded: 2016, size: "about 120",
        products: [
          ["Amberline Shift", "a staff scheduling app used by roughly 900 small businesses in the Baltics"],
          ["Amberline Pay", "an invoicing add-on that connects to local bank accounts"],
        ],
        culture: "Engineering works in English and holds one short stand-up each morning. Juniors are paired with a mentor, and student contracts are planned around lecture timetables.",
        hiring: "Three steps: a 20-minute recruiter call, a take-home UI task of about three hours, and a 45-minute technical and team interview.",
        questions: [
          "Tell us about a project where you built a user interface. What would you improve today?",
          "How would you debug a layout that breaks only on small phone screens?",
          "How do you explain a technical problem to a colleague who is not a developer?",
        ],
      },
    },
    {
      id: "j2", title: "Data Analyst Intern", company: "Daugava Data Works", initials: "DD",
      place: "Riga, Agenskalns", mode: "Hybrid", hours: "Part-time 24h", level: "Intern", english: true,
      match: 88, pay: "€8 to €10 per hour", posted: "3 days ago",
      summary: "Clean datasets, build dashboards with SQL and Python, and present findings to logistics clients.",
      kw: ["SQL", "Python", "Excel", "dashboards", "data cleaning"],
      brief: {
        sector: "an analytics consultancy for transport and logistics", founded: 2014, size: "about 60",
        products: [
          ["DataWorks Pulse", "dashboards that track delivery times for fleet managers"],
          ["Route Insight", "a monthly analytics report on fuel use and route delays"],
        ],
        culture: "Small analyst teams, a knowledge-share session every Friday, and interns present one finding to the whole company after eight weeks.",
        hiring: "A short SQL test, followed by a 40-minute conversation about a dataset you choose yourself.",
        questions: [
          "How would you check a new dataset for errors before analysing it?",
          "Explain one of your charts to someone who dislikes numbers.",
          "Which tool would you pick for a quick analysis, and why?",
        ],
      },
    },
    {
      id: "j3", title: "QA Engineer (Student)", company: "Baltic Pixel Studio", initials: "BP",
      place: "Remote, Latvia", mode: "Remote", hours: "Part-time 20h", level: "Junior", english: true,
      match: 85, pay: "€8 to €10 per hour", posted: "5 days ago",
      summary: "Test mobile games before release, write clear bug reports and help automate regression checks.",
      kw: ["test cases", "bug reports", "Jira", "automation", "mobile testing"],
      brief: {
        sector: "an independent mobile game studio", founded: 2018, size: "about 45",
        products: [
          ["Tiny Harbor", "a relaxing puzzle game with over one million downloads"],
          ["Pixel Forge", "an internal tool that builds test levels automatically"],
        ],
        culture: "Fully remote with core hours from 11:00 to 15:00 Riga time, so lectures fit around work. Feedback is direct and always written down.",
        hiring: "A bug-hunt exercise on a sample build, then two 30-minute calls with the QA lead and a producer.",
        questions: [
          "How would you test a login screen with no written requirements?",
          "Describe a bug you found. How did you report it so a developer could fix it quickly?",
          "What would you automate first, and what would you keep manual?",
        ],
      },
    },
    {
      id: "j4", title: "IT Support Specialist", company: "Kurzeme Logistics Tech", initials: "KL",
      place: "Riga, Port area", mode: "On-site", hours: "Full-time", level: "Junior", english: true,
      match: 71, pay: "€1,300 to €1,500 per month", posted: "1 week ago",
      summary: "First-line support for about 80 warehouse staff: laptops, access rights, printers and handheld scanners. Shift work.",
      kw: ["troubleshooting", "Windows", "ticketing", "networking", "customer service"],
      brief: {
        sector: "software and hardware systems for warehouses", founded: 2011, size: "about 300",
        products: [
          ["StockLine", "warehouse management software for mid-sized distributors"],
          ["ScanDock", "rugged handheld scanners sold with a support contract"],
        ],
        culture: "Operations-focused and practical. Support staff work in shifts, and Latvian or Russian is common on the warehouse floor while documentation is in English.",
        hiring: "A phone screen, a practical troubleshooting scenario, and a short meeting with the IT manager.",
        questions: [
          "A user cannot log in and the warehouse is waiting. What do you do first?",
          "How do you prioritise five tickets that arrive at the same time?",
          "How would you handle a stressed colleague who speaks a different language than you?",
        ],
      },
    },
    {
      id: "j5", title: "Backend Developer (Node.js)", company: "Lielupe Pay", initials: "LP",
      place: "Riga, Skanstes", mode: "Hybrid", hours: "Full-time", level: "Mid", english: true,
      match: 83, pay: "€1,900 to €2,300 per month", posted: "4 days ago",
      summary: "Own small payment services in Node.js and PostgreSQL. Good fit for graduates with real project experience.",
      kw: ["Node.js", "REST APIs", "PostgreSQL", "testing", "Docker"],
      brief: {
        sector: "payment tools for online shops", founded: 2019, size: "about 85",
        products: [
          ["Lielupe Checkout", "a hosted payment page with card and bank-link support"],
          ["Lielupe Ledger", "a reporting API for reconciling daily payouts"],
        ],
        culture: "Engineer-led with written design notes before big changes. The team works in English and offers a learning budget for courses and conferences.",
        hiring: "A coding task, a system design chat about a payment flow, and a final culture conversation.",
        questions: [
          "How would you design an API endpoint that must never charge a customer twice?",
          "Tell us about a time you found a bug in production. What did you do?",
          "How do you decide when a service needs automated tests?",
        ],
      },
    },
    {
      id: "j6", title: "Product Operations Assistant", company: "Gauja Health Systems", initials: "GH",
      place: "Riga, Teika", mode: "Hybrid", hours: "Part-time 20h", level: "Junior", english: true,
      match: 76, pay: "€8 to €9.50 per hour", posted: "6 days ago",
      summary: "Keep release notes, customer feedback and support tickets organised for a clinic software team.",
      kw: ["documentation", "Notion", "stakeholder communication", "prioritisation", "analytics"],
      brief: {
        sector: "management software for private clinics", founded: 2015, size: "about 140",
        products: [
          ["Gauja Clinic", "appointment booking and patient records for small clinics"],
          ["Gauja Remind", "automatic SMS reminders that cut missed appointments"],
        ],
        culture: "Calm and process-minded. Product, support and engineering sit together, and meetings are held in English whenever one international colleague joins.",
        hiring: "A 30-minute intro call, a small writing task (summarise customer feedback) and a team meeting.",
        questions: [
          "How would you turn 30 messy customer comments into three clear priorities?",
          "Tell us about a time you kept a project organised under pressure.",
          "How do you keep several teams updated without writing long emails?",
        ],
      },
    },
    {
      id: "j7", title: "Web Developer", company: "Zemgale AgriTech", initials: "ZA",
      place: "Riga, Imanta", mode: "On-site", hours: "Full-time", level: "Mid", english: false,
      match: 64, pay: "€1,600 to €1,900 per month", posted: "1 week ago",
      summary: "Maintain farm-management websites for local customers. Team and clients communicate in Latvian.",
      kw: ["PHP", "WordPress", "JavaScript", "MySQL", "Latvian B2"],
      brief: {
        sector: "farm-management software for local agriculture", founded: 2009, size: "about 50",
        products: [
          ["FieldBook", "a crop and field diary used by family farms"],
          ["AgriShop", "an online shop template for local producers"],
        ],
        culture: "Close-knit team, mostly Latvian-speaking, with frequent customer visits. Written documentation is in Latvian.",
        hiring: "An interview in Latvian, a small PHP exercise and a visit to the office.",
        questions: [
          "Can you describe a website you maintained for a non-technical customer?",
          "How would you fix a slow WordPress site?",
          "Can you handle customer calls in Latvian? What level are you at today?",
        ],
      },
    },
    {
      id: "j8", title: "Customer Success Associate", company: "Vecriga Travel Labs", initials: "VT",
      place: "Riga, Old Town", mode: "Hybrid", hours: "Part-time 20h", level: "Junior", english: false,
      match: 58, pay: "€7.50 to €9 per hour", posted: "2 weeks ago",
      summary: "Help hotel customers in Latvian and English, onboard new accounts and report product issues to the team.",
      kw: ["customer support", "CRM", "onboarding", "communication", "Latvian B2"],
      brief: {
        sector: "booking software for small hotels and guesthouses", founded: 2017, size: "about 35",
        products: [
          ["StayDesk", "a booking calendar that syncs with travel websites"],
          ["StayGuide", "a digital welcome guide guests open by QR code"],
        ],
        culture: "Friendly start-up feeling, a lot of customer contact and some seasonal peaks. Support is offered in Latvian, English and Russian.",
        hiring: "A role-play call with a customer, followed by a conversation with the head of customer success.",
        questions: [
          "How would you calm a hotel owner whose bookings did not sync?",
          "Tell us about a time you explained something difficult in your second language.",
          "How do you decide which customer issue to escalate?",
        ],
      },
    },
  ];

  const AGENTS = [
    {
      name: "CV Agent", ico: "i-cv", screen: "cv", cta: "Open CV Check", state: "Done today",
      bullets: ["Reviewed your CV (version 3)", "Found 5 issues, 2 are high priority", "Prepared bullet rewrites for 6 roles"],
      stat: () => [state.cvApplied ? "84" : "62", "ATS score"],
    },
    {
      name: "Job Scout Agent", ico: "i-jobs", screen: "jobs", cta: "See jobs", state: "Done today",
      bullets: ["Scanned 214 new postings in Riga", "Dropped 168 that need Latvian or long hours", "Kept 8 that fit your schedule"],
      stat: () => ["8", "good matches"],
    },
    {
      name: "Company Research Agent", ico: "i-building", screen: "brief", cta: "Read the brief", state: "Done today",
      bullets: ["Wrote a brief for Amberline Software", "Read 5 sources and cited every claim", "Listed 3 likely interview questions"],
      stat: () => ["1", "brief ready"],
    },
    {
      name: "Interview Coach Agent", ico: "i-chat", screen: "interview", cta: "Practise now", state: "Ready",
      bullets: ["No practice session yet this week", "Next session: 4 questions, about 10 minutes", "Tip: prepare one STAR story first"],
      stat: () => [`${Math.min(iv.answers.length, 4)}/4`, "questions practised"],
    },
  ];

  const STEPS = [
    { id: "profile", title: "Create your profile", desc: "Education, skills and English level", screen: null, done: () => true },
    { id: "cv", title: "Run the CV check and apply the fixes", desc: "Raises your ATS score from 62 to 84", screen: "cv", cta: "Open CV Check", done: () => state.cvApplied },
    { id: "brief", title: "Read a company brief before you apply", desc: "Know the product, culture and likely questions", screen: "brief", cta: "Open brief", done: () => state.briefRead },
    { id: "interview", title: "Finish one mock interview", desc: "Four questions with scored feedback", screen: "interview", cta: "Start practice", done: () => state.interviewDone },
    { id: "permit", title: "Check the work rules for students", desc: "One minute, before you accept any offer", screen: null, cta: "Read guide", done: () => state.permitRead, action: "permit" },
  ];

  const CV_SAMPLE = [
    "AYKHAN DADASHOV",
    "Riga, Latvia | aykhan.dadashov@example.com | +371 20 000 000",
    "Date of birth: 01.01.2000 | Marital status: single",
    "",
    "EDUCATION",
    "Riga Nordic University (RNU), Riga",
    "BSc Information Systems (2023 - present)",
    "",
    "EXPERIENCE",
    "Software Developer, Nordic Web Studio (remote) - Jan 2024 - present",
    "- Worked on website for company and fixed bugs",
    "- Responsible for helping team with tasks and meetings",
    "",
    "SKILLS",
    "HTML, CSS, JavaScript, Git, some Python",
    "",
    "LANGUAGES",
    "English, Azerbaijani, Russian",
  ].join("\n");

  const fixedCv = (job) =>
    [
      "AYKHAN DADASHOV",
      "Riga, Latvia | aykhan.dadashov@example.com | +371 20 000 000 | github.com/example",
      "",
      "PROFILE",
      `Information Systems student at RNU (Riga) and working software developer with JavaScript, Node.js and Git. Looking for a ${job.title} role, up to 20 hours per week during studies.`,
      "",
      "EDUCATION",
      "Riga Nordic University (RNU), Riga",
      "BSc Information Systems (2023 - present)",
      "",
      "EXPERIENCE",
      "Software Developer, Nordic Web Studio (remote) - Jan 2024 - present",
      "- Built and maintained 6 features for a customer web app in JavaScript and Node.js, fixing 40+ bugs and cutting page load time by 35%",
      "- Coordinated daily stand-ups for a 5-person team in English and Russian, shortening sprint hand-offs by 1 day",
      "",
      "SKILLS",
      `HTML, CSS, JavaScript, Git, Python (basics), ${job.kw.slice(0, 3).join(", ")}`,
      "",
      "LANGUAGES",
      "English C1 | Azerbaijani (native) | Russian B2 | Latvian A2",
      "Work eligibility: part-time (up to 20 h/week) during studies",
    ].join("\n");

  const REWRITES = [
    {
      before: "Worked on website for company and fixed bugs",
      after: "Built and maintained 6 features for a customer web app in JavaScript and Node.js, fixing 40+ bugs and cutting page load time by 35%.",
      why: "Strong verb, named tools and measurable results. Recruiters and ATS filters both look for these.",
    },
    {
      before: "Responsible for helping team with tasks and meetings",
      after: "Coordinated daily stand-ups for a 5-person team in English and Russian, shortening sprint hand-offs by 1 day.",
      why: "Shows teamwork and language skills, which matters for employers who hire English speakers in Latvia.",
    },
  ];

  const QUESTIONS = [
    {
      key: "Introduction", behavioral: false,
      text: (job) => `Tell me about yourself and why you are interested in the ${job.title} role at ${job.company}.`,
      keywords: ["student", "developer", "experience", "interested", "team", "built", "junior", "learn"],
      tip: "use a present, past, future flow: who you are now, one proof of experience, and why this role fits.",
      sample:
        "I'm an Information Systems student at RNU in Riga and I work as a software developer, mostly with JavaScript and Node.js. Last year I built and maintained features for a customer web app and fixed more than 40 bugs. I'm interested in this role because I want to grow as a junior member of an English-speaking team and use what I learn at university in real products.",
    },
    {
      key: "Learning fast", behavioral: true,
      text: () => "Describe a time you had to learn a new tool or technology quickly.",
      keywords: ["learn", "tool", "technology", "deadline", "tutorial", "project", "new"],
      tip: "name the tool, the deadline and how you learned it (tutorial, mentor, small prototype).",
      sample:
        "In my last project the team decided to move our forms to React two weeks before a release, and I had never used it. My task was to rebuild the sign-up form. I followed the official tutorial in the evenings, built a small prototype first and asked a senior colleague to review my code. As a result I delivered the form on time and it reduced sign-up errors by 30%.",
    },
    {
      key: "Teamwork", behavioral: true,
      text: () => "Tell me about a time you worked in a team with people from different countries or languages. What was difficult?",
      keywords: ["team", "language", "english", "different", "communication", "misunderstand", "colleague"],
      tip: "describe the specific communication problem, not just that the team was international.",
      sample:
        "During a university project my team had members from four countries and our English levels were very different. The challenge was that we often misunderstood the task descriptions. I proposed that we write every task as a short checklist in a shared document and confirm it in the chat. After that we missed no deadlines in the remaining six weeks and our project got the top grade.",
    },
    {
      key: "Availability", behavioral: false,
      text: () => "How many hours can you work during your studies, and what is your work eligibility in Latvia?",
      keywords: ["hours", "week", "studies", "schedule", "permit", "part-time", "classes", "available"],
      tip: "give a concrete number of hours, your class schedule and your permit status in two or three sentences.",
      sample:
        "I can work up to 20 hours per week during the semester and full-time during holidays. My classes are in the afternoon, so I can work mornings from Monday to Thursday. My study residence permit allows part-time work and I can share the documents before I start.",
    },
  ];

  /* ------------------------------------------------------------------
     State
  ------------------------------------------------------------------ */
  const state = {
    jobId: "j1",
    cvApplied: false,
    briefRead: false,
    briefShownFor: null,
    interviewDone: false,
    permitRead: false,
    metrics: { cv: 62, profile: 82, jobs: 74, interview: 55 },
    filters: new Set(),
  };
  const job = () => JOBS.find((j) => j.id === state.jobId) || JOBS[0];

  const iv = { token: 0, idx: 0, answers: [], scores: [], busy: false, done: false, jobId: null };

  /* ------------------------------------------------------------------
     Routing (hash based, no page reloads)
  ------------------------------------------------------------------ */
  const SCREENS = {
    dashboard: "Dashboard",
    cv: "CV Check",
    jobs: "Jobs",
    brief: "Company brief",
    interview: "Interview Coach",
  };

  function show(name, moveFocus) {
    $$(".screen").forEach((s) => (s.hidden = s.id !== `screen-${name}`));
    $$("[data-nav]").forEach((a) => {
      if (a.dataset.nav === name) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    document.title = `${SCREENS[name]} | CareerBridge`;
    if (name === "dashboard") renderDashboard();
    if (name === "cv") syncCvJob();
    if (name === "brief") renderBrief();
    if (name === "interview") enterInterview();
    window.scrollTo(0, 0);
    if (moveFocus) $(`#h-${name}`).focus({ preventScroll: true });
  }

  function route(moveFocus) {
    const hash = location.hash.slice(1);
    if (hash.startsWith("src-")) return; // citation links inside the brief
    show(SCREENS[hash] ? hash : "dashboard", moveFocus);
  }

  function goTo(name) {
    if (location.hash === `#${name}`) show(name, true);
    else location.hash = name;
  }

  window.addEventListener("hashchange", () => route(true));

  /* ------------------------------------------------------------------
     Dashboard
  ------------------------------------------------------------------ */
  function readiness() {
    const m = state.metrics;
    return Math.round((m.cv + m.profile + m.jobs + m.interview) / 4);
  }

  function renderDashboard() {
    $(".eyebrow", $("#screen-dashboard")).textContent =
      new Date().toLocaleDateString("en-GB", { weekday: "long" }) + " · Riga";

    const score = readiness();
    const band = score >= 85 ? "Interview-ready" : score >= 70 ? "Almost there" : score >= 55 ? "Getting there" : "Just starting";
    $("#readiness-score").textContent = score;
    $("#readiness-label").textContent = band;
    setRing($("#readiness-ring"), score, `Career readiness ${score} out of 100, ${band}`);

    const rows = [
      ["CV strength", state.metrics.cv],
      ["Profile", state.metrics.profile],
      ["Job search", state.metrics.jobs],
      ["Interview practice", state.metrics.interview],
    ];
    $("#metric-list").innerHTML = rows
      .map(
        ([label, v]) => `<li>
          <div class="metric-top"><b>${label}</b><span>${v}%</span></div>
          <div class="progress" role="progressbar" aria-label="${label}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${v}"><span style="width:${v}%"></span></div>
        </li>`
      )
      .join("");

    const next = STEPS.find((s) => !s.done());
    $("#readiness-note").innerHTML = next
      ? `<strong>Next best step:</strong> ${esc(next.title)}.`
      : `<strong>All steps done.</strong> You are ready to apply with confidence.`;

    $("#steps").innerHTML = STEPS.map((s) => {
      const done = s.done();
      const btn = !done && s.cta
        ? `<button type="button" class="btn btn-secondary btn-sm" data-step="${s.id}">${esc(s.cta)}</button>`
        : "";
      return `<li class="step ${done ? "is-done" : ""}">
        <span class="step-mark" aria-hidden="true">${done ? icon("i-check") : ""}</span>
        <div class="step-body">
          <p class="step-title"><span class="step-status">${done ? "Done" : "To do"}</span>${esc(s.title)}</p>
          <p class="step-desc">${esc(s.desc)}</p>
        </div>${btn}
      </li>`;
    }).join("");

    $("#agents").innerHTML = AGENTS.map((a) => {
      const [num, lbl] = a.stat();
      const idle = a.state === "Ready" && iv.answers.length === 0;
      const stateText = a.name.startsWith("Interview") && iv.answers.length ? "Practised today" : a.state;
      return `<article class="card agent" aria-label="${esc(a.name)}">
        <div class="agent-head">
          <span class="agent-icon" aria-hidden="true">${icon(a.ico)}</span>
          <div><h3>${esc(a.name)}</h3><p class="agent-state ${idle ? "is-idle" : ""}">${esc(stateText)}</p></div>
        </div>
        <ul>${a.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
        <p class="agent-stat"><b>${esc(num)}</b>${esc(lbl)}</p>
        <button type="button" class="btn btn-secondary btn-sm" data-go="${a.screen}">${esc(a.cta)}</button>
      </article>`;
    }).join("");
  }

  $("#steps").addEventListener("click", (e) => {
    const b = e.target.closest("[data-step]");
    if (!b) return;
    const step = STEPS.find((s) => s.id === b.dataset.step);
    if (step.action === "permit") togglePermit(true);
    else if (step.screen) goTo(step.screen);
  });

  $("#agents").addEventListener("click", (e) => {
    const b = e.target.closest("[data-go]");
    if (b) goTo(b.dataset.go);
  });

  function togglePermit(forceOpen) {
    const panel = $("#permit-panel");
    const btn = $("#permit-toggle");
    const open = forceOpen ? true : panel.hidden;
    panel.hidden = !open;
    btn.setAttribute("aria-expanded", String(open));
    btn.textContent = open ? "Hide the guide" : "Read the 1-minute guide";
    if (open && !state.permitRead) {
      state.permitRead = true;
      renderDashboard();
    }
    if (open) panel.scrollIntoView({ block: "nearest", behavior: reduceMotion ? "auto" : "smooth" });
  }
  $("#permit-toggle").addEventListener("click", () => togglePermit(false));

  /* ------------------------------------------------------------------
     Jobs
  ------------------------------------------------------------------ */
  const FILTERS = {
    english: (j) => j.english,
    parttime: (j) => j.hours.startsWith("Part-time"),
    flex: (j) => j.mode === "Remote" || j.mode === "Hybrid",
    junior: (j) => j.level === "Junior" || j.level === "Intern",
    match: (j) => j.match >= 80,
  };

  function jobCard(j) {
    const band = j.match >= 85 ? "match-hi" : j.match >= 70 ? "match-mid" : "match-lo";
    const lang = j.english
      ? `<span class="tag tag-good">English OK</span>`
      : `<span class="tag tag-warn">Latvian B2 required</span>`;
    return `<article class="card job" aria-labelledby="t-${j.id}">
      <div class="job-top">
        <span class="logo-tile" aria-hidden="true">${esc(j.initials)}</span>
        <div class="job-head">
          <h2 class="job-title" id="t-${j.id}">${esc(j.title)}</h2>
          <p class="job-co">${esc(j.company)}</p>
        </div>
        <div class="match ${band}">
          <span class="match-num">${j.match}%</span>
          <span class="match-lbl">match</span>
          <div class="progress" aria-hidden="true"><span style="width:${j.match}%"></span></div>
        </div>
      </div>
      <ul class="tags" aria-label="Job details">
        <li>${lang}</li>
        <li><span class="tag ${j.hours.startsWith("Part") ? "tag-brand" : ""}">${esc(j.hours)}</span></li>
        <li><span class="tag">${esc(j.mode)}</span></li>
        <li><span class="tag">${esc(j.level)}</span></li>
      </ul>
      <p class="job-sum">${esc(j.summary)}</p>
      <p class="job-meta"><span>${icon("i-pin")}${esc(j.place)}</span><span>${esc(j.pay)}</span><span>Posted ${esc(j.posted)}</span></p>
      <div class="job-actions">
        <button type="button" class="btn btn-primary btn-sm" data-act="tailor" data-job="${j.id}" aria-label="Tailor CV for ${esc(j.title)} at ${esc(j.company)}">Tailor CV</button>
        <button type="button" class="btn btn-secondary btn-sm" data-act="research" data-job="${j.id}" aria-label="Research company ${esc(j.company)}">Research company</button>
      </div>
    </article>`;
  }

  function renderJobs() {
    const active = [...state.filters];
    const list = JOBS.filter((j) => active.every((f) => FILTERS[f](j))).sort((a, b) => b.match - a.match);
    $("#job-list").innerHTML = list.map(jobCard).join("");
    $("#job-empty").hidden = list.length > 0;
    $("#job-list").hidden = list.length === 0;
    $("#job-count").textContent = active.length
      ? `Showing ${list.length} of ${JOBS.length} jobs`
      : `Showing all ${JOBS.length} jobs, best match first`;
    $("#filters-reset").hidden = active.length === 0;
    $$(".chip").forEach((c) => c.setAttribute("aria-pressed", String(state.filters.has(c.dataset.filter))));
  }

  $(".filters").addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    const f = chip.dataset.filter;
    if (state.filters.has(f)) state.filters.delete(f);
    else state.filters.add(f);
    renderJobs();
  });
  $("#filters-reset").addEventListener("click", () => {
    state.filters.clear();
    renderJobs();
    $$(".chip")[0].focus();
  });

  $("#job-list").addEventListener("click", (e) => {
    const b = e.target.closest("[data-act]");
    if (!b) return;
    state.jobId = b.dataset.job;
    if (b.dataset.act === "tailor") goTo("cv");
    else goTo("brief");
  });

  /* ------------------------------------------------------------------
     CV Check
  ------------------------------------------------------------------ */
  const cvJob = $("#cv-job");
  const cvText = $("#cv-text");
  cvJob.innerHTML = JOBS.map((j) => `<option value="${j.id}">${esc(j.title)}, ${esc(j.company)}</option>`).join("");
  cvText.value = CV_SAMPLE;

  function syncCvJob() {
    cvJob.value = state.jobId;
  }
  cvJob.addEventListener("change", () => {
    state.jobId = cvJob.value;
    // A new target job invalidates the old result
    $("#cv-results").hidden = true;
    $("#cv-empty").hidden = false;
  });

  $("#cv-reset").addEventListener("click", () => {
    cvText.value = CV_SAMPLE;
    $("#cv-error").hidden = true;
    $("#cv-results").hidden = true;
    $("#cv-empty").hidden = false;
    cvText.focus({ preventScroll: true });
    cvText.setSelectionRange(0, 0);
    cvText.scrollTop = 0;
  });

  const THINK = [
    "Reading your CV structure",
    "Checking ATS formatting",
    "Matching keywords with the job ad",
    "Rewriting weak bullet points",
  ];
  let analyzing = false;

  $("#cv-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (analyzing) return;
    const err = $("#cv-error");
    if (!cvText.value.trim()) {
      err.hidden = false;
      cvText.setAttribute("aria-invalid", "true");
      cvText.focus();
      return;
    }
    err.hidden = true;
    cvText.removeAttribute("aria-invalid");
    analyzing = true;

    const btn = $("#cv-analyze");
    btn.disabled = true;
    $("#cv-empty").hidden = true;
    $("#cv-results").hidden = true;
    const box = $("#cv-thinking");
    box.hidden = false;
    const stepsEl = $("#cv-think-steps");
    stepsEl.innerHTML = THINK.map((t) => `<li><span class="tick">${icon("i-check")}</span>${t}</li>`).join("");
    const bar = $("#cv-think-bar");
    bar.style.width = "0%";
    const status = $("#cv-thinking-status");

    for (let i = 0; i < THINK.length; i++) {
      const items = $$("li", stepsEl);
      items[i].classList.add("is-active");
      status.textContent = `CV Agent: ${THINK[i]}`;
      bar.style.width = `${Math.round(((i + 0.5) / THINK.length) * 100)}%`;
      await wait(560);
      items[i].classList.remove("is-active");
      items[i].classList.add("is-done");
      bar.style.width = `${Math.round(((i + 1) / THINK.length) * 100)}%`;
    }
    await wait(250);
    box.hidden = true;
    renderCvResults();
    btn.disabled = false;
    analyzing = false;
    $("#cv-results").scrollIntoView({ block: "start", behavior: reduceMotion ? "auto" : "smooth" });
  });

  function issuesFor(j, improved) {
    if (improved) {
      return [
        { sev: "low", title: "Add one link that proves your skills", text: "A GitHub or portfolio link with 2 or 3 small projects helps juniors stand out.", pts: 4 },
        { sev: "low", title: "Keep the CV to one page", text: "Your structure is clean and ATS friendly. For a junior CV, one page is the Latvian norm.", pts: 3 },
      ];
    }
    return [
      { sev: "high", title: "Bullet points describe duties, not results", text: "\"Worked on website\" and \"Responsible for helping team\" do not show impact. Start with a strong verb and add a number.", pts: 7 },
      { sev: "high", title: "No profile summary at the top", text: "Recruiters in Latvia scan the first five lines. Add two lines: who you are, your strongest skills and the role you want.", pts: 5 },
      { sev: "med", title: "Languages and work eligibility are missing", text: "Add CEFR levels (for example English C1, Russian B2, Latvian A2) and one line that you can work part-time during your studies.", pts: 4 },
      { sev: "med", title: `Missing keywords for ${j.title}`, text: "The job ad repeats these terms. Add the ones that are true for you to Skills or Experience.", kw: j.kw.filter((k) => !k.startsWith("Latvian")), pts: 4 },
      { sev: "low", title: "Personal details that are not expected", text: "Remove date of birth and marital status. They are optional in Latvia and can invite bias. Keep city, email, phone and a GitHub or LinkedIn link.", pts: 2 },
    ];
  }

  function renderCvResults() {
    const j = job();
    const improved = /^PROFILE\s*$/m.test(cvText.value);
    const before = improved ? 84 : 62;
    const after = improved ? 91 : 84;
    $("#cv-job-name").textContent = `${j.title}, ${j.company}`;
    $("#cv-score-before").textContent = before;
    $("#cv-score-after").textContent = after;
    setRing($("#cv-ring-before"), before, `Current score ${before} out of 100`);
    setRing($("#cv-ring-after"), after, `Score after fixes ${after} out of 100`);
    $("#cv-ring-before").classList.toggle("ring-warn", !improved);
    $("#cv-ring-before").classList.toggle("ring-good", improved);
    $("#cv-delta").textContent = `+${after - before} points`;
    $("#cv-score-text").textContent = improved
      ? "Your CV is already strong for this job. Two small polish items are left."
      : `Your CV passes basic ATS parsing, but it will rank low against other applicants for ${j.title}. Five fixes close the gap.`;

    $("#cv-issues").innerHTML = issuesFor(j, improved)
      .map(
        (i) => `<li class="issue">
          <span class="sev sev-${i.sev}">${{ high: "High", med: "Medium", low: "Low" }[i.sev]}</span>
          <div class="issue-body">
            <p class="issue-title">${esc(i.title)}</p>
            <p class="issue-text">${esc(i.text)}</p>
            ${i.kw ? `<p aria-label="Keywords">${i.kw.map((k) => `<span class="kw">${esc(k)}</span>`).join("")}</p>` : ""}
          </div>
          <span class="issue-pts">+${i.pts}</span>
        </li>`
      )
      .join("");

    $("#cv-rewrites").innerHTML = improved
      ? `<p>Nothing left to rewrite. Your bullets already start with strong verbs and include numbers.</p>`
      : REWRITES.map(
          (r, n) => `<div class="rewrite" role="group" aria-label="Bullet ${n + 1}">
            <p class="rw rw-before"><span>Before</span>${esc(r.before)}</p>
            <p class="rw rw-after"><span>After</span>${esc(r.after)}</p>
            <p class="why">${esc(r.why)}</p>
          </div>`
        ).join("");

    const apply = $("#cv-apply");
    apply.disabled = improved;
    apply.textContent = improved ? "Fixes applied" : "Apply all fixes to my CV";
    $("#cv-results").hidden = false;
  }

  $("#cv-apply").addEventListener("click", () => {
    cvText.value = fixedCv(job());
    cvText.scrollTop = 0;
    state.cvApplied = true;
    state.metrics.cv = 84;
    renderCvResults();
    toast("Fixes applied to your CV. Career readiness updated.");
  });
  $("#cv-to-jobs").addEventListener("click", () => goTo("jobs"));

  /* ------------------------------------------------------------------
     Company brief (STORM-style: every claim carries a numbered source)
  ------------------------------------------------------------------ */
  const cite = (...nums) =>
    `<sup class="cite">${nums.map((n) => `<a href="#src-${n}" aria-label="Source ${n}">[${n}]</a>`).join("")}</sup>`;

  async function renderBrief() {
    const j = job();
    const loading = $("#brief-thinking");
    const content = $("#brief-content");
    if (state.briefShownFor === j.id) {
      loading.hidden = true;
      content.hidden = false;
      return;
    }
    state.briefShownFor = null;
    content.hidden = true;
    loading.hidden = false;
    const bar = $("#brief-bar");
    bar.style.width = "0%";
    requestAnimationFrame(() => requestAnimationFrame(() => (bar.style.width = "100%")));
    bar.style.transition = reduceMotion ? "none" : "width 1.1s ease";
    const forJob = j.id;
    await wait(1150);
    if (forJob !== state.jobId || $("#screen-brief").hidden) return; // user moved on
    fillBrief(j);
    loading.hidden = true;
    content.hidden = false;
    state.briefShownFor = j.id;
    if (!state.briefRead) {
      state.briefRead = true;
      state.metrics.jobs = 88;
    }
  }

  function fillBrief(j) {
    const b = j.brief;
    const slug = j.company.toLowerCase().replace(/[^a-z]+/g, "-");
    $("#brief-tile").textContent = j.initials;
    $("#h-company").textContent = j.company;
    $("#brief-sub").textContent = `Hiring: ${j.title} · ${j.place}`;

    $("#brief-overview").innerHTML = `${esc(j.company)} is ${esc(b.sector)}, founded in ${b.founded} and based in Riga with ${esc(b.size)} employees.${cite(1)} It is currently hiring for the ${esc(j.title)} role${j.english ? ", and the posting accepts English as the working language" : ", and the posting asks for Latvian at B2 level"}.${cite(2, 5)}`;

    $("#brief-products").innerHTML = b.products
      .map(([n, d], i) => `<li><strong>${esc(n)}</strong>: ${esc(d)}.${cite(i === 0 ? 1 : 3)}</li>`)
      .join("");

    $("#brief-culture").innerHTML = `${esc(b.culture)}${cite(3, 4)}`;
    $("#brief-hiring").innerHTML = `<strong>Hiring process:</strong> ${esc(b.hiring)}${cite(2, 4)}`;

    $("#brief-questions").innerHTML = b.questions.map((q) => `<li>${esc(q)}${cite(4)}</li>`).join("");

    const base = `https://example.com/${slug}`;
    $("#brief-sources").innerHTML = [
      ["About us page", `${base}/about`],
      ["Careers page and job ad", `${base}/careers`],
      ["Local business news article (placeholder)", `https://example.com/news/${slug}`],
      ["Employee review summary (placeholder)", `https://example.com/reviews/${slug}`],
      ["Company register entry (placeholder)", `https://example.com/register/${slug}`],
    ]
      .map(([t, u], i) => `<li id="src-${i + 1}">${esc(t)}. <a href="${u}" target="_blank" rel="noopener noreferrer">${u}</a></li>`)
      .join("");

    $("#brief-facts").innerHTML = [
      ["Founded", b.founded],
      ["Team size", b.size.replace("about ", "~")],
      ["HQ", "Riga"],
      ["Work language", j.english ? "English" : "Latvian"],
      ["Open role", j.title],
      ["Hours", j.hours],
    ]
      .map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`)
      .join("");
  }

  $("#brief-to-interview").addEventListener("click", () => goTo("interview"));
  $("#brief-to-cv").addEventListener("click", () => goTo("cv"));

  /* ------------------------------------------------------------------
     Interview Coach (scripted questions, tiny rule-based scoring)
  ------------------------------------------------------------------ */
  const log = $("#chat-log");
  const input = $("#chat-input");
  const sendBtn = $("#chat-send");
  const sampleBtn = $("#chat-sample");

  function scoreAnswer(q, raw) {
    const text = raw.trim();
    const lower = text.toLowerCase();
    const words = text.split(/\s+/).filter(Boolean).length;
    const sentences = (text.match(/[.!?](\s|$)/g) || []).length || 1;

    let clarity = words < 8 ? 1 : words < 20 ? 2 : words < 35 ? 3 : words <= 150 ? 4 : 3;
    if (clarity === 4 && words >= 50 && words <= 120 && sentences >= 3 && words / sentences <= 30) clarity = 5;

    const hits = q.keywords.filter((k) => lower.includes(k)).length;
    const relevance = Math.max(1, Math.min(5, hits === 0 ? 1 : hits + 1));

    const signals = [
      /\b(when|during|last (year|month|semester)|once|in my|at my|in our)\b/,
      /\b(had to|needed to|my task|my goal|was asked|the challenge|the goal|was responsible)\b/,
      /\bi (built|wrote|created|decided|organi[sz]ed|asked|followed|proposed|set up|led|fixed|made|started|suggested|rebuilt|delivered|worked|learned|learnt|can|hold)\b/,
      /(as a result|\bresult\b|so that|reduced|improved|saved|\d+\s?%|\d+\+?\s(bugs|users|errors|weeks|hours|days)|top grade|on time|no deadlines)/,
    ];
    const found = signals.filter((r) => r.test(lower)).length;
    let star = Math.max(1, Math.min(5, found + 1));
    if (!q.behavioral) star = Math.max(star, words >= 20 ? 3 : 2);

    return { clarity, relevance, star, words, found };
  }

  function feedbackFor(q, s) {
    const avg = (s.clarity + s.relevance + s.star) / 3;
    const opener = avg >= 4 ? "Strong answer." : avg >= 3 ? "Good start." : "This needs more detail.";
    const dims = [
      ["clarity", s.clarity, "it is clear and easy to follow"],
      ["relevance", s.relevance, "it answers the question directly"],
      ["star", s.star, "it has a clear structure"],
    ];
    const best = [...dims].sort((a, b) => b[1] - a[1])[0];
    const worst = [...dims].sort((a, b) => a[1] - b[1])[0];
    const tips = {
      clarity: s.words < 35
        ? "aim for three to six sentences so the interviewer has something to remember."
        : "trim it to about 45 seconds when spoken, roughly 120 words.",
      relevance: q.tip,
      star: q.behavioral
        ? "finish with the Result: what changed because of your action, ideally with a number. Say what <em>you</em> did, not only what \"we\" did."
        : "add one concrete example or number to make the answer memorable.",
    };
    const strengthPart = best[1] >= 4 ? ` What worked: ${best[2]}.` : "";
    const tipPart = worst[1] < 5 ? ` To improve, ${tips[worst[0]]}` : " Nothing to fix here.";
    return `<strong>${opener}</strong>${strengthPart}${tipPart}`;
  }

  function pips(v) {
    const cls = v >= 4 ? "s-hi" : v <= 2 ? "s-lo" : "";
    return `<span class="pips ${cls}" aria-hidden="true">${[1, 2, 3, 4, 5].map((n) => `<i class="${n <= v ? "on" : ""}"></i>`).join("")}</span>`;
  }
  const scoreRow = (label, v) =>
    `<div class="score-row" role="group" aria-label="${label}: ${v} out of 5"><b>${label}</b>${pips(v)}<em>${v}/5</em></div>`;

  function addMsg(who, html) {
    const wrap = document.createElement("div");
    wrap.className = `msg msg-${who}`;
    const av = who === "coach" ? `<span class="avatar" aria-hidden="true">${icon("i-spark")}</span>` : `<span class="avatar" aria-hidden="true">AD</span>`;
    wrap.innerHTML = `${av}<div class="bubble">${html}</div>`;
    log.appendChild(wrap);
    log.scrollTop = log.scrollHeight;
    return wrap;
  }

  async function coachSay(html, token, delay = 750) {
    const t = addMsg("coach", `<span class="typing" aria-label="Coach is typing"><i></i><i></i><i></i></span>`);
    await wait(delay);
    if (token !== iv.token) {
      t.remove();
      return false;
    }
    t.querySelector(".bubble").innerHTML = html;
    log.scrollTop = log.scrollHeight;
    return true;
  }

  function renderSteps() {
    $("#iv-steps").innerHTML = QUESTIONS.map((q, i) => {
      const done = i < iv.scores.length;
      const cur = !iv.done && i === iv.idx;
      const sc = done ? `<span class="sc">${avgOf(iv.scores[i]).toFixed(1)}/5</span>` : "";
      return `<li class="${done ? "is-done" : cur ? "is-current" : ""}">
        <span class="n" aria-hidden="true">${done ? icon("i-check").replace("<svg", '<svg style="width:14px;height:14px"') : i + 1}</span>
        <span>${esc(q.key)}${done ? '<span class="sr-only"> done</span>' : cur ? '<span class="sr-only"> current</span>' : ""}</span>${sc}
      </li>`;
    }).join("");
    $("#iv-progress").textContent = iv.done ? "Interview complete" : `Question ${Math.min(iv.idx + 1, 4)} of 4`;
  }
  const avgOf = (s) => (s.clarity + s.relevance + s.star) / 3;

  function setComposer(enabled) {
    input.disabled = !enabled;
    sendBtn.disabled = !enabled;
    sampleBtn.disabled = !enabled;
  }

  function questionHtml(i) {
    return `<span class="q-label">Question ${i + 1} of 4 &middot; ${esc(QUESTIONS[i].key)}</span>${esc(QUESTIONS[i].text(job()))}`;
  }

  function enterInterview() {
    $("#iv-context").innerHTML = `Practising for <strong>${esc(job().title)}</strong> at ${esc(job().company)}.`;
    const fresh = iv.jobId === null || (iv.jobId !== state.jobId && iv.answers.length === 0);
    if (fresh) startInterview();
    else renderSteps();
  }

  async function startInterview() {
    const token = ++iv.token;
    Object.assign(iv, { idx: 0, answers: [], scores: [], busy: false, done: false, jobId: state.jobId });
    log.innerHTML = "";
    input.value = "";
    setComposer(false);
    renderSteps();
    const j = job();
    $("#iv-context").innerHTML = `Practising for <strong>${esc(j.title)}</strong> at ${esc(j.company)}.`;
    const ok1 = await coachSay(
      `<p>Hi Aykhan, I'm your Interview Coach. We will practise <strong>4 questions</strong> for the <strong>${esc(j.title)}</strong> role at ${esc(j.company)}.</p><p>Answer in three to six sentences. After each answer you get feedback and three scores.</p>`,
      token, 500
    );
    if (!ok1) return;
    const ok2 = await coachSay(questionHtml(0), token, 600);
    if (!ok2) return;
    setComposer(true);
    if ($("#screen-interview").hidden === false && document.activeElement === document.body) input.focus({ preventScroll: true });
  }

  async function sendAnswer() {
    if (iv.busy || iv.done) return;
    const text = input.value.trim();
    if (!text) {
      toast("Type an answer first, or click \"Use sample answer\".");
      input.focus();
      return;
    }
    const token = iv.token;
    iv.busy = true;
    setComposer(false);
    const q = QUESTIONS[iv.idx];
    addMsg("user", esc(text));
    input.value = "";

    const s = scoreAnswer(q, text);
    iv.answers.push(text);
    iv.scores.push(s);
    renderSteps();

    const fbHtml = `<p>${feedbackFor(q, s)}</p><div class="scores">${scoreRow("Clarity", s.clarity)}${scoreRow("Relevance", s.relevance)}${scoreRow("STAR", s.star)}</div>`;
    if (!(await coachSay(fbHtml, token, 900))) return;

    iv.idx += 1;
    if (iv.idx < QUESTIONS.length) {
      renderSteps();
      if (!(await coachSay(questionHtml(iv.idx), token, 700))) return;
      iv.busy = false;
      setComposer(true);
      input.focus({ preventScroll: true });
    } else {
      await finishInterview(token);
    }
  }

  async function finishInterview(token) {
    iv.done = true;
    renderSteps();
    const mean = (k) => iv.scores.reduce((a, s) => a + s[k], 0) / iv.scores.length;
    const c = mean("clarity"), r = mean("relevance"), st = mean("star");
    const overall = (c + r + st) / 3;
    const dims = [["clarity", c, "Your answers are clear and well sized."], ["relevance", r, "You answer what was asked."], ["STAR structure", st, "You tell stories with a beginning and a result."]];
    const best = [...dims].sort((a, b) => b[1] - a[1])[0];
    const worst = [...dims].sort((a, b) => a[1] - b[1])[0];
    const focusTip = {
      clarity: "Keep each answer near 45 seconds.",
      relevance: "Mirror the keywords of the job ad in your answers.",
      "STAR structure": "End every story with a number: what changed because of you.",
    }[worst[0]];

    const html = `<div class="summary">
      <h3>Interview summary</h3>
      <p class="summary-total"><b>${overall.toFixed(1)}</b><span>/ 5 overall</span></p>
      <div class="scores">${scoreRow("Clarity", Math.round(c))}${scoreRow("Relevance", Math.round(r))}${scoreRow("STAR", Math.round(st))}</div>
      <ul>
        <li><strong>Strongest:</strong> ${best[0]}. ${best[2]}</li>
        <li><strong>Focus next:</strong> ${esc(focusTip)}</li>
        <li><strong>Per question:</strong> ${iv.scores.map((s, i) => `Q${i + 1} ${avgOf(s).toFixed(1)}`).join(", ")}</li>
      </ul>
      <div class="summary-actions">
        <button type="button" class="btn btn-primary btn-sm" data-sum="restart">Practise again</button>
        <button type="button" class="btn btn-secondary btn-sm" data-sum="dash">Back to dashboard</button>
      </div>
    </div>`;
    if (!(await coachSay(html, token, 900))) return;
    iv.busy = false;
    state.interviewDone = true;
    state.metrics.interview = Math.max(state.metrics.interview, Math.round((overall / 5) * 100));
    toast("Mock interview finished. Career readiness updated.");
    setComposer(false);
    sendBtn.disabled = true;
  }

  $("#chat-form").addEventListener("submit", (e) => {
    e.preventDefault();
    sendAnswer();
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
      e.preventDefault();
      sendAnswer();
    }
  });
  sampleBtn.addEventListener("click", () => {
    if (iv.busy || iv.done) return;
    input.value = QUESTIONS[iv.idx].sample;
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  });
  log.addEventListener("click", (e) => {
    const b = e.target.closest("[data-sum]");
    if (!b) return;
    if (b.dataset.sum === "restart") startInterview();
    else goTo("dashboard");
  });

  /* ------------------------------------------------------------------
     Wire up the rest of the navigation
  ------------------------------------------------------------------ */
  renderJobs();
  route(false);
})();
