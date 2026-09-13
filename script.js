(function(){
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- live clock ---------- */
  var clockEl = document.getElementById("clock");
  function tickClock(){
    if(!clockEl) return;
    var d = new Date();
    var pad = function(n){ return String(n).padStart(2,"0"); };
    clockEl.textContent = pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
  }
  tickClock();
  setInterval(tickClock, 1000);

  /* ---------- section reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if("IntersectionObserver" in window && !reduceMotion){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add("is-visible"); });
  }

  /* ---------- animated impact counters ---------- */
  var counters = document.querySelectorAll(".impact-num");
  function animateCounter(el){
    var target = parseFloat(el.getAttribute("data-target"));
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var suffix = el.getAttribute("data-suffix") || "";
    if(reduceMotion){
      el.textContent = target.toFixed(decimals) + suffix;
      return;
    }
    var duration = 1400;
    var start = null;
    function step(ts){
      if(start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var val = target * eased;
      el.textContent = val.toFixed(decimals) + suffix;
      if(progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toFixed(decimals) + suffix;
    }
    requestAnimationFrame(step);
  }
  if(counters.length){
    var counterIo = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          animateCounter(entry.target);
          counterIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function(el){ counterIo.observe(el); });
  }

  /* ---------- signature project diagram: sequential highlight ---------- */
  var diagram = document.querySelector(".project-diagram");
  if(diagram){
    var nodes = diagram.querySelectorAll(".diag-node");
    var diagIo = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          nodes.forEach(function(node, i){
            var delay = reduceMotion ? 0 : i * 160;
            setTimeout(function(){ node.classList.add("is-active"); }, delay);
          });
          diagIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    diagIo.observe(diagram);
  }

  /* ---------- model probability bars ---------- */
  var modelBars = document.querySelector(".model-bars");
  if(modelBars){
    var barIo = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.querySelectorAll(".mb-fill").forEach(function(fill){
            fill.classList.add("is-filled");
          });
          barIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    barIo.observe(modelBars);
  }

  /* ---------- skills filter ---------- */
  var filterBtns = document.querySelectorAll("#skillFilters .chip");
  var skillGroups = document.querySelectorAll("#skillMap .skill-group");
  filterBtns.forEach(function(btn){
    btn.addEventListener("click", function(){
      filterBtns.forEach(function(b){ b.classList.remove("is-active"); });
      btn.classList.add("is-active");
      var filter = btn.getAttribute("data-filter");
      skillGroups.forEach(function(group){
        var match = filter === "all" || group.getAttribute("data-group") === filter;
        group.classList.toggle("is-hidden", !match);
      });
    });
  });

  /* ---------- Ask Kapish's Portfolio (local Q&A) ---------- */
  var knowledge = [
    {
      k: ["strongest project","best project","favorite project","signature project","flagship"],
      a: "His strongest project is LocalDocs AI Assistant — a RAG document Q&A system combining FAISS and BM25 hybrid retrieval with Google Gemini, supporting 8 document formats with source-attributed answers."
    },
    {
      k: ["rag","localdocs","retrieval","document q&a","document qa"],
      a: "LocalDocs AI Assistant is a Retrieval-Augmented Generation app built with Python, LangChain and Google Gemini. It runs documents through OCR, chunking and embeddings, then answers questions using hybrid FAISS + BM25 retrieval — with summaries, flashcards, source attribution and confidence scoring."
    },
    {
      k: ["technologies","tech stack","skills","stack","languages","know"],
      a: "Core stack: Python, JavaScript, SQL and C++; LangChain, Google Gemini, RAG and prompt engineering for GenAI; React, Node.js, Express and Django on the web side; Scikit-learn, Pandas and NumPy for ML; MongoDB, SQLite and SQLAlchemy for data."
    },
    {
      k: ["internship","internships","experience","work experience","hedge5","bluestock"],
      a: "Two internships: Software Development Intern at HEDGE5 (May–Aug 2025), building a biogas calculator and a 5-page company website, and Data Analyst Intern at Bluestock Fintech (Jun–Aug 2026), building an analytics workflow over 10+ mutual fund datasets."
    },
    {
      k: ["disease","health","healthcare","prediction","diabetes","heart","parkinson"],
      a: "The Multiple Disease Prediction system unifies three models — Diabetes (75–85%), Heart Disease (80–88%) and Parkinson's (85–90%) — using predict_proba() for probability-based, risk-aware recommendations, plus hospital search and lifestyle guidance."
    },
    {
      k: ["eventora","booking","event","mern"],
      a: "Eventora is a full-stack MERN event booking platform with 12+ REST APIs, JWT auth, 2FA OTP, and a seat-locking pipeline that prevents overbooking across 1,000+ seats, with an admin dashboard and live revenue analytics."
    },
    {
      k: ["education","college","university","cgpa","vit"],
      a: "Kapish is a Computer Science Engineering student at VIT Bhopal University with a CGPA of 8.39/10, since 2023."
    },
    {
      k: ["contact","email","reach","hire","linkedin","github"],
      a: "Reach him at kapishh17@gmail.com, or find him on GitHub at github.com/Kapish17 and LinkedIn at linkedin.com/in/kapish-kela."
    },
    {
      k: ["certification","certifications","certificate","courses"],
      a: "Applied Machine Learning (Coursera), Cloud Computing (NPTEL, IIT Kharagpur), and the OCI 2025 Certified AI Foundations Associate (Oracle Cloud Infrastructure)."
    },
    {
      k: ["leadership","captain","volunteer","cricket","tcs"],
      a: "He captained his cricket team for inter-college tournaments and volunteered on TCS campus recruitment logistics, coordinating for 500+ applicants."
    }
  ];
  var fallback = "I don't have a canned answer for that yet — try asking about his projects, stack, internships, or how to reach him.";

  function answerFor(question){
    var q = question.toLowerCase();
    for(var i=0;i<knowledge.length;i++){
      for(var j=0;j<knowledge[i].k.length;j++){
        if(q.indexOf(knowledge[i].k[j]) !== -1) return knowledge[i].a;
      }
    }
    return fallback;
  }

  var askLog = document.getElementById("askLog");
  var askForm = document.getElementById("askForm");
  var askInput = document.getElementById("askInput");
  var askSuggestions = document.getElementById("askSuggestions");

  function appendMsg(text, who){
    var wrap = document.createElement("div");
    wrap.className = "ask-msg " + (who === "user" ? "ask-msg-user" : "ask-msg-bot");
    var p = document.createElement("p");
    p.textContent = text;
    wrap.appendChild(p);
    askLog.appendChild(wrap);
    askLog.scrollTop = askLog.scrollHeight;
  }

  function ask(question){
    if(!question || !question.trim()) return;
    appendMsg(question, "user");
    var reply = answerFor(question);
    var delay = reduceMotion ? 60 : 380;
    setTimeout(function(){ appendMsg(reply, "bot"); }, delay);
  }

  if(askForm){
    askForm.addEventListener("submit", function(e){
      e.preventDefault();
      var val = askInput.value;
      askInput.value = "";
      ask(val);
    });
  }
  if(askSuggestions){
    askSuggestions.addEventListener("click", function(e){
      var btn = e.target.closest("button");
      if(!btn) return;
      ask(btn.textContent);
    });
  }

  /* ---------- command palette ---------- */
  var cmdItems = [
    { label: "Go to hero", hint: "top", action: function(){ scrollToId("top"); } },
    { label: "About / journey", hint: "section", action: function(){ scrollToId("about"); } },
    { label: "Experience", hint: "section", action: function(){ scrollToId("experience"); } },
    { label: "Projects", hint: "section", action: function(){ scrollToId("work"); } },
    { label: "Skills", hint: "section", action: function(){ scrollToId("skills"); } },
    { label: "Impact numbers", hint: "section", action: function(){ scrollToId("impact"); } },
    { label: "Ask this portfolio", hint: "section", action: function(){ scrollToId("lab"); } },
    { label: "Certifications & leadership", hint: "section", action: function(){ scrollToId("creds"); } },
    { label: "Contact", hint: "section", action: function(){ scrollToId("contact"); } },
    { label: "Open GitHub", hint: "external", action: function(){ window.open("https://github.com/Kapish17","_blank","noopener"); } },
    { label: "Open LinkedIn", hint: "external", action: function(){ window.open("https://linkedin.com/in/kapish-kela","_blank","noopener"); } },
    { label: "Email Kapish", hint: "mailto", action: function(){ window.location.href = "mailto:kapishh17@gmail.com"; } }
  ];

  function scrollToId(id){
    var el = document.getElementById(id);
    if(el) el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  }

  var overlay = document.getElementById("cmdOverlay");
  var palette = document.getElementById("cmdPalette");
  var cmdInput = document.getElementById("cmdInput");
  var cmdList = document.getElementById("cmdList");
  var trigger = document.getElementById("paletteTrigger");
  var activeIndex = 0;
  var filteredItems = cmdItems.slice();

  function renderList(){
    cmdList.innerHTML = "";
    filteredItems.forEach(function(item, i){
      var li = document.createElement("li");
      li.className = i === activeIndex ? "is-active" : "";
      var span = document.createElement("span");
      span.textContent = item.label;
      var hint = document.createElement("span");
      hint.className = "cmd-hint";
      hint.textContent = item.hint;
      li.appendChild(span);
      li.appendChild(hint);
      li.addEventListener("mouseenter", function(){ activeIndex = i; renderList(); });
      li.addEventListener("click", function(){ runActive(); });
      cmdList.appendChild(li);
    });
  }

  function filterItems(){
    var q = cmdInput.value.toLowerCase();
    filteredItems = cmdItems.filter(function(item){
      return item.label.toLowerCase().indexOf(q) !== -1;
    });
    activeIndex = 0;
    renderList();
  }

  function openPalette(){
    overlay.hidden = false;
    palette.hidden = false;
    cmdInput.value = "";
    filterItems();
    setTimeout(function(){ cmdInput.focus(); }, 10);
    document.body.style.overflow = "hidden";
  }

  function closePalette(){
    overlay.hidden = true;
    palette.hidden = true;
    document.body.style.overflow = "";
    if(trigger) trigger.focus();
  }

  function runActive(){
    var item = filteredItems[activeIndex];
    if(item){ item.action(); closePalette(); }
  }

  if(trigger) trigger.addEventListener("click", openPalette);
  if(overlay) overlay.addEventListener("click", closePalette);
  if(cmdInput) cmdInput.addEventListener("input", filterItems);

  document.addEventListener("keydown", function(e){
    var isMeta = e.metaKey || e.ctrlKey;
    if(isMeta && e.key.toLowerCase() === "k"){
      e.preventDefault();
      if(palette.hidden) openPalette(); else closePalette();
      return;
    }
    if(palette.hidden) return;
    if(e.key === "Escape"){ closePalette(); }
    else if(e.key === "ArrowDown"){ e.preventDefault(); activeIndex = Math.min(activeIndex + 1, filteredItems.length - 1); renderList(); }
    else if(e.key === "ArrowUp"){ e.preventDefault(); activeIndex = Math.max(activeIndex - 1, 0); renderList(); }
    else if(e.key === "Enter"){ e.preventDefault(); runActive(); }
  });

})();