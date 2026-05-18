/* =====================================================
   WORKOUT TRACKER - MAIN APPLICATION
   =====================================================
   Sections:
   1. TRAINING PLANS DATA
   2. DATA LAYER (localStorage helpers)
   3. STATE
   4. UTILITY HELPERS
   5. TRAINING LOGIC (feedback, suggestions)
   6. UI - NAVIGATION
   7. UI - TRAINING TAB
   8. UI - HISTORY TAB
   9. UI - STATISTICS TAB
   10. UI - SETTINGS TAB
   11. CONFETTI
   12. SERVICE WORKER REGISTRATION
   13. INIT
   ===================================================== */

/* =====================================================
   1. TRAINING PLANS DATA
   ===================================================== */

const PLANS = {
  trainer: {
    name: 'Plan Trainer',
    sessions: [
      {
        id: 'oberkörper',
        name: 'Oberkörper',
        frequency: '2x/Woche',
        exercises: [
          { name: 'Rudern', sets: 3, repsMin: 12, repsMax: 20 },
          { name: 'Klimmzüge / Latzug', sets: 3, repsMin: 12, repsMax: 20 },
          { name: 'Bizeps Curl', sets: 2, repsMin: 12, repsMax: 20 },
          { name: 'Brustpresse schräg', sets: 3, repsMin: 12, repsMax: 20 },
          { name: 'Dips', sets: 2, repsMin: 12, repsMax: 20 },
          { name: 'Seitheben', sets: 2, repsMin: 12, repsMax: 20 },
          { name: 'Frontheben', sets: 2, repsMin: 12, repsMax: 20 },
          { name: 'Rotatorenmanschette Außenrotation Kabel', sets: 2, repsMin: 12, repsMax: 15 },
          { name: 'Rotatorenmanschette Innenrotation Kabel', sets: 2, repsMin: 12, repsMax: 15 },
          { name: 'Rotatorenmanschette Außenrotation KH', sets: 2, repsMin: 12, repsMax: 15 },
          { name: 'Rotatorenmanschette Innenrotation KH', sets: 2, repsMin: 12, repsMax: 15 },
        ]
      },
      {
        id: 'unterkörper-muskel',
        name: 'Unterkörper Muskelaufbau',
        frequency: '1x/Woche',
        exercises: [
          { name: 'Beinpresse', sets: 2, repsMin: 12, repsMax: 20 },
          { name: 'Split Squat / RDL', sets: 2, repsMin: 12, repsMax: 15, perSide: true },
          { name: 'Beinbeuger', sets: 2, repsMin: 12, repsMax: 20 },
          { name: 'Beinstrecker', sets: 2, repsMin: 12, repsMax: 20 },
          { name: 'Abduktion', sets: 2, repsMin: 15, repsMax: 20 },
          { name: 'Adduktion', sets: 2, repsMin: 15, repsMax: 20 },
          { name: 'Sit Ups', sets: 2, repsMin: 15, repsMax: 20 },
          { name: 'Wadenheben', sets: 2, repsMin: 15, repsMax: 20 },
          { name: 'Tibialis Raises', sets: 2, repsMin: 15, repsMax: 20 },
        ]
      },
      {
        id: 'unterkörper-funk',
        name: 'Unterkörper Funktionalität',
        frequency: '1x/Woche',
        exercises: [
          { name: 'Abduktion', sets: 2, repsMin: 15, repsMax: 20 },
          { name: 'Adduktion', sets: 2, repsMin: 15, repsMax: 20 },
          { name: 'Step Up', sets: 2, repsMin: 12, repsMax: 12, perSide: true },
          { name: 'Beinpresse', sets: 2, repsMin: 12, repsMax: 20 },
          { name: 'Lunges', sets: 2, repsMin: 12, repsMax: 12, perSide: true },
          { name: 'Wadenheben', sets: 2, repsMin: 15, repsMax: 20 },
          { name: 'Plank / Dragon Flag / Hollow Hold', sets: 2, repsMin: 0, repsMax: 999, toFailure: true },
        ]
      }
    ]
  },
  optimiert: {
    name: 'Plan Optimiert',
    sessions: [
      {
        id: 'oberkörper-a',
        name: 'Oberkörper A',
        frequency: 'Brust/Schulter-Fokus',
        exercises: [
          { name: 'Schrägbankdrücken Kurzhantel', sets: 4, repsMin: 6, repsMax: 10 },
          { name: 'Schulterdrücken sitzend', sets: 3, repsMin: 8, repsMax: 12 },
          { name: 'Klimmzüge', sets: 3, repsMin: 1, repsMax: 999, amrap: true },
          { name: 'Rudern Kurzhantel einarmig', sets: 3, repsMin: 8, repsMax: 12, perSide: true },
          { name: 'Seitheben', sets: 4, repsMin: 12, repsMax: 15 },
          { name: 'Face Pulls', sets: 3, repsMin: 12, repsMax: 15 },
          { name: 'Trizeps Pushdowns', sets: 2, repsMin: 10, repsMax: 12 },
          { name: 'Bizeps Curls', sets: 2, repsMin: 10, repsMax: 12 },
          { name: 'Rotatorenmanschette Außenrotation', sets: 2, repsMin: 12, repsMax: 15 },
        ]
      },
      {
        id: 'unterkörper',
        name: 'Unterkörper',
        frequency: '1x/Woche',
        exercises: [
          { name: 'Beinpresse / Kniebeugen', sets: 4, repsMin: 8, repsMax: 12 },
          { name: 'Rumänisches Kreuzheben', sets: 3, repsMin: 8, repsMax: 12 },
          { name: 'Bulgarian Split Squats', sets: 3, repsMin: 10, repsMax: 12, perSide: true },
          { name: 'Beinbeuger', sets: 2, repsMin: 12, repsMax: 15 },
          { name: 'Hüftabduktion', sets: 2, repsMin: 15, repsMax: 20 },
          { name: 'Wadenheben', sets: 4, repsMin: 12, repsMax: 20 },
          { name: 'Tibialis Raises', sets: 2, repsMin: 15, repsMax: 20 },
          { name: 'Hängendes Beinheben', sets: 3, repsMin: 10, repsMax: 15 },
        ]
      },
      {
        id: 'oberkörper-b',
        name: 'Oberkörper B',
        frequency: 'Rücken/Arm-Fokus',
        exercises: [
          { name: 'Klimmzüge mit Zusatzgewicht', sets: 4, repsMin: 6, repsMax: 10 },
          { name: 'Langhantel-Rudern', sets: 3, repsMin: 8, repsMax: 12 },
          { name: 'Bankdrücken flach Kurzhantel', sets: 3, repsMin: 8, repsMax: 12 },
          { name: 'Dips', sets: 3, repsMin: 1, repsMax: 999, amrap: true },
          { name: 'Seitheben', sets: 4, repsMin: 12, repsMax: 15 },
          { name: 'Reverse Flys', sets: 3, repsMin: 12, repsMax: 15 },
          { name: 'Hammer Curls', sets: 3, repsMin: 10, repsMax: 12 },
          { name: 'Rotatorenmanschette Innenrotation', sets: 2, repsMin: 12, repsMax: 15 },
        ]
      }
    ]
  }
};

/* =====================================================
   2. DATA LAYER
   ===================================================== */

const DB_KEY = 'workout_tracker_data';

/**
 * Returns the default data structure for a fresh install.
 */
function getDefaultData() {
  return {
    version: 1,
    settings: {
      activePlan: 'trainer',
      darkMode: true,
      vibration: true,
      pauseTimer: 120
    },
    workouts: []
  };
}

/**
 * Load all data from localStorage. Returns default if missing/corrupt.
 */
function loadData() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) return getDefaultData();
    const parsed = JSON.parse(raw);
    // Basic schema migration: ensure fields exist
    if (!parsed.settings) parsed.settings = getDefaultData().settings;
    if (!parsed.workouts) parsed.workouts = [];
    return parsed;
  } catch (e) {
    console.error('[DB] Error loading data:', e);
    return getDefaultData();
  }
}

