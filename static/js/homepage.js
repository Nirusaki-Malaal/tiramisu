        // Initialize Lucide Icons
        lucide.createIcons();

        // ------------------------------------------------------------------
        // THEME SWITCHER LOGIC
        // ------------------------------------------------------------------
        let isLightMode = false;
        const themeBtn = document.getElementById('theme-toggle');
        const sunIcon = document.getElementById('icon-sun');
        const moonIcon = document.getElementById('icon-moon');
        const body = document.body;

        // Global reference to Three.js objects for theme updating
        let sceneRef, fogRef, coreMaterialRef, particlesMaterialRef, kanjiMaterialsRef = [];

        themeBtn.addEventListener('click', () => {
            isLightMode = !isLightMode;
            body.classList.toggle('light-theme');
            
            // Icon Toggle
            if(isLightMode) {
                sunIcon.classList.remove('hidden');
                moonIcon.classList.add('hidden');
            } else {
                sunIcon.classList.add('hidden');
                moonIcon.classList.remove('hidden');
            }

            // Update Three.js Scene Colors
            updateThreeTheme();
        });

        const updateThreeTheme = () => {
            if(!sceneRef) return;

            if(isLightMode) {
                // Light Mode (Quincy: White/Blue)
                fogRef.color.setHex(0xe8e8e8); 
                coreMaterialRef.color.setHex(0x2563eb); // Blue Core
                particlesMaterialRef.color.setHex(0x9333ea); // Purple Particles
                // Update Kanji colors
                kanjiMaterialsRef.forEach(mat => {
                    mat.color.setHex(Math.random() > 0.5 ? 0x2563eb : 0x9333ea);
                });
            } else {
                // Dark Mode (Soul Reaper: Black/Cyan/Orange)
                fogRef.color.setHex(0x050505);
                coreMaterialRef.color.setHex(0x00f2ff); // Cyan Core
                particlesMaterialRef.color.setHex(0x00f2ff);
                // Update Kanji colors
                kanjiMaterialsRef.forEach(mat => {
                    mat.color.setHex(Math.random() > 0.5 ? 0xff7b00 : 0x00f2ff);
                });
            }
        };


        // ------------------------------------------------------------------
        // AUTHENTICATION LOGIC
        // ------------------------------------------------------------------
        const authModal = document.getElementById('auth-modal');
        const tabLogin = document.getElementById('tab-login');
        const tabSignup = document.getElementById('tab-signup');
        const fieldUsername = document.getElementById('field-username');
        const submitText = document.getElementById('submit-text');
        const authSection = document.getElementById('auth-section');
        let currentAuthMode = 'signup';

        function openAuthModal(mode) {
            authModal.classList.add('open');
            switchAuthTab(mode);
        }

        function closeAuthModal() {
            authModal.classList.remove('open');
        }

        function switchAuthTab(mode) {
            currentAuthMode = mode;
            if(mode === 'login') {
                tabLogin.classList.add('border-orange-500', 'text-orange-500');
                tabLogin.classList.remove('border-transparent');
                tabSignup.classList.remove('border-orange-500', 'text-orange-500');
                tabSignup.classList.add('border-transparent');
                
                fieldUsername.classList.add('hidden');
                document.getElementById('username').removeAttribute('required');
                submitText.textContent = "LOG IN";
            } else {
                tabSignup.classList.add('border-orange-500', 'text-orange-500');
                tabSignup.classList.remove('border-transparent');
                tabLogin.classList.remove('border-orange-500', 'text-orange-500');
                tabLogin.classList.add('border-transparent');
                
                fieldUsername.classList.remove('hidden');
                document.getElementById('username').setAttribute('required', 'true');
                submitText.textContent = "INITIATE SIGN UP";
            }
        }

        function handleAuth(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const username = document.getElementById('username').value;
            
            // Simulate API call with timeout
            submitText.textContent = "CONNECTING...";
            
            setTimeout(() => {
                closeAuthModal();
                const displayName = currentAuthMode === 'login' ? email.split('@')[0] : username;
                
                // Update UI to logged in state
                authSection.innerHTML = `
                    <div class="flex items-center gap-3">
                         <div class="text-right hidden md:block">
                             <div class="text-xs text-gray-400 tracking-widest">RANK 10 / <span class="font-jp">第十席</span></div>
                             <div class="font-bold theme-text-primary uppercase">${displayName}</div>
                         </div>
                         <div class="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                             ${displayName[0].toUpperCase()}
                         </div>
                    </div>
                `;
                
                // Reset form
                document.getElementById('auth-form').reset();
                submitText.textContent = currentAuthMode === 'login' ? "LOG IN" : "INITIATE SIGN UP";
            }, 1000);
        }


        // ------------------------------------------------------------------
        // THREE.JS & ANIMATION
        // ------------------------------------------------------------------
        const initThreeJS = () => {
            const container = document.getElementById('canvas-container');
            const scene = new THREE.Scene();
            sceneRef = scene;
            
            // Fog matches background color
            const fogColor = 0x050505; 
            scene.fog = new THREE.FogExp2(fogColor, 0.002);
            fogRef = scene.fog;

            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 50;

            const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            container.appendChild(renderer.domElement);

            // --- MAIN 3D SPIRIT ARTIFACT (Torus Knot) ---
            const coreGeometry = new THREE.TorusKnotGeometry(8, 2, 120, 20);
            const coreMaterial = new THREE.MeshBasicMaterial({
                color: 0x00f2ff, 
                wireframe: true,
                transparent: true,
                opacity: 0.1,
                blending: THREE.AdditiveBlending
            });
            coreMaterialRef = coreMaterial;
            const spiritCore = new THREE.Mesh(coreGeometry, coreMaterial);
            scene.add(spiritCore);

            // --- KANJI ---
            const kanjiChars = ['卍', '解', '魂', '死', '神', '虚', '斬', '力'];
            const kanjiObjects = []; // Store custom objects for animation logic
            
            const createKanjiTexture = (char) => {
                const canvas = document.createElement('canvas');
                canvas.width = 128;
                canvas.height = 128;
                const ctx = canvas.getContext('2d');
                ctx.font = 'bold 80px "Kosugi Maru", "Arial", sans-serif'; 
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(char, 64, 64);
                return new THREE.CanvasTexture(canvas);
            };

            kanjiChars.forEach((char) => {
                const texture = createKanjiTexture(char);
                for (let i = 0; i < 3; i++) {
                     const material = new THREE.MeshBasicMaterial({
                        map: texture,
                        transparent: true,
                        opacity: 0.15, 
                        color: Math.random() > 0.5 ? 0xff7b00 : 0x00f2ff,
                        side: THREE.DoubleSide,
                        depthWrite: false,
                        blending: THREE.AdditiveBlending
                    });
                    kanjiMaterialsRef.push(material); // Store ref for theme switching
                    
                    const geometry = new THREE.PlaneGeometry(5, 5);
                    const mesh = new THREE.Mesh(geometry, material);
                    
                    const startX = (Math.random() - 0.5) * 160;
                    const startY = (Math.random() - 0.5) * 160;
                    const startZ = (Math.random() - 0.5) * 100;

                    mesh.position.set(startX, startY, startZ);
                    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
                    
                    scene.add(mesh);
                    
                    kanjiObjects.push({
                        mesh,
                        baseY: startY,
                        speed: Math.random() * 0.02,
                        phase: Math.random() * Math.PI * 2
                    });
                }
            });


            // --- PARTICLES ---
            const particlesGeometry = new THREE.BufferGeometry();
            const particlesCount = 1500;
            const posArray = new Float32Array(particlesCount * 3);
            for (let i = 0; i < particlesCount * 3; i+=3) {
                posArray[i] = (Math.random() - 0.5) * 200;
                posArray[i+1] = (Math.random() - 0.5) * 200;
                posArray[i+2] = (Math.random() - 0.5) * 200;
            }
            particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
            const particlesMaterial = new THREE.PointsMaterial({
                size: 0.2,
                color: 0x00f2ff,
                transparent: true,
                opacity: 0.6,
            });
            particlesMaterialRef = particlesMaterial;
            const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
            scene.add(particlesMesh);

            // --- ANIMATION LOOP ---
            let mouseX = 0;
            let mouseY = 0;
            
            document.addEventListener('mousemove', (event) => {
                mouseX = (event.clientX - window.innerWidth / 2) * 0.1;
                mouseY = (event.clientY - window.innerHeight / 2) * 0.1;
            });

            const animate = () => {
                requestAnimationFrame(animate);

                // Get scroll percentage
                const scrollY = window.scrollY;
                const docHeight = document.body.scrollHeight - window.innerHeight;
                const scrollPercent = scrollY / docHeight;

                // --- SCROLL ANIMATION LOGIC ---
                
                // 1. Rotate Spirit Core based on scroll
                spiritCore.rotation.x += 0.003 + (scrollPercent * 0.05); // Spins faster as you scroll
                spiritCore.rotation.y += 0.005;
                // Core moves down slightly as you scroll
                spiritCore.position.y = -scrollY * 0.02;

                // 2. Animate Kanji with scroll influence
                kanjiObjects.forEach(item => {
                    item.mesh.rotation.x += item.speed;
                    item.mesh.rotation.y += item.speed;
                    
                    // Add wave motion + scroll offset
                    // As you scroll down, items move up (Parallax)
                    item.mesh.position.y = item.baseY + Math.sin(Date.now() * 0.001 + item.phase) * 5 + (scrollY * 0.05);
                });

                // 3. Rotate entire particle field based on scroll
                particlesMesh.rotation.y = scrollY * 0.0005;
                scene.rotation.z = scrollY * 0.0002; // Slight tilt of the world

                // Camera mouse follow
                camera.position.x += (mouseX * 0.1 - camera.position.x) * 0.05;
                camera.position.y += (-mouseY * 0.1 - camera.position.y) * 0.05;
                camera.lookAt(scene.position);

                renderer.render(scene, camera);
            };

            animate();

            window.addEventListener('resize', () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });
        };

        window.addEventListener('load', initThreeJS);


        // ------------------------------------------------------------------
        // INTERSECTION OBSERVER (Scroll Reveal)
        // ------------------------------------------------------------------
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visible');
                    observer.unobserve(entry.target); 
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        });

        document.querySelectorAll('.reveal-hidden').forEach((el) => observer.observe(el));