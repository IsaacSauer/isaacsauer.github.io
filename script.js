let pages = [], idx = 0;

const fileInput = document.getElementById('fileInput');
const viewer = document.getElementById('viewer');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const pageCounter = document.getElementById('pageCounter');
const loading = document.getElementById('loading');
const darkToggle = document.getElementById('darkToggle');
const thumbnailContainer = document.getElementById('thumbnails');

fileInput.addEventListener('change', async e => {
    const file = e.target.files[0];
    if (!file) return;

    pages = [];
    idx = 0;
    viewer.src = '';
    pageCounter.textContent = '';
    thumbnailContainer.innerHTML = '';
    loading.style.display = 'block';

    try {
        const archive = await Unarchiver.open(file);
        const entries = archive.entries
            .filter(e => /\.(jpe?g|png|gif|webp)$/i.test(e.name))
            .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

        pages = await Promise.all(entries.map(async entry => {
            const blob = await entry.read();
            return URL.createObjectURL(blob);
        }));

        if (pages.length) {
            idx = 0;
            renderThumbnails();
            updateViewer();
            prevBtn.disabled = false;
            nextBtn.disabled = false;
        }
    } catch (err) {
        alert("Failed to read archive: " + err.message);
    } finally {
        loading.style.display = 'none';
    }
});

function renderThumbnails() {
    thumbnailContainer.innerHTML = '';
    pages.forEach((src, i) => {
        const thumb = document.createElement('img');
        thumb.src = src;
        if (i === idx) thumb.classList.add('active');
        thumb.addEventListener('click', () => {
            idx = i;
            updateViewer();
        });
        thumbnailContainer.appendChild(thumb);
    });
}

function updateViewer() {
    viewer.src = pages[idx];
    pageCounter.textContent = `Page ${idx + 1} of ${pages.length}`;
    [...thumbnailContainer.children].forEach((thumb, i) => {
        thumb.classList.toggle('active', i === idx);
    });
}

prevBtn.addEventListener('click', () => {
    if (idx > 0) {
        idx--;
        updateViewer();
    }
});

nextBtn.addEventListener('click', () => {
    if (idx < pages.length - 1) {
        idx++;
        updateViewer();
    }
});

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') prevBtn.click();
    if (e.key === 'ArrowRight') nextBtn.click();
});

darkToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
});
