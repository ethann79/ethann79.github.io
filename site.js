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
  const brand = link("Home", "index.html", "brand");
  brand.setAttribute("aria-label", `${profile.name} — Home`);
  if (page === "home") brand.setAttribute("aria-current", "page");
  const nav = el("nav", "navigation");
  nav.setAttribute("aria-label", "Main navigation");
  for (const [label, href, key] of [["Projects", "projects.html", "projects"]]) {
    const item = link(label, href);
    if (page === key || (page === "project" && key === "projects")) item.setAttribute("aria-current", "page");
    nav.append(item);
  }
  const resume = link("Resume ↗", resumeUrl || "index.html#resume", "resume-nav", Boolean(resumeUrl));
  if (resumeUrl) resume.setAttribute("aria-label", "Open resume (new tab)");
  header.append(brand, nav, resume);
  const footer = document.getElementById("site-footer");
  footer.append(el("span", "footer-credit", `${profile.name} · Portfolio`));
  const contact = el("div", "footer-links");
  const addresses = emailAddresses(profile.email);
  addresses.forEach(address => {
    const label = addresses.length === 1 ? "Email ↗" : address + " ↗";
    const href = "mailto:" + encodeURIComponent(address).replace(/%40/gi,"@");
    contact.append(link(label,href));
  });
  for (const [label, value, service] of [
    ["LinkedIn ↗", profile.linkedin, "linkedin"],
    ["GitHub ↗", profile.github, "github"],
    ["Instagram ↗", profile.instagram || profile.Instagram, "instagram"]
  ]) {
    const href = socialLink(value,service);
    if (href) contact.append(link(label,href,"",true));
  }
  if (!contact.childElementCount) contact.append(el("span", "muted", "Your contact links will appear here"));
  footer.append(contact);

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
    const mapLayer = el("div", "map-layer");
    const mapImage = el("img", "map-background");
    mapImage.alt = ""; mapImage.src = safeLink(backgrounds.map); mapImage.decoding = "async";
    mapImage.style.objectPosition = backgrounds.mapPosition || "50% 50%";
    mapLayer.append(mapImage, el("div", "map-wash"));
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
    stage.append(mapLayer, videoLayer);
    const hero = el("section", "video-hero");
    hero.setAttribute("aria-labelledby", "hero-title");
    const greeting = el("h1", "hero-greeting"); greeting.id = "hero-title";
    greeting.append(el("span", "greeting-prefix", profile.greeting || "Hello, I’m"), document.createTextNode(" "), el("span", "greeting-name", profile.name));
    const bottom = el("div", "hero-bottom");
    const heroCopy = el("div", "hero-copy");
    heroCopy.append(el("p", "hero-description", profile.introduction));
    const opportunity = profile.opportunity || {};
    const opportunityLine = el("p", "hero-opportunity");
    opportunityLine.append(opportunity.lead || "", el("strong", "", opportunity.emphasis || ""));
    if (opportunityLine.textContent.trim()) heroCopy.append(opportunityLine);
    bottom.append(heroCopy, link("View my projects", "projects.html", "button hero-button"));
    const scrollLink = link("About me ↓", "#about", "scroll-cue");
    const motionButton = el("button", "motion-toggle", "Pause video");
    motionButton.type = "button"; motionButton.setAttribute("aria-pressed", "false");
    hero.append(greeting, bottom, scrollLink, motionButton);
    const about = el("section", "home-about"); about.id = "about";
    about.setAttribute("aria-labelledby", "about-title");
    const panel = el("div", "about-panel");
    panel.append(el("p", "eyebrow", "A little more about me"));
    const aboutTitle = el("h2", "about-title", "Beyond the projects."); aboutTitle.id = "about-title"; panel.append(aboutTitle);
    panel.append(el("p", "about-study", `${profile.program} / ${profile.university}`));
    (profile.about || []).forEach(text => panel.append(el("p", "body-copy", text)));
    const detailGrid = el("div", "about-detail-grid");
    const education = el("section", ""); education.append(el("h3", "eyebrow", "Education"), el("p", "education-title", profile.education), el("p", "small-copy", profile.studyPeriod));
    const skills = el("section", ""); skills.append(el("h3", "eyebrow", "Skills & interests"));
    const skillList = el("ul", "skill-list"); (profile.skills || []).forEach(skill => skillList.append(el("li", "skill-chip", skill))); skills.append(skillList);
    detailGrid.append(education,skills); panel.append(detailGrid);
    const interests = el("section", "interests-section"); interests.append(el("h3", "eyebrow", "Away from my desk"), el("p", "body-copy", profile.interests)); panel.append(interests);
    const resumeSection = el("section", "resume-panel"); resumeSection.id = "resume";
    const resumeCopy = el("div", ""); resumeCopy.append(el("h3", "section-title", "The resume version."));
    if (resumeUrl) resumeCopy.append(el("p", "small-copy muted", "My education, experience, and skills in one place."));
    resumeSection.append(resumeCopy, resumeUrl ? link("View resume ↗",resumeUrl,"button primary",true) : el("span","coming-soon","Resume coming soon"));
    panel.append(resumeSection);
    const connect = el("div", "about-connect"); connect.append(el("p", "small-copy", profile.availability), contact.cloneNode(true)); panel.append(connect);

    const contactAddress = emailAddresses(profile.contactEmail || profile.email)[0] || "ethanniu79@gmail.com";
    const contactPanel = el("section", "contact-panel"); contactPanel.id = "contact";
    contactPanel.setAttribute("aria-labelledby", "contact-title");
    contactPanel.append(el("p", "eyebrow", "Get in touch"));
    const contactTitle = el("h2", "contact-title", "Send me a message."); contactTitle.id = "contact-title";
    contactPanel.append(contactTitle, el("p", "contact-intro", "Have a question or want to connect?"));

    const form = el("form", "contact-form");
    const emailField = el("label", "contact-field");
    emailField.append(el("span", "contact-label", "Your email"));
    const emailInput = el("input", "contact-input");
    emailInput.type = "email"; emailInput.name = "email"; emailInput.autocomplete = "email";
    emailInput.placeholder = "you@example.com"; emailInput.required = true;
    emailField.append(emailInput);

    const messageField = el("label", "contact-field");
    messageField.append(el("span", "contact-label", "Message"));
    const messageInput = el("textarea", "contact-input contact-message");
    messageInput.name = "message"; messageInput.rows = 6; messageInput.placeholder = "Write your message here"; messageInput.required = true;
    messageField.append(messageInput);

    const submit = el("button", "button primary contact-submit", "Send message"); submit.type = "submit";
    const direct = el("p", "contact-direct");
    direct.append("Or email me directly at ", link(contactAddress, "mailto:" + encodeURIComponent(contactAddress).replace(/%40/gi,"@")));
    form.append(emailField, messageField, submit);
    contactPanel.append(form, direct);
    form.addEventListener("submit", event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const subject = "Message from your portfolio website";
      const body = `From: ${emailInput.value.trim()}\n\n${messageInput.value.trim()}`;
      window.location.href = `mailto:${contactAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });

    about.append(panel, contactPanel);
    const mapCredit = safeLink(backgrounds.mapCreditUrl);
    if (backgrounds.mapCredit) about.append(mapCredit ? link(backgrounds.mapCredit,mapCredit,"map-credit",true) : el("p","map-credit",backgrounds.mapCredit));
    scene.append(stage,hero,about); main.append(scene);

    // Native scrolling, with only the background opacity linked to scroll position.
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const saveData = Boolean(navigator.connection && navigator.connection.saveData);
    let userPaused = false;
    let userOptedIn = false;
    let playbackFailed = false;
    let sourceLoaded = false;
    let playPending = false;
    let playAttempt = 0;
    let lastWanted = null;
    let frameRequested = false;
    let heroHeight = hero.offsetHeight;
    let sceneTop = scene.getBoundingClientRect().top + window.scrollY;
    let heroOnScreen = true;
    const motionAllowed = () => (!reducedMotion.matches && !saveData) || userOptedIn;
    const syncButton = () => {
      const paused = userPaused || !motionAllowed() || playbackFailed;
      motionButton.textContent = paused ? "Play video" : "Pause video";
      motionButton.setAttribute("aria-pressed", String(paused));
      motionButton.setAttribute("aria-label", paused ? "Play background video" : "Pause background video");
    };
    const syncPlayback = () => {
      const want = motionAllowed() && !userPaused && !playbackFailed && heroOnScreen && !document.hidden;
      if (want === lastWanted) return;
      lastWanted = want;
      if (!want) { video.pause(); syncButton(); return; }
      if (!sourceLoaded) {
        const source = safeLink(backgrounds.video);
        if (!source) { playbackFailed = true; syncButton(); return; }
        video.src = source; sourceLoaded = true;
      }
      if (!playPending) {
        playPending = true;
        const attempt = ++playAttempt;
        const promise = video.play();
        if (promise) promise.then(() => {
          if (attempt !== playAttempt) return;
          playPending = false;
          if (!lastWanted) video.pause();
        }).catch(error => {
          if (attempt !== playAttempt) return;
          playPending = false;
          if (error.name !== "AbortError") playbackFailed = true;
          lastWanted = null;
          syncButton();
          if (error.name === "AbortError") requestSceneUpdate();
        });
      }
      syncButton();
    };
    const updateScene = () => {
      frameRequested = false;
      const distance = window.scrollY - sceneTop;
      const raw = Math.max(0, Math.min(1, (distance / Math.max(1,heroHeight) - 0.20) / 0.85));
      const progress = reducedMotion.matches ? (raw >= 0.5 ? 1 : 0) : raw * raw * (3 - 2 * raw);
      videoLayer.style.opacity = String(1-progress);
      document.body.classList.toggle("map-visible",progress > 0.60);
      heroOnScreen = progress < 0.995 && distance + window.innerHeight > 0;
      syncPlayback();
    };
    const requestSceneUpdate = () => {
      if (!frameRequested) { frameRequested = true; requestAnimationFrame(updateScene); }
    };
    motionButton.addEventListener("click", () => {
      if (userPaused || !motionAllowed() || playbackFailed) { userPaused=false; userOptedIn=true; playbackFailed=false; }
      else userPaused=true;
      lastWanted=null; syncPlayback(); syncButton();
    });
    video.addEventListener("error", () => { playbackFailed=true; video.style.visibility="hidden"; syncButton(); });
    video.addEventListener("playing", () => { video.style.visibility="visible"; });
    window.addEventListener("scroll", requestSceneUpdate, {passive:true});
    window.addEventListener("resize", () => { heroHeight=hero.offsetHeight; sceneTop=scene.getBoundingClientRect().top+window.scrollY; requestSceneUpdate(); }, {passive:true});
    document.addEventListener("visibilitychange", () => { lastWanted=null; syncPlayback(); });
    reducedMotion.addEventListener("change", () => { userOptedIn=false; lastWanted=null; requestSceneUpdate(); syncButton(); });
    window.addEventListener("pageshow", requestSceneUpdate);
    window.addEventListener("pagehide", () => { lastWanted = null; video.pause(); });
    syncButton(); updateScene();
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
      el("span", "map-viewer-hint", "Drag the map to move · scroll or use the map controls to zoom"),
      link("Open full map ↗", src, "full-map-link", true)
    );
    const map = el("iframe", "interactive-map-embed");
    map.title = `Interactive Toronto accessibility map for ${project.title}`;
    map.loading = "eager";
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
        const full = link("", src, "full-image", true);
        full.setAttribute("aria-label", `Open full-size image for ${project.title} (new tab)`);
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
    const note = el("div", "end-note"); note.append(el("span", "", "A little context behind the work."), link("Get to know me →", "index.html#about")); main.append(note);
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
  else if (page === "projects") renderProjects();
  else if (page === "project") renderProject();
})();