/**
 * Save all data to localStorage. Handles quota errors gracefully.
 */
function saveData(data) {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      showToast('⚠️ Speicher voll! Bitte alte Daten exportieren und löschen.');
    } else {
      console.error('[DB] Save error:', e);
    }
    return false;
  }
}

/**
 * Generate a simple UUID v4-like string.
 */
function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

/* =====================================================
   3. STATE
   ===================================================== */

let appData = loadData();

// Active training session state
const trainingState = {
  active: false,
  plan: null,          // 'trainer' | 'optimiert'
  session: null,       // session object from PLANS
  exercises: [],       // deep copy of session exercises
  currentIndex: 0,     // current exercise index
  sets: [],            // array of arrays: sets[exerciseIndex] = [{weight, reps, notes, done}]
  notes: [],           // notes[exerciseIndex] = string
  startTime: null,
  timerInterval: null,
  timerRemaining: 0,
  timerTotal: 0,
};

/* =====================================================
   4. UTILITY HELPERS
   ===================================================== */

/**
 * Trigger haptic feedback (vibration) if enabled.
 * @param {number|number[]} pattern - ms or pattern array
 */
function vibrate(pattern = 10) {
  if (appData.settings.vibration && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
}

/**
 * Format a date string "YYYY-MM-DD" to "18. Mai 2026".
 */
function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch { return dateStr; }
}

/**
 * Format seconds to "m:ss".
 */
function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/**
 * Calculate duration in minutes from ISO strings.
 */
function calcDurationMin(startTime, endTime) {
  if (!startTime || !endTime) return 0;
  const diff = new Date(endTime) - new Date(startTime);
  return Math.round(diff / 60000);
}

/**
 * Get today's date string "YYYY-MM-DD".
 */
function todayStr() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Deep clone an object.
 */
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Validate numeric input. Returns clamped value or fallback.
 */
function validateNumber(val, min, max, fallback) {
  const n = parseFloat(val);
  if (isNaN(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}

/* =====================================================
   5. TRAINING LOGIC
   ===================================================== */

/**
 * Find the last workout entry for a given exercise name.
 * Returns { sets: [...], date } or null.
 */
function getLastWorkoutForExercise(exerciseName) {
  const workouts = [...appData.workouts].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  for (const w of workouts) {
    const ex = w.exercises.find(e => e.name === exerciseName);
    if (ex && ex.sets && ex.sets.length > 0) {
      return { sets: ex.sets, date: w.date, workoutId: w.id };
    }
  }
  return null;
}

/**
 * Get all-time best set for an exercise (highest weight, then most reps).
 */
function getPersonalRecord(exerciseName) {
  let bestWeight = 0, bestReps = 0;
  for (const w of appData.workouts) {
    const ex = w.exercises.find(e => e.name === exerciseName);
    if (!ex) continue;
    for (const s of ex.sets) {
      if (s.weight > bestWeight || (s.weight === bestWeight && s.reps > bestReps)) {
        bestWeight = s.weight;
        bestReps = s.reps;
      }
    }
  }
  if (bestWeight === 0 && bestReps === 0) return null;
  return { weight: bestWeight, reps: bestReps };
}

/**
 * Generate weight/rep suggestion for start of exercise.
 * Returns a string.
 */
function generateSuggestion(exercise) {
  const last = getLastWorkoutForExercise(exercise.name);
  if (!last) return '📝 Erste Einheit – trage dein Startgewicht ein';

  const lastSets = last.sets;
  if (!lastSets || lastSets.length === 0) return '';

  // Check if all sets hit upper bound last time → suggest +2.5kg
  const allHitUpper = lastSets.every(s => s.reps >= exercise.repsMax);
  const anyMissedLower = lastSets.some(s => s.reps < exercise.repsMin);
  const lastWeight = lastSets[0].weight;
  const lastReps = lastSets[0].reps;

  if (exercise.amrap) {
    return `Letztes Mal: ${lastReps} Wdh → AMRAP heute`;
  }

  let suggestedWeight = lastWeight;
  if (allHitUpper && !exercise.amrap) {
    suggestedWeight = lastWeight + 2.5;
    return `Letztes Mal: ${lastWeight}kg × ${lastReps} Wdh → Vorschlag heute: ${suggestedWeight}kg (+2,5kg)`;
  } else if (anyMissedLower) {
    suggestedWeight = Math.max(0, lastWeight - 2.5);
    return `Letztes Mal: ${lastWeight}kg × ${lastReps} Wdh → Vorschlag heute: ${suggestedWeight}kg (-2,5kg)`;
  } else {
    return `Letztes Mal: ${lastWeight}kg × ${lastReps} Wdh → Vorschlag: ${lastWeight}kg halten`;
  }
}

/**
 * Get the suggested starting weight for a set input.
 */
function getSuggestedWeight(exercise) {
  const last = getLastWorkoutForExercise(exercise.name);
  if (!last || !last.sets.length) return 0;
  const lastWeight = last.sets[0].weight || 0;
  const allHitUpper = last.sets.every(s => s.reps >= exercise.repsMax);
  const anyMissedLower = last.sets.some(s => s.reps < exercise.repsMin);
  if (allHitUpper) return lastWeight + 2.5;
  if (anyMissedLower) return Math.max(0, lastWeight - 2.5);
  return lastWeight;
}

/**
 * Get suggested reps for a set input.
 */
function getSuggestedReps(exercise) {
  const last = getLastWorkoutForExercise(exercise.name);
  if (!last || !last.sets.length) return exercise.repsMin || 10;
  return last.sets[0].reps || exercise.repsMin;
}

/**
 * Generate feedback message for a completed set.
 * @param {object} exercise - exercise definition
 * @param {number} weight - weight used
 * @param {number} reps - reps completed
 * @param {number} setIndex - 0-based set index
 * @returns {string} feedback message
 */
function generateFeedback(exercise, weight, reps, setIndex) {
  const last = getLastWorkoutForExercise(exercise.name);

  // Check for first time tracking
  if (!last) {
    return '📝 Erste Einheit getrackt – Vergleich ab nächstem Mal';
  }

  // Check for new PR
  const pr = getPersonalRecord(exercise.name);
  if (pr && (weight > pr.weight || (weight === pr.weight && reps > pr.reps))) {
    // Will trigger confetti separately
    return '🏆 NEUER PERSONAL RECORD!';
  }

  // Compare to last workout same set
  const lastSet = last.sets[setIndex] || last.sets[last.sets.length - 1];

  if (lastSet) {
    if (weight === lastSet.weight && reps < lastSet.reps) {
      return '📉 Rückschritt. Tagesform? Schlaf/Ernährung checken';
    }
  }

  // AMRAP exercises: just show reps
  if (exercise.amrap) {
    if (lastSet && reps > lastSet.reps) return `🔥 Stark! ${reps} Wdh – neuer Bestwert!`;
    if (lastSet && reps === lastSet.reps) return `✅ Gleiche Leistung wie letztes Mal`;
    return `✅ ${reps} Wdh getrackt`;
  }

  const { repsMin, repsMax } = exercise;
  const mid = Math.floor((repsMin + repsMax) / 2);

  if (reps >= repsMax) {
    return `🔥 Stark! Nächstes Mal +2,5kg probieren`;
  } else if (reps >= mid) {
    return `✅ Solide. Eine Wiederholung mehr nächstes Mal anpeilen`;
  } else if (reps >= repsMin) {
    return `⚠️ Knapp im Zielbereich. Gewicht halten bis du oben rauskommst`;
  } else {
    return `❌ Zu schwer. Nächstes Mal -2,5kg`;
  }
}

/* =====================================================
   6. UI - NAVIGATION
   ===================================================== */

/** Switch between the four main tabs */
function switchTab(tabName) {
  // Update nav items
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });

  // Show/hide tab screens
  document.querySelectorAll('.tab-screen').forEach(screen => {
    const isActive = screen.id === `tab-${tabName}`;
    screen.classList.toggle('active', isActive);
  });

  // Refresh content when switching to certain tabs
  if (tabName === 'history') renderHistory();
  if (tabName === 'stats') renderStats();
  if (tabName === 'settings') renderSettings();
}

