    lucide.createIcons();

    /* =============================================
       DATA
       ============================================= */
    const DB = {
        subjects: [
            { id: 'math', name: 'Mathematics', short: 'Math', icon: 'function-square', color: '#3b82f6', bg: 'from-blue-600 to-blue-900' },
            { id: 'phys', name: 'Physics', short: 'Phys', icon: 'atom', color: '#f97316', bg: 'from-orange-500 to-orange-800' },
            { id: 'chem', name: 'Chemistry', short: 'Chem', icon: 'flask-conical', color: '#22c55e', bg: 'from-green-500 to-green-800' },
            { id: 'bio',  name: 'Biology', short: 'Bio', icon: 'dna', color: '#ec4899', bg: 'from-pink-500 to-pink-800' },
            { id: 'eng',  name: 'English', short: 'Eng', icon: 'book-open', color: '#a855f7', bg: 'from-purple-500 to-purple-800' },
            { id: 'cs',   name: 'Computer Science', short: 'CS', icon: 'monitor', color: '#06b6d4', bg: 'from-cyan-500 to-cyan-800' },
            { id: 'hist', name: 'History', short: 'Hist', icon: 'landmark', color: '#eab308', bg: 'from-yellow-500 to-yellow-800' },
            { id: 'geo',  name: 'Geography', short: 'Geo', icon: 'globe', color: '#14b8a6', bg: 'from-teal-500 to-teal-800' },
            { id: 'eco',  name: 'Economics', short: 'Eco', icon: 'trending-up', color: '#f43f5e', bg: 'from-rose-500 to-rose-800' },
            { id: 'psc',  name: 'Political Science', short: 'PolSci', icon: 'scale', color: '#8b5cf6', bg: 'from-violet-500 to-violet-800' },
            { id: 'acc',  name: 'Accountancy', short: 'Acc', icon: 'calculator', color: '#10b981', bg: 'from-emerald-500 to-emerald-800' },
            { id: 'phy2', name: 'Physical Education', short: 'PE', icon: 'dumbbell', color: '#ef4444', bg: 'from-red-500 to-red-800' },
            { id: 'art',  name: 'Fine Arts', short: 'Art', icon: 'palette', color: '#f472b6', bg: 'from-pink-400 to-pink-700' },
            { id: 'mus',  name: 'Music', short: 'Music', icon: 'music', color: '#fb923c', bg: 'from-orange-400 to-orange-700' },
        ],
        chapters: {
            'math': [
                { id: 'm1', title: 'Fundamentals of Algebra', modules: 6 },
                { id: 'm2', title: 'Quadratic Equations', modules: 4 },
                { id: 'm3', title: 'Set Theory & Number System', modules: 5 },
                { id: 'm4', title: 'Logarithms', modules: 3 },
                { id: 'm5', title: 'Sequence & Series', modules: 7 },
                { id: 'm6', title: 'Permutations & Combinations', modules: 5 },
            ],
            'phys': [
                { id: 'p1', title: 'Kinematics', modules: 8 },
                { id: 'p2', title: 'Laws of Motion', modules: 6 },
                { id: 'p3', title: 'Work, Energy & Power', modules: 5 },
                { id: 'p4', title: 'Rotational Motion', modules: 7 },
                { id: 'p5', title: 'Gravitation', modules: 4 },
            ],
            'chem': [
                { id: 'c1', title: 'Atomic Structure', modules: 5 },
                { id: 'c2', title: 'Chemical Bonding', modules: 6 },
                { id: 'c3', title: 'States of Matter', modules: 4 },
                { id: 'c4', title: 'Thermodynamics', modules: 5 },
            ],
            'bio': [
                { id: 'b1', title: 'Cell Biology', modules: 6 },
                { id: 'b2', title: 'Biomolecules', modules: 4 },
                { id: 'b3', title: 'Cell Division', modules: 3 },
                { id: 'b4', title: 'Plant Anatomy', modules: 5 },
                { id: 'b5', title: 'Animal Tissues', modules: 4 },
            ]
        },
        resources: {
            notes: [
                { title: "Lecture Note 01: Core Concepts", type: "PDF", size: "2.4 MB", date: "20 Apr", icon: "file-text" },
                { title: "Class Notes: Detailed Theory", type: "PDF", size: "1.8 MB", date: "21 Apr", icon: "file-text" },
                { title: "Formula Cheatsheet", type: "IMG", size: "500 KB", date: "22 Apr", icon: "image" },
                { title: "Solved Examples Set A", type: "PDF", size: "3.1 MB", date: "23 Apr", icon: "file-text" },
                { title: "Daily Practice Problem (DPP)", type: "DOC", size: "1.2 MB", date: "24 Apr", icon: "file-text" },
                { title: "Mind Map: Quick Revision", type: "IMG", size: "800 KB", date: "25 Apr", icon: "image" },
            ],
            recordings: [
                { title: "Fundamentals of Algebra 03", type: "VID", size: "145 MB", date: "20 Apr, 2024", icon: "video", duration: "102:00" },
                { title: "Fundamentals of Algebra 02", type: "VID", size: "88 MB", date: "19 Apr, 2024", icon: "video", duration: "110:00" },
                { title: "Fundamentals of Algebra 01", type: "VID", size: "112 MB", date: "18 Apr, 2024", icon: "video", duration: "114:00" },
            ],
            practice: [
                { title: "Assignment Sheet — Level 1", type: "PDF", size: "1.5 MB", date: "21 Apr", icon: "pen-tool" },
                { title: "Previous Year Questions", type: "PDF", size: "2.8 MB", date: "23 Apr", icon: "pen-tool" },
            ]
        }
    };

    let currentSubject = 'math';
    let currentChapter = 'm1';
    let currentTab = 'notes';

    function getSubject(id) { return DB.subjects.find(s => s.id === id); }
    function getChapter(subId, chapId) { return (DB.chapters[subId] || []).find(c => c.id === chapId); }

    const typeColors = {
        'PDF': { bg: 'bg-red-900/20', border: 'border-red-800/20', text: 'text-red-400', icon: 'text-red-400' },
        'IMG': { bg: 'bg-blue-900/20', border: 'border-blue-800/20', text: 'text-blue-400', icon: 'text-blue-400' },
        'DOC': { bg: 'bg-green-900/20', border: 'border-green-800/20', text: 'text-green-400', icon: 'text-green-400' },
        'VID': { bg: 'bg-purple-900/20', border: 'border-purple-800/20', text: 'text-purple-400', icon: 'text-purple-400' },
    };

    /* =============================================
       DESKTOP RENDERING
       ============================================= */
    function dkRenderSubjects() {
        const el = document.getElementById('dkSubjectSidebar');
        if (!el) return;
        el.innerHTML = `<div class="dk-sidebar-title">Subjects</div>` + DB.subjects.map(s => {
            const chapCount = (DB.chapters[s.id] || []).length;
            return `<div class="dk-sub-btn ${s.id === currentSubject ? 'active' : ''}" onclick="dkSelectSubject('${s.id}')" title="${s.name}">
                <div class="dk-sub-icon" style="background:${s.id === currentSubject ? s.color + '22' : 'rgba(255,255,255,0.04)'};">
                    <i data-lucide="${s.icon}" class="w-5 h-5" style="color:${s.id === currentSubject ? s.color : 'var(--text-muted)'};"></i>
                </div>
                <div class="dk-sub-info">
                    <span class="dk-sub-name">${s.name}</span>
                    <span class="dk-sub-meta">${chapCount} chapters</span>
                </div>
            </div>`;
        }).join('');
        lucide.createIcons();
    }

    function dkRenderChapters() {
        const el = document.getElementById('dkChapterList');
        if (!el) return;
        const sub = getSubject(currentSubject);
        const chapters = DB.chapters[currentSubject] || [];
        const search = (document.getElementById('dkChapSearch')?.value || '').toLowerCase();
        const filtered = chapters.filter(c => c.title.toLowerCase().includes(search));

        document.getElementById('dkSubjectTitle').textContent = sub.name;
        document.getElementById('dkChapCount').textContent = chapters.length + ' chapters';

        el.innerHTML = filtered.map((c, i) => {
            const active = c.id === currentChapter;
            return `<div class="dk-chap-item ${active ? 'active' : ''}" onclick="dkSelectChapter('${c.id}')">
                <div class="dk-chap-num">0${i+1}</div>
                <div class="flex-1 min-w-0">
                    <p class="text-[13px] font-bold ${active ? 'text-white' : 'text-neutral-300'} leading-snug">${c.title}</p>
                    <span class="text-[10px] text-neutral-500 font-bold mt-1 inline-block">${c.modules} modules</span>
                </div>
                <i data-lucide="chevron-right" class="w-4 h-4 ${active ? 'text-[var(--reishi)]' : 'text-neutral-700'}"></i>
            </div>`;
        }).join('');
        if (filtered.length === 0) el.innerHTML = '<div class="p-8 text-center text-neutral-600 text-xs font-bold">No chapters found</div>';
        lucide.createIcons();
    }

    function dkRenderContent() {
        const el = document.getElementById('dkCards');
        if (!el) return;
        const chap = getChapter(currentSubject, currentChapter);
        const sub = getSubject(currentSubject);
        if (!chap || !sub) return;

        document.getElementById('dkContentTitle').textContent = chap.title;
        document.getElementById('dkModuleBadge').textContent = chap.modules + ' modules';
        document.getElementById('dkStatNotes').textContent = DB.resources.notes.length + ' Notes';

        // Breadcrumb
        document.getElementById('dkBreadcrumb').innerHTML = `
            <span class="text-[10px] text-neutral-500 font-bold cursor-pointer hover:text-white transition-colors" onclick="dkBreadSubject()">${sub.name}</span>
            <i data-lucide="chevron-right" class="w-3 h-3 text-neutral-600"></i>
            <span class="text-[10px] text-[var(--getsuga)] font-bold">${chap.title}</span>`;

        const items = DB.resources[currentTab] || [];
        const chapterTitle = chap.title;

        // Recordings tab: Allen.in-style list with thumbnails
        if (currentTab === 'recordings') {
            const svgGraph = `<svg viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg"><text x="8" y="16" fill="rgba(255,255,255,0.6)" font-size="6" font-family="monospace">y = a(x - α)(x - β)</text><line x1="10" y1="80" x2="150" y2="80" stroke="rgba(255,255,255,0.3)" stroke-width="0.5"/><line x1="20" y1="15" x2="20" y2="90" stroke="rgba(255,255,255,0.3)" stroke-width="0.5"/><path d="M 15 70 Q 40 20 70 50 Q 100 80 130 30 Q 145 10 155 15" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="1.5"/><path d="M 15 60 Q 45 30 75 55 Q 105 75 135 35 Q 148 18 155 22" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1" stroke-dasharray="3,3"/></svg>`;
            el.parentElement.className = 'flex-1 overflow-y-auto px-10 py-8 custom-scroll';
            el.className = 'max-w-2xl';
            el.innerHTML = `<div class="dk-section-title">Live Class Recordings</div>` + items.map((r, i) => {
                return `<div class="dk-rec-card anim-card" style="animation-delay:${i*0.08}s">
                    <div class="dk-rec-thumb">
                        ${svgGraph}
                        <div class="dk-rec-duration">${r.duration || '00:00'}</div>
                        <div class="dk-rec-play"><i data-lucide="play" class="w-5 h-5 text-white"></i></div>
                    </div>
                    <div class="dk-rec-info">
                        <div class="dk-rec-title">${r.title}</div>
                        <div class="dk-rec-date">${r.date}</div>
                    </div>
                </div>`;
            }).join('');
        } else {
            // Notes / Practice: list layout
            const sectionLabel = currentTab === 'notes' ? 'Notes & Study Material' : 'Practice Sheets';
            el.parentElement.className = 'flex-1 overflow-y-auto px-10 py-8 custom-scroll';
            el.className = 'max-w-2xl';
            el.innerHTML = `<div class="dk-section-title">${sectionLabel}</div>` + items.map((r, i) => {
                const tc = typeColors[r.type] || typeColors['PDF'];
                return `<div class="dk-note-card anim-card" style="animation-delay:${i*0.06}s">
                    <div class="dk-note-icon ${tc.bg} border ${tc.border}">
                        <i data-lucide="${r.icon}" class="w-5 h-5 ${tc.icon}"></i>
                    </div>
                    <div class="dk-note-info">
                        <div class="dk-note-title">${r.title}</div>
                        <div class="dk-note-meta">
                            <span class="${tc.text}">${r.type}</span>
                            <span class="text-neutral-600">&bull;</span>
                            <span class="text-neutral-500">${r.size}</span>
                            <span class="text-neutral-600">&bull;</span>
                            <span class="text-neutral-500">${r.date}</span>
                        </div>
                    </div>
                    <div class="dk-card-dl" style="opacity:1; transform:none;" title="Download">
                        <i data-lucide="download" class="w-4 h-4"></i>
                    </div>
                </div>`;
            }).join('');
        }
        if (items.length === 0) el.innerHTML = '<div class="col-span-3 text-center py-16 text-neutral-600"><i data-lucide="inbox" class="w-12 h-12 mx-auto mb-3 opacity-30"></i><p class="text-sm font-bold">No resources yet</p></div>';
        lucide.createIcons();
    }

    function dkSelectSubject(id) {
        currentSubject = id;
        currentChapter = DB.chapters[id]?.[0]?.id || null;
        currentTab = 'notes';
        dkResetTabs();
        dkRenderSubjects();
        dkRenderChapters();
        if (currentChapter) dkRenderContent();
    }

    function dkSelectChapter(id) {
        currentChapter = id;
        currentTab = 'notes';
        dkResetTabs();
        dkRenderChapters();
        dkRenderContent();
    }

    function dkSwitchTab(tab, btn) {
        currentTab = tab;
        document.querySelectorAll('.dk-tab').forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        dkRenderContent();
    }

    function dkResetTabs() {
        document.querySelectorAll('.dk-tab').forEach((t, i) => {
            t.classList.toggle('active', i === 0);
        });
    }

    function dkChapFilter() { dkRenderChapters(); }

    /* =============================================
       DYNAMIC GLOBAL SEARCH
       ============================================= */
    let dkSearchFocusIdx = -1;

    function highlightMatch(text, query) {
        if (!query) return text;
        const esc = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return text.replace(new RegExp(`(${esc})`, 'gi'), '<mark>$1</mark>');
    }

    function dkSearchFilter() {
        const input = document.getElementById('dkSearch');
        const dd = document.getElementById('dkSearchDropdown');
        const q = (input?.value || '').trim().toLowerCase();
        dkSearchFocusIdx = -1;

        if (!q) { dd.classList.remove('open'); dd.innerHTML = ''; return; }

        let results = [];

        // Search subjects
        DB.subjects.forEach(s => {
            if (s.name.toLowerCase().includes(q) || s.short.toLowerCase().includes(q)) {
                results.push({ group: 'Subjects', icon: s.icon, color: s.color,
                    title: s.name, meta: (DB.chapters[s.id]||[]).length + ' chapters',
                    badge: null, action: () => { dkSelectSubject(s.id); dkCloseSearch(); }});
            }
        });

        // Search chapters across all subjects
        DB.subjects.forEach(s => {
            (DB.chapters[s.id]||[]).forEach(c => {
                if (c.title.toLowerCase().includes(q)) {
                    results.push({ group: 'Chapters', icon: 'book-open', color: '#00d2ff',
                        title: c.title, meta: s.name + ' · ' + c.modules + ' modules',
                        badge: s.short, badgeColor: s.color,
                        action: () => { dkSelectSubject(s.id); dkSelectChapter(c.id); dkCloseSearch(); }});
                }
            });
        });

        // Search resources across all tabs
        ['notes','recordings','practice'].forEach(tab => {
            (DB.resources[tab]||[]).forEach(r => {
                if (r.title.toLowerCase().includes(q) || r.type.toLowerCase().includes(q)) {
                    const tabLabel = tab.charAt(0).toUpperCase() + tab.slice(1);
                    const tc = typeColors[r.type] || typeColors['PDF'];
                    results.push({ group: 'Resources', icon: r.icon, color: r.type === 'VID' ? '#a855f7' : r.type === 'IMG' ? '#3b82f6' : r.type === 'DOC' ? '#22c55e' : '#ef4444',
                        title: r.title, meta: tabLabel + ' · ' + r.type + ' · ' + r.size,
                        badge: tabLabel, badgeColor: r.type === 'VID' ? '#a855f7' : '#ff6b00',
                        action: () => { dkSwitchTabByName(tab); dkCloseSearch(); }});
                }
            });
        });

        // Build dropdown HTML
        if (results.length === 0) {
            dd.innerHTML = `<div class="dk-search-empty">
                <i data-lucide="search-x" class="w-8 h-8 mx-auto block"></i>
                <p>No results for "<strong>${input.value}</strong>"</p>
            </div>`;
        } else {
            let html = '';
            let currentGroup = '';
            results.forEach((r, i) => {
                if (r.group !== currentGroup) {
                    currentGroup = r.group;
                    html += `<div class="dk-search-group-label">${r.group}</div>`;
                }
                const badgeHtml = r.badge ? `<span class="dk-search-item-badge" style="background:${r.badgeColor}15;color:${r.badgeColor};border:1px solid ${r.badgeColor}30;">${r.badge}</span>` : '';
                html += `<div class="dk-search-item" data-idx="${i}" onclick="dkSearchResults[${i}].action()">
                    <div class="dk-search-item-icon" style="background:${r.color}15;border:1px solid ${r.color}25;border-radius:10px;">
                        <i data-lucide="${r.icon}" class="w-4 h-4" style="color:${r.color}"></i>
                    </div>
                    <div class="dk-search-item-text">
                        <div class="dk-search-item-title">${highlightMatch(r.title, input.value)}</div>
                        <div class="dk-search-item-meta">${r.meta}</div>
                    </div>
                    ${badgeHtml}
                </div>`;
            });
            html += `<div class="dk-search-hint">
                <span><kbd>↑</kbd> <kbd>↓</kbd> navigate</span>
                <span><kbd>↵</kbd> select</span>
                <span><kbd>esc</kbd> close</span>
            </div>`;
            dd.innerHTML = html;
        }

        window.dkSearchResults = results;
        dd.classList.add('open');
        lucide.createIcons();
    }

    function dkSearchFocus() {
        const q = (document.getElementById('dkSearch')?.value || '').trim();
        if (q) dkSearchFilter();
    }

    function dkCloseSearch() {
        const dd = document.getElementById('dkSearchDropdown');
        const input = document.getElementById('dkSearch');
        dd.classList.remove('open');
        input.value = '';
        dkSearchFocusIdx = -1;
    }

    function dkSwitchTabByName(tab) {
        currentTab = tab;
        document.querySelectorAll('.dk-tab').forEach(t => {
            const tabName = t.textContent.trim().toLowerCase();
            t.classList.toggle('active', tabName === tab);
        });
        dkRenderContent();
    }

    // Keyboard navigation for search
    document.addEventListener('keydown', function(e) {
        const dd = document.getElementById('dkSearchDropdown');
        if (!dd || !dd.classList.contains('open')) {
            // Ctrl+K or / to focus search
            if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && document.activeElement.tagName !== 'INPUT')) {
                e.preventDefault();
                document.getElementById('dkSearch')?.focus();
            }
            return;
        }

        const items = dd.querySelectorAll('.dk-search-item');
        if (!items.length) return;

        if (e.key === 'Escape') {
            e.preventDefault(); dkCloseSearch(); document.getElementById('dkSearch')?.blur(); return;
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            dkSearchFocusIdx = Math.min(dkSearchFocusIdx + 1, items.length - 1);
            items.forEach((it, i) => it.classList.toggle('focused', i === dkSearchFocusIdx));
            items[dkSearchFocusIdx]?.scrollIntoView({ block: 'nearest' });
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            dkSearchFocusIdx = Math.max(dkSearchFocusIdx - 1, 0);
            items.forEach((it, i) => it.classList.toggle('focused', i === dkSearchFocusIdx));
            items[dkSearchFocusIdx]?.scrollIntoView({ block: 'nearest' });
        }
        if (e.key === 'Enter' && dkSearchFocusIdx >= 0 && window.dkSearchResults?.[dkSearchFocusIdx]) {
            e.preventDefault();
            window.dkSearchResults[dkSearchFocusIdx].action();
        }
    });

    // Click outside to close
    document.addEventListener('click', function(e) {
        const wrap = e.target.closest('.dk-search-wrap');
        if (!wrap) dkCloseSearch();
    });

    function dkBreadSubject() { /* Focus back on subject */ }

    /* =============================================
       SIDEBAR COLLAPSE (Desktop)
       ============================================= */
    function toggleSidebar() {
        const sidebar = document.getElementById('dkSubjectSidebar');
        const collapseIcon = document.querySelector('.sidebar-icon-collapse');
        const expandIcon = document.querySelector('.sidebar-icon-expand');
        if (!sidebar) return;
        sidebar.classList.toggle('collapsed');
        const isCollapsed = sidebar.classList.contains('collapsed');
        if (collapseIcon) collapseIcon.classList.toggle('hidden', isCollapsed);
        if (expandIcon) expandIcon.classList.toggle('hidden', !isCollapsed);
        localStorage.setItem('sidebarCollapsed', isCollapsed ? '1' : '0');
    }

    // Restore sidebar state on load
    function restoreSidebarState() {
        if (localStorage.getItem('sidebarCollapsed') === '1') {
            const sidebar = document.getElementById('dkSubjectSidebar');
            const collapseIcon = document.querySelector('.sidebar-icon-collapse');
            const expandIcon = document.querySelector('.sidebar-icon-expand');
            if (sidebar) {
                sidebar.classList.add('collapsed');
                if (collapseIcon) collapseIcon.classList.add('hidden');
                if (expandIcon) expandIcon.classList.remove('hidden');
            }
        }
    }

    /* =============================================
       MOBILE RENDERING
       ============================================= */
    function mobRenderSubjectGrid() {
        const el = document.getElementById('mobSubjectGrid');
        if (!el) return;
        el.innerHTML = DB.subjects.map(s => {
            const chapCount = (DB.chapters[s.id] || []).length;
            const isActive = s.id === currentSubject;
            return `<div class="mob-sub-card ${isActive ? 'active' : ''}" style="--card-glow:${s.color}15;" onclick="mobSelectSubject('${s.id}')">
                <div class="mob-sub-card-icon" style="background:${s.color}18;border:1px solid ${s.color}30;">
                    <i data-lucide="${s.icon}" class="w-5 h-5" style="color:${s.color}"></i>
                </div>
                <span class="mob-sub-card-name">${s.name}</span>
                <span class="mob-sub-card-meta">${chapCount} chapters</span>
            </div>`;
        }).join('');
        lucide.createIcons();
        mobUpdateActiveBar();
    }

    function mobUpdateActiveBar() {
        const sub = getSubject(currentSubject);
        if (!sub) return;
        const iconEl = document.getElementById('mobActiveSubIcon');
        const labelEl = document.getElementById('mobActiveSubLabel');
        if (iconEl) {
            iconEl.style.background = sub.color + '18';
            iconEl.style.border = '1px solid ' + sub.color + '30';
            iconEl.innerHTML = `<i data-lucide="${sub.icon}" class="w-3.5 h-3.5" style="color:${sub.color}"></i>`;
        }
        if (labelEl) labelEl.textContent = sub.name;
        lucide.createIcons();
    }

    function mobToggleSubjectPicker() {
        const overlay = document.getElementById('mobSubjectOverlay');
        const btn = document.getElementById('mobGridBtn');
        const isOpen = overlay.classList.contains('open');
        if (isOpen) {
            mobCloseSubjectPicker();
        } else {
            overlay.classList.add('open');
            btn.classList.add('open');
        }
    }

    function mobCloseSubjectPicker() {
        document.getElementById('mobSubjectOverlay')?.classList.remove('open');
        document.getElementById('mobGridBtn')?.classList.remove('open');
    }

    function mobRenderChapters() {
        const el = document.getElementById('mobChapterList');
        if (!el) return;
        const sub = getSubject(currentSubject);
        const chapters = DB.chapters[currentSubject] || [];
        const search = (document.getElementById('mobSearchInput')?.value || '').toLowerCase();
        const filtered = chapters.filter(c => c.title.toLowerCase().includes(search));

        document.getElementById('mobSubTitle').textContent = sub.name;
        document.getElementById('mobChapCount').textContent = chapters.length + ' chapters';

        el.innerHTML = filtered.map((c, i) => {
            return `<div class="mob-chap-card anim-card" style="animation-delay:${i*0.05}s" onclick="mobSelectChapter('${c.id}')">
                <div class="mob-chap-num bg-white/[0.04] text-neutral-400">0${i+1}</div>
                <div class="flex-1 min-w-0">
                    <p class="text-[13px] font-bold text-white leading-snug">${c.title}</p>
                    <span class="text-[10px] text-neutral-500 font-bold mt-1 inline-block">${c.modules} modules</span>
                </div>
                <div class="mob-chap-chevron"><i data-lucide="chevron-right" class="w-4 h-4"></i></div>
            </div>`;
        }).join('');
        if (filtered.length === 0) el.innerHTML = '<div class="text-center py-16 text-neutral-600 text-xs font-bold">No chapters found</div>';
        lucide.createIcons();
    }

    function mobRenderResources() {
        const el = document.getElementById('mobResourceList');
        if (!el) return;
        const chap = getChapter(currentSubject, currentChapter);
        const sub = getSubject(currentSubject);
        if (!chap || !sub) return;

        document.getElementById('mobContentTitle').textContent = chap.title;
        document.getElementById('mobContentSub').textContent = sub.name + ' \u2022 ' + chap.modules + ' modules';
        document.getElementById('mobHeroTitle').textContent = chap.title;
        document.getElementById('mobHeroModules').textContent = chap.modules + ' modules';

        const items = DB.resources[currentTab] || [];
        el.innerHTML = items.map((r, i) => {
            const tc = typeColors[r.type] || typeColors['PDF'];
            return `<div class="mob-res-card anim-card" style="animation-delay:${i*0.05}s">
                <div class="mob-res-icon ${tc.bg} border ${tc.border}">
                    <i data-lucide="${r.icon}" class="w-5 h-5 ${tc.icon}"></i>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-[13px] font-bold text-white leading-snug">${r.title}</p>
                    <div class="flex items-center gap-2 mt-1">
                        <span class="text-[10px] text-neutral-500 font-bold">${r.date}</span>
                        <span class="w-1 h-1 rounded-full bg-neutral-700"></span>
                        <span class="text-[10px] text-neutral-500 font-bold">${r.size}</span>
                        <span class="text-[10px] font-bold ${tc.text} ml-1">${r.type}</span>
                    </div>
                </div>
                <div class="mob-res-dl" title="Download">
                    <i data-lucide="download" class="w-4 h-4"></i>
                </div>
            </div>`;
        }).join('');
        if (items.length === 0) el.innerHTML = '<div class="text-center py-16 text-neutral-600"><i data-lucide="inbox" class="w-10 h-10 mx-auto mb-2 opacity-30"></i><p class="text-xs font-bold">No resources yet</p></div>';
        lucide.createIcons();
    }

    function mobSelectSubject(id) {
        currentSubject = id;
        currentChapter = DB.chapters[id]?.[0]?.id || null;
        mobCloseSubjectPicker();
        mobRenderSubjectGrid();
        mobRenderChapters();
    }

    function mobSelectChapter(id) {
        currentChapter = id;
        currentTab = 'notes';
        mobResetTabs();
        mobRenderResources();
        // Slide to content screen
        document.getElementById('mobScreenChapters').className = 'mob-screen off-left';
        document.getElementById('mobScreenContent').className = 'mob-screen center';
    }

    function mobGoBack() {
        document.getElementById('mobScreenChapters').className = 'mob-screen center';
        document.getElementById('mobScreenContent').className = 'mob-screen off-right';
    }

    function mobSwitchTab(tab, btn) {
        currentTab = tab;
        document.querySelectorAll('.mob-tab').forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        mobRenderResources();
    }

    function mobResetTabs() {
        document.querySelectorAll('.mob-tab').forEach((t, i) => t.classList.toggle('active', i === 0));
    }

    function mobToggleSearch() {
        const w = document.getElementById('mobSearchWrap');
        w.classList.toggle('hidden');
        if (!w.classList.contains('hidden')) document.getElementById('mobSearchInput').focus();
    }

    function mobFilterChapters() { mobRenderChapters(); }

    /* =============================================
       INIT
       ============================================= */
    function isMobile() { return window.innerWidth < 768; }

    function initApp() {
        restoreNotesTheme();
        if (isMobile()) {
            mobRenderSubjectGrid();
            mobRenderChapters();
        } else {
            restoreSidebarState();
            restoreChapterPanelState();
            dkRenderSubjects();
            dkRenderChapters();
            dkRenderContent();
        }
    }

    // Expose toggleSidebar globally for onclick
    window.toggleSidebar = toggleSidebar;

    /* =============================================
       THEME TOGGLE (Dark / Light)
       ============================================= */
    function toggleNotesTheme() {
        const isLight = document.body.classList.toggle('light-theme');
        localStorage.setItem('notesTheme', isLight ? 'light' : 'dark');
        updateThemeIcons();
    }

    function updateThemeIcons() {
        const isLight = document.body.classList.contains('light-theme');
        document.querySelectorAll('.notes-icon-sun').forEach(el => el.classList.toggle('hidden', !isLight));
        document.querySelectorAll('.notes-icon-moon').forEach(el => el.classList.toggle('hidden', isLight));
    }

    function restoreNotesTheme() {
        const saved = localStorage.getItem('notesTheme');
        if (saved === 'light') {
            document.body.classList.add('light-theme');
        }
        updateThemeIcons();
    }

    window.toggleNotesTheme = toggleNotesTheme;

    /* =============================================
       CHAPTER PANEL TOGGLE (Desktop)
       ============================================= */
    function toggleChapterPanel() {
        const panel = document.getElementById('dkChapterPanel');
        const collapseIcon = document.querySelector('.chapter-icon-collapse');
        const expandIcon = document.querySelector('.chapter-icon-expand');
        if (!panel) return;
        panel.classList.toggle('collapsed');
        const isCollapsed = panel.classList.contains('collapsed');
        if (collapseIcon) collapseIcon.classList.toggle('hidden', isCollapsed);
        if (expandIcon) expandIcon.classList.toggle('hidden', !isCollapsed);
        localStorage.setItem('chapterPanelCollapsed', isCollapsed ? '1' : '0');
    }

    function restoreChapterPanelState() {
        if (localStorage.getItem('chapterPanelCollapsed') === '1') {
            const panel = document.getElementById('dkChapterPanel');
            const collapseIcon = document.querySelector('.chapter-icon-collapse');
            const expandIcon = document.querySelector('.chapter-icon-expand');
            if (panel) {
                panel.classList.add('collapsed');
                if (collapseIcon) collapseIcon.classList.add('hidden');
                if (expandIcon) expandIcon.classList.remove('hidden');
            }
        }
    }

    window.toggleChapterPanel = toggleChapterPanel;

    window.addEventListener('resize', initApp);

    // Browser back button for mobile
    window.addEventListener('popstate', () => {
        if (isMobile()) {
            const content = document.getElementById('mobScreenContent');
            if (content && !content.classList.contains('off-right')) {
                mobGoBack();
            }
        }
    });

    window.onload = () => { initApp(); };