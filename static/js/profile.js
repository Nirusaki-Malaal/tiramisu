lucide.createIcons();

        // --- GLOBAL STATE ---
        let cropper = null;

        // --- AUDIO ENGINE ---
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        function playClickSound() {
            if (navigator.vibrate) navigator.vibrate(10);
            if (audioCtx.state === 'suspended') audioCtx.resume();
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.1);
        }

        // --- TOAST NOTIFICATIONS ---
        function showToast(message, type = 'normal') {
            const container = document.getElementById('toast-container');
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            toast.innerHTML = `<div class="flex items-center gap-3"><i data-lucide="${type === 'error' ? 'alert-octagon' : 'check-circle'}" class="w-4 h-4"></i> ${message}</div>`;
            container.appendChild(toast);
            lucide.createIcons();
            
            requestAnimationFrame(() => toast.classList.add('show'));
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }

        // --- UI LOGIC ---
        function switchTab(tabName) {
            playClickSound();
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            event.currentTarget.classList.add('active');
            document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
            const activeContent = document.getElementById(`tab-${tabName}`);
            activeContent.classList.remove('hidden');
            activeContent.classList.remove('fade-up');
            void activeContent.offsetWidth; 
            activeContent.classList.add('fade-up');
        }

        function enableEdit(inputId) {
            playClickSound();
            const input = document.getElementById(inputId);
            input.readOnly = false;
            input.classList.add('editable');
            input.focus();
        }

        function navigateToDashboard() {
            playClickSound();
            const overlay = document.getElementById('transition-overlay');
            overlay.classList.add('active');
            setTimeout(() => window.location.href = "dashboard.html", 500);
        }

        /* --- PHOTO & AVATAR LOGIC --- */
        function togglePhotoMenu(e) {
            e.stopPropagation();
            const menu = document.getElementById('photo-menu');
            const btn = e.currentTarget.closest('.group'); 
            const rect = btn.getBoundingClientRect();
            menu.style.top = `${rect.bottom + 5}px`;
            menu.style.left = `${rect.left}px`;
            menu.classList.toggle('hidden');
        }

        document.addEventListener('click', (e) => {
            if (!e.target.closest('#photo-menu') && !e.target.closest('.group')) {
                document.getElementById('photo-menu').classList.add('hidden');
            }
        });

        function triggerFileSelect() {
            document.getElementById('photo-upload').click();
            document.getElementById('photo-menu').classList.add('hidden');
        }

        function handleRemovePhoto() {
            document.getElementById('profile-avatar').src = 'https://ui-avatars.com/api/?name=User&background=111&color=555';
            document.getElementById('nav-avatar').src = 'https://ui-avatars.com/api/?name=User&background=111&color=555';
            showToast("Soul image erased from archives.", 'success');
            document.getElementById('photo-menu').classList.add('hidden');
        }

        function openAvatarModal() {
            document.getElementById('photo-menu').classList.add('hidden');
            const modal = document.getElementById('avatar-modal');
            modal.classList.add('active');
            regenerateAvatarGrid();
        }

        function closeModal(id) {
            document.getElementById(id).classList.remove('active');
            if (id === 'cropper-modal' && cropper) {
                cropper.destroy();
                cropper = null;
            }
        }

        /* --- IMAGE CROPPER LOGIC --- */
        function handlePhotoUpload(input) {
            const file = input.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = document.getElementById('cropper-image');
                    img.src = e.target.result;
                    
                    const modal = document.getElementById('cropper-modal');
                    modal.classList.add('active');
                    
                    // Initialize Cropper
                    if(cropper) cropper.destroy();
                    const image = document.getElementById('cropper-image');
                    cropper = new Cropper(image, {
                        aspectRatio: 1,
                        viewMode: 1,
                        background: false,
                        modal: true,
                        autoCropArea: 1,
                    });
                };
                reader.readAsDataURL(file);
                document.getElementById('photo-menu').classList.add('hidden');
            }
            // Reset input so same file can be selected again
            input.value = '';
        }

        function saveCrop() {
            if (!cropper) return;
            const canvas = cropper.getCroppedCanvas({ width: 256, height: 256 });
            const croppedDataUrl = canvas.toDataURL();
            
            document.getElementById('profile-avatar').src = croppedDataUrl;
            document.getElementById('nav-avatar').src = croppedDataUrl;
            
            closeModal('cropper-modal');
            showToast("Soul Signature Updated Successfully", 'success');
        }

        /* --- PIXEL AVATAR GENERATOR --- */
        function generatePixelAvatar(seed, size=12) {
            const canvas = document.createElement('canvas');
            const scale = 10;
            canvas.width = size * scale;
            canvas.height = size * scale;
            const ctx = canvas.getContext('2d');
            let hash = 0;
            const str = seed + "salt"; 
            for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
            const rng = () => { const x = Math.sin(hash++) * 10000; return x - Math.floor(x); }
            const bgColors = ['#1a1a1a', '#1e3a8a', '#4c1d95', '#052e16', '#7f1d1d', '#333'];
            const skinColors = ['#fdd0b1', '#e0ac69', '#8d5524', '#c68642', '#f1c27d'];
            const hairColors = ['#0f0f0f', '#4a2c2a', '#e6c35c', '#8d2d2d', '#5e3a28', '#ff6b00', '#00d2ff'];
            const shirtColors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
            const bg = bgColors[Math.floor(rng() * bgColors.length)];
            const skin = skinColors[Math.floor(rng() * skinColors.length)];
            const hair = hairColors[Math.floor(rng() * hairColors.length)];
            const shirt = shirtColors[Math.floor(rng() * shirtColors.length)];
            const rect = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x * scale, y * scale, w * scale, h * scale); };
            rect(0, 0, size, size, bg);
            rect(3, 3, 6, 6, skin); rect(4, 9, 4, 2, skin);
            rect(2, 10, 8, 2, shirt);
            const hairType = Math.floor(rng()*3);
            if(hairType===0) { rect(3,2,6,2,hair); rect(2,3,1,4,hair); rect(9,3,1,4,hair); }
            else if(hairType===1) { rect(3,1,6,3,hair); rect(1,3,2,5,hair); rect(9,3,2,5,hair); }
            else { rect(3,2,6,1,skin); } // Bald/Short
            const eyeColor = rng() > 0.8 ? '#00d2ff' : '#000';
            rect(4,5,1,1, eyeColor); rect(7,5,1,1, eyeColor);
            if (rng() > 0.5) rect(5, 7, 2, 1, '#000'); else rect(5, 7, 2, 1, '#a00');
            if (rng() > 0.7) { rect(3, 5, 6, 1, '#fff'); ctx.fillStyle = 'rgba(0, 200, 255, 0.5)'; ctx.fillRect(3 * scale, 5 * scale, 2 * scale, 1 * scale); ctx.fillRect(7 * scale, 5 * scale, 2 * scale, 1 * scale); }
            return canvas.toDataURL();
        }

        function regenerateAvatarGrid() {
            const grid = document.getElementById('avatar-grid');
            grid.innerHTML = '';
            for(let i=0; i<12; i++) {
                const seed = Math.random().toString(36).substring(7);
                const src = generatePixelAvatar(seed);
                const div = document.createElement('div');
                div.className = "cursor-pointer border-2 border-transparent hover:border-[var(--reishi)] rounded-sm p-1 transition-all hover:scale-105";
                div.innerHTML = `<img src="${src}" class="w-full h-full pixel-avatar">`;
                div.onclick = () => selectAvatar(src);
                grid.appendChild(div);
            }
        }

        function selectAvatar(src) {
            document.getElementById('profile-avatar').src = src;
            document.getElementById('nav-avatar').src = src;
            closeModal('avatar-modal');
            showToast("Spirit Form Updated Successfully", 'success');
        }

        function updateAvatarLive(val) {
            const src = generatePixelAvatar(val || "user");
            document.getElementById('profile-avatar').src = src;
            document.getElementById('nav-avatar').src = src;
        }

        // --- API FUNCTIONS ---
        async function fetchUserProfile() {
            // Simulate loading profile data
            setTimeout(() => {
                document.getElementById('loading-screen').style.opacity = '0';
                setTimeout(() => document.getElementById('loading-screen').style.display = 'none', 800);
                updateAvatarLive("sr_ichigo");
            }, 1500);
        }

        async function handleUpdateProfile() {
            playClickSound();
            showToast("Syncing Spirit Data...", 'normal');
            setTimeout(() => {
                showToast("Profile Updated. Reloading...", 'success');
                setTimeout(() => window.location.reload(), 1500);
            }, 1000);
        }

        async function handleChangePassword() {
            playClickSound();
            const newPass = document.getElementById('new-pass').value;
            const confirmPass = document.getElementById('confirm-pass').value;
            if (newPass !== confirmPass) {
                showToast("Error: Spirit codes do not match.", 'error');
                return;
            }
            showToast("Security Clearance Updated. Reloading...", 'success');
            setTimeout(() => window.location.reload(), 1500);
        }

        // --- 2FA & DELETE ACCOUNT LOGIC ---
        
        function handleDeleteAccount() {
            const modal = document.getElementById('delete-modal');
            const step1 = document.getElementById('delete-step-1');
            const step2 = document.getElementById('delete-step-2');
            
            // Reset state
            document.getElementById('delete-password').value = '';
            document.querySelectorAll('.otp-input').forEach(i => i.value = '');
            step1.classList.remove('hidden');
            step2.classList.add('hidden');
            
            modal.classList.add('active');
        }

        function verifyDeletePassword() {
            const pass = document.getElementById('delete-password').value;
            if(pass.length > 0) {
                // Dummy check success
                showToast("Password Verified. Dispatching Hell Butterfly...", 'normal');
                setTimeout(() => {
                    document.getElementById('delete-step-1').classList.add('hidden');
                    document.getElementById('delete-step-2').classList.remove('hidden');
                    document.querySelector('.otp-input').focus();
                }, 1000);
            } else {
                showToast("Password Required", 'error');
            }
        }

        function verifyOTPAndDelete() {
            // Check OTP inputs (dummy check)
            let otp = "";
            document.querySelectorAll('.otp-input').forEach(i => otp += i.value);
            
            if(otp.length === 4) {
                showToast("OTP Verified. Severing Link...", 'error');
                setTimeout(() => {
                    alert("Account Deleted. Returning to the World of the Living.");
                    window.location.href = "login.html"; 
                }, 1500);
            } else {
                showToast("Invalid OTP", 'error');
            }
        }

        // OTP Input Auto-Focus Logic
        document.querySelectorAll('.otp-input').forEach((input, index, inputs) => {
            input.addEventListener('input', (e) => {
                if(e.target.value.length === 1 && index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }
            });
            input.addEventListener('keydown', (e) => {
                if(e.key === 'Backspace' && e.target.value.length === 0 && index > 0) {
                    inputs[index - 1].focus();
                }
            });
        });

        // Initialize
        document.addEventListener("DOMContentLoaded", async () => {
            await fetchUserProfile();
        });