/* =====================================================
   7. UI - TRAINING TAB
   ===================================================== */

/** Render the training home view (plan overview + session cards) */
function renderTrainingHome() {
  const plan = PLANS[appData.settings.activePlan];
  if (!plan) return;

  // Update plan badge
  const badge = document.getElementById('active-plan-badge');
  if (badge) badge.textContent = plan.name;

  // Last session card
  renderLastSessionCard();

  // Session selection cards
  const container = document.getElementById('session-cards-container');
  if (!container) return;
  container.innerHTML = '';

  plan.sessions.forEach(session => {
    const card = document.createElement('div');
    card.className = 'session-card';
    card.innerHTML = `
      <div class="session-card-info">
        <div class="session-card-name">${session.name}</div>
        <div class="session-card-meta">${session.exercises.length} Übungen · ${session.frequency}</div>
      </div>
      <div class="session-card-arrow">›</div>
    `;
    card.addEventListener('click', () => {
      vibrate(10);
      startTrainingSession(appData.settings.activePlan, session);
    });
    container.appendChild(card);
  });
}

/** Render the last session summary card */
function renderLastSessionCard() {
  const card = document.getElementById('last-session-content');
  if (!card) return;

  if (appData.workouts.length === 0) {
    card.innerHTML = '<span class="muted">Noch kein Training aufgezeichnet</span>';
    return;
  }

  // Sort by date desc, get most recent
  const sorted = [...appData.workouts].sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
  const last = sorted[0];
  const duration = calcDurationMin(last.startTime, last.endTime);
  const planName = PLANS[last.plan]?.name || last.plan;

  card.innerHTML = `
    <div class="last-session-date">${formatDate(last.date)} · ${planName}</div>
    <div class="last-session-info">${last.session} · ${last.exercises.length} Übungen · ${duration} Min</div>
  `;
}

/**
 * Start a training session for a given plan and session.
 */
function startTrainingSession(planKey, session) {
  // Copy session exercises deeply
  trainingState.active = true;
  trainingState.plan = planKey;
  trainingState.session = session;
  trainingState.exercises = deepClone(session.exercises);
  trainingState.currentIndex = 0;
  trainingState.startTime = new Date().toISOString();

  // Initialize sets and notes arrays
  trainingState.sets = trainingState.exercises.map(ex => {
    const suggestedWeight = getSuggestedWeight(ex);
    const suggestedReps = getSuggestedReps(ex);
    // Pre-populate with target number of sets
    return Array.from({ length: ex.sets }, () => ({
      weight: suggestedWeight,
      reps: suggestedReps,
      notes: '',
      done: false
    }));
  });
  trainingState.notes = trainingState.exercises.map(() => '');

  // Switch to active training view
  showView('training', 'view-training-active');
  renderExercise(0);
}

/**
 * Render a specific exercise by index.
 */
function renderExercise(index) {
  const exercises = trainingState.exercises;
  if (index < 0 || index >= exercises.length) return;

  trainingState.currentIndex = index;
  const ex = exercises[index];
  const isAmrap = !!ex.amrap;

  // Update progress
  const counter = document.getElementById('exercise-counter');
  if (counter) counter.textContent = `Übung ${index + 1} von ${exercises.length}`;

  const progressBar = document.getElementById('exercise-progress-bar');
  if (progressBar) {
    progressBar.style.width = `${((index + 1) / exercises.length) * 100}%`;
  }

  // Exercise name and target
  const nameEl = document.getElementById('exercise-name');
  if (nameEl) {
    nameEl.innerHTML = ex.name + (isAmrap ? ' <span class="amrap-badge">AMRAP</span>' : '');
  }

  const targetEl = document.getElementById('exercise-target');
  if (targetEl) {
    if (isAmrap) {
      targetEl.textContent = `${ex.sets} Sätze × AMRAP (so viele wie möglich)`;
    } else if (ex.toFailure) {
      targetEl.textContent = `${ex.sets} Sätze × bis Versagen`;
    } else if (ex.perSide) {
      targetEl.textContent = `${ex.sets} Sätze × ${ex.repsMin === ex.repsMax ? ex.repsMin : `${ex.repsMin}-${ex.repsMax}`} Wdh pro Seite`;
    } else {
      targetEl.textContent = `${ex.sets} Sätze × ${ex.repsMin === ex.repsMax ? ex.repsMin : `${ex.repsMin}-${ex.repsMax}`} Wdh`;
    }
  }

  // Suggestion
  const suggEl = document.getElementById('weight-suggestion');
  if (suggEl) suggEl.textContent = generateSuggestion(ex);

  // Restore note
  const noteEl = document.getElementById('exercise-note');
  if (noteEl) noteEl.value = trainingState.notes[index] || '';

  // Render sets
  renderSetsForCurrentExercise();

  // Animate in
  const card = document.getElementById('exercise-card');
  if (card) {
    card.classList.remove('swipe-left', 'swipe-right');
    card.style.transform = '';
    card.style.opacity = '';
  }
}

/** Render all sets for the current exercise */
function renderSetsForCurrentExercise() {
  const container = document.getElementById('sets-container');
  if (!container) return;
  container.innerHTML = '';

  const index = trainingState.currentIndex;
  const ex = trainingState.exercises[index];
  const sets = trainingState.sets[index];
  const isAmrap = !!ex.amrap;

  sets.forEach((set, setIdx) => {
    const row = document.createElement('div');
    row.className = 'set-row' + (set.done ? ' completed' : '');
    row.dataset.setIndex = setIdx;

    if (isAmrap) {
      // AMRAP: only reps, no weight
      row.innerHTML = `
        <div class="set-number">S${setIdx + 1}</div>
        <div class="set-input-group">
          <span class="set-input-label">Wdh</span>
          <button class="set-adjust-btn" data-action="reps-minus" data-set="${setIdx}">−</button>
          <input type="number" class="set-value-input" data-type="reps" data-set="${setIdx}"
            value="${set.reps}" min="0" max="999" inputmode="numeric" />
          <button class="set-adjust-btn" data-action="reps-plus" data-set="${setIdx}">+</button>
        </div>
        <button class="set-done-btn ${set.done ? 'done' : ''}" data-set="${setIdx}" aria-label="Satz abschließen">
          <span class="plus-icon">✓</span>
          <span class="check-icon">✓</span>
        </button>
      `;
    } else {
      row.innerHTML = `
        <div class="set-number">S${setIdx + 1}</div>
        <div class="set-input-group">
          <span class="set-input-label">kg</span>
          <button class="set-adjust-btn" data-action="weight-minus" data-set="${setIdx}">−</button>
          <input type="number" class="set-value-input" data-type="weight" data-set="${setIdx}"
            value="${set.weight}" min="0" max="500" step="0.5" inputmode="decimal" />
          <button class="set-adjust-btn" data-action="weight-plus" data-set="${setIdx}">+</button>
        </div>
        <div class="set-input-group">
          <span class="set-input-label">Wdh</span>
          <button class="set-adjust-btn" data-action="reps-minus" data-set="${setIdx}">−</button>
          <input type="number" class="set-value-input" data-type="reps" data-set="${setIdx}"
            value="${set.reps}" min="0" max="999" inputmode="numeric" />
          <button class="set-adjust-btn" data-action="reps-plus" data-set="${setIdx}">+</button>
        </div>
        <button class="set-done-btn ${set.done ? 'done' : ''}" data-set="${setIdx}" aria-label="Satz abschließen">
          <span class="plus-icon">✓</span>
          <span class="check-icon">✓</span>
        </button>
      `;
    }

    container.appendChild(row);
  });

  // Attach event listeners
  container.querySelectorAll('.set-adjust-btn').forEach(btn => {
    btn.addEventListener('click', handleSetAdjust);
  });

  container.querySelectorAll('.set-value-input').forEach(input => {
    input.addEventListener('change', handleSetInputChange);
    input.addEventListener('blur', handleSetInputChange);
  });

  container.querySelectorAll('.set-done-btn').forEach(btn => {
    btn.addEventListener('click', handleSetDone);
  });
}

