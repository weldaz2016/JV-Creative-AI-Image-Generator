const navItems = document.querySelectorAll('.nav-item');
const panels = document.querySelectorAll('.panel');
const STORAGE_KEY = 'jv-creative-assets';
const API_BASE = 'http://localhost:3001';

navItems.forEach((item) => {
  item.addEventListener('click', () => {
    navItems.forEach((button) => button.classList.remove('active'));
    item.classList.add('active');

    const target = item.dataset.target;
    panels.forEach((panel) => {
      panel.classList.toggle('active', panel.id === target);
    });
  });
});

const presetCards = document.querySelectorAll('.preset-card');
presetCards.forEach((card) => {
  card.addEventListener('click', () => {
    presetCards.forEach((item) => item.classList.remove('active'));
    card.classList.add('active');
  });
});

const imagePrompt = document.querySelector('#image-prompt');
const videoPrompt = document.querySelector('#video-prompt');
const textInput = document.querySelector('#text-input');
const generateImageButton = document.querySelector('#generate-image');
const generateVideoButton = document.querySelector('#generate-video');
const generateVariationsButton = document.querySelector('#generate-variations');
const renderTypographyButton = document.querySelector('#render-typography');
const historyGrid = document.querySelector('#history-grid');
const exportGrid = document.querySelector('#export-grid');

const imageReference = document.querySelector('#image-reference');
const videoReference = document.querySelector('#video-reference');
const reverseImage = document.querySelector('#reverse-image');
const reverseStyle = document.querySelector('#reverse-style');

const progressLine = document.querySelector('.progress-line');
const progressMeta = document.querySelector('.progress-meta');

const loadAssets = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    return [];
  }
};

const saveAssets = (assets) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(assets));
};

const formatTime = (timestamp) => {
  const deltaMinutes = Math.floor((Date.now() - timestamp) / 60000);
  if (deltaMinutes < 1) return 'Just now';
  if (deltaMinutes === 1) return '1 min ago';
  if (deltaMinutes < 60) return `${deltaMinutes} mins ago`;
  const hours = Math.floor(deltaMinutes / 60);
  return `${hours} hrs ago`;
};

const createCanvasPreview = (title, subtitle) => {
  const canvas = document.createElement('canvas');
  canvas.width = 768;
  canvas.height = 768;
  const context = canvas.getContext('2d');
  const gradient = context.createLinearGradient(0, 0, 768, 768);
  gradient.addColorStop(0, '#26f7ff');
  gradient.addColorStop(1, '#bd3bff');
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = 'rgba(0, 0, 0, 0.45)';
  context.fillRect(40, 520, 688, 180);

  context.fillStyle = '#f4f7ff';
  context.font = 'bold 36px Segoe UI';
  context.fillText(title.slice(0, 28), 60, 580);
  context.font = '20px Segoe UI';
  context.fillText(subtitle.slice(0, 40), 60, 620);

  return canvas.toDataURL('image/png');
};

const createId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `asset-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

const addAsset = (asset) => {
  const assets = loadAssets();
  assets.unshift(asset);
  saveAssets(assets);
  renderAssets();
};

const renderHistory = (assets) => {
  if (!historyGrid) return;
  historyGrid.innerHTML = '';
  assets.slice(0, 5).forEach((asset) => {
    const card = document.createElement('div');
    card.className = 'history-card';
    card.innerHTML = `
      <img class="thumbnail glow" alt="${asset.title}" src="${asset.preview}" />
      <div>
        <strong>${asset.title}</strong>
        <p>${asset.meta} · ${formatTime(asset.createdAt)}</p>
      </div>
      <button class="ghost-button" data-action="open" data-id="${asset.id}">Open</button>
    `;
    historyGrid.appendChild(card);
  });
};

const renderExports = (assets) => {
  if (!exportGrid) return;
  exportGrid.innerHTML = '';
  assets.forEach((asset) => {
    const card = document.createElement('div');
    card.className = 'export-card';
    card.innerHTML = `
      <img class="thumbnail glow" alt="${asset.title}" src="${asset.preview}" />
      <div>
        <h4>${asset.title}</h4>
        <p>${asset.meta} · ${formatTime(asset.createdAt)}</p>
      </div>
      <div class="export-actions">
        <a class="icon-button" href="${asset.preview}" download="${asset.title}.png" title="Download">
          <i class="fa-solid fa-download"></i>
        </a>
        <button class="icon-button" data-action="rename" data-id="${asset.id}">
          <i class="fa-solid fa-pen"></i>
        </button>
        <button class="icon-button" data-action="delete" data-id="${asset.id}">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `;
    exportGrid.appendChild(card);
  });
};

const renderAssets = () => {
  const assets = loadAssets();
  renderHistory(assets);
  renderExports(assets);
};

const setProgress = (value, label) => {
  if (progressLine) {
    progressLine.style.width = `${value}%`;
  }
  if (progressMeta) {
    progressMeta.innerHTML = `<span>${label}</span><span>${value}%</span>`;
  }
};

const handleImageGeneration = async () => {
  const prompt = imagePrompt?.value?.trim();
  if (!prompt) {
    alert('Please add a prompt to generate an image.');
    return;
  }
  setProgress(30, 'Generating image');
  let preview = createCanvasPreview('JV Creative', prompt);
  try {
    const response = await fetch(`${API_BASE}/api/generate/image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    const data = await response.json();
    if (data?.url) {
      preview = data.url;
    }
  } catch (error) {
    console.warn('Backend unavailable, using local preview.');
  }
  addAsset({
    id: createId(),
    title: prompt.slice(0, 24),
    meta: 'AI Image · PNG',
    preview,
    createdAt: Date.now(),
  });
  setProgress(100, 'Complete');
};

