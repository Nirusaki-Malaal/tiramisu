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
            ['username', 'email', 'password'].forEach(id => document.getElementById(`err-${id}`).classList.add('hidden'));
            authModal.classList.add('open');
            switchAuthTab(mode);
        }

        function closeAuthModal() {
            ['username', 'email', 'password'].forEach(id => document.getElementById(`err-${id}`).classList.add('hidden'));
            authModal.classList.remove('open');
        }

        function switchAuthTab(mode) {
            currentAuthMode = mode;
            isOtpStep = false; // Reset OTP step
            ['username', 'email', 'password'].forEach(id => document.getElementById(`err-${id}`).classList.add('hidden'));
            // Reset UI visibility
            document.getElementById('field-username').classList.remove('hidden');
            document.getElementById('group-email').classList.remove('hidden');
            document.getElementById('group-password').classList.remove('hidden');
            document.getElementById('field-confirm-password').classList.remove('hidden'); // Show confirm pass
            document.getElementById('group-remember').classList.remove('hidden');
            document.getElementById('group-otp').classList.add('hidden');
            // Reset inputs validity/errors
            document.querySelectorAll('.text-red-500').forEach(el => el.classList.add('hidden'));

            if(mode === 'login') {
                tabLogin.classList.add('border-orange-500', 'text-orange-500');
                tabLogin.classList.remove('border-transparent');
                tabSignup.classList.remove('border-orange-500', 'text-orange-500');
                tabSignup.classList.add('border-transparent');
                
                document.getElementById('field-username').classList.add('hidden');
                document.getElementById('field-confirm-password').classList.add('hidden'); // Hide confirm pass
                document.getElementById('username').removeAttribute('required');
                document.getElementById('confirm-password').removeAttribute('required');
                
                submitText.textContent = "LOG IN";
            } else {
                tabSignup.classList.add('border-orange-500', 'text-orange-500');
                tabSignup.classList.remove('border-transparent');
                tabLogin.classList.remove('border-orange-500', 'text-orange-500');
                tabLogin.classList.add('border-transparent');
                
                // Ensure username is visible for signup
                document.getElementById('field-username').classList.remove('hidden');
                document.getElementById('field-confirm-password').classList.remove('hidden');
                document.getElementById('username').setAttribute('required', 'true');
                document.getElementById('confirm-password').setAttribute('required', 'true');
                
                submitText.textContent = "INITIATE SIGN UP";
            }
        }
        function togglePassword(fieldId, btn) {
            const input = document.getElementById(fieldId);
            const eyeOpen = btn.querySelector('.eye-open');
            const eyeClosed = btn.querySelector('.eye-closed');
            
            if (input.type === 'password') {
                input.type = 'text';
                eyeOpen.classList.add('hidden');
                eyeClosed.classList.remove('hidden');
            } else {
                input.type = 'password';
                eyeOpen.classList.remove('hidden');
                eyeClosed.classList.add('hidden');
            }
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

        


        const submit_button = document.getElementById("submit-button-1");
        const auth_form = document.getElementById("auth-form");

        async function getData(username, email,password) 
        {
            const head = {method: "POST", headers:{"Content-Type": "application/json"}, body:`{"username":"${username}", "email":"${email}", "password":"${password}"}`};
            const response = await fetch("/signup", head);
            console.log(response);
        }

        function check_username(username) 
        {
            const USERNAME_REGEX = /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/;
            return USERNAME_REGEX.test(username);
        }

        function check_email(email) 
        {
            const EMAIL_REGEX = /^25(bar|bcs|bec|bee|bme|bce|bch|bma|bph|bms|dcs|dec)[0-9]{3}@nith\.ac\.in$/;
            return EMAIL_REGEX.test(email);
        }
        
        function check_password(password) 
        {
            const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$/;
            return PASSWORD_REGEX.test(password);
        }
        async function waitForClick(btn) 
        {
            return new Promise(resolve => {
                btn.addEventListener("click", (e) => {
                e.preventDefault();
                resolve();
                                                    }, { once: true });
            });
        }

        async function username_check(username) {
    const res = await fetch("/username_check", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username
        })
    });

    const response = await res.json();
    return response.status // if false means username taken
}


        async function email_check(email) {
            const res = await fetch("/email_check", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                    },
                body: JSON.stringify({
                    email: email
                })
                });

    const response = await res.json();
    return response.status // if false means email taken, true matlab email not taken
}


        async function handleformsubmit(e)
        {
            e.preventDefault();// avoid page reload
            if(currentAuthMode === "login")
            {
                const email = document.getElementById("email").value;
                const password = document.getElementById("password").value;
                
                ['email', 'password'].forEach(id => document.getElementById(`err-${id}`).classList.add('hidden'));
                let bool = false;
                
                if(!check_email(email))
                {
                const err = document.getElementById('err-email');
                err.textContent = "INVALID EMAIL";
                err.classList.remove('hidden');
                bool = true;
                }
                if(!check_password(password))
                {
                const err = document.getElementById('err-password');
                err.textContent = "Check Your Credentials";
                err.classList.remove('hidden');
                bool = true;
                }
                if (await email_check(email) === "NOT_TAKEN")
                {
                    const err = document.getElementById('err-email');
                    err.textContent = "EMAIL NOT REGISTERED";
                    err.classList.remove('hidden');
                    bool = true;
                }
                if (bool)
                {
                    return 
                }
                    submitText.innerHTML = `<svg class="animate-spin -ml-1 mr-2 h-4 w-4 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg> CONNECTING...`;
                    const head = {method: "POST", headers:{"Content-Type": "application/json"}, body:JSON.stringify({email: email, password: password})};
                    let json = await fetch("/login", head);
                    const result = await json.json();
                    if(result.status === "error")
                    {
                        const err = document.getElementById('err-password');
                        err.textContent = "INVALID CREDENTIALS";
                        err.classList.remove('hidden');
                        return;
                    }
                    if (result.status === "success")
                    {
                         window.location.href = "/dashboard";
                    }
                    
                
            }

            const email = document.getElementById("email").value;
            const username = document.getElementById('username').value;
            const password = document.getElementById("password").value;
            const confirm_password = document.getElementById("confirm-password").value;
            ['username', 'email', 'password', 'confirm-password'].forEach(id => document.getElementById(`err-${id}`).classList.add('hidden'));
            let bool = false;
            if(password !== confirm_password)
                {
                    const err = document.getElementById('err-confirm-password');
                    err.textContent = "Passwords Don't Match";
                    err.classList.remove('hidden');
                    bool = true;
                }

            if((await username_check(username)) === "TAKEN")
            {
                const err = document.getElementById('err-username');
                err.textContent = "USERNAME ALREADY TAKEN";
                err.classList.remove('hidden');
                bool = true;
            }
            if(((await email_check(email))) === "TAKEN")
            {
                const err = document.getElementById('err-email');
                err.textContent = "EMAIL ALREADY REGISTERED";
                err.classList.remove('hidden');
                bool = true;
            }
            if(!check_username(username))
            {
                const err = document.getElementById('err-username');
                err.textContent = "3-20 CHARACTERS. LETTERS, NUMBERS & UNDERSCORES ONLY.";
                err.classList.remove('hidden');
                bool = true;
            }
            if(!check_email(email))
            {
                const err = document.getElementById('err-email');
                err.textContent = "INVALID EMAIL";
                err.classList.remove('hidden');
                bool = true;
            }
            if(!check_password(password))
            {
                const err = document.getElementById('err-password');
                err.textContent = "8-64 CHARS, INC. UPPER, LOWER, NUMBER & SPECIAL CHAR.";
                err.classList.remove('hidden');
                bool = true;
            }
            if(bool)
            {
                return;
            }
            submitText.innerHTML = `<svg class="animate-spin -ml-1 mr-2 h-4 w-4 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg> CONNECTING...`;
            let b = await getData(username, email,password);
            submitText.textContent = "GENERATING SPIRIT CODE...";
            document.getElementById('field-username').classList.add('hidden');
            document.getElementById('group-email').classList.add('hidden');
            document.getElementById('group-password').classList.add('hidden');
            document.getElementById('group-remember').classList.add('hidden');
            document.getElementById('field-confirm-password').classList.add('hidden');           
            document.getElementById('group-otp').classList.remove('hidden');
            document.getElementById('otp').focus(); // LIKE KISI File ko single click dena
            submitText.textContent = "VERIFY OTP";
            submit_button.removeEventListener("click", handleformsubmit);
            await waitForClick(submit_button); // for 300 seconds, lets assume otp is 6 digits
            const otp = document.getElementById('otp').value;
            submitText.innerHTML = `<svg class="animate-spin -ml-1 mr-2 h-4 w-4 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg> VERIFYING...`;
            json = await fetch("/verify-otp", {method: "POST", headers:{"Content-Type": "application/json"}, body:JSON.stringify({username: username, email: email, otp: otp})});
            const result = await json.json();
            if(result.status === "error")
            {
                const err = document.getElementById('err-otp');
                err.textContent = "OTP INVALID OR EXPIRED";
                err.classList.remove('hidden');
                return;
            }
            submitText.textContent = "OTP VERIFIED! REDIRECTING...";
            if (result.status === "success")
            {
                 window.location.href = "/dashboard";
            }
        }

        submit_button.addEventListener("click", handleformsubmit);

        