/** Handle +/- adjust buttons for weight and reps */
function handleSetAdjust(e) {
  vibrate(8);
  const action = e.currentTarget.dataset.action;
  const setIdx = parseInt(e.currentTarget.dataset.set, 10);
  const exIdx = trainingState.currentIndex;
  const set = trainingState.sets[exIdx][setIdx];

  switch (action) {
    case 'weight-plus':  set.weight = Math.min(500, +(set.weight + 2.5).toFixed(1)); break;
    case 'weight-minus': set.weight = Math.max(0, +(set.weight - 2.5).toFixed(1)); break;
    case 'reps-plus':    set.reps = Math.min(999, set.reps + 1); break;
    case 'reps-minus':   set.reps = Math.max(0, set.reps - 1); break;
  }

  // Update the corresponding input directly (faster than full re-render)
  const row = e.currentTarget.closest('.set-row');
  if (action.startsWith('weight')) {
    const inp = row.querySelector('[data-type="weight"]');
    if (inp) inp.value = set.weight;
  } else {
    const inp = row.querySelector('[data-type="reps"]');
    if (inp) inp.value = set.reps;
  }
}

/** Handle direct text input changes for set values */
function handleSetInputChange(e) {
  const setIdx = parseInt(e.currentTarget.dataset.set, 10);
  const type = e.currentTarget.dataset.type;
  const exIdx = trainingState.currentIndex;
  const set = trainingState.sets[exIdx][setIdx];

  if (type === 'weight') {
    set.weight = validateNumber(e.currentTarget.value, 0, 500, set.weight);
    e.currentTarget.value = set.weight;
  } else if (type === 'reps') {
    set.reps = validateNumber(e.currentTarget.value, 0, 999, set.reps);
    e.currentTarget.value = set.reps;
  }
}

/** Handle set "done" button tap */
function handleSetDone(e) {
  vibrate([10, 30, 10]);
  const setIdx = parseInt(e.currentTarget.dataset.set, 10);
  const exIdx = trainingState.currentIndex;
  const set = trainingState.sets[exIdx][setIdx];
  const ex = trainingState.exercises[exIdx];

  // Read current input values before marking done
  const row = e.currentTarget.closest('.set-row');
  const weightInp = row.querySelector('[data-type="weight"]');
  const repsInp = row.querySelector('[data-type="reps"]');
  if (weightInp) set.weight = validateNumber(weightInp.value, 0, 500, set.weight);
  if (repsInp) set.reps = validateNumber(repsInp.value, 0, 999, set.reps);

  set.done = !set.done;

  if (set.done) {
    // Update row appearance
    row.classList.add('completed');
    e.currentTarget.classList.add('done');

    // Generate and show feedback
    const feedback = generateFeedback(ex, set.weight, set.reps, setIdx);
    showToast(feedback);

    // Check for PR and trigger confetti
    if (feedback.includes('PERSONAL RECORD')) {
      setTimeout(() => launchConfetti(), 300);
    }

    // Start rest timer
    startRestTimer(appData.settings.pauseTimer);
  } else {
    row.classList.remove('completed');
    e.currentTarget.classList.remove('done');
  }
}

/** Navigate to next exercise via button */
function goToNextExercise() {
  const next = trainingState.currentIndex + 1;
  if (next >= trainingState.exercises.length) {
    showTrainingSummary();
  } else {
    animateExerciseTransition('left', next);
  }
}

/** Navigate to previous exercise */
function goToPrevExercise() {
  const prev = trainingState.currentIndex - 1;
  if (prev >= 0) {
    animateExerciseTransition('right', prev);
  }
}

/** Animate exercise card transition */
function animateExerciseTransition(direction, targetIndex) {
  vibrate(5);
  const card = document.getElementById('exercise-card');
  if (!card) { renderExercise(targetIndex); return; }

  // Save current note
  const noteEl = document.getElementById('exercise-note');
  if (noteEl) trainingState.notes[trainingState.currentIndex] = noteEl.value;

  const outClass = direction === 'left' ? 'swipe-left' : 'swipe-right';
  card.classList.add(outClass);

  setTimeout(() => {
    card.classList.remove(outClass);
    // Slide in from opposite side briefly
    const inClass = direction === 'left' ? 'swipe-right' : 'swipe-left';
    card.style.transform = direction === 'left' ? 'translateX(100%)' : 'translateX(-100%)';
    card.style.opacity = '0';

    renderExercise(targetIndex);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        card.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s ease';
        card.style.transform = '';
        card.style.opacity = '';
        setTimeout(() => { card.style.transition = ''; }, 350);
      });
    });
  }, 200);
}

/** Show training summary screen */
function showTrainingSummary() {
  // Stop any active timer
  stopRestTimer();

  // Save current note
  const noteEl = document.getElementById('exercise-note');
  if (noteEl) trainingState.notes[trainingState.currentIndex] = noteEl.value;

  // Calculate stats
  const endTime = new Date().toISOString();
  const duration = calcDurationMin(trainingState.startTime, endTime);
  let totalSets = 0, totalReps = 0, totalTonnage = 0;

  trainingState.sets.forEach((exSets, exIdx) => {
    exSets.forEach(s => {
      if (s.done) {
        totalSets++;
        totalReps += s.reps;
        totalTonnage += (s.weight || 0) * s.reps;
      }
    });
  });

  // Build summary HTML
  const summaryEl = document.getElementById('summary-content');
  if (!summaryEl) return;

  let html = `
    <div class="summary-stat-row">
      <div class="summary-stat">
        <div class="summary-stat-value">${duration}</div>
        <div class="summary-stat-label">Minuten</div>
      </div>
      <div class="summary-stat">
        <div class="summary-stat-value">${totalSets}</div>
        <div class="summary-stat-label">Sätze</div>
      </div>
      <div class="summary-stat">
        <div class="summary-stat-value">${totalTonnage.toLocaleString('de-DE')} kg</div>
        <div class="summary-stat-label">Volumen</div>
      </div>
    </div>
  `;

  trainingState.exercises.forEach((ex, exIdx) => {
    const sets = trainingState.sets[exIdx].filter(s => s.done);
    if (sets.length === 0) return;
    html += `
      <div class="summary-exercise-card">
        <div class="summary-exercise-name">${ex.name}</div>
        ${sets.map((s, i) => `
          <div class="summary-set-row">S${i + 1}: ${ex.amrap ? '' : s.weight + 'kg × '}${s.reps} Wdh</div>
        `).join('')}
      </div>
    `;
  });

  summaryEl.innerHTML = html;

  // Store endTime on state for save
  trainingState.endTime = endTime;

  showView('training', 'view-training-summary');
}

/** Save the completed workout to storage */
function saveWorkout() {
  const exercises = trainingState.exercises.map((ex, exIdx) => ({
    name: ex.name,
    sets: trainingState.sets[exIdx]
      .filter(s => s.done)
      .map(s => ({ weight: s.weight, reps: s.reps, notes: s.notes || '' })),
    notes: trainingState.notes[exIdx] || ''
  })).filter(ex => ex.sets.length > 0);

  if (exercises.length === 0) {
    showToast('⚠️ Keine abgeschlossenen Sätze zum Speichern');
    return;
  }

  const workout = {
    id: generateId(),
    date: todayStr(),
    plan: trainingState.plan,
    session: trainingState.session.name,
    startTime: trainingState.startTime,
    endTime: trainingState.endTime || new Date().toISOString(),
    exercises
  };

  appData.workouts.push(workout);
  if (saveData(appData)) {
    showToast('✅ Workout gespeichert!');
    vibrate([10, 50, 10]);
  }

  // Return to training home
  trainingState.active = false;
  showView('training', 'view-training-home');
  renderTrainingHome();
}

