(() => {
  "use strict";
  const data = window.PORTFOLIO;
  const main = document.getElementById("main");
  if (!data || !data.profile || !Array.isArray(data.projects)) {
    main.textContent = "The portfolio content could not load. Check content.js for a missing quotation mark or comma.";
    return;
  }
  const profile = data.profile;
  const page = document.body.dataset.page;
  const backgrounds = data.backgrounds || {};
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const link = (text, href, className = "", external = false) => {
    const node = el("a", className, text);
    node.href = href;
    if (external) { node.target = "_blank"; node.rel = "noopener noreferrer"; }
    return node;
  };
  const safeLink = value => {
    if (typeof value !== "string" || !value.trim()) return "";
    const trimmed = value.trim();
    const candidate = /^www\./i.test(trimmed) ? "https://" + trimmed : trimmed;
    if (/^https?:\/\//i.test(candidate)) {
      try {
        const url = new URL(candidate);
        if (!url.hostname || url.username || url.password) return "";
        return url.href;
      } catch { return ""; }
    }
    if (/^(?:\.\/)?assets\/[a-z0-9_./ -]+(?:\?v=[a-z0-9_-]+)?$/i.test(trimmed) && !trimmed.includes("..")) return trimmed;
    return "";
  };
  const socialLink = (value, service) => {
    if (typeof value !== "string" || !value.trim()) return "";
    const trimmed = value.trim();
    const direct = safeLink(trimmed);
    if (/^https?:\/\//i.test(direct)) return direct;
    if (/^(?:linkedin\.com|github\.com|instagram\.com)(?:\/|$)/i.test(trimmed)) return safeLink("https://" + trimmed);
    const handle = trimmed.replace(/^@/, "");
    if (service === "github" && /^[a-z0-9](?:[a-z0-9-]{0,38})$/i.test(handle)) return "https://github.com/" + handle;
    if (service === "instagram" && /^[a-z0-9_.]{1,30}$/i.test(handle)) return "https://www.instagram.com/" + handle + "/";
    if (service === "linkedin" && /^(?:in\/)?[a-z0-9_-]+\/?$/i.test(handle)) return "https://www.linkedin.com/" + (handle.startsWith("in/") ? handle : "in/" + handle);
    return "";
  };
  const emailAddresses = value => {
    const entries = Array.isArray(value) ? value : [value];
    const addresses = entries.flatMap(entry => typeof entry === "string" ? entry.trim().replace(/^mailto:/i, "").split(/[\s,;]+/) : []);
    return [...new Set(addresses.filter(address => /^[a-z0-9.!#$%&'*+/=?^_{}|~-]+@[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?\.[a-z]{2,}$/i.test(address)))];
  };
  const resumeUrl = safeLink(profile.resume);
  const header = document.getElementById("site-header");
  const brand = link(profile.chineseName || "牛", "index.html", "brand");
  brand.setAttribute("aria-label", `${profile.chineseName || "牛"} — ${profile.name}, Home`);
  if (page === "home") brand.setAttribute("aria-current", "page");
  const nav = el("nav", "navigation");
  nav.setAttribute("aria-label", "Main navigation");
  for (const [label, href, key] of [
    ["Projects", "projects.html", "projects"],
    ["About Me", "about.html", "about"]
  ]) {
    const item = link(label, href);
    if (page === key || (page === "project" && key === "projects")) item.setAttribute("aria-current", "page");
    nav.append(item);
  }
  const resume = link("Resume ↗", resumeUrl || "about.html#resume", "resume-nav", Boolean(resumeUrl));
  if (resumeUrl) resume.setAttribute("aria-label", "Open resume (new tab)");
  header.append(brand, nav, resume);
  const footer = document.getElementById("site-footer");
  footer.append(el("span", "footer-credit", `${profile.name} · Portfolio`));
  const icon = name => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "social-icon");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    const icons = {
      email: '<path d="M3 5h18v14H3z"/><path d="m3 6 9 7 9-7"/>',
      linkedin: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 10v7M8 7v.01M12 17v-7M12 13.25A3.25 3.25 0 0 1 18.5 13.25V17"/>',
      instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".75" class="social-icon-dot"/>',
      github: '<path class="social-icon-fill" d="M12 .7a11.5 11.5 0 0 0-3.64 22.41c.58.11.79-.25.79-.56v-2.23c-3.23.7-3.91-1.37-3.91-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.72 1.27 3.39.97.1-.75.41-1.27.74-1.56-2.58-.29-5.29-1.29-5.29-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.47.11-3.05 0 0 .97-.31 3.16 1.18a10.9 10.9 0 0 1 5.76 0c2.19-1.49 3.15-1.18 3.15-1.18.63 1.58.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.72 5.39-5.3 5.68.42.36.79 1.07.79 2.16v3.21c0 .31.21.68.8.56A11.5 11.5 0 0 0 12 .7Z"/>'
    };
    svg.innerHTML = icons[name] || "";
    return svg;
  };
  const iconLink = (label, href, iconName, external = false) => {
    const item = link("", href, "social-icon-link", external);
    item.setAttribute("aria-label", label);
    item.title = label;
    item.append(icon(iconName));
    return item;
  };
  const footerSocials = el("div", "footer-socials");
  const primaryEmail = emailAddresses(profile.contactEmail || profile.email)[0];
  const footerItems = [
    ["GitHub", socialLink(profile.github, "github"), "github", true],
    ["LinkedIn", socialLink(profile.linkedin, "linkedin"), "linkedin", true],
    ["Email", primaryEmail ? "mailto:" + encodeURIComponent(primaryEmail).replace(/%40/gi,"@") : "", "email", false],
    ["Instagram", socialLink(profile.instagram || profile.Instagram, "instagram"), "instagram", true]
  ];
  for (const [label, href, iconName, external] of footerItems) {
    if (href) footerSocials.append(iconLink(label, href, iconName, external));
  }
  if (footerSocials.childElementCount) footer.append(footerSocials);

  const setMeta = (key, value, property = false) => {
    const attribute = property ? "property" : "name";
    let tag = document.querySelector('meta[' + attribute + '="' + key + '"]');
    if (!value) { if (tag) tag.remove(); return; }
    if (!tag) { tag = document.createElement("meta"); tag.setAttribute(attribute,key); document.head.append(tag); }
    tag.content = value;
  };
  const setTitle = (title, description = "", imagePath = "assets/social-preview.png") => {
    document.title = title + " — " + profile.name;
    const summary = description || (page === "home" ? profile.introduction : title + ". Maps, research, and projects from " + profile.name + ".");
    setMeta("description",summary);
    setMeta("og:title",document.title,true); setMeta("og:description",summary,true);
    setMeta("og:type","website",true);
    setMeta("twitter:title",document.title); setMeta("twitter:description",summary);
    const image = safeLink(imagePath);
    const imageUrl = image && /^https?:$/.test(window.location.protocol) ? new URL(image,window.location.href).href : "";
    setMeta("og:image",imageUrl,true); setMeta("twitter:image",imageUrl);
    setMeta("twitter:card",imageUrl ? "summary_large_image" : "summary");
  };
  const renderHome = () => {
    setTitle("Portfolio");
    document.body.classList.add("home-page");
    const scene = el("div", "home-scene");
    const stage = el("div", "background-stage");
    stage.setAttribute("aria-hidden", "true");
    const factsVideoLayer = el("div", "facts-video-layer");
    const factsPoster = el("img", "facts-video-poster");
    factsPoster.alt = ""; factsPoster.src = safeLink(backgrounds.factsPoster); factsPoster.decoding = "async";
    factsPoster.style.objectPosition = backgrounds.factsVideoPosition || "50% 50%";
    const factsVideo = el("video", "facts-video");
    factsVideo.muted = true; factsVideo.defaultMuted = true; factsVideo.loop = true; factsVideo.playsInline = true;
    factsVideo.setAttribute("muted", ""); factsVideo.setAttribute("playsinline", "");
    factsVideo.setAttribute("aria-hidden", "true"); factsVideo.tabIndex = -1;
    factsVideo.preload = "metadata"; factsVideo.disablePictureInPicture = true;
    factsVideo.poster = safeLink(backgrounds.factsPoster);
    factsVideo.style.objectPosition = backgrounds.factsVideoPosition || "50% 50%";
    factsVideoLayer.append(factsPoster, factsVideo, el("div", "facts-video-shade"));
    const videoLayer = el("div", "video-layer");
    const poster = el("img", "video-poster");
    poster.alt = ""; poster.src = safeLink(backgrounds.poster); poster.fetchPriority = "high";
    poster.style.objectPosition = backgrounds.videoPosition || "50% 50%";
    const video = el("video", "hero-video");
    video.muted = true; video.defaultMuted = true; video.loop = true; video.playsInline = true;
    video.setAttribute("muted", ""); video.setAttribute("playsinline", "");
    video.setAttribute("aria-hidden", "true"); video.tabIndex = -1;
    video.preload = "metadata"; video.disablePictureInPicture = true;
    video.poster = safeLink(backgrounds.poster);
    video.style.objectPosition = backgrounds.videoPosition || "50% 50%";
    videoLayer.append(poster, video, el("div", "video-shade"));
    stage.append(factsVideoLayer, videoLayer);
    const hero = el("section", "video-hero");
    hero.setAttribute("aria-labelledby", "hero-title");
    const greeting = el("h1", "hero-greeting"); greeting.id = "hero-title";
    const greetingText = profile.greeting || "Hello, I’m";
    const portraitUrl = safeLink(profile.portrait);
    if (portraitUrl) {
      const greetingParts = greetingText.match(/^(.*?)(I[’']m)\s*$/i);
      const greetingLead = greetingParts ? greetingParts[1].trim() : greetingText;
      const greetingJoiner = greetingParts ? greetingParts[2] : "";
      const portraitFrame = el("span", "hero-portrait-frame");
      portraitFrame.setAttribute("aria-hidden", "true");
      const portrait = el("img", "hero-portrait");
      portrait.alt = ""; portrait.src = portraitUrl; portrait.decoding = "async"; portrait.fetchPriority = "high";
      portraitFrame.append(portrait);
      greeting.classList.add("has-portrait");
      greeting.append(
        el("span", "greeting-prefix", greetingLead),
        portraitFrame,
        el("span", "greeting-name", [greetingJoiner,profile.name].filter(Boolean).join(" "))
      );
    } else {
      greeting.append(el("span", "greeting-prefix", greetingText), document.createTextNode(" "), el("span", "greeting-name", profile.name));
    }
    const bottom = el("div", "hero-bottom");
    const heroCopy = el("div", "hero-copy");
    heroCopy.append(el("p", "hero-description", profile.introduction));
    const opportunity = profile.opportunity || {};
    const opportunityLine = el("p", "hero-opportunity");
    opportunityLine.append(el("strong", "", `${opportunity.lead || ""}${opportunity.emphasis || ""}`));
    if (opportunityLine.textContent.trim()) heroCopy.append(opportunityLine);
    bottom.append(heroCopy, link("View my projects", "projects.html", "button hero-button"));
    const scrollLink = link("Quick facts ↓", "#quick-facts", "scroll-cue");
    const motionButton = el("button", "motion-toggle", "Pause video");
    motionButton.type = "button"; motionButton.setAttribute("aria-pressed", "false");
    hero.append(greeting, bottom, scrollLink, motionButton);
    const facts = el("section", "home-facts"); facts.id = "quick-facts";
    facts.setAttribute("aria-label", "Quick facts");
    const factsPanel = el("div", "quick-facts-panel");
    const factList = el("ul", "quick-facts-list");
    const factItems = Array.isArray(profile.quickFacts) ? profile.quickFacts : [];
    factItems.forEach(fact => {
      const item = el("li", "");
      if (typeof fact === "string") {
        item.textContent = fact;
      } else if (fact && typeof fact === "object" && typeof fact.projectId === "string" && typeof fact.linkText === "string") {
        item.append(
          typeof fact.before === "string" ? fact.before : "",
          link(fact.linkText, `project.html?id=${encodeURIComponent(fact.projectId)}`, "quick-fact-link"),
          typeof fact.after === "string" ? fact.after : ""
        );
      }
      if (item.textContent.trim()) factList.append(item);
    });
    factsPanel.append(factList);
    facts.append(factsPanel);
    const footer = document.getElementById("site-footer");
    if (footer) facts.append(footer);
    scene.append(stage,hero,facts); main.append(scene);

    // Native scrolling crossfades the Waterloo hero video into the Tokyo quick-facts video.
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const saveData = Boolean(navigator.connection && navigator.connection.saveData);
    const revealStart = Number(backgrounds.heroRevealStart) || 3.8;
    const revealEnd = Math.max(revealStart + .25,Number(backgrounds.heroRevealEnd) || 5.75);
    const heroLoopEnd = Number(backgrounds.heroLoopEnd) || 0;
    let introRevealActive = !reducedMotion.matches && !saveData;
    let introRevealFrame = 0;
    let heroLoopFrame = 0;
    let userPaused = false;
    let userOptedIn = false;
    let frameRequested = false;
    let heroHeight = hero.offsetHeight;
    let sceneTop = scene.getBoundingClientRect().top + window.scrollY;
    let heroOnScreen = true;
    let factsOnScreen = false;
    if (introRevealActive) {
      hero.classList.add("intro-reveal-waiting");
      document.body.classList.add("home-intro-waiting");
      document.documentElement.classList.add("home-intro-locked");
      window.scrollTo(0,0);
      requestAnimationFrame(() => { if (introRevealActive) window.scrollTo(0,0); });
    }

    const motionAllowed = () => (!reducedMotion.matches && !saveData) || userOptedIn;
    const heroMedia = { element:video, source:safeLink(backgrounds.video), loaded:false, failed:false, pending:false, attempt:0, wanted:null };
    const factsMedia = { element:factsVideo, source:safeLink(backgrounds.factsVideo), loaded:false, failed:false, pending:false, attempt:0, wanted:null };
    const mediaStates = [heroMedia,factsMedia];

    const finishIntroReveal = () => {
      if (!introRevealActive) return;
      introRevealActive = false;
      cancelAnimationFrame(introRevealFrame);
      introRevealFrame = 0;
      greeting.style.clipPath = "";
      hero.classList.remove("intro-reveal-waiting");
      hero.classList.add("intro-reveal-complete");
      document.body.classList.remove("home-intro-waiting");
      document.body.classList.add("home-intro-complete");
      document.documentElement.classList.remove("home-intro-locked");
    };
    const syncGreetingToVideo = () => {
      if (!introRevealActive) return;
      const current = video.currentTime;
      if (current >= revealEnd) { finishIntroReveal(); return; }
      if (current <= revealStart) {
        greeting.style.clipPath = "inset(0 100% 0 0)";
      } else {
        const sourceWidth = video.videoWidth || 1600;
        const sourceHeight = video.videoHeight || 900;
        const progress = Math.max(0,Math.min(1,(current-revealStart)/(revealEnd-revealStart)));
        const scale = Math.max(hero.clientWidth/sourceWidth,hero.clientHeight/sourceHeight);
        const cropLeft = Math.max(0,(sourceWidth*scale-hero.clientWidth)/2);
        const trainTail = sourceWidth*progress*scale-cropLeft;
        const greetingBounds = greeting.getBoundingClientRect();
        const revealed = Math.max(0,Math.min(1,(trainTail-greetingBounds.left)/Math.max(1,greetingBounds.width)));
        greeting.style.clipPath = `inset(0 ${(1-revealed)*100}% 0 0)`;
      }
      introRevealFrame = requestAnimationFrame(syncGreetingToVideo);
    };
    const startIntroReveal = () => {
      if (introRevealActive && !introRevealFrame) introRevealFrame = requestAnimationFrame(syncGreetingToVideo);
    };
    const keepHeroLoopClean = () => {
      if (heroLoopEnd > 0 && Number.isFinite(video.duration) && video.currentTime >= Math.min(heroLoopEnd,video.duration)) {
        video.currentTime = 0;
      }
      heroLoopFrame = requestAnimationFrame(keepHeroLoopClean);
    };
    const startHeroLoopWatcher = () => {
      if (heroLoopEnd > 0 && !heroLoopFrame) heroLoopFrame = requestAnimationFrame(keepHeroLoopClean);
    };
    const syncButton = () => {
      const paused = userPaused || !motionAllowed() || heroMedia.failed;
      motionButton.textContent = paused ? "Play video" : "Pause video";
      motionButton.setAttribute("aria-pressed", String(paused));
      motionButton.setAttribute("aria-label", paused ? "Play background videos" : "Pause background videos");
    };
    const syncMedia = (state,want) => {
      want = Boolean(want && motionAllowed() && !userPaused && !state.failed && !document.hidden);
      if (want === state.wanted) return;
      state.wanted = want;
      if (!want) { state.element.pause(); return; }
      if (!state.loaded) {
        if (!state.source) { state.failed=true; if (state === heroMedia) finishIntroReveal(); return; }
        state.element.src = state.source;
        state.loaded = true;
      }
      if (state.pending) return;
      state.pending = true;
      const attempt = ++state.attempt;
      const promise = state.element.play();
      if (!promise) { state.pending=false; return; }
      promise.then(() => {
        if (attempt !== state.attempt) return;
        state.pending = false;
        if (!state.wanted) state.element.pause();
      }).catch(error => {
        if (attempt !== state.attempt) return;
        state.pending = false;
        if (error.name !== "AbortError") {
          state.failed = true;
          if (state === heroMedia) finishIntroReveal();
        }
        state.wanted = null;
        syncButton();
        if (error.name === "AbortError") requestSceneUpdate();
      });
    };
    const syncPlayback = () => {
      syncMedia(heroMedia,heroOnScreen);
      syncMedia(factsMedia,factsOnScreen);
      syncButton();
    };
    const updateScene = () => {
      frameRequested = false;
      const distance = window.scrollY - sceneTop;
      const raw = Math.max(0, Math.min(1, (distance / Math.max(1,heroHeight) - 0.20) / 0.85));
      const progress = reducedMotion.matches ? (raw >= 0.5 ? 1 : 0) : raw * raw * (3 - 2 * raw);
      videoLayer.style.opacity = String(1-progress);
      document.body.classList.toggle("photo-visible",progress > 0.60);
      heroOnScreen = progress < 0.96 && distance + window.innerHeight > 0;
      factsOnScreen = progress > 0.04 && distance < heroHeight*1.95;
      syncPlayback();
    };
    const requestSceneUpdate = () => {
      if (!frameRequested) { frameRequested = true; requestAnimationFrame(updateScene); }
    };

    motionButton.addEventListener("click", () => {
      if (userPaused || !motionAllowed() || heroMedia.failed) {
        userPaused=false; userOptedIn=true; heroMedia.failed=false;
      } else {
        userPaused=true;
        finishIntroReveal();
      }
      mediaStates.forEach(state => { state.wanted=null; });
      syncPlayback();
    });
    mediaStates.forEach(state => {
      state.element.addEventListener("error", () => {
        state.failed=true; state.element.style.visibility="hidden";
        if (state === heroMedia) finishIntroReveal();
        syncButton();
      });
      state.element.addEventListener("playing", () => {
        state.element.style.visibility="visible";
        if (state === heroMedia) { startIntroReveal(); startHeroLoopWatcher(); }
      });
    });
    window.addEventListener("scroll", requestSceneUpdate, {passive:true});
    window.addEventListener("resize", () => { heroHeight=hero.offsetHeight; sceneTop=scene.getBoundingClientRect().top+window.scrollY; requestSceneUpdate(); }, {passive:true});
    document.addEventListener("visibilitychange", () => { mediaStates.forEach(state => { state.wanted=null; }); syncPlayback(); });
    reducedMotion.addEventListener("change", () => { userOptedIn=false; finishIntroReveal(); mediaStates.forEach(state => { state.wanted=null; }); requestSceneUpdate(); syncButton(); });
    window.addEventListener("pageshow", () => {
      if (introRevealActive) window.scrollTo(0,0);
      requestSceneUpdate();
    });
    window.addEventListener("pagehide", () => {
      if (heroLoopFrame) cancelAnimationFrame(heroLoopFrame);
      heroLoopFrame=0;
      mediaStates.forEach(state => { state.wanted=null; state.element.pause(); });
    });
    syncButton(); updateScene();
  };
  const buildAboutPanel = () => {
    const panel = el("section", "about-panel");
    panel.setAttribute("aria-labelledby", "about-story-title");
    panel.append(el("p", "eyebrow", "A little more about me"));
    const aboutTitle = el("h2", "about-title", "Beyond the projects.");
    aboutTitle.id = "about-story-title";
    panel.append(aboutTitle, el("p", "about-study", `${profile.program} / ${profile.university}`));
    (profile.about || []).forEach(text => panel.append(el("p", "body-copy", text)));

    const detailGrid = el("div", "about-detail-grid");
    const education = el("section", "");
    education.append(el("h3", "eyebrow", "Education"), el("p", "education-title", profile.education), el("p", "small-copy", profile.studyPeriod));
    const skills = el("section", "");
    skills.append(el("h3", "eyebrow", "Skills & interests"));
    const skillList = el("ul", "skill-list");
    (profile.skills || []).forEach(skill => skillList.append(el("li", "skill-chip", skill)));
    skills.append(skillList);
    detailGrid.append(education, skills);
    panel.append(detailGrid);

    const interests = el("section", "interests-section");
    interests.append(el("h3", "eyebrow", "Hobbies and Interests"), el("p", "body-copy", profile.interests));
    panel.append(interests);

    const resumeSection = el("section", "resume-panel");
    resumeSection.id = "resume";
    const resumeCopy = el("div", "");
    resumeCopy.append(el("h3", "section-title", "The resume version."));
    if (resumeUrl) resumeCopy.append(el("p", "small-copy muted", "My education, experience, and skills in one place."));
    resumeSection.append(resumeCopy, resumeUrl ? link("View resume ↗", resumeUrl, "button primary", true) : el("span", "coming-soon", "Resume coming soon"));
    panel.append(resumeSection);
    return panel;
  };
  const buildContactPanel = () => {
    const contactAddress = emailAddresses(profile.contactEmail || profile.email)[0] || "ethanniu79@gmail.com";
    const contactPanel = el("section", "contact-panel");
    contactPanel.id = "contact";
    contactPanel.setAttribute("aria-labelledby", "contact-title");
    contactPanel.append(el("p", "eyebrow", "Get in touch"));
    const contactTitle = el("h2", "contact-title", "Send me a message.");
    contactTitle.id = "contact-title";
    contactPanel.append(contactTitle, el("p", "contact-intro", "Have a question or want to connect?"));

    const form = el("form", "contact-form");
    const emailField = el("label", "contact-field");
    emailField.append(el("span", "contact-label", "Your email"));
    const emailInput = el("input", "contact-input");
    emailInput.type = "email";
    emailInput.name = "email";
    emailInput.autocomplete = "email";
    emailInput.placeholder = "you@example.com";
    emailInput.required = true;
    emailField.append(emailInput);

    const messageField = el("label", "contact-field");
    messageField.append(el("span", "contact-label", "Message"));
    const messageInput = el("textarea", "contact-input contact-message");
    messageInput.name = "message";
    messageInput.rows = 6;
    messageInput.placeholder = "Write your message here";
    messageInput.required = true;
    messageField.append(messageInput);

    const submit = el("button", "button primary contact-submit", "Send message");
    submit.type = "submit";
    const direct = el("p", "contact-direct");
    direct.append("Or email me directly at ", link(contactAddress, "mailto:" + encodeURIComponent(contactAddress).replace(/%40/gi, "@")));
    form.append(emailField, messageField, submit);
    contactPanel.append(form, direct);
    form.addEventListener("submit", event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const subject = "Message from your portfolio website";
      const body = `From: ${emailInput.value.trim()}\n\n${messageInput.value.trim()}`;
      window.location.href = `mailto:${contactAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
    return contactPanel;
  };
  const makePlaceholder = (project, index, unavailable = false) => {
    const box = el("div", "media-placeholder");
    box.append(el("span", "placeholder-index", String(index + 1).padStart(2, "0")));
    const message = el("div", "placeholder-message");
    message.append(el("span", "placeholder-title", unavailable ? "Image not found" : project.category === "Mapping" ? "Your map goes here" : "Your image goes here"));
    message.append(el("span", "placeholder-hint", unavailable ? "Check the image filename in content.js" : "Add an image whenever you’re ready"));
    box.append(message);
    return box;
  };
  const interactiveProjectImage = (project, index, src) => {
    const frame = el("div", "project-media detail-media map-viewer");
    const toolbar = el("div", "map-viewer-toolbar");
    toolbar.append(el("span", "map-viewer-hint", "Drag to move · scroll or use the controls to zoom"));
    const controls = el("div", "map-viewer-controls");
    const zoomOut = el("button", "map-viewer-button", "−");
    const zoomIn = el("button", "map-viewer-button", "+");
    const reset = el("button", "map-viewer-button map-reset-button", "Reset");
    const status = el("span", "map-zoom-status", "100%");
    zoomOut.type = zoomIn.type = reset.type = "button";
    zoomOut.setAttribute("aria-label", "Zoom out");
    zoomIn.setAttribute("aria-label", "Zoom in");
    reset.setAttribute("aria-label", "Reset map position and zoom");
    status.setAttribute("aria-live", "polite");
    controls.append(zoomOut, zoomIn, reset, status, link("Open original ↗", src, "full-map-link", true));
    toolbar.append(controls);

    const viewport = el("div", "map-viewport");
    viewport.tabIndex = 0;
    viewport.setAttribute("role", "region");
    viewport.setAttribute("aria-label", `Interactive map viewer for ${project.title}. Drag to move, use the mouse wheel or plus and minus keys to zoom, and press zero to reset.`);
    const image = el("img", "project-image interactive-map-image");
    image.alt = project.imageAlt || `Map for ${project.title}`;
    image.loading = "eager";
    image.decoding = "async";
    image.draggable = false;
    viewport.append(image);
    frame.append(toolbar, viewport);

    let zoom = 1;
    let panX = 0;
    let panY = 0;
    let baseWidth = 0;
    let baseHeight = 0;
    const minZoom = 1;
    const maxZoom = 8;
    let activePointer = null;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragOriginX = 0;
    let dragOriginY = 0;

    const clampPan = () => {
      const bounds = viewport.getBoundingClientRect();
      const maxX = Math.max(0, (baseWidth * zoom - bounds.width) / 2);
      const maxY = Math.max(0, (baseHeight * zoom - bounds.height) / 2);
      panX = Math.max(-maxX, Math.min(maxX, panX));
      panY = Math.max(-maxY, Math.min(maxY, panY));
    };
    const draw = () => {
      clampPan();
      image.style.left = `calc(50% + ${panX}px)`;
      image.style.top = `calc(50% + ${panY}px)`;
      image.style.transform = `translate(-50%, -50%) scale(${zoom})`;
      status.textContent = `${Math.round(zoom * 100)}%`;
      zoomOut.disabled = zoom <= minZoom + 0.001;
      zoomIn.disabled = zoom >= maxZoom - 0.001;
    };
    const fitImage = () => {
      if (!image.naturalWidth || !image.naturalHeight) return;
      const bounds = viewport.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const fit = Math.min(bounds.width / image.naturalWidth, bounds.height / image.naturalHeight);
      baseWidth = image.naturalWidth * fit;
      baseHeight = image.naturalHeight * fit;
      image.style.width = `${baseWidth}px`;
      image.style.height = `${baseHeight}px`;
      draw();
    };
    const setZoom = (nextZoom, focalX = 0, focalY = 0) => {
      const previous = zoom;
      zoom = Math.max(minZoom, Math.min(maxZoom, nextZoom));
      const ratio = zoom / previous;
      panX = focalX - (focalX - panX) * ratio;
      panY = focalY - (focalY - panY) * ratio;
      draw();
    };
    const resetView = () => {
      zoom = 1;
      panX = 0;
      panY = 0;
      draw();
    };
    const endDrag = event => {
      if (event.pointerId !== activePointer) return;
      activePointer = null;
      viewport.classList.remove("is-dragging");
      if (viewport.hasPointerCapture && viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
    };

    image.addEventListener("load", fitImage, { once: true });
    image.addEventListener("error", () => frame.replaceChildren(makePlaceholder(project, index, true)), { once: true });
    viewport.addEventListener("wheel", event => {
      event.preventDefault();
      const bounds = viewport.getBoundingClientRect();
      const focalX = event.clientX - bounds.left - bounds.width / 2;
      const focalY = event.clientY - bounds.top - bounds.height / 2;
      setZoom(zoom * Math.exp(-event.deltaY * 0.0015), focalX, focalY);
    }, { passive: false });
    viewport.addEventListener("pointerdown", event => {
      if (event.button !== undefined && event.button !== 0) return;
      activePointer = event.pointerId;
      dragStartX = event.clientX;
      dragStartY = event.clientY;
      dragOriginX = panX;
      dragOriginY = panY;
      if (viewport.setPointerCapture) viewport.setPointerCapture(event.pointerId);
      viewport.classList.add("is-dragging");
    });
    viewport.addEventListener("pointermove", event => {
      if (event.pointerId !== activePointer) return;
      panX = dragOriginX + event.clientX - dragStartX;
      panY = dragOriginY + event.clientY - dragStartY;
      draw();
    });
    viewport.addEventListener("pointerup", endDrag);
    viewport.addEventListener("pointercancel", endDrag);
    viewport.addEventListener("keydown", event => {
      const panStep = event.shiftKey ? 80 : 35;
      if (event.key === "+" || event.key === "=") setZoom(zoom * 1.25);
      else if (event.key === "-") setZoom(zoom / 1.25);
      else if (event.key === "0") resetView();
      else if (event.key === "ArrowLeft") { panX += panStep; draw(); }
      else if (event.key === "ArrowRight") { panX -= panStep; draw(); }
      else if (event.key === "ArrowUp") { panY += panStep; draw(); }
      else if (event.key === "ArrowDown") { panY -= panStep; draw(); }
      else return;
      event.preventDefault();
    });
    zoomOut.addEventListener("click", () => setZoom(zoom / 1.35));
    zoomIn.addEventListener("click", () => setZoom(zoom * 1.35));
    reset.addEventListener("click", resetView);
    if (typeof ResizeObserver === "function") new ResizeObserver(fitImage).observe(viewport);
    else window.addEventListener("resize", fitImage, { passive: true });
    image.src = src;
    if (image.complete) fitImage();
    return frame;
  };
  const embeddedProjectMap = (project, index, src) => {
    const frame = el("div", "project-media detail-media embedded-map");
    const toolbar = el("div", "map-viewer-toolbar");
    toolbar.append(
      el("span", "map-viewer-hint", "Click a DA for details · drag to move · scroll or use controls to zoom"),
      link("Open full map ↗", src, "full-map-link", true)
    );
    const map = el("iframe", "interactive-map-embed");
    map.title = `Interactive Toronto accessibility map for ${project.title}`;
    map.loading = "lazy";
    map.src = src;
    frame.append(toolbar, map);
    return frame;
  };
  const projectImage = (project, index, detailed = false) => {
    const frame = el("div", detailed ? "project-media detail-media" : "project-media");
    if (project.zoomable) frame.classList.add("map-project-media");
    const interactiveMap = safeLink(project.interactiveMap);
    if (detailed && interactiveMap) return embeddedProjectMap(project, index, interactiveMap);
    const src = safeLink(detailed ? project.image : (project.previewImage || project.image));
    if (src) {
      if (detailed && project.zoomable) return interactiveProjectImage(project, index, src);
      const image = el("img", "project-image");
      image.alt = project.imageAlt || `Preview of ${project.title}`;
      image.loading = detailed ? "eager" : "lazy";
      image.decoding = "async";
      image.addEventListener("error", () => frame.replaceChildren(makePlaceholder(project, index, true)), { once: true });
      image.src = src;
      if (detailed) {
        const imageLink = safeLink(project.imageLink) || src;
        const full = link("", imageLink, "full-image", true);
        full.setAttribute("aria-label", project.imageLink
          ? `Open ${project.title} live project (new tab)`
          : `Open full-size image for ${project.title} (new tab)`);
        full.append(image);
        frame.append(full);
      } else frame.append(image);
    } else frame.append(makePlaceholder(project, index));
    return frame;
  };
  const pageHeading = (eyebrow, title, description) => {
    const heading = el("div", "page-heading");
    heading.append(el("p", "eyebrow", eyebrow), el("h1", "page-title", title));
    if (description) heading.append(el("p", "page-description", description));
    return heading;
  };
  const renderAbout = () => {
    setTitle("About Me", "More about Ethan Niu, his interests, education, skills, and experience.");
    main.classList.add("inner-page", "about-page-main");
    main.append(pageHeading("The person behind the work", "About Me", "A little context behind the maps, projects, and the person making them."));
    const layout = el("div", "about-page-layout");
    layout.append(buildAboutPanel(), buildContactPanel());
    main.append(layout);
  };
  const renderProjects = () => {
    setTitle("Projects");
    main.classList.add("inner-page");
    main.append(pageHeading("A collection of work", "Projects", "Maps, research, and other things I’ve worked on. Select a project to take a closer look"));
    const grid = el("div", "project-grid");
    data.projects.forEach((project, index) => {
      const card = el("article", "project-card");
      const target = link("", `project.html?id=${encodeURIComponent(project.id)}`, "project-card-link");
      target.append(projectImage(project, index));
      const info = el("div", "card-copy");
      const meta = el("div", "card-meta");
      meta.append(el("span", "", project.category), el("span", "", project.year));
      const title = el("h2", "card-title", project.title);
      const arrow = el("span", "card-arrow", "↗"); arrow.setAttribute("aria-hidden", "true"); title.append(arrow);
      info.append(meta, title, el("p", "card-description", project.cardSummary || project.summary));
      target.append(info); card.append(target); grid.append(card);
    });
    if (!data.projects.length) grid.append(el("p", "empty-state", "Projects will appear here when they’re added."));
    main.append(grid);
    const note = el("div", "end-note"); note.append(el("span", "", "A little context behind the work."), link("Get to know me →", "about.html")); main.append(note);
  };
  const textSection = (title, text) => {
    const section = el("section", "text-section"); section.append(el("h2", "section-title", title), el("p", "body-copy", text)); return section;
  };
  const renderProject = () => {
    main.classList.add("inner-page");
    const id = new URLSearchParams(window.location.search).get("id");
    const index = data.projects.findIndex(project => project.id === id);
    if (index < 0) {
      setTitle("Project not found"); main.append(pageHeading("Something is missing", "Project not found.", "This project may have moved or hasn’t been added yet."), link("Back to all projects →", "projects.html", "button primary")); return;
    }
    const project = data.projects[index]; setTitle(project.title, project.summary, project.previewImage || project.image);
    document.querySelector('meta[name="description"]').content = project.summary;
    main.append(link("← All projects", "projects.html", "back-link"), pageHeading(`${project.category} / ${project.year}`, project.title, project.summary));
    const facts = el("dl", "project-facts");
    for (const [label, value] of [["Context", project.context], ["Tools & methods", (project.tools || []).join(" · ")]]) {
      const fact = el("div", ""); fact.append(el("dt", "eyebrow", label), el("dd", "small-copy", value)); facts.append(fact);
    }
    main.append(facts);
    const overview = textSection("The idea", project.overview);
    overview.classList.add("project-introduction");
    main.append(overview);
    const figure = el("figure", "project-figure");
    figure.append(projectImage(project, index, true), el("figcaption", "figure-caption", project.caption)); main.append(figure);
    const resources = el("div", "resource-links");
    for (const [label, value] of [["View PDF ↗", project.pdf], [project.category === "Mapping" ? "Open interactive map ↗" : "Open live project ↗", project.liveUrl], ["View project source ↗", project.sourceUrl]]) {
      const href = safeLink(value); if (href) resources.append(link(label, href, "button", true));
    }
    if (resources.childElementCount) main.append(resources);
    const sections = el("div", "project-story");
    sections.append(textSection("What I did", project.process), textSection("The outcome", project.outcome)); main.append(sections);
    const bottom = el("div", "end-note"); bottom.append(link("← All projects", "projects.html"));
    if (data.projects.length > 1) {
      const next = data.projects[(index + 1) % data.projects.length]; bottom.append(link(`Next: ${next.title} →`, `project.html?id=${encodeURIComponent(next.id)}`));
    }
    main.append(bottom);
  };
  if (page === "home") renderHome();
  else if (page === "about") renderAbout();
  else if (page === "projects") renderProjects();
  else if (page === "project") renderProject();
})();
