(function () {
  const STORAGE_KEY =
    (window.FONDATION_SUPPORT &&
      window.FONDATION_SUPPORT.meta &&
      window.FONDATION_SUPPORT.meta.storageKey) ||
    "fondation_support_completed_sections_v1";

  function getSections() {
    return Array.isArray(window.FONDATION_SUPPORT?.sections)
      ? window.FONDATION_SUPPORT.sections
      : [];
  }

  function getTrackableSections() {
    return getSections().filter(section => section.trackCompletion !== false);
  }

  function getDefaultSectionId() {
    return getSections()[0]?.id || null;
  }

  function loadState() {
    const fallback = {
      currentSectionId: getDefaultSectionId(),
      completedIds: []
    };

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return fallback;

      const parsed = JSON.parse(raw);
      return {
        currentSectionId: parsed.currentSectionId || fallback.currentSectionId,
        completedIds: Array.isArray(parsed.completedIds) ? parsed.completedIds : []
      };
    } catch (error) {
      console.warn("⚠️ État du support illisible, réinitialisation.", error);
      return fallback;
    }
  }

  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      currentSectionId: state.currentSectionId,
      completedIds: state.completedIds
    }));
  }

  function getSectionById(sectionId) {
    return getSections().find(section => section.id === sectionId) || null;
  }

  function getSectionIndex(sectionId) {
    return getSections().findIndex(section => section.id === sectionId);
  }

  function isCompleted(sectionId) {
    return loadState().completedIds.includes(sectionId);
  }

  function setCurrentSection(sectionId) {
    const state = loadState();
    state.currentSectionId = sectionId;
    saveState(state);
  }

  function toggleCompleted(sectionId) {
    const section = getSectionById(sectionId);
    if (!section || section.trackCompletion === false) return;

    const state = loadState();
    const alreadyDone = state.completedIds.includes(sectionId);

    if (alreadyDone) {
      state.completedIds = state.completedIds.filter(id => id !== sectionId);
    } else {
      state.completedIds.push(sectionId);
    }

    saveState(state);
  }

  function getCompletionStats() {
    const state = loadState();
    const trackable = getTrackableSections();
    const completed = trackable.filter(section => state.completedIds.includes(section.id)).length;
    const total = trackable.length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { completed, total, percent };
  }

  function qs(id) {
    return document.getElementById(id);
  }

  function buildTocHTML() {
    const state = loadState();

    return `
      <ul class="support-toc-list">
        ${getSections().map((section, index) => {
          const active = state.currentSectionId === section.id;
          const done = section.trackCompletion !== false && state.completedIds.includes(section.id);
          const meta = section.trackCompletion === false ? "Informatif" : (done ? "Terminé" : "À explorer");

          return `
            <li class="support-toc-item">
              <button
                type="button"
                class="support-toc-btn ${active ? "is-active" : ""} ${done ? "is-completed" : ""}"
                data-support-section-id="${section.id}"
              >
                <span class="support-toc-title">${section.shortLabel || section.label || `Chapitre ${index + 1}`}</span>
                <span class="support-toc-meta">${meta}</span>
              </button>
            </li>
          `;
        }).join("")}
      </ul>
    `;
  }

  function renderProgress() {
    const stats = getCompletionStats();
    const value = `${stats.percent}%`;
    const meta = `${stats.completed}/${stats.total} chapitres terminés`;

    if (qs("support-progress-value")) qs("support-progress-value").textContent = value;
    if (qs("support-progress-meta")) qs("support-progress-meta").textContent = meta;
    if (qs("support-progress-value-mobile")) qs("support-progress-value-mobile").textContent = value;
    if (qs("support-progress-meta-mobile")) qs("support-progress-meta-mobile").textContent = meta;
  }

  function renderToc() {
    const html = buildTocHTML();
    if (qs("support-toc")) qs("support-toc").innerHTML = html;
    if (qs("support-toc-mobile")) qs("support-toc-mobile").innerHTML = html;
  }

  function renderCurrentSection() {
    const state = loadState();
    const current = getSectionById(state.currentSectionId) || getSections()[0] || null;
    if (!current) return;

    const content = qs("support-content");
    const currentTitle = qs("support-topbar-current");
    const currentSub = qs("support-topbar-sub");
    const statusBadge = qs("support-status-badge");
    const advanceBtn = qs("support-advance-btn");
    const prevBtn = qs("support-prev-btn");
    const contentWrap = qs("support-content-wrap");
    const subtitle = qs("support-sidebar-subtitle");

    if (content) {
      content.innerHTML = current.html || "<p>Contenu indisponible.</p>";
    }

    if (subtitle) {
      subtitle.textContent = window.FONDATION_SUPPORT?.meta?.subtitle || "";
    }

    if (currentTitle) {
      currentTitle.textContent = current.shortLabel || current.label || "FONDATION";
    }

    if (currentSub) {
      currentSub.textContent = current.trackCompletion === false ? "Chapitre informatif" : "Chapitre du support";
    }

    const done = isCompleted(current.id);

    if (statusBadge) {
      if (current.trackCompletion === false) {
        statusBadge.className = "support-status-badge is-pending";
        statusBadge.textContent = "Informatif";
      } else if (done) {
        statusBadge.className = "support-status-badge is-done";
        statusBadge.textContent = "Terminé";
      } else {
        statusBadge.className = "support-status-badge is-pending";
        statusBadge.textContent = "À explorer";
      }
    }

    const index = getSectionIndex(current.id);
    const isLastSection = index >= getSections().length - 1;

    if (prevBtn) prevBtn.disabled = index <= 0;

    if (advanceBtn) {
      if (current.trackCompletion === false) {
        advanceBtn.disabled = isLastSection;
        advanceBtn.className = "support-btn support-btn--ghost";
        advanceBtn.textContent = isLastSection
          ? "ℹ️ Fin du support"
          : "Chapitre suivant →";
      } else if (done) {
        advanceBtn.disabled = isLastSection;
        advanceBtn.className = "support-btn support-btn--done";
        advanceBtn.textContent = isLastSection
          ? "✅ Chapitre terminé"
          : "✅ Terminé - chapitre suivant";
      } else {
        advanceBtn.disabled = false;
        advanceBtn.className = "support-btn support-btn--primary";
        advanceBtn.textContent = "✅ Terminer et passer au suivant";
      }
    }

    if (contentWrap) contentWrap.scrollTop = 0;
  }

  function render() {
    renderProgress();
    renderToc();
    renderCurrentSection();
  }

  function goToSection(sectionId) {
    if (!getSectionById(sectionId)) return;
    setCurrentSection(sectionId);
    render();
    closeDrawer();
  }

  function goToAdjacent(direction) {
    const state = loadState();
    const currentIndex = getSectionIndex(state.currentSectionId);
    const nextIndex = currentIndex + direction;
    if (nextIndex < 0 || nextIndex >= getSections().length) return;

    goToSection(getSections()[nextIndex].id);
  }


  function advanceCurrentSection() {
    const state = loadState();
    const current = getSectionById(state.currentSectionId);
    if (!current) return;

    if (current.trackCompletion !== false && !isCompleted(current.id)) {
      toggleCompleted(current.id);
    }

    const currentIndex = getSectionIndex(current.id);
    const nextIndex = currentIndex + 1;

    if (nextIndex >= 0 && nextIndex < getSections().length) {
      setCurrentSection(getSections()[nextIndex].id);
    }

    render();
  }


  function open() {
    const overlay = qs("support-overlay");
    if (!overlay) return;

    render();
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function close() {
    const overlay = qs("support-overlay");
    if (!overlay) return;

    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    closeDrawer();
    document.body.style.overflow = "";
  }

  function openDrawer() {
    const drawer = qs("support-mobile-drawer");
    if (!drawer) return;
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
  }

  function closeDrawer() {
    const drawer = qs("support-mobile-drawer");
    if (!drawer) return;
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
  }

  function bindEvents() {
    document.addEventListener("click", function (event) {
      const tocBtn = event.target.closest("[data-support-section-id]");
      if (tocBtn) {
        goToSection(tocBtn.getAttribute("data-support-section-id"));
        return;
      }

      if (event.target.closest("#support-close-btn")) {
        close();
        return;
      }

      if (event.target.closest("#support-menu-btn")) {
        openDrawer();
        return;
      }

      if (event.target.closest("#support-mobile-close-btn") || event.target.closest("#support-mobile-backdrop")) {
        closeDrawer();
        return;
      }

      if (event.target.closest("#support-prev-btn")) {
        goToAdjacent(-1);
        return;
      }

      if (event.target.closest("#support-advance-btn")) {
        advanceCurrentSection();
        return;
      }
    });

    document.addEventListener("keydown", function (event) {
      const overlay = qs("support-overlay");
      if (!overlay || !overlay.classList.contains("is-open")) return;

      if (event.key === "Escape") {
        close();
      }
    });
  }

  function init() {
    if (!window.FONDATION_SUPPORT || !Array.isArray(window.FONDATION_SUPPORT.sections)) {
      console.warn("⚠️ FONDATION_SUPPORT introuvable.");
      return;
    }

    const state = loadState();
    if (!getSectionById(state.currentSectionId)) {
      saveState({
        currentSectionId: getDefaultSectionId(),
        completedIds: state.completedIds || []
      });
    }

    bindEvents();
    render();
  }

  window.FondationSupportOverlay = {
    init,
    open,
    close,
    render
  };

  document.addEventListener("DOMContentLoaded", init);
})();