/** Discard current training session */
function endTrainingWithConfirm() {
  showModal(
    'Training beenden?',
    'Alle eingetragenen Daten werden verworfen.',
    () => {
      stopRestTimer();
      trainingState.active = false;
      showView('training', 'view-training-home');
    }
  );
}

/* REST TIMER */

/** Start the rest timer countdown */
function startRestTimer(seconds) {
  stopRestTimer(); // Clear any existing timer

  trainingState.timerTotal = seconds;
  trainingState.timerRemaining = seconds;

  const overlay = document.getElementById('rest-timer-overlay');
  const displayEl = document.getElementById('timer-display');
  const circleEl = document.getElementById('timer-circle-progress');
  const CIRCUMFERENCE = 552.92; // 2 * PI * 88

  if (overlay) overlay.classList.remove('hidden');

  function tick() {
    if (trainingState.timerRemaining <= 0) {
      // Timer finished
      stopRestTimer();
      if (overlay) overlay.classList.add('hidden');
      vibrate([100, 50, 100, 50, 200]); // End pattern
      showToast('✅ Pause vorbei – weiter!');
      return;
    }

    // Update display
    if (displayEl) displayEl.textContent = formatTime(trainingState.timerRemaining);

    // Update circle stroke
    if (circleEl) {
      const progress = trainingState.timerRemaining / trainingState.timerTotal;
      const offset = CIRCUMFERENCE * (1 - progress);
      circleEl.style.strokeDashoffset = offset;
      // Color: green when > 50%, orange when 25-50%, red when < 25%
      if (progress > 0.5) circleEl.style.stroke = 'var(--accent)';
      else if (progress > 0.25) circleEl.style.stroke = 'var(--accent-orange)';
      else circleEl.style.stroke = 'var(--accent-red)';
    }

    trainingState.timerRemaining--;
    trainingState.timerInterval = setTimeout(tick, 1000);
  }

  tick();
}

/** Stop the rest timer */
function stopRestTimer() {
  if (trainingState.timerInterval) {
    clearTimeout(trainingState.timerInterval);
    trainingState.timerInterval = null;
  }
}

/* SWIPE GESTURE */

/** Setup swipe gesture for exercise navigation */
function setupSwipeGesture() {
  const area = document.getElementById('exercise-swipe-area');
  if (!area) return;

  let startX = 0, startY = 0;
  const THRESHOLD = 50; // px

  area.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  area.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const deltaX = endX - startX;
    const deltaY = endY - startY;

    // Only handle if horizontal movement is dominant
    if (Math.abs(deltaX) < THRESHOLD) return;
    if (Math.abs(deltaY) > Math.abs(deltaX)) return;

    // Save current note before swiping
    const noteEl = document.getElementById('exercise-note');
    if (noteEl) trainingState.notes[trainingState.currentIndex] = noteEl.value;

    if (deltaX < -THRESHOLD) {
      // Swipe left → next exercise
      const next = trainingState.currentIndex + 1;
      if (next >= trainingState.exercises.length) {
        showTrainingSummary();
      } else {
        animateExerciseTransition('left', next);
      }
    } else if (deltaX > THRESHOLD) {
      // Swipe right → previous exercise
      const prev = trainingState.currentIndex - 1;
      if (prev >= 0) {
        animateExerciseTransition('right', prev);
      }
    }
  }, { passive: true });
}

/* =====================================================
   8. UI - HISTORY TAB
   ===================================================== */

