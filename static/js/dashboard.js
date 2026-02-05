    lucide.createIcons();

        /* =========================================
         * DATA ENGINE
         * ========================================= */
        const SoulSocietyOS = {
            notifications: [
                { title: "Mission Alert", msg: "New Hollow in Karakura.", type: "urgent" },
                { title: "System", msg: "Spirit Pager v2.0 Live.", type: "info" }
            ],
            todaysClasses: [
                { time: "09:00", subject: "Calculus II", type: "Lecture", status: "completed" },
                { time: "11:00", subject: "Kido Theory", type: "Lab", status: "live" },
                { time: "14:00", subject: "Physics", type: "Lecture", status: "upcoming" }
            ],
            todos: [
                { id: 1, text: "Finish Calculus Ch.3", done: false },
                { id: 2, text: "Review Kido Spells", done: true },
                { id: 3, text: "Submit Squad Report", done: false }
            ]
        };

        // --- RENDER ---
        function renderDashboard() {
            // Notifications
            const notifList = document.getElementById('notif-list');
            notifList.innerHTML = SoulSocietyOS.notifications.map(n => `
                <div class="p-3 border-b border-[var(--panel-border)] hover:bg-[var(--sidebar-bg)] cursor-pointer">
                    <div class="text-[var(--text-main)] text-xs font-bold">${n.title}</div>
                    <div class="text-[var(--text-muted)] text-[10px] font-mono">${n.msg}</div>
                </div>
            `).join('');
            
            // Today's Classes (Time Table)
            const timeTableList = document.getElementById('timetable-list');
            timeTableList.innerHTML = SoulSocietyOS.todaysClasses.map(c => {
                let statusColor = "bg-[var(--widget-bg)] border-[var(--panel-border)]";
                let iconColor = "text-[var(--text-muted)]";
                
                if (c.status === 'live') {
                    statusColor = "bg-[var(--reishi)]/10 border-[var(--reishi)] shadow-[0_0_10px_rgba(0,210,255,0.1)]";
                    iconColor = "text-[var(--reishi)]";
                } else if (c.status === 'completed') {
                    statusColor = "bg-[var(--widget-bg)] border-[var(--panel-border)] opacity-60";
                }

                return `
                <div class="flex items-center gap-3 p-3 rounded-sm border ${statusColor} transition-all hover:scale-[1.02]">
                    <div class="flex flex-col items-center min-w-[3rem]">
                        <span class="text-[var(--text-main)] font-mono font-bold text-sm">${c.time}</span>
                        <span class="text-[8px] text-[var(--text-muted)] uppercase tracking-wide">${c.status}</span>
                    </div>
                    <div class="h-8 w-px bg-[var(--panel-border)]"></div>
                    <div>
                        <div class="text-sm font-bold text-[var(--text-main)]">${c.subject}</div>
                        <div class="text-[10px] text-[var(--text-muted)] font-mono flex items-center gap-1">
                            <i data-lucide="book-open" class="w-3 h-3 ${iconColor}"></i> ${c.type}
                        </div>
                    </div>
                </div>
                `;
            }).join('');

            // Render Todos
            const todoList = document.getElementById('todo-list');
            todoList.innerHTML = SoulSocietyOS.todos.map(t => `
                <li class="flex items-center gap-3 text-xs text-[var(--text-muted)] font-mono group cursor-pointer p-2 hover:bg-[var(--widget-bg)] rounded-sm" onclick="toggleTodo(${t.id})">
                    <div class="w-4 h-4 border ${t.done ? 'bg-[var(--getsuga)] border-[var(--getsuga)]' : 'border-[var(--text-muted)]'} rounded-sm flex items-center justify-center transition-colors">
                        ${t.done ? '<i data-lucide="check" class="w-3 h-3 text-black"></i>' : ''}
                    </div>
                    <span class="${t.done ? 'line-through opacity-50' : 'group-hover:text-[var(--text-main)]'} transition-colors">${t.text}</span>
                </li>
            `).join('');

            lucide.createIcons();
        }
        
        function toggleTodo(id) {
            const item = SoulSocietyOS.todos.find(t => t.id === id);
            if (item) { item.done = !item.done; renderDashboard(); }
        }

        // --- SEARCH (DEBOUNCED) ---
        let searchTimeout;
        function debouncedSearch(val) {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if(val.length > 2) showFeatureToast(`Searching: "${val}"...`);
            }, 500);
        }

        // --- WIDGET LOGIC (DRAGGABLE) ---
        // Setup Dragging
        function setupDraggable(elementId) {
            const el = document.getElementById(elementId);
            const header = el.querySelector('.widget-header');
            let isDragging = false, startX, startY, initialLeft, initialTop;

            const onStart = (clientX, clientY) => {
                // Lock widgets on mobile
                if (window.innerWidth < 768) return;

                isDragging = true;
                startX = clientX;
                startY = clientY;
                initialLeft = el.offsetLeft;
                initialTop = el.offsetTop;
                el.style.cursor = 'grabbing';
            };

            const onMove = (clientX, clientY) => {
                if (!isDragging) return;
                const dx = clientX - startX;
                const dy = clientY - startY;
                el.style.left = `${initialLeft + dx}px`;
                el.style.top = `${initialTop + dy}px`;
                // Clear bottom/right to switch to top/left positioning
                el.style.bottom = 'auto';
                el.style.right = 'auto';
            };

            const onEnd = () => {
                if (!isDragging) return; // check added to prevent cursor change if not dragging
                isDragging = false;
                el.style.cursor = 'default';
            };

            // Mouse Events
            header.addEventListener('mousedown', e => onStart(e.clientX, e.clientY));
            document.addEventListener('mousemove', e => onMove(e.clientX, e.clientY));
            document.addEventListener('mouseup', onEnd);

            // Touch Events (for Mobile Dragging)
            header.addEventListener('touchstart', e => {
                 // Lock on mobile: don't prevent default, don't start drag
                if (window.innerWidth < 768) return;
                
                const touch = e.touches[0];
                onStart(touch.clientX, touch.clientY);
                e.preventDefault(); // Prevent scroll while dragging widget
            }, {passive: false});
            
            document.addEventListener('touchmove', e => {
                if (!isDragging) return;
                const touch = e.touches[0];
                onMove(touch.clientX, touch.clientY);
            }, {passive: false});

            document.addEventListener('touchend', onEnd);
        }
        
        // Pomodoro
        let pomoInterval;
        let pomoTime = 25 * 60;
        function togglePomodoro() {
            const widget = document.getElementById('floating-pomo');
            widget.classList.toggle('hidden');
        }
        function pomoAction(action) {
            const display = document.getElementById('widget-pomo-display');
            
            if (action === 'start') {
                if (pomoInterval) return;
                pomoInterval = setInterval(() => {
                    if (pomoTime > 0) {
                        pomoTime--;
                        const m = Math.floor(pomoTime / 60).toString().padStart(2, '0');
                        const s = (pomoTime % 60).toString().padStart(2, '0');
                        display.innerText = `${m}:${s}`;
                    } else {
                        clearInterval(pomoInterval);
                        alert("Session Complete!");
                    }
                }, 1000);
            } else if (action === 'reset') {
                clearInterval(pomoInterval);
                pomoInterval = null;
                pomoTime = 25 * 60;
                display.innerText = "25:00";
            }
        }

        // AI Chat
        function toggleAI() {
            document.getElementById('floating-ai').classList.toggle('hidden');
        }

        function sendAIMessageWidget() {
            const input = document.getElementById('widget-ai-input');
            const text = input.value;
            if (!text) return;
            const chatBody = document.getElementById('widget-ai-body');
            
            chatBody.innerHTML += `<div class="text-right text-[var(--text-main)] bg-[var(--reishi)]/20 p-2 rounded mb-2 inline-block ml-auto max-w-[90%] border border-[var(--reishi)]/30">${text}</div>`;
            input.value = '';
            chatBody.scrollTop = chatBody.scrollHeight;

            setTimeout(() => {
                const quotes = ["Good luck!", "Focus!", "Don't give up!", "Bankai!"];
                const reply = quotes[Math.floor(Math.random() * quotes.length)];
                chatBody.innerHTML += `<div class="text-left text-[var(--text-main)] bg-[var(--panel-bg)] p-2 rounded mb-2 inline-block mr-auto max-w-[90%] border border-[var(--panel-border)]">${reply}</div>`;
                chatBody.scrollTop = chatBody.scrollHeight;
            }, 600);
        }

        // --- THEME LOGIC ---
        function toggleDarkMode() {
            document.body.classList.toggle('light-mode');
            const isLight = document.body.classList.contains('light-mode');
            localStorage.setItem('shingaku-theme', isLight ? 'light' : 'dark');
            const dot = document.getElementById('theme-toggle-dot');
            if(dot) dot.style.transform = isLight ? 'translateX(-100%)' : 'translateX(0)';
        }
        if (localStorage.getItem('shingaku-theme') === 'light') {
            document.body.classList.add('light-mode');
        }

        // --- UI UTILS ---
        function toggleSidebar() { document.getElementById('sidebar').classList.toggle('collapsed'); }
        function toggleSearch() { 
            const c = document.querySelector('.search-container');
            c.classList.toggle('active');
            if(c.classList.contains('active')) document.getElementById('global-search').focus();
        }
        function toggleProfile() { document.getElementById('profile-menu').classList.toggle('hidden'); }
        function toggleNotifications() { document.getElementById('notif-dropdown').classList.toggle('hidden'); }
        
        function showFeatureToast(msg) {
            const container = document.getElementById('toast-container');
            const toast = document.createElement('div');
            toast.className = 'toast';
            toast.innerHTML = `<div class="flex items-center gap-2"><i data-lucide="zap" class="w-4 h-4 text-[var(--reishi)]"></i> <span>${msg}</span></div>`;
            container.appendChild(toast);
            lucide.createIcons();
            requestAnimationFrame(() => toast.classList.add('show'));
            setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 2000);
        }

        // Close Dropdowns
        document.addEventListener('click', (e) => {
            const menu = document.getElementById('profile-menu');
            const notif = document.getElementById('notif-dropdown');
            if (!e.target.closest('.profile-container button') && !menu.contains(e.target)) menu.classList.add('hidden');
            if (!e.target.closest('button[onclick="toggleNotifications()"]') && !notif.contains(e.target)) notif.classList.add('hidden');
        });

        // --- THREE.JS BACKGROUND ---
        function initThreeJS() {
            const canvas = document.getElementById('three-canvas');
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
            camera.position.z = 20;
            const renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:true});
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(window.devicePixelRatio);

            const group = new THREE.Group();
            scene.add(group);

            // 1. Spirit Core (Icosahedron)
            const coreGeo = new THREE.IcosahedronGeometry(8, 1);
            const coreMat = new THREE.MeshBasicMaterial({ color: 0x00d2ff, wireframe: true, transparent: true, opacity: 0.1 });
            const core = new THREE.Mesh(coreGeo, coreMat);
            group.add(core);

            // 2. Data Rings
            const ringGeo = new THREE.TorusGeometry(12, 0.05, 16, 100);
            const ringMat = new THREE.MeshBasicMaterial({ color: 0xff6b00, transparent: true, opacity: 0.3 });
            const ring1 = new THREE.Mesh(ringGeo, ringMat);
            const ring2 = new THREE.Mesh(ringGeo, ringMat);
            ring1.rotation.x = Math.PI/2;
            ring2.rotation.x = Math.PI/1.5;
            group.add(ring1);
            group.add(ring2);

            // 3. Particles
            const particlesGeo = new THREE.BufferGeometry();
            const count = 800;
            const pos = new Float32Array(count * 3);
            for(let i=0; i<count*3; i++) pos[i] = (Math.random()-0.5)*60;
            particlesGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
            const particlesMat = new THREE.PointsMaterial({size: 0.05, color: 0x00d2ff, transparent: true, opacity: 0.4});
            const particles = new THREE.Points(particlesGeo, particlesMat);
            group.add(particles);

            // Mouse Parallax
            let mouseX = 0, mouseY = 0;
            window.addEventListener('mousemove', (e) => {
                mouseX = (e.clientX - window.innerWidth/2) * 0.001;
                mouseY = (e.clientY - window.innerHeight/2) * 0.001;
            });

            function animate() {
                requestAnimationFrame(animate);
                core.rotation.y += 0.002;
                core.rotation.z += 0.001;
                ring1.rotation.z -= 0.002;
                ring2.rotation.z += 0.002;
                group.rotation.x += (mouseY - group.rotation.x) * 0.05;
                group.rotation.y += (mouseX - group.rotation.y) * 0.05;
                renderer.render(scene, camera);
            }
            animate();
            window.addEventListener('resize', () => {
                camera.aspect = window.innerWidth/window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });
        }

        window.onload = () => {
            initThreeJS();
            renderDashboard();
            setupDraggable('floating-pomo');
            setupDraggable('floating-ai');
        };

        /*
        --- VARIABLE DESCRIPTION TABLE ---
        | Variable | Type | Description |
        |---|---|---|
        | SoulSocietyOS | Object | Mock backend containing user, notification, schedule, and class data. |
        | pomoInterval | Interval | Stores the setInterval ID for the Pomodoro timer. |
        | pomoTime | Number | Current remaining time in seconds for Pomodoro (default 1500). |
        | searchTimeout | Timeout | Stores the timeout ID for search debouncing. |
        | --panel-bg | CSS Var | Glassmorphism background color (dynamic by theme). |
        | --reishi | CSS Var | Primary accent color (Blue). |
        | --getsuga | CSS Var | Secondary accent color (Orange). |
        */
        async function logOut() 
        {
            response = await fetch('/logout', { method: 'POST' });
            if (response.ok) {
                window.location.href = 'homepage.html';
            } else {
                alert('Logout failed. Please try again.');
                location.reload();
            }
        }

        async function profile() {
                response = await fetch('/profile', { method: 'GET' }); 
        }