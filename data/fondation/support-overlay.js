(function () {
  const META = window.FONDATION_SUPPORT?.meta || {};
  const STORAGE_KEY = META.storageKey || 'fondation_support_completed_sections_v2';
  const FORM_STORAGE_KEY = META.formStorageKey || 'fondation_support_forms_v2';

  function qs(id) {
    return document.getElementById(id);
  }

  function getSections() {
    return Array.isArray(window.FONDATION_SUPPORT?.sections) ? window.FONDATION_SUPPORT.sections : [];
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
      console.warn('⚠️ État du support illisible, réinitialisation.', error);
      return fallback;
    }
  }

  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      currentSectionId: state.currentSectionId,
      completedIds: state.completedIds
    }));
  }

  function loadForms() {
    const fallback = {
      checkinHome: {
        feelingsHome: '',
        likesHome: '',
        heavinessHome: '',
        greenery: '',
        waterMantra: ''
      },
      entourageQuality: {
        people: [createEmptyPerson()]
      }
    };

    try {
      const raw = localStorage.getItem(FORM_STORAGE_KEY);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return {
        checkinHome: {
          ...fallback.checkinHome,
          ...(parsed.checkinHome || {})
        },
        entourageQuality: {
          people: normalizePeople(parsed.entourageQuality?.people)
        }
      };
    } catch (error) {
      console.warn('⚠️ Données du support illisibles, réinitialisation.', error);
      return fallback;
    }
  }

  function saveForms(forms) {
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(forms));
  }

  function createEmptyPerson() {
    return {
      id: `person_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      who: '',
      brings: '',
      burdens: '',
      gauge: ''
    };
  }

  function normalizePeople(people) {
    if (!Array.isArray(people) || people.length === 0) {
      return [createEmptyPerson()];
    }

    return people.map((person, index) => ({
      id: person?.id || `person_${index}_${Math.random().toString(36).slice(2, 8)}`,
      who: person?.who || '',
      brings: person?.brings || '',
      burdens: person?.burdens || '',
      gauge: ['1', '2', '3', '4', '5'].includes(String(person?.gauge || '')) ? String(person.gauge) : ''
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

  function buildTocHTML() {
    const state = loadState();

    return `
      <ul class="support-toc-list">
        ${getSections().map((section, index) => {
          const active = state.currentSectionId === section.id;
          const done = section.trackCompletion !== false && state.completedIds.includes(section.id);
          const meta = section.trackCompletion === false ? 'Informatif' : (done ? 'Terminé' : 'À explorer');

          return `
            <li class="support-toc-item">
              <button
                type="button"
                class="support-toc-btn ${active ? 'is-active' : ''} ${done ? 'is-completed' : ''}"
                data-support-section-id="${section.id}"
              >
                <span class="support-toc-title">${section.shortLabel || section.label || `Chapitre ${index + 1}`}</span>
                <span class="support-toc-meta">${meta}</span>
              </button>
            </li>
          `;
        }).join('')}
      </ul>
    `;
  }

  function renderProgress() {
    const stats = getCompletionStats();
    const value = `${stats.percent}%`;
    const meta = `${stats.completed}/${stats.total} chapitres terminés`;

    if (qs('support-progress-value')) qs('support-progress-value').textContent = value;
    if (qs('support-progress-meta')) qs('support-progress-meta').textContent = meta;
    if (qs('support-progress-value-mobile')) qs('support-progress-value-mobile').textContent = value;
    if (qs('support-progress-meta-mobile')) qs('support-progress-meta-mobile').textContent = meta;
  }

  function renderToc() {
    const html = buildTocHTML();
    if (qs('support-toc')) qs('support-toc').innerHTML = html;
    if (qs('support-toc-mobile')) qs('support-toc-mobile').innerHTML = html;
  }

  function renderCurrentSection() {
    const state = loadState();
    const current = getSectionById(state.currentSectionId) || getSections()[0] || null;
    if (!current) return;

    const content = qs('support-content');
    const currentTitle = qs('support-topbar-current');
    const currentSub = qs('support-topbar-sub');
    const statusBadge = qs('support-status-badge');
    const advanceBtn = qs('support-advance-btn');
    const prevBtn = qs('support-prev-btn');
    const contentWrap = qs('support-content-wrap');
    const subtitle = qs('support-sidebar-subtitle');

    if (content) content.innerHTML = current.html || '<p>Contenu indisponible.</p>';
    if (subtitle) subtitle.textContent = window.FONDATION_SUPPORT?.meta?.subtitle || '';
    if (currentTitle) currentTitle.textContent = current.shortLabel || current.label || 'FONDATION';
    if (currentSub) currentSub.textContent = current.trackCompletion === false ? 'Chapitre informatif' : 'Chapitre du support';

    const done = isCompleted(current.id);

    if (statusBadge) {
      if (current.trackCompletion === false) {
        statusBadge.className = 'support-status-badge is-pending';
        statusBadge.textContent = 'Informatif';
      } else if (done) {
        statusBadge.className = 'support-status-badge is-done';
        statusBadge.textContent = 'Terminé';
      } else {
        statusBadge.className = 'support-status-badge is-pending';
        statusBadge.textContent = 'À explorer';
      }
    }

    const index = getSectionIndex(current.id);
    const isLastSection = index >= getSections().length - 1;

    if (prevBtn) prevBtn.disabled = index <= 0;

    if (advanceBtn) {
      if (current.trackCompletion === false) {
        advanceBtn.disabled = isLastSection;
        advanceBtn.className = 'support-btn support-btn--ghost';
        advanceBtn.textContent = isLastSection ? 'ℹ️ Fin du support' : 'Chapitre suivant →';
      } else if (done) {
        advanceBtn.disabled = isLastSection;
        advanceBtn.className = 'support-btn support-btn--done';
        advanceBtn.textContent = isLastSection ? '✅ Chapitre terminé' : '✅ Terminé - chapitre suivant';
      } else {
        advanceBtn.disabled = false;
        advanceBtn.className = 'support-btn support-btn--primary';
        advanceBtn.textContent = '✅ Terminer et passer au suivant';
      }
    }

    initDynamicSection(current.id);

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
    const overlay = qs('support-overlay');
    if (!overlay) return;
    render();
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    const overlay = qs('support-overlay');
    if (!overlay) return;
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    closeDrawer();
    document.body.style.overflow = '';
  }

  function openDrawer() {
    const drawer = qs('support-mobile-drawer');
    if (!drawer) return;
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
  }

  function closeDrawer() {
    const drawer = qs('support-mobile-drawer');
    if (!drawer) return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
  }

  function updateSaveStatus(formName, message = 'Sauvegardé automatiquement') {
    const node = document.querySelector(`[data-support-save-status="${formName}"]`);
    if (!node) return;
    node.textContent = message;
  }

  function initDynamicSection(sectionId) {
    if (sectionId === 'je-fais-le-point') {
      initCheckinHomeForm();
      return;
    }

    if (sectionId === 'qualite-entourage') {
      initEntourageQualityForm();
    }
  }

  function initCheckinHomeForm() {
    const root = document.querySelector('[data-support-form="checkin-home"]');
    if (!root) return;

    const forms = loadForms();
    const data = forms.checkinHome || {};

    root.querySelectorAll('[data-support-input]').forEach((field) => {
      const key = field.getAttribute('data-support-input');
      field.value = data[key] || '';

      field.addEventListener('input', function () {
        const latest = loadForms();
        latest.checkinHome[key] = field.value;
        saveForms(latest);
        updateSaveStatus('checkin-home');
      });
    });

    updateSaveStatus('checkin-home');
  }

  function getGaugeOptions() {
    return [
      { value: '1', label: 'Freins très forts', className: 'is-gauge-1' },
      { value: '2', label: 'Plutôt lourd', className: 'is-gauge-2' },
      { value: '3', label: 'Mitigé', className: 'is-gauge-3' },
      { value: '4', label: 'Plutôt bénéfique', className: 'is-gauge-4' },
      { value: '5', label: 'Très bénéfique', className: 'is-gauge-5' }
    ];
  }

  function renderPeopleList() {
    const container = document.querySelector('[data-support-people-list]');
    if (!container) return;

    const forms = loadForms();
    const people = normalizePeople(forms.entourageQuality?.people);
    forms.entourageQuality.people = people;
    saveForms(forms);

    container.innerHTML = people.map((person, index) => {
      const gaugeOptions = getGaugeOptions().map((option) => `
        <label class="support-gauge-option ${option.className}">
          <input type="radio" name="support-gauge-${person.id}" value="${option.value}" ${person.gauge === option.value ? 'checked' : ''}>
          <span class="support-gauge-dot" aria-hidden="true"></span>
          <span class="support-sr-only">${option.label}</span>
        </label>
      `).join('');

      return `
        <article class="support-person-card" data-person-id="${person.id}">
          <div class="support-person-head">
            <h3>Personne ${index + 1}</h3>
            <button type="button" class="support-remove-person-btn" data-support-action="remove-person" data-person-id="${person.id}" ${people.length <= 1 ? 'disabled' : ''}>Supprimer</button>
          </div>

          <div class="support-person-grid">
            <label class="support-mini-card">
              <span class="support-mini-title">Qui ?</span>
              <textarea class="support-textarea support-textarea--mini" rows="3" data-person-field="who">${escapeHtml(person.who)}</textarea>
            </label>

            <label class="support-mini-card">
              <span class="support-mini-title">Ce qu'il/elle m'apporte</span>
              <textarea class="support-textarea support-textarea--mini" rows="3" data-person-field="brings">${escapeHtml(person.brings)}</textarea>
            </label>

            <label class="support-mini-card">
              <span class="support-mini-title">Ce qui m'angoisse ou m'alourdit chez lui/elle</span>
              <textarea class="support-textarea support-textarea--mini" rows="3" data-person-field="burdens">${escapeHtml(person.burdens)}</textarea>
            </label>

            <div class="support-mini-card support-mini-card--gauge">
              <span class="support-mini-title">Jauge des freins et bénéfices</span>
              <div class="support-gauge-row" data-person-field="gauge">${gaugeOptions}</div>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  function initEntourageQualityForm() {
    renderPeopleList();
    bindPeopleListEvents();
    updateSaveStatus('entourage-quality');
  }

  function bindPeopleListEvents() {
    const container = document.querySelector('[data-support-people-list]');
    if (!container || container.dataset.bound === 'true') return;
    container.dataset.bound = 'true';

    container.addEventListener('input', function (event) {
      const card = event.target.closest('[data-person-id]');
      if (!card) return;
      const personId = card.getAttribute('data-person-id');
      const fieldName = event.target.getAttribute('data-person-field');
      if (!fieldName) return;
      updatePerson(personId, fieldName, event.target.value);
    });

    container.addEventListener('change', function (event) {
      const card = event.target.closest('[data-person-id]');
      if (!card) return;
      const personId = card.getAttribute('data-person-id');
      if (event.target.matches('input[type="radio"]')) {
        updatePerson(personId, 'gauge', event.target.value);
      }
    });
  }

  function updatePerson(personId, fieldName, value) {
    const forms = loadForms();
    forms.entourageQuality.people = normalizePeople(forms.entourageQuality.people).map((person) => {
      if (person.id !== personId) return person;
      return { ...person, [fieldName]: value };
    });
    saveForms(forms);
    updateSaveStatus('entourage-quality');
  }

  function addPerson() {
    const forms = loadForms();
    forms.entourageQuality.people = normalizePeople(forms.entourageQuality.people);
    forms.entourageQuality.people.push(createEmptyPerson());
    saveForms(forms);
    renderPeopleList();
    updateSaveStatus('entourage-quality');
  }

  function removePerson(personId) {
    const forms = loadForms();
    let people = normalizePeople(forms.entourageQuality.people).filter((person) => person.id !== personId);
    if (!people.length) people = [createEmptyPerson()];
    forms.entourageQuality.people = people;
    saveForms(forms);
    renderPeopleList();
    updateSaveStatus('entourage-quality');
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function bindEvents() {
    document.addEventListener('click', function (event) {
      const tocBtn = event.target.closest('[data-support-section-id]');
      if (tocBtn) {
        goToSection(tocBtn.getAttribute('data-support-section-id'));
        return;
      }

      if (event.target.closest('#support-close-btn')) {
        close();
        return;
      }

      if (event.target.closest('#support-menu-btn')) {
        openDrawer();
        return;
      }

      if (event.target.closest('#support-mobile-close-btn') || event.target.closest('#support-mobile-backdrop')) {
        closeDrawer();
        return;
      }

      if (event.target.closest('#support-prev-btn')) {
        goToAdjacent(-1);
        return;
      }

      if (event.target.closest('#support-advance-btn')) {
        advanceCurrentSection();
        return;
      }

      const addBtn = event.target.closest('[data-support-action="add-person"]');
      if (addBtn) {
        addPerson();
        return;
      }

      const removeBtn = event.target.closest('[data-support-action="remove-person"]');
      if (removeBtn) {
        removePerson(removeBtn.getAttribute('data-person-id'));
      }
    });

    document.addEventListener('keydown', function (event) {
      const overlay = qs('support-overlay');
      if (!overlay || !overlay.classList.contains('is-open')) return;
      if (event.key === 'Escape') close();
    });
  }

  function init() {
    if (!window.FONDATION_SUPPORT || !Array.isArray(window.FONDATION_SUPPORT.sections)) {
      console.warn('⚠️ FONDATION_SUPPORT introuvable.');
      return;
    }

    const state = loadState();
    if (!getSectionById(state.currentSectionId)) {
      saveState({
        currentSectionId: getDefaultSectionId(),
        completedIds: state.completedIds || []
      });
    }

    const forms = loadForms();
    saveForms(forms);

    bindEvents();
    render();
  }

  window.FondationSupportOverlay = {
    init,
    open,
    close,
    render
  };

  document.addEventListener('DOMContentLoaded', init);
})();