const handleVideoGeneration = async () => {
  const prompt = videoPrompt?.value?.trim();
  if (!prompt) {
    alert('Please add a prompt to generate a video.');
    return;
  }
  setProgress(40, 'Rendering preview');
  let preview = createCanvasPreview('Video Preview', prompt);
  try {
    const response = await fetch(`${API_BASE}/api/generate/video`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    const data = await response.json();
    if (data?.url) {
      preview = data.url;
    }
  } catch (error) {
    console.warn('Backend unavailable, using local preview.');
  }
  addAsset({
    id: createId(),
    title: prompt.slice(0, 24),
    meta: 'AI Video · MP4',
    preview,
    createdAt: Date.now(),
  });
  setProgress(100, 'Complete');
};

const handleTypography = async () => {
  const text = textInput?.value?.trim();
  if (!text) {
    alert('Please add text to render.');
    return;
  }
  let preview = createCanvasPreview('Typography', text);
  try {
    const response = await fetch(`${API_BASE}/api/generate/text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    const data = await response.json();
    if (data?.url) {
      preview = data.url;
    }
  } catch (error) {
    console.warn('Backend unavailable, using local preview.');
  }
  addAsset({
    id: createId(),
    title: text.slice(0, 24),
    meta: 'AI Text · SVG',
    preview,
    createdAt: Date.now(),
  });
};

const handleReverseImage = (file) => {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    addAsset({
      id: createId(),
      title: file.name.replace(/\.[^/.]+$/, ''),
      meta: 'Reverse Image · PNG',
      preview: reader.result,
      createdAt: Date.now(),
    });
  };
  reader.readAsDataURL(file);
};

exportGrid?.addEventListener('click', (event) => {
  const target = event.target.closest('[data-action]');
  if (!target) return;
  const action = target.dataset.action;
  const id = target.dataset.id;
  let assets = loadAssets();
  if (action === 'delete') {
    assets = assets.filter((asset) => asset.id !== id);
    saveAssets(assets);
    renderAssets();
  }
  if (action === 'rename') {
    const newName = prompt('Rename asset');
    if (newName) {
      assets = assets.map((asset) =>
        asset.id === id ? { ...asset, title: newName } : asset
      );
      saveAssets(assets);
      renderAssets();
    }
  }
});

generateImageButton?.addEventListener('click', handleImageGeneration);
generateVideoButton?.addEventListener('click', handleVideoGeneration);
renderTypographyButton?.addEventListener('click', handleTypography);
generateVariationsButton?.addEventListener('click', () => {
  if (reverseImage?.files?.[0]) {
    handleReverseImage(reverseImage.files[0]);
  } else {
    alert('Upload an image to generate variations.');
  }
});

imageReference?.addEventListener('change', (event) => handleReverseImage(event.target.files[0]));
videoReference?.addEventListener('change', (event) => handleReverseImage(event.target.files[0]));
reverseImage?.addEventListener('change', (event) => handleReverseImage(event.target.files[0]));
reverseStyle?.addEventListener('change', (event) => handleReverseImage(event.target.files[0]));

renderAssets();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js');
  });
}
