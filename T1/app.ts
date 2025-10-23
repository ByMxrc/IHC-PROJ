/* File: app.ts */
// TypeScript interactivity for the rediseño

// Utility to toggle class and set aria-pressed
function toggleButton(btn: HTMLElement, cls: string) {
  const pressed = btn.getAttribute('aria-pressed') === 'true';
  btn.setAttribute('aria-pressed', String(!pressed));
  document.documentElement.classList.toggle(cls);
}

// Accessibility controls
const btnAcc = document.getElementById('btn-accessibility') as HTMLElement | null;
const btnDark = document.getElementById('btn-toggle-dark') as HTMLElement | null;
const accLargeText = document.getElementById('acc-large-text') as HTMLInputElement | null;
const accHighContrast = document.getElementById('acc-high-contrast') as HTMLInputElement | null;

if (btnDark) {
  btnDark.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    // simple CSS switch (user can adapt)
    if (document.documentElement.classList.contains('dark')) {
      (document.documentElement.style as any).setProperty('--bg', '#041423');
      (document.documentElement.style as any).setProperty('--fg', '#e6f3ff');
    } else {
      (document.documentElement.style as any).setProperty('--bg', '#ffffff');
      (document.documentElement.style as any).setProperty('--fg', '#0b2545');
    }
  });
}

if (btnAcc) {
  btnAcc.addEventListener('click', () => {
    // open accessible panel — here we toggle a class for demo
    toggleButton(btnAcc, 'show-acc');
  });
}

if (accLargeText) {
  accLargeText.addEventListener('change', () => {
    document.documentElement.classList.toggle('large-text', accLargeText.checked);
  });
}
if (accHighContrast) {
  accHighContrast.addEventListener('change', () => {
    document.documentElement.classList.toggle('high-contrast', accHighContrast.checked);
  });
}

// Quick actions keyboard support
const quick = document.querySelectorAll('.quick-actions .card');
quick.forEach((el) => {
  el.setAttribute('tabindex', '0');
el.addEventListener('keydown', (e: Event) => {
    const ke = e as KeyboardEvent;
    if (ke.key === 'Enter' || ke.key === ' ') {
        (el as HTMLElement).click();
        ke.preventDefault();
    }
});
});

// Voice assistant (minimal, using Web Speech API)
const voiceBtn = document.getElementById('voice-btn') as HTMLElement | null;
let recognition: any = null;
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = 'es-EC';
  recognition.interimResults = false;
}

if (voiceBtn && recognition) {
  let listening = false;
  voiceBtn.addEventListener('click', () => {
    if (!listening) {
      recognition.start();
      listening = true;
      voiceBtn.textContent = '🛑';
      voiceBtn.setAttribute('aria-pressed', 'true');
    } else {
      recognition.stop();
      listening = false;
      voiceBtn.textContent = '🎤';
      voiceBtn.setAttribute('aria-pressed', 'false');
    }
  });

  recognition.addEventListener('result', (ev: any) => {
    const text = ev.results[0][0].transcript;
    // Simple command parsing
    if (/agendar|cita/.test(text)) {
      alert('Comando detectado: Agendar cita — redirigiendo...');
    } else if (/médico|doctor/.test(text)) {
      alert('Buscando médicos...');
    } else {
      alert('No se reconoció un comando específico: "' + text + '"');
    }
  });

  recognition.addEventListener('end', () => {
    listening = false;
    voiceBtn.textContent = '🎤';
    voiceBtn.setAttribute('aria-pressed', 'false');
  });
}

// Search form keyboard and basic behavior
const searchForm = document.getElementById('search-form') as HTMLFormElement | null;
const searchInput = document.getElementById('search-input') as HTMLInputElement | null;
if (searchForm && searchInput) {
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = searchInput.value.trim();
    if (!q) {
      searchInput.focus();
      alert('Por favor ingrese un término de búsqueda.');
      return;
    }
    // In a real app, aquí se redirigiría a resultados
    alert('Buscar: ' + q);
  });
}

// Small enhancement: visible focus for keyboard users
document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    document.documentElement.classList.add('show-focus');
  }
});