/** Render the history list */
function renderHistory(filter = 'all') {
  const list = document.getElementById('history-list');
  if (!list) return;

  let workouts = [...appData.workouts].sort(
    (a, b) => new Date(b.startTime) - new Date(a.startTime)
  );

  // Apply filter
  if (filter !== 'all') {
    workouts = workouts.filter(w => w.plan === filter);
  }

  if (workouts.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📋</div>
        <div class="empty-text">Noch keine Workouts</div>
        <div class="empty-sub">Starte dein erstes Training!</div>
      </div>
    `;
    return;
  }

  list.innerHTML = '';
  workouts.forEach(workout => {
    const card = document.createElement('div');
    card.className = 'history-card';
    const duration = calcDurationMin(workout.startTime, workout.endTime);
    const planName = PLANS[workout.plan]?.name || workout.plan;

    card.innerHTML = `
      <div class="history-card-header">
        <div class="history-card-date">${formatDate(workout.date)}</div>
        <div class="history-card-plan">${planName}</div>
      </div>
      <div class="history-card-session">${workout.session}</div>
      <div class="history-card-meta">
        <span>🏋️ ${workout.exercises.length} Übungen</span>
        <span>⏱ ${duration} Min</span>
        <span>📦 ${workout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0)} Sätze</span>
      </div>
    `;

    card.addEventListener('click', () => showHistoryDetail(workout));
    list.appendChild(card);
  });
}

/** Show detail modal for a specific workout */
function showHistoryDetail(workout) {
  const overlay = document.getElementById('history-detail-overlay');
  const title = document.getElementById('history-detail-title');
  const body = document.getElementById('history-detail-body');
  if (!overlay || !title || !body) return;

  title.textContent = `${workout.session} · ${formatDate(workout.date)}`;

  let html = '';
  workout.exercises.forEach(ex => {
    html += `
      <div class="history-detail-exercise">
        <div class="history-detail-exercise-name">${ex.name}</div>
        ${ex.sets.map((s, i) => {
          if (ex.amrap || s.weight === 0) {
            return `<div class="history-detail-set">Satz ${i + 1}: <span>${s.reps} Wdh</span></div>`;
          }
          return `<div class="history-detail-set">Satz ${i + 1}: <span>${s.weight} kg × ${s.reps} Wdh</span></div>`;
        }).join('')}
      </div>
    `;
  });

  body.innerHTML = html;
  overlay.classList.remove('hidden');
}

/* =====================================================
   9. UI - STATISTICS TAB
   ===================================================== */

/** Render all statistics */
function renderStats() {
  const workouts = appData.workouts;

  // Total workouts
  const totalEl = document.getElementById('stat-total-workouts');
  if (totalEl) totalEl.textContent = workouts.length;

  // Total training hours
  let totalMinutes = 0;
  workouts.forEach(w => { totalMinutes += calcDurationMin(w.startTime, w.endTime); });
  const hoursEl = document.getElementById('stat-total-hours');
  if (hoursEl) hoursEl.textContent = Math.round(totalMinutes / 60) + 'h';

  // Streak (weeks with at least one workout)
  const streakEl = document.getElementById('stat-streak');
  if (streakEl) streakEl.textContent = calculateWeekStreak();

  // Total tonnage
  let tonnage = 0;
  workouts.forEach(w => {
    w.exercises.forEach(ex => {
      ex.sets.forEach(s => { tonnage += (s.weight || 0) * s.reps; });
    });
  });
  const tonnageEl = document.getElementById('stat-tonnage');
  if (tonnageEl) {
    tonnageEl.textContent = tonnage >= 1000
      ? (tonnage / 1000).toFixed(1) + ' t'
      : tonnage.toLocaleString('de-DE') + ' kg';
  }

  // Weekly chart
  renderWeeklyChart();

  // Exercise selector for line chart
  populateExerciseSelector();

  // Personal records
  renderPRList();
}

/** Calculate streak in consecutive weeks */
function calculateWeekStreak() {
  if (appData.workouts.length === 0) return 0;

  const getWeekKey = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    const jan1 = new Date(d.getFullYear(), 0, 1);
    const week = Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7);
    return `${d.getFullYear()}-W${week}`;
  };

  // Get unique weeks with workouts
  const weeksWithWorkout = new Set(appData.workouts.map(w => getWeekKey(w.date)));
  const today = new Date();

  let streak = 0;
  let currentWeek = new Date(today);
  // Start from current week
  while (true) {
    const key = getWeekKey(currentWeek.toISOString().split('T')[0]);
    if (weeksWithWorkout.has(key)) {
      streak++;
      currentWeek.setDate(currentWeek.getDate() - 7);
    } else {
      break;
    }
  }
  return streak;
}

/** Render the weekly workout frequency chart (bar chart via Canvas) */
function renderWeeklyChart() {
  const canvas = document.getElementById('weekly-chart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const displayWidth = canvas.offsetWidth || 300;
  const displayHeight = 80;

  canvas.width = displayWidth * dpr;
  canvas.height = displayHeight * dpr;
  ctx.scale(dpr, dpr);
  canvas.style.width = displayWidth + 'px';
  canvas.style.height = displayHeight + 'px';

  // Build last 7 days data
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }

  const counts = days.map(day =>
    appData.workouts.filter(w => w.date === day).length
  );

  const maxCount = Math.max(...counts, 1);
  const barWidth = (displayWidth - 20) / 7;
  const dayLabels = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  const isDark = document.body.classList.contains('dark-mode');
  const barColor = '#007AFF';
  const emptyColor = isDark ? '#2c2c2e' : '#e5e5ea';
  const textColor = isDark ? '#ebebf599' : '#3c3c4399';

  ctx.clearRect(0, 0, displayWidth, displayHeight);

  days.forEach((day, i) => {
    const count = counts[i];
    const x = 10 + i * barWidth + barWidth * 0.1;
    const w = barWidth * 0.8;
    const maxBarH = displayHeight - 24;
    const h = count > 0 ? Math.max((count / maxCount) * maxBarH, 6) : 4;
    const y = displayHeight - 20 - h;

    // Bar
    ctx.fillStyle = count > 0 ? barColor : emptyColor;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(x, y, w, h, 3) : ctx.rect(x, y, w, h);
    ctx.fill();

    // Day label
    const today = days[days.length - 1];
    ctx.fillStyle = day === today ? barColor : textColor;
    ctx.font = `${day === today ? 700 : 400} 11px -apple-system`;
    ctx.textAlign = 'center';

    // Map date to day label
    const dateObj = new Date(day + 'T00:00:00');
    const dayIdx = (dateObj.getDay() + 6) % 7; // Mon=0
    ctx.fillText(dayLabels[dayIdx], x + w / 2, displayHeight - 4);
  });
}

/** Populate exercise selector in stats */
function populateExerciseSelector() {
  const sel = document.getElementById('exercise-chart-select');
  if (!sel) return;

  // Collect all exercise names from workout history
  const names = new Set();
  appData.workouts.forEach(w => w.exercises.forEach(ex => names.add(ex.name)));

  const currentVal = sel.value;
  sel.innerHTML = '<option value="">Übung wählen...</option>';
  [...names].sort().forEach(name => {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    if (name === currentVal) opt.selected = true;
    sel.appendChild(opt);
  });

  if (currentVal && names.has(currentVal)) {
    renderExerciseChart(currentVal);
  }
}

/** Render exercise progress line chart on Canvas */
function renderExerciseChart(exerciseName) {
  const canvas = document.getElementById('exercise-chart');
  if (!canvas || !exerciseName) return;

  // Collect top sets per workout date
  const dataPoints = [];
  const sorted = [...appData.workouts].sort((a, b) => new Date(a.date) - new Date(b.date));

  sorted.forEach(w => {
    const ex = w.exercises.find(e => e.name === exerciseName);
    if (!ex || !ex.sets.length) return;
    // Top set = highest weight * reps
    const topSet = ex.sets.reduce((best, s) => {
      const score = (s.weight || 0) * s.reps;
      return score > (best.weight || 0) * best.reps ? s : best;
    });
    dataPoints.push({ date: w.date, weight: topSet.weight || 0, reps: topSet.reps });
  });

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const displayWidth = canvas.offsetWidth || 300;
  const displayHeight = 160;

  canvas.width = displayWidth * dpr;
  canvas.height = displayHeight * dpr;
  ctx.scale(dpr, dpr);
  canvas.style.width = displayWidth + 'px';
  canvas.style.height = displayHeight + 'px';

  ctx.clearRect(0, 0, displayWidth, displayHeight);

  if (dataPoints.length < 2) {
    const isDark = document.body.classList.contains('dark-mode');
    ctx.fillStyle = isDark ? '#ebebf599' : '#3c3c4399';
    ctx.font = '14px -apple-system';
    ctx.textAlign = 'center';
    ctx.fillText(dataPoints.length === 0 ? 'Keine Daten' : 'Mehr Daten ab 2 Einheiten', displayWidth / 2, displayHeight / 2);
    return;
  }

  const weights = dataPoints.map(p => p.weight);
  const minW = Math.min(...weights);
  const maxW = Math.max(...weights);
  const range = maxW - minW || 1;

  const padLeft = 44, padRight = 12, padTop = 12, padBottom = 28;
  const chartW = displayWidth - padLeft - padRight;
  const chartH = displayHeight - padTop - padBottom;

  const isDark = document.body.classList.contains('dark-mode');
  const lineColor = '#007AFF';
  const gridColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';
  const textColor = isDark ? '#ebebf599' : '#3c3c4399';
  const pointColor = '#007AFF';
  const fillColor = isDark ? 'rgba(0,122,255,0.12)' : 'rgba(0,122,255,0.08)';

  // Grid lines
  const gridLines = 4;
  for (let i = 0; i <= gridLines; i++) {
    const y = padTop + (chartH * i) / gridLines;
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padLeft, y);
    ctx.lineTo(padLeft + chartW, y);
    ctx.stroke();

    // Y axis label
    const val = maxW - (range * i) / gridLines;
    ctx.fillStyle = textColor;
    ctx.font = '10px -apple-system';
    ctx.textAlign = 'right';
    ctx.fillText(val.toFixed(val % 1 === 0 ? 0 : 1) + 'kg', padLeft - 4, y + 4);
  }

  // Compute x/y for each point
  const points = dataPoints.map((p, i) => ({
    x: padLeft + (i / (dataPoints.length - 1)) * chartW,
    y: padTop + chartH - ((p.weight - minW) / range) * chartH,
    ...p
  }));

  // Fill area
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  points.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(points[points.length - 1].x, padTop + chartH);
  ctx.lineTo(points[0].x, padTop + chartH);
  ctx.closePath();
  ctx.fillStyle = fillColor;
  ctx.fill();

  // Line
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  points.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.stroke();

  // Points + date labels
  points.forEach((p, i) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = pointColor;
    ctx.fill();
    ctx.strokeStyle = isDark ? '#000' : '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Date label (only first, last, and every 3rd)
    if (i === 0 || i === points.length - 1 || i % 3 === 0) {
      const d = new Date(p.date + 'T00:00:00');
      const label = `${d.getDate()}.${d.getMonth() + 1}`;
      ctx.fillStyle = textColor;
      ctx.font = '10px -apple-system';
      ctx.textAlign = i === 0 ? 'left' : i === points.length - 1 ? 'right' : 'center';
      ctx.fillText(label, Math.max(padLeft, Math.min(p.x, padLeft + chartW)), displayHeight - 6);
    }
  });
}

/** Render personal records list */
function renderPRList() {
  const container = document.getElementById('pr-list');
  if (!container) return;

  // Collect all exercise names
  const exerciseNames = new Set();
  appData.workouts.forEach(w => w.exercises.forEach(ex => exerciseNames.add(ex.name)));

  const prs = [];
  exerciseNames.forEach(name => {
    const pr = getPersonalRecord(name);
    if (pr) prs.push({ name, ...pr });
  });

  if (prs.length === 0) {
    container.innerHTML = '<span class="muted">Noch keine PRs</span>';
    return;
  }

  prs.sort((a, b) => a.name.localeCompare(b.name));

  container.innerHTML = prs.map(pr => `
    <div class="pr-item">
      <div class="pr-name">${pr.name}</div>
      <div class="pr-value">${pr.weight > 0 ? pr.weight + 'kg × ' : ''}${pr.reps} Wdh</div>
    </div>
  `).join('');
}

/* =====================================================
   10. UI - SETTINGS TAB
   ===================================================== */

/** Render settings values from appData */
function renderSettings() {
  const planSel = document.getElementById('setting-plan');
  const timerSel = document.getElementById('setting-timer');
  const darkToggle = document.getElementById('setting-darkmode');
  const vibToggle = document.getElementById('setting-vibration');

  if (planSel) planSel.value = appData.settings.activePlan;
  if (timerSel) timerSel.value = appData.settings.pauseTimer;
  if (darkToggle) darkToggle.checked = appData.settings.darkMode;
  if (vibToggle) vibToggle.checked = appData.settings.vibration;
}

/** Apply dark/light mode to body */
function applyTheme() {
  if (appData.settings.darkMode) {
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
  } else {
    document.body.classList.add('light-mode');
    document.body.classList.remove('dark-mode');
  }
}

/** Export all data as JSON download */
function exportData() {
  try {
    const json = JSON.stringify(appData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workout-tracker-export-${todayStr()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('✅ Daten exportiert!');
  } catch (e) {
    showToast('❌ Export fehlgeschlagen');
    console.error('[Export]', e);
  }
}

/** Import data from a JSON file */
function importData(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      // Basic validation
      if (!imported.workouts || !Array.isArray(imported.workouts)) {
        throw new Error('Invalid data format');
      }
      appData = { ...getDefaultData(), ...imported };
      if (!appData.settings) appData.settings = getDefaultData().settings;
      saveData(appData);
      applyTheme();
      renderTrainingHome();
      renderSettings();
      showToast(`✅ ${imported.workouts.length} Workouts importiert!`);
    } catch (err) {
      showToast('❌ Ungültige JSON-Datei');
      console.error('[Import]', err);
    }
  };
  reader.readAsText(file);
}

/* =====================================================
   11. TOAST, MODAL, VIEW HELPERS
   ===================================================== */

let toastTimeout = null;

/** Show a toast notification */
function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  // Clear existing
  if (toastTimeout) {
    clearTimeout(toastTimeout);
    toast.classList.remove('show');
  }

  toast.classList.remove('hidden');
  toast.textContent = message;

  // Force reflow for animation
  void toast.offsetWidth;
  toast.classList.add('show');

  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => { toast.classList.add('hidden'); }, 300);
  }, duration);
}

/** Show confirmation modal */
function showModal(title, body, onConfirm, confirmLabel = 'Löschen') {
  const overlay = document.getElementById('modal-overlay');
  const titleEl = document.getElementById('modal-title');
  const bodyEl = document.getElementById('modal-body');
  const confirmBtn = document.getElementById('modal-confirm');

  if (!overlay) return;
  titleEl.textContent = title;
  bodyEl.textContent = body;
  confirmBtn.textContent = confirmLabel;
  overlay.classList.remove('hidden');

  confirmBtn.onclick = () => {
    overlay.classList.add('hidden');
    onConfirm();
  };
}

/** Switch between views within a tab */
function showView(tabId, viewId) {
  const tab = document.getElementById(`tab-${tabId}`);
  if (!tab) return;
  tab.querySelectorAll('.view').forEach(v => {
    v.classList.toggle('active', v.id === viewId);
  });
}

/* =====================================================
   12. CONFETTI
   ===================================================== */

let confettiAnimId = null;
const confettiParticles = [];

/** Launch confetti celebration animation */
function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  confettiParticles.length = 0;

  // Generate particles
  const colors = ['#007AFF', '#34C759', '#FF9500', '#FFD60A', '#FF3B30', '#AF52DE', '#FF2D55'];
  for (let i = 0; i < 120; i++) {
    confettiParticles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * -1,
      w: Math.random() * 10 + 5,
      h: Math.random() * 5 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 4 + 2,
      rot: Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * 0.2,
      opacity: 1
    });
  }

  const startTime = performance.now();
  const duration = 3500; // ms

  function animate(now) {
    const elapsed = now - startTime;
    const progress = elapsed / duration;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let anyVisible = false;
    confettiParticles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.06; // gravity
      p.rot += p.vrot;

      // Fade out near end
      if (progress > 0.7) p.opacity = Math.max(0, 1 - (progress - 0.7) / 0.3);

      if (p.y < canvas.height + 20) anyVisible = true;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });

    if (anyVisible && elapsed < duration + 1000) {
      confettiAnimId = requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  if (confettiAnimId) cancelAnimationFrame(confettiAnimId);
  confettiAnimId = requestAnimationFrame(animate);
  vibrate([50, 30, 50, 30, 100]);
}

/* =====================================================
   13. SERVICE WORKER REGISTRATION
   ===================================================== */

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('./service-worker.js')
        .then(reg => {
          console.log('[SW] Registered:', reg.scope);
          // Check for updates
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                showToast('🔄 Update verfügbar – bitte neu laden');
              }
            });
          });
        })
        .catch(err => console.error('[SW] Registration failed:', err));
    });
  }
}

/* =====================================================
   ICON GENERATOR (Canvas-based app icons)
   ===================================================== */

/** Generate app icon PNG data URLs and set them on link elements */
function generateAppIcons() {
  [192, 512].forEach(size => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, '#1a1a2e');
    grad.addColorStop(1, '#16213e');
    ctx.fillStyle = grad;
    // Rounded rect
    const r = size * 0.22;
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(size - r, 0);
    ctx.quadraticCurveTo(size, 0, size, r);
    ctx.lineTo(size, size - r);
    ctx.quadraticCurveTo(size, size, size - r, size);
    ctx.lineTo(r, size);
    ctx.quadraticCurveTo(0, size, 0, size - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();
    ctx.fill();

    // Dumbbell icon
    const s = size;
    ctx.fillStyle = '#007AFF';
    const barH = s * 0.08;
    const barY = s * 0.46;
    // Main bar
    ctx.fillRect(s * 0.28, barY, s * 0.44, barH);
    // Left weight
    ctx.beginPath();
    ctx.roundRect
      ? ctx.roundRect(s * 0.12, s * 0.35, s * 0.1, s * 0.3, s * 0.04)
      : ctx.rect(s * 0.12, s * 0.35, s * 0.1, s * 0.3);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect
      ? ctx.roundRect(s * 0.2, s * 0.38, s * 0.08, s * 0.24, s * 0.03)
      : ctx.rect(s * 0.2, s * 0.38, s * 0.08, s * 0.24);
    ctx.fill();
    // Right weight
    ctx.beginPath();
    ctx.roundRect
      ? ctx.roundRect(s * 0.78, s * 0.35, s * 0.1, s * 0.3, s * 0.04)
      : ctx.rect(s * 0.78, s * 0.35, s * 0.1, s * 0.3);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect
      ? ctx.roundRect(s * 0.72, s * 0.38, s * 0.08, s * 0.24, s * 0.03)
      : ctx.rect(s * 0.72, s * 0.38, s * 0.08, s * 0.24);
    ctx.fill();

    const dataUrl = canvas.toDataURL('image/png');
    // Set apple touch icon
    if (size === 192) {
      let link = document.querySelector('link[rel="apple-touch-icon"]');
      if (!link) {
        link = document.createElement('link');
        link.rel = 'apple-touch-icon';
        document.head.appendChild(link);
      }
      link.href = dataUrl;
    }
  });
}

/* =====================================================
   14. EVENT LISTENERS SETUP
   ===================================================== */

function setupEventListeners() {

  // ===== BOTTOM NAV =====
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      vibrate(8);
      switchTab(btn.dataset.tab);
    });
  });

  // ===== TRAINING HOME =====
  const planSwitchBtn = document.getElementById('btn-plan-switch');
  if (planSwitchBtn) {
    planSwitchBtn.addEventListener('click', () => {
      vibrate(8);
      // Toggle between plans
      appData.settings.activePlan = appData.settings.activePlan === 'trainer' ? 'optimiert' : 'trainer';
      saveData(appData);
      renderTrainingHome();
      renderSettings();
      showToast(`Plan: ${PLANS[appData.settings.activePlan].name}`);
    });
  }

  // ===== TRAINING ACTIVE =====
  const endBtn = document.getElementById('btn-end-training');
  if (endBtn) endBtn.addEventListener('click', endTrainingWithConfirm);

  const skipBtn = document.getElementById('btn-skip-exercise');
  if (skipBtn) skipBtn.addEventListener('click', () => {
    // Save note
    const noteEl = document.getElementById('exercise-note');
    if (noteEl) trainingState.notes[trainingState.currentIndex] = noteEl.value;
    goToNextExercise();
  });

  const addSetBtn = document.getElementById('btn-add-set');
  if (addSetBtn) {
    addSetBtn.addEventListener('click', () => {
      vibrate(8);
      const exIdx = trainingState.currentIndex;
      const ex = trainingState.exercises[exIdx];
      const currentSets = trainingState.sets[exIdx];
      const lastSet = currentSets[currentSets.length - 1];
      currentSets.push({
        weight: lastSet ? lastSet.weight : getSuggestedWeight(ex),
        reps: lastSet ? lastSet.reps : getSuggestedReps(ex),
        notes: '',
        done: false
      });
      renderSetsForCurrentExercise();
    });
  }

  // Save note on input
  const noteInput = document.getElementById('exercise-note');
  if (noteInput) {
    noteInput.addEventListener('input', () => {
      trainingState.notes[trainingState.currentIndex] = noteInput.value;
    });
  }

  // ===== REST TIMER =====
  const timerSkip = document.getElementById('btn-timer-skip');
  if (timerSkip) {
    timerSkip.addEventListener('click', () => {
      vibrate(10);
      stopRestTimer();
      const overlay = document.getElementById('rest-timer-overlay');
      if (overlay) overlay.classList.add('hidden');
    });
  }

  const timerMinus = document.getElementById('btn-timer-minus');
  if (timerMinus) {
    timerMinus.addEventListener('click', () => {
      vibrate(8);
      trainingState.timerRemaining = Math.max(0, trainingState.timerRemaining - 30);
    });
  }

  const timerPlus = document.getElementById('btn-timer-plus');
  if (timerPlus) {
    timerPlus.addEventListener('click', () => {
      vibrate(8);
      trainingState.timerRemaining += 30;
      trainingState.timerTotal = Math.max(trainingState.timerTotal, trainingState.timerRemaining);
    });
  }

  // ===== TRAINING SUMMARY =====
  const saveBtn = document.getElementById('btn-save-workout');
  if (saveBtn) saveBtn.addEventListener('click', saveWorkout);

  // ===== SWIPE GESTURE =====
  setupSwipeGesture();

  // ===== HISTORY FILTERS =====
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderHistory(btn.dataset.filter);
    });
  });

  // ===== HISTORY DETAIL CLOSE =====
  const closeDetailBtn = document.getElementById('btn-close-history-detail');
  if (closeDetailBtn) {
    closeDetailBtn.addEventListener('click', () => {
      document.getElementById('history-detail-overlay')?.classList.add('hidden');
    });
  }

  document.getElementById('history-detail-overlay')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
      e.currentTarget.classList.add('hidden');
    }
  });

  // ===== EXERCISE CHART SELECTOR =====
  const chartSel = document.getElementById('exercise-chart-select');
  if (chartSel) {
    chartSel.addEventListener('change', () => {
      renderExerciseChart(chartSel.value);
    });
  }

  // ===== SETTINGS =====
  const planSetting = document.getElementById('setting-plan');
  if (planSetting) {
    planSetting.addEventListener('change', () => {
      appData.settings.activePlan = planSetting.value;
      saveData(appData);
      renderTrainingHome();
      showToast(`Plan: ${PLANS[appData.settings.activePlan].name}`);
    });
  }

  const timerSetting = document.getElementById('setting-timer');
  if (timerSetting) {
    timerSetting.addEventListener('change', () => {
      appData.settings.pauseTimer = parseInt(timerSetting.value, 10);
      saveData(appData);
    });
  }

  const darkSetting = document.getElementById('setting-darkmode');
  if (darkSetting) {
    darkSetting.addEventListener('change', () => {
      appData.settings.darkMode = darkSetting.checked;
      saveData(appData);
      applyTheme();
    });
  }

  const vibSetting = document.getElementById('setting-vibration');
  if (vibSetting) {
    vibSetting.addEventListener('change', () => {
      appData.settings.vibration = vibSetting.checked;
      saveData(appData);
    });
  }

  const exportBtn = document.getElementById('btn-export');
  if (exportBtn) exportBtn.addEventListener('click', exportData);

  const importInput = document.getElementById('btn-import');
  if (importInput) {
    importInput.addEventListener('change', (e) => {
      importData(e.target.files[0]);
      e.target.value = ''; // Reset so same file can be imported again
    });
  }

  const deleteBtn = document.getElementById('btn-delete-all');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
      showModal(
        'Alle Daten löschen?',
        'Diese Aktion kann nicht rückgängig gemacht werden. Alle Workouts und Einstellungen werden gelöscht.',
        () => {
          appData = getDefaultData();
          saveData(appData);
          applyTheme();
          renderTrainingHome();
          renderSettings();
          showToast('🗑️ Alle Daten gelöscht');
        },
        'Löschen'
      );
    });
  }

  // ===== MODAL CANCEL =====
  const modalCancel = document.getElementById('modal-cancel');
  if (modalCancel) {
    modalCancel.addEventListener('click', () => {
      document.getElementById('modal-overlay')?.classList.add('hidden');
    });
  }

  document.getElementById('modal-overlay')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
      e.currentTarget.classList.add('hidden');
    }
  });

  // ===== PREVENT BOUNCE SCROLL =====
  document.body.addEventListener('touchmove', (e) => {
    // Allow scroll within scrollable elements
    let el = e.target;
    while (el !== document.body) {
      if (el.scrollHeight > el.clientHeight) return;
      el = el.parentElement;
    }
    e.preventDefault();
  }, { passive: false });

  // ===== RESIZE → REDRAW CHARTS =====
  window.addEventListener('resize', () => {
    const statsTab = document.getElementById('tab-stats');
    if (statsTab && statsTab.classList.contains('active')) {
      renderWeeklyChart();
      const sel = document.getElementById('exercise-chart-select');
      if (sel && sel.value) renderExerciseChart(sel.value);
    }
  });
}

/* =====================================================
   15. INIT
   ===================================================== */

/** Main initialization function */
function init() {
  // Apply saved theme immediately (prevent FOUC)
  applyTheme();

  // Generate app icons via canvas
  generateAppIcons();

  // Setup all event listeners
  setupEventListeners();

  // Render initial training home
  renderTrainingHome();

  // Apply settings to controls
  renderSettings();

  // Register service worker
  registerServiceWorker();

  // Hide loading screen and show app
  const loadingScreen = document.getElementById('loading-screen');
  const app = document.getElementById('app');

  setTimeout(() => {
    if (loadingScreen) {
      loadingScreen.style.opacity = '0';
      setTimeout(() => {
        loadingScreen.style.display = 'none';
        if (app) app.style.display = 'flex';
        if (app) app.style.flexDirection = 'column';
      }, 400);
    }
  }, 600);
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
