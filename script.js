// ===== Global State Management =====
let allGames = [];
let filteredGames = [];
let currentView = 'grid';
let currentTheme = 'dark';
let isLoading = false;
let animationFrameId = null;

// ===== DOM Elements =====
const gameList = document.getElementById('game-list');
const gameCount = document.getElementById('game-count');
const totalRating = document.getElementById('total-rating');
const searchInput = document.getElementById('search-input');
const clearSearch = document.getElementById('clear-search');
const sortSelect = document.getElementById('sort-select');
const viewButtons = document.querySelectorAll('.view-btn');
const scrollTopBtn = document.getElementById('scroll-top');
const themeToggle = document.getElementById('theme-toggle');
const loadingState = document.getElementById('loading-state');
const emptyState = document.getElementById('empty-state');
const navbar = document.getElementById('navbar');
const navProgressBar = document.getElementById('nav-progress-bar');

// ===== Initialize App =====
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    setupScrollButton();
    setupThemeToggle();
    setupNavbarEffects();
    addEnhancedAnimations();
    initializeParallaxEffects();
    initializeMatrixRain();
    initializeParticleSystem();
    setupIntersectionObserver();
    
    // Add loading screen
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 2000);
});

// ===== Matrix Rain Effect =====
function initializeMatrixRain() {
    const matrixContainer = document.getElementById('matrix-rain');
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    
    function createMatrixColumn() {
        const column = document.createElement('div');
        column.style.cssText = `
            position: absolute;
            top: -100px;
            font-size: 14px;
            color: rgba(99, 102, 241, 0.6);
            animation: matrixFall ${Math.random() * 3 + 2}s linear infinite;
            left: ${Math.random() * 100}%;
            font-family: 'Courier New', monospace;
        `;
        
        let text = '';
        for (let i = 0; i < Math.random() * 20 + 10; i++) {
            text += chars[Math.floor(Math.random() * chars.length)] + '<br>';
        }
        column.innerHTML = text;
        
        matrixContainer.appendChild(column);
        
        setTimeout(() => {
            column.remove();
        }, 5000);
    }
    
    // Create matrix columns periodically
    setInterval(createMatrixColumn, 200);
    
    // Add CSS for matrix animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes matrixFall {
            0% {
                transform: translateY(-100px);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(100vh);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// ===== Enhanced Particle System =====
function initializeParticleSystem() {
    const particlesContainer = document.querySelector('.particles');
    
    // Add more particles dynamically
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('span');
        particle.className = 'particle';
        particle.style.cssText = `
            left: ${Math.random() * 100}%;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: ${getRandomColor()};
            animation-delay: ${Math.random() * 25}s;
            animation-duration: ${Math.random() * 10 + 20}s;
            box-shadow: 0 0 ${Math.random() * 15 + 5}px ${getRandomColor()};
        `;
        particlesContainer.appendChild(particle);
    }
}

function getRandomColor() {
    const colors = [
        'rgba(99, 102, 241, 0.6)',
        'rgba(139, 92, 246, 0.5)',
        'rgba(236, 72, 153, 0.4)',
        'rgba(16, 185, 129, 0.5)',
        'rgba(245, 158, 11, 0.4)'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// ===== Enhanced Navbar Effects =====
function setupNavbarEffects() {
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Update progress bar
        const scrollProgress = (currentScrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        navProgressBar.style.transform = `scaleX(${scrollProgress / 100})`;
        
        // Navbar hide/show effect
        if (currentScrollY > 100) {
            navbar.classList.add('scrolled');
            
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
        } else {
            navbar.classList.remove('scrolled');
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
    
    // Add ripple effect to nav buttons
    document.querySelectorAll('.nav-search-btn, .nav-theme-btn, .nav-menu-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = this.querySelector('.btn-ripple');
            ripple.style.width = '100px';
            ripple.style.height = '100px';
            
            setTimeout(() => {
                ripple.style.width = '0';
                ripple.style.height = '0';
            }, 600);
        });
    });
}

// ===== Intersection Observer for Animations =====
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Special handling for stat cards
                if (entry.target.classList.contains('stat-card')) {
                    animateStatCard(entry.target);
                }
                
                // Special handling for game cards
                if (entry.target.classList.contains('game-card')) {
                    entry.target.style.animationDelay = `${Math.random() * 0.5}s`;
                }
            }
        });
    }, observerOptions);
    
    // Observe elements
    document.querySelectorAll('.stat-card, .game-card, .feature-badge, .social-btn').forEach(el => {
        observer.observe(el);
    });
}

// ===== Animate Stat Cards =====
function animateStatCard(card) {
    const progressBar = card.querySelector('.progress-bar');
    const statValue = card.querySelector('.stat-value');
    
    if (progressBar) {
        const progress = progressBar.dataset.progress || 0.8;
        progressBar.style.setProperty('--progress', progress);
    }
    
    // Animate number counting
    if (statValue) {
        const finalValue = statValue.textContent;
        const isDecimal = finalValue.includes('.');
        const numericValue = parseFloat(finalValue);
        
        animateValue(statValue, 0, numericValue, 2000, isDecimal);
    }
}

// ===== Enhanced Parallax Effects =====
function initializeParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.floating-shapes .shape, .particles .particle');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach((element, index) => {
            const speed = (index + 1) * 0.1;
            element.style.transform = `translateY(${rate * speed}px) rotate(${scrolled * 0.05}deg)`;
        });
    });
    
    // Mouse parallax effect
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        parallaxElements.forEach((element, index) => {
            const speed = (index + 1) * 10;
            const x = (mouseX - 0.5) * speed;
            const y = (mouseY - 0.5) * speed;
            
            element.style.transform += ` translate(${x}px, ${y}px)`;
        });
    });
}

// ===== Fetch and Load Games =====
async function initializeApp() {
    try {
        showLoading();
        
        // Simulate loading delay for better UX
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const response = await fetch('game.json');
        
        if (!response.ok) {
            throw new Error('Failed to load games data');
        }
        
        allGames = await response.json();
        filteredGames = [...allGames];
        
        hideLoading();
        updateStats();
        renderGames(filteredGames);
        animateCards();
        
        // Add stagger animation to initial load
        setTimeout(() => {
            addStaggerAnimation();
        }, 500);
        
    } catch (error) {
        console.error('Error loading games:', error);
        hideLoading();
        showError('Không thể tải danh sách game. Vui lòng thử lại sau.');
    }
}

// ===== Loading States =====
function showLoading() {
    loadingState.style.display = 'block';
    gameList.style.display = 'none';
    emptyState.style.display = 'none';
}

function hideLoading() {
    loadingState.style.display = 'none';
    gameList.style.display = 'grid';
}

function showEmpty() {
    emptyState.style.display = 'block';
    gameList.style.display = 'none';
}

function hideEmpty() {
    emptyState.style.display = 'none';
    gameList.style.display = 'grid';
}

function showError(message) {
    gameList.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 80px 20px;">
            <h3 style="color: var(--text-secondary); margin-bottom: 15px; font-size: 2rem;">Đã xảy ra lỗi</h3>
            <p style="color: var(--text-muted); font-size: 1.1rem;">${message}</p>
        </div>
    `;
    gameList.style.display = 'grid';
}

// ===== Update Statistics =====
function updateStats() {
    // Animate count up
    animateValue(gameCount, 0, allGames.length, 1000);
    
    const avgRating = allGames.length > 0
        ? (allGames.reduce((sum, game) => sum + (game.rating || 0), 0) / allGames.length)
        : 0;
    
    animateValue(totalRating, 0, avgRating, 1000, true);
}

// ===== Animate Number Counter =====
function animateValue(element, start, end, duration, isDecimal = false) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
    }, 16);
}

// ===== Render Games =====
function renderGames(games) {
    gameList.innerHTML = '';
    
    if (games.length === 0) {
        showEmpty();
        return;
    }
    
    hideEmpty();
    
    games.forEach((game, index) => {
        const card = createGameCard(game, index);
        gameList.appendChild(card);
    });
}

// ===== Create Game Card (NO ICONS VERSION) =====
function createGameCard(game, index) {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.style.animationDelay = `${index * 0.05}s`;
    
    // Generate genre badges
    const genreTags = game.genre 
        ? game.genre.slice(0, 3).map(g => `<span class="tag">${g}</span>`).join('')
        : '';
    
    // Platform list (text only, no icons)
    const platforms = game.platform 
        ? game.platform.slice(0, 3).join(', ')
        : 'PC';
    
    // Rating display (number only, no stars)
    const ratingDisplay = game.rating 
        ? `<span style="color: var(--primary-light); font-weight: 700;">${game.rating.toFixed(1)}</span>`
        : '<span style="color: var(--text-muted);">N/A</span>';
    
    // Featured badge (text only)
    const featuredBadge = game.featured 
        ? '<div class="game-badge">Nổi Bật</div>' 
        : '';
    
    // Alternative download links
    const altLinks = game.alternativeLinks && game.alternativeLinks.length > 0
        ? `
            <div style="margin-top: 12px; display: flex; flex-wrap: wrap; gap: 8px;">
                ${game.alternativeLinks.map(link => `
                    <a href="${link.url}" target="_blank" rel="noopener" 
                       style="display: inline-block; padding: 8px 16px; 
                              background: rgba(99, 102, 241, 0.12); color: var(--primary-light); 
                              text-decoration: none; border-radius: 10px; font-size: 0.85rem;
                              border: 1px solid rgba(99, 102, 241, 0.3); font-weight: 600;
                              transition: all 0.3s ease;">
                        ${link.name}
                    </a>
                `).join('')}
            </div>
        `
        : '';
    
    card.innerHTML = `
        <div class="game-card-image">
            <img src="${game.image}" alt="${game.title}" loading="lazy" 
                 onerror="this.src='https://via.placeholder.com/400x220/1a1f35/64748b?text=${encodeURIComponent(game.title)}'">
            ${featuredBadge}
        </div>
        <div class="content">
            <h3>${game.title}</h3>
            
            <div class="game-meta">
                <div class="meta-item">
                    <span style="color: var(--text-muted); font-size: 0.85rem;">Đánh giá:</span>
                    ${ratingDisplay}
                </div>
                <div class="meta-item">
                    <span style="color: var(--text-muted); font-size: 0.85rem;">Dung lượng:</span>
                    <span style="color: var(--text-secondary); font-weight: 600;">${game.size || 'N/A'}</span>
                </div>
                <div class="meta-item">
                    <span style="color: var(--text-muted); font-size: 0.85rem;">Tải về:</span>
                    <span style="color: var(--success); font-weight: 600;">${formatDownloads(game.downloads || 0)}</span>
                </div>
            </div>
            
            <p>${game.description}</p>
            
            ${game.genre ? `
                <div class="game-tags">
                    ${genreTags}
                </div>
            ` : ''}
            
            <div style="margin-top: 18px; padding-top: 18px; border-top: 1px solid var(--border);">
                <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px; 
                            color: var(--text-muted); font-size: 0.9rem;">
                    <div style="display: flex; justify-content: space-between;">
                        <span>Nền tảng:</span>
                        <span style="color: var(--text-secondary); font-weight: 600;">${platforms}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span>Ngôn ngữ:</span>
                        <span style="color: var(--success); font-weight: 600;">${game.language || 'Tiếng Việt (100%)'}</span>
                    </div>
                </div>
                
                <a href="${game.download}" target="_blank" rel="noopener" 
                   class="download-btn" onclick="trackDownload('${game.id}', '${game.title}')">
                    Tải Game Ngay
                </a>
                
                ${altLinks}
                
                ${game.trailer ? `
                    <a href="${game.trailer}" target="_blank" rel="noopener"
                       style="display: block; margin-top: 12px; padding: 12px 24px; 
                              background: rgba(236, 72, 153, 0.12); color: var(--accent); 
                              text-decoration: none; border-radius: 12px; font-weight: 700;
                              border: 1px solid rgba(236, 72, 153, 0.3); text-align: center;
                              transition: all 0.3s ease; font-size: 0.95rem;">
                        Xem Trailer
                    </a>
                ` : ''}
            </div>
        </div>
    `;
    
    // Add hover effect for alternative links
    const altLinkElements = card.querySelectorAll('.content a[href*="drive.google"], .content a[href*="mega"], .content a[href*="mediafire"]');
    altLinkElements.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(99, 102, 241, 0.2)';
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)';
        });
        link.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(99, 102, 241, 0.12)';
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
    
    return card;
}

// ===== Format Downloads Number =====
function formatDownloads(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// ===== Search Functionality =====
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        clearSearch.style.display = 'none';
        filteredGames = [...allGames];
    } else {
        clearSearch.style.display = 'block';
        filteredGames = allGames.filter(game => {
            const searchableText = [
                game.title,
                game.description,
                ...(game.genre || []),
                ...(game.tags || []),
                game.developer
            ].join(' ').toLowerCase();
            
            return searchableText.includes(searchTerm);
        });
    }
    
    applySorting();
    renderGames(filteredGames);
    animateCards();
}

// ===== Clear Search =====
function handleClearSearch() {
    searchInput.value = '';
    clearSearch.style.display = 'none';
    filteredGames = [...allGames];
    applySorting();
    renderGames(filteredGames);
    animateCards();
    searchInput.focus();
}

// ===== Sorting Functionality =====
function applySorting() {
    const sortValue = sortSelect.value;
    
    switch (sortValue) {
        case 'name':
            filteredGames.sort((a, b) => a.title.localeCompare(b.title, 'vi'));
            break;
        case 'name-desc':
            filteredGames.sort((a, b) => b.title.localeCompare(a.title, 'vi'));
            break;
        case 'rating':
            filteredGames.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
        case 'rating-asc':
            filteredGames.sort((a, b) => (a.rating || 0) - (b.rating || 0));
            break;
        case 'newest':
            filteredGames.sort((a, b) => {
                const dateA = new Date(a.releaseDate || '2000-01-01');
                const dateB = new Date(b.releaseDate || '2000-01-01');
                return dateB - dateA;
            });
            break;
        default:
            break;
    }
}

// ===== Enhanced View Toggle =====
function toggleView(view) {
    currentView = view;
    
    viewButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.view === view) {
            btn.classList.add('active');
        }
    });
    
    gameList.classList.remove('list-view', 'compact-view');
    
    if (view === 'list') {
        gameList.classList.add('list-view');
    } else if (view === 'compact') {
        gameList.classList.add('compact-view');
    }
    
    // Re-animate cards on view change with stagger
    setTimeout(() => {
        animateCards();
        addStaggerAnimation();
    }, 100);
}

// ===== Animate Cards on Load =====
function animateCards() {
    const cards = document.querySelectorAll('.game-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 50);
    });
}

// ===== Scroll to Top Button =====
function setupScrollButton() {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== Event Listeners Setup =====
function setupEventListeners() {
    // Search input
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    
    // Clear search button
    clearSearch.addEventListener('click', handleClearSearch);
    
    // Sort select
    sortSelect.addEventListener('change', () => {
        applySorting();
        renderGames(filteredGames);
        animateCards();
        showNotification('Đã sắp xếp lại danh sách');
    });
    
    // View toggle buttons
    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            toggleView(btn.dataset.view);
            showNotification(`Chuyển sang chế độ xem ${btn.dataset.view === 'grid' ? 'lưới' : 'danh sách'}`);
        });
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K for search focus
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
            searchInput.select();
        }
        
        // Escape to clear search
        if (e.key === 'Escape' && searchInput.value) {
            handleClearSearch();
        }
    });
}

// ===== Debounce Helper =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== Track Download (Analytics) =====
function trackDownload(gameId, gameTitle) {
    console.log(`Download tracked: ${gameTitle} (${gameId})`);
    showNotification(`Chuẩn bị tải "${gameTitle}"...`);
}

// ===== Show Notification =====
function showNotification(message) {
    // Remove existing notification if any
    const existing = document.querySelector('.toast-notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'toast-notification';
    notification.style.cssText = `
        position: fixed;
        bottom: 40px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        color: white;
        padding: 16px 32px;
        border-radius: 50px;
        box-shadow: 0 8px 32px rgba(99, 102, 241, 0.5);
        z-index: 10000;
        font-weight: 600;
        font-size: 0.95rem;
        animation: toastSlideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        backdrop-filter: blur(10px);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'toastSlideDown 0.4s ease forwards';
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}

// ===== Enhanced Animations =====
function addEnhancedAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        /* ===== Loading Screen ===== */
        body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, var(--bg-dark), var(--bg-card));
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: opacity 0.8s ease, visibility 0.8s ease;
        }
        
        body.loaded::before {
            opacity: 0;
            visibility: hidden;
        }
        
        /* ===== Enhanced Animations ===== */
        @keyframes toastSlideUp {
            from {
                transform: translateX(-50%) translateY(100px);
                opacity: 0;
            }
            to {
                transform: translateX(-50%) translateY(0);
                opacity: 1;
            }
        }
        
        @keyframes toastSlideDown {
            from {
                transform: translateX(-50%) translateY(0);
                opacity: 1;
            }
            to {
                transform: translateX(-50%) translateY(100px);
                opacity: 0;
            }
        }
        
        /* ===== Animate In Classes ===== */
        .animate-in {
            animation: slideInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(50px) scale(0.9);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        
        /* ===== Game Card Hover Effects ===== */
        .game-card {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .game-card.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* ===== Enhanced Button Effects ===== */
        .download-btn {
            position: relative;
            overflow: hidden;
        }
        
        .download-btn::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            transition: all 0.6s ease;
        }
        
        .download-btn:active::after {
            width: 300px;
            height: 300px;
        }
        
        /* ===== Smooth transitions for all interactive elements ===== */
        a, button, .tag, .game-card, .nav-link, .social-btn {
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        /* ===== Enhanced loading spinner ===== */
        .loading-spinner {
            position: relative;
            width: 70px;
            height: 70px;
            border: 5px solid rgba(99, 102, 241, 0.1);
            border-top: 5px solid var(--primary);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        .loading-spinner::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 30px;
            height: 30px;
            margin: -15px 0 0 -15px;
            border: 3px solid rgba(139, 92, 246, 0.2);
            border-radius: 50%;
            animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
                opacity: 1;
            }
            50% {
                transform: scale(1.2);
                opacity: 0.5;
            }
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        /* ===== Stagger Animation ===== */
        .stagger-animation {
            animation: staggerFadeIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        
        @keyframes staggerFadeIn {
            from {
                opacity: 0;
                transform: translateY(40px) scale(0.9);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        
        /* ===== Glitch Effect ===== */
        .glitch {
            position: relative;
            animation: glitch 2s infinite;
        }
        
        .glitch::before,
        .glitch::after {
            content: attr(data-text);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
        
        .glitch::before {
            animation: glitch-1 0.5s infinite;
            color: #ff0000;
            z-index: -1;
        }
        
        .glitch::after {
            animation: glitch-2 0.5s infinite;
            color: #00ffff;
            z-index: -2;
        }
        
        @keyframes glitch {
            0%, 100% { transform: translate(0); }
            20% { transform: translate(-2px, 2px); }
            40% { transform: translate(-2px, -2px); }
            60% { transform: translate(2px, 2px); }
            80% { transform: translate(2px, -2px); }
        }
        
        @keyframes glitch-1 {
            0%, 100% { transform: translate(0); }
            20% { transform: translate(2px, -2px); }
            40% { transform: translate(-2px, 2px); }
            60% { transform: translate(-2px, -2px); }
            80% { transform: translate(2px, 2px); }
        }
        
        @keyframes glitch-2 {
            0%, 100% { transform: translate(0); }
            20% { transform: translate(-2px, 2px); }
            40% { transform: translate(2px, -2px); }
            60% { transform: translate(2px, 2px); }
            80% { transform: translate(-2px, -2px); }
        }
        
        /* ===== Neon Glow Effect ===== */
        .neon-glow {
            text-shadow: 
                0 0 5px currentColor,
                0 0 10px currentColor,
                0 0 15px currentColor,
                0 0 20px var(--primary),
                0 0 35px var(--primary),
                0 0 40px var(--primary);
            animation: neonFlicker 2s infinite alternate;
        }
        
        @keyframes neonFlicker {
            0%, 100% {
                text-shadow: 
                    0 0 5px currentColor,
                    0 0 10px currentColor,
                    0 0 15px currentColor,
                    0 0 20px var(--primary),
                    0 0 35px var(--primary),
                    0 0 40px var(--primary);
            }
            50% {
                text-shadow: 
                    0 0 2px currentColor,
                    0 0 5px currentColor,
                    0 0 8px currentColor,
                    0 0 12px var(--primary),
                    0 0 18px var(--primary),
                    0 0 25px var(--primary);
            }
        }
        
        /* ===== Floating Animation ===== */
        .floating {
            animation: floating 3s ease-in-out infinite;
        }
        
        @keyframes floating {
            0%, 100% {
                transform: translateY(0px);
            }
            50% {
                transform: translateY(-20px);
            }
        }
        
        /* ===== Typewriter Effect ===== */
        .typewriter {
            overflow: hidden;
            border-right: 2px solid var(--primary);
            white-space: nowrap;
            animation: 
                typing 3.5s steps(40, end),
                blink-caret 0.75s step-end infinite;
        }
        
        @keyframes typing {
            from { width: 0; }
            to { width: 100%; }
        }
        
        @keyframes blink-caret {
            from, to { border-color: transparent; }
            50% { border-color: var(--primary); }
        }
    `;
    document.head.appendChild(style);
}

// ===== Add Stagger Animation =====
function addStaggerAnimation() {
    const cards = document.querySelectorAll('.game-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('stagger-animation');
        }, index * 100);
    });
}

// ===== Enhanced Show Notification =====
function showNotification(message, type = 'info') {
    // Remove existing notification if any
    const existing = document.querySelector('.toast-notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'toast-notification';
    
    let bgColor = 'linear-gradient(135deg, var(--primary), var(--secondary))';
    let icon = 'ℹ️';
    
    switch (type) {
        case 'success':
            bgColor = 'linear-gradient(135deg, var(--success), #059669)';
            icon = '✅';
            break;
        case 'error':
            bgColor = 'linear-gradient(135deg, var(--error), #dc2626)';
            icon = '❌';
            break;
        case 'warning':
            bgColor = 'linear-gradient(135deg, var(--warning), #d97706)';
            icon = '⚠️';
            break;
    }
    
    notification.style.cssText = `
        position: fixed;
        bottom: 40px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: ${bgColor};
        color: white;
        padding: 18px 36px;
        border-radius: 50px;
        box-shadow: 0 12px 40px rgba(99, 102, 241, 0.5);
        z-index: 10000;
        font-weight: 600;
        font-size: 1rem;
        animation: toastSlideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        backdrop-filter: blur(20px);
        display: flex;
        align-items: center;
        gap: 12px;
        max-width: 90vw;
        text-align: center;
    `;
    
    notification.innerHTML = `<span style="font-size: 1.2rem;">${icon}</span>${message}`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'toastSlideDown 0.4s ease forwards';
        setTimeout(() => notification.remove(), 400);
    }, 3500);
}

// ===== Add Glitch Effect to Title =====
function addGlitchEffect() {
    const titleWords = document.querySelectorAll('.title-word');
    titleWords.forEach(word => {
        word.classList.add('glitch');
        word.setAttribute('data-text', word.textContent);
    });
}

// ===== Add Neon Effect =====
function addNeonEffect(element) {
    element.classList.add('neon-glow');
}

// ===== Performance Monitoring =====
function initializePerformanceMonitoring() {
    // Monitor FPS
    let fps = 0;
    let lastTime = performance.now();
    
    function countFPS() {
        const currentTime = performance.now();
        fps = Math.round(1000 / (currentTime - lastTime));
        lastTime = currentTime;
        
        if (fps < 30) {
            // Reduce animations if FPS is low
            document.body.classList.add('low-performance');
        }
        
        requestAnimationFrame(countFPS);
    }
    
    countFPS();
}

// ===== Initialize Performance Monitoring =====
console.log('%c🎮 GAMEDUCVONG Website Loaded Successfully! ', 'background: linear-gradient(135deg, #667eea, #764ba2); color: white; font-size: 16px; font-weight: bold; padding: 10px 20px; border-radius: 8px;');
console.log('%cDeveloped with ❤️ for gaming community', 'color: #94a3b8; font-size: 12px;');
console.log('%c🚀 Enhanced with premium animations and effects!', 'background: linear-gradient(135deg, #f093fb, #f5576c); color: white; font-size: 14px; font-weight: bold; padding: 8px 16px; border-radius: 6px;');

// Initialize performance monitoring
initializePerformanceMonitoring();
// ===== Enhanced Game Card Creation =====
function createGameCard(game, index) {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    // Generate genre badges with enhanced styling
    const genreTags = game.genre 
        ? game.genre.slice(0, 3).map(g => `<span class="tag" data-genre="${g}">${g}</span>`).join('')
        : '';
    
    // Platform list with icons
    const platforms = game.platform 
        ? game.platform.slice(0, 3).join(', ')
        : 'PC';
    
    // Enhanced rating display with stars
    const ratingDisplay = game.rating 
        ? `<span style="color: var(--warning); font-weight: 800; display: flex; align-items: center; gap: 5px;">
             ${game.rating.toFixed(1)}
             <span style="color: var(--warning);">${'★'.repeat(Math.floor(game.rating))}</span>
           </span>`
        : '<span style="color: var(--text-muted);">N/A</span>';
    
    // Enhanced featured badge
    const featuredBadge = game.featured 
        ? '<div class="game-badge">🌟 Nổi Bật</div>' 
        : '';
    
    // Enhanced alternative download links
    const altLinks = game.alternativeLinks && game.alternativeLinks.length > 0
        ? `
            <div style="margin-top: 15px; display: flex; flex-wrap: wrap; gap: 10px;">
                ${game.alternativeLinks.map(link => `
                    <a href="${link.url}" target="_blank" rel="noopener" 
                       class="alt-download-link"
                       style="display: inline-flex; align-items: center; gap: 8px;
                              padding: 10px 18px; 
                              background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.15)); 
                              color: var(--primary-light); 
                              text-decoration: none; border-radius: 15px; font-size: 0.9rem;
                              border: 1px solid rgba(99, 102, 241, 0.3); font-weight: 700;
                              transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                              position: relative; overflow: hidden;">
                        <span style="font-size: 1.1rem;">${getLinkIcon(link.name)}</span>
                        ${link.name}
                    </a>
                `).join('')}
            </div>
        `
        : '';
    
    card.innerHTML = `
        <div class="game-card-image">
            <img src="${game.image}" alt="${game.title}" loading="lazy" 
                 onerror="this.src='https://via.placeholder.com/400x260/1a1f35/64748b?text=${encodeURIComponent(game.title)}'">
            ${featuredBadge}
            <div class="image-overlay"></div>
        </div>
        <div class="content">
            <h3>${game.title}</h3>
            
            <div class="game-meta">
                <div class="meta-item">
                    <span>Đánh giá</span>
                    ${ratingDisplay}
                </div>
                <div class="meta-item">
                    <span>Dung lượng</span>
                    <span style="color: var(--text-secondary); font-weight: 700;">${game.size || 'N/A'}</span>
                </div>
                <div class="meta-item">
                    <span>Tải về</span>
                    <span style="color: var(--success); font-weight: 700;">${formatDownloads(game.downloads || 0)}</span>
                </div>
            </div>
            
            <p style="color: var(--text-secondary); font-size: 1rem; line-height: 1.7; margin-bottom: 25px;
                      display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                ${game.description}
            </p>
            
            ${game.genre ? `
                <div class="game-tags">
                    ${genreTags}
                </div>
            ` : ''}
            
            <div style="margin-top: 25px; padding-top: 25px; border-top: 1px solid var(--border);">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; 
                            color: var(--text-muted); font-size: 0.95rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 1.1rem;">🖥️</span>
                            Nền tảng:
                        </span>
                        <span style="color: var(--text-secondary); font-weight: 700;">${platforms}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 1.1rem;">🇻🇳</span>
                            Ngôn ngữ:
                        </span>
                        <span style="color: var(--success); font-weight: 700;">${game.language || 'Tiếng Việt (100%)'}</span>
                    </div>
                </div>
                
                <a href="${game.download}" target="_blank" rel="noopener" 
                   class="download-btn" onclick="trackDownload('${game.id}', '${game.title}')">
                    <span style="font-size: 1.2rem;">⬇️</span>
                    Tải Game Ngay
                </a>
                
                ${altLinks}
                
                ${game.trailer ? `
                    <a href="${game.trailer}" target="_blank" rel="noopener"
                       style="display: flex; align-items: center; justify-content: center; gap: 10px;
                              margin-top: 15px; padding: 15px 28px; 
                              background: linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(245, 158, 11, 0.15)); 
                              color: var(--accent); 
                              text-decoration: none; border-radius: 18px; font-weight: 800;
                              border: 1px solid rgba(236, 72, 153, 0.3); text-align: center;
                              transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); font-size: 1rem;
                              text-transform: uppercase; letter-spacing: 0.5px;">
                        <span style="font-size: 1.3rem;">🎬</span>
                        Xem Trailer
                    </a>
                ` : ''}
            </div>
        </div>
    `;
    
    // Add enhanced hover effects for alternative links
    setTimeout(() => {
        const altLinkElements = card.querySelectorAll('.alt-download-link');
        altLinkElements.forEach(link => {
            // Add shimmer effect
            link.innerHTML += '<div class="link-shimmer"></div>';
            
            link.addEventListener('mouseenter', function() {
                this.style.background = 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(139, 92, 246, 0.25))';
                this.style.transform = 'translateY(-3px) scale(1.05)';
                this.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.4)';
            });
            
            link.addEventListener('mouseleave', function() {
                this.style.background = 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.15))';
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = 'none';
            });
        });
    }, 100);
    
    return card;
}

// ===== Get Link Icon =====
function getLinkIcon(linkName) {
    const icons = {
        'Google Drive': '📁',
        'Mega.nz': '☁️',
        'MediaFire': '🔥',
        'Torrent': '🌊',
        '1fichier': '📦'
    };
    return icons[linkName] || '🔗';
}

// ===== Enhanced Track Download =====
function trackDownload(gameId, gameTitle) {
    console.log(`Download tracked: ${gameTitle} (${gameId})`);
    
    // Add download animation
    const downloadBtn = event.target;
    downloadBtn.style.transform = 'scale(0.95)';
    downloadBtn.innerHTML = '<span style="font-size: 1.2rem;">⏳</span> Đang chuẩn bị...';
    
    setTimeout(() => {
        downloadBtn.style.transform = 'scale(1)';
        downloadBtn.innerHTML = '<span style="font-size: 1.2rem;">✅</span> Đã sẵn sàng!';
    }, 1000);
    
    setTimeout(() => {
        downloadBtn.innerHTML = '<span style="font-size: 1.2rem;">⬇️</span> Tải Game Ngay';
    }, 3000);
    
    showNotification(`🎮 Chuẩn bị tải "${gameTitle}"...`, 'success');
    
    // Update download count (simulate)
    const currentDownloads = parseInt(document.getElementById('total-downloads').textContent) || 0;
    animateValue(document.getElementById('total-downloads'), currentDownloads, currentDownloads + 1, 1000);
}

// ===== Enhanced Search with Voice Recognition =====
function setupVoiceSearch() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'vi-VN';
        
        const voiceBtn = document.getElementById('voice-search-btn');
        if (voiceBtn) {
            voiceBtn.addEventListener('click', () => {
                recognition.start();
                voiceBtn.innerHTML = '🎤 Đang nghe...';
                voiceBtn.style.background = 'linear-gradient(135deg, var(--error), var(--warning))';
            });
            
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                searchInput.value = transcript;
                handleSearch();
                showNotification(`🎤 Đã tìm kiếm: "${transcript}"`, 'success');
            };
            
            recognition.onend = () => {
                voiceBtn.innerHTML = '🎤';
                voiceBtn.style.background = '';
            };
            
            recognition.onerror = () => {
                showNotification('❌ Không thể nhận diện giọng nói', 'error');
                voiceBtn.innerHTML = '🎤';
                voiceBtn.style.background = '';
            };
        }
    }
}

// ===== Keyboard Shortcuts =====
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K for search focus
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
            searchInput.select();
            showNotification('🔍 Tìm kiếm được kích hoạt', 'info');
        }
        
        // Escape to clear search
        if (e.key === 'Escape' && searchInput.value) {
            handleClearSearch();
            showNotification('🧹 Đã xóa tìm kiếm', 'info');
        }
        
        // Arrow keys for navigation
        if (e.key === 'ArrowDown' && e.ctrlKey) {
            e.preventDefault();
            window.scrollBy(0, 300);
        }
        
        if (e.key === 'ArrowUp' && e.ctrlKey) {
            e.preventDefault();
            window.scrollBy(0, -300);
        }
        
        // Home/End for quick navigation
        if (e.key === 'Home' && e.ctrlKey) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        if (e.key === 'End' && e.ctrlKey) {
            e.preventDefault();
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
    });
}

// ===== Enhanced Theme Toggle =====
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const navThemeBtn = document.getElementById('nav-theme-btn');
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.classList.toggle('light-theme', savedTheme === 'light');
    updateThemeIcon(savedTheme);
    
    function toggleTheme() {
        const isLight = document.body.classList.contains('light-theme');
        const newTheme = isLight ? 'dark' : 'light';
        
        document.body.classList.toggle('light-theme');
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        showNotification(`🎨 Đã chuyển sang theme ${newTheme === 'light' ? 'sáng' : 'tối'}`, 'success');
    }
    
    function updateThemeIcon(theme) {
        const icon = theme === 'light' ? '☀️' : '🌙';
        if (themeToggle) themeToggle.innerHTML = `<span class="theme-icon">${icon}</span>`;
        if (navThemeBtn) navThemeBtn.querySelector('.btn-icon').textContent = icon;
    }
    
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    if (navThemeBtn) navThemeBtn.addEventListener('click', toggleTheme);
}

// ===== Initialize All Enhanced Features =====
document.addEventListener('DOMContentLoaded', () => {
    setupVoiceSearch();
    setupKeyboardShortcuts();
    
    // Add welcome message
    setTimeout(() => {
        showNotification('🎮 Chào mừng đến với GAMEDUCVONG! Khám phá thế giới game Việt hóa chất lượng cao.', 'success');
    }, 3000);
    
    // Add Easter egg
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.code);
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }
        
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            showNotification('🎉 Konami Code activated! You found the secret!', 'success');
            document.body.style.filter = 'hue-rotate(180deg)';
            setTimeout(() => {
                document.body.style.filter = '';
            }, 3000);
        }
    });
});

console.log('%c🚀 GAMEDUCVONG Premium Features Loaded!', 'background: linear-gradient(135deg, #f093fb, #f5576c); color: white; font-size: 16px; font-weight: bold; padding: 10px 20px; border-radius: 8px;');
console.log('%c✨ Features: Voice Search, Keyboard Shortcuts, Enhanced Animations, Matrix Rain, Particle System', 'color: #a78bfa; font-size: 12px;');
// ===== Authentication System =====
let currentUser = null;
let isLoggedIn = false;

// ===== Authentication Modal Management =====
function setupAuthModal() {
    const loginBtn = document.getElementById('login-btn');
    const authModalOverlay = document.getElementById('auth-modal-overlay');
    const authModalClose = document.getElementById('auth-modal-close');
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const userMenu = document.getElementById('user-menu');
    const userDropdown = document.getElementById('user-dropdown');
    const logoutBtn = document.getElementById('logout-btn');

    // Show login modal
    loginBtn?.addEventListener('click', () => {
        authModalOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        showLoginForm();
    });

    // Close modal
    authModalClose?.addEventListener('click', closeAuthModal);
    authModalOverlay?.addEventListener('click', (e) => {
        if (e.target === authModalOverlay) {
            closeAuthModal();
        }
    });

    // Switch between login and register
    showRegister?.addEventListener('click', (e) => {
        e.preventDefault();
        showRegisterForm();
    });

    showLogin?.addEventListener('click', (e) => {
        e.preventDefault();
        showLoginForm();
    });

    // Toggle user dropdown
    userMenu?.addEventListener('click', (e) => {
        if (isLoggedIn) {
            e.stopPropagation();
            userDropdown.style.display = userDropdown.style.display === 'none' ? 'block' : 'none';
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        if (userDropdown) {
            userDropdown.style.display = 'none';
        }
    });

    // Logout
    logoutBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });

    function closeAuthModal() {
        authModalOverlay.style.display = 'none';
        document.body.style.overflow = '';
    }

    function showLoginForm() {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    }

    function showRegisterForm() {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    }
}

// ===== Password Strength Checker =====
function setupPasswordStrength() {
    const passwordInput = document.getElementById('register-password');
    const strengthFill = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');

    passwordInput?.addEventListener('input', (e) => {
        const password = e.target.value;
        const strength = calculatePasswordStrength(password);
        
        strengthFill.style.width = `${strength.percentage}%`;
        strengthText.textContent = strength.text;
        strengthText.style.color = strength.color;
    });
}

function calculatePasswordStrength(password) {
    let score = 0;
    let feedback = [];

    if (password.length >= 8) score += 25;
    else feedback.push('ít nhất 8 ký tự');

    if (/[a-z]/.test(password)) score += 25;
    else feedback.push('chữ thường');

    if (/[A-Z]/.test(password)) score += 25;
    else feedback.push('chữ hoa');

    if (/[0-9]/.test(password)) score += 25;
    else feedback.push('số');

    if (/[^A-Za-z0-9]/.test(password)) score += 25;
    else feedback.push('ký tự đặc biệt');

    let text, color;
    if (score < 50) {
        text = `Yếu - Cần: ${feedback.join(', ')}`;
        color = 'var(--error)';
    } else if (score < 75) {
        text = 'Trung bình - Có thể cải thiện';
        color = 'var(--warning)';
    } else if (score < 100) {
        text = 'Mạnh - Tốt';
        color = 'var(--success)';
    } else {
        text = 'Rất mạnh - Xuất sắc!';
        color = 'var(--success)';
    }

    return { percentage: Math.min(score, 100), text, color };
}

// ===== Password Toggle =====
function setupPasswordToggle() {
    const toggleButtons = document.querySelectorAll('.password-toggle');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const input = button.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            button.textContent = type === 'password' ? '👁️' : '🙈';
        });
    });
}

// ===== Form Submission =====
function setupFormSubmission() {
    const loginForm = document.getElementById('login-form-content');
    const registerForm = document.getElementById('register-form-content');

    loginForm?.addEventListener('submit', handleLogin);
    registerForm?.addEventListener('submit', handleRegister);
}

async function handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me').checked;

    // Show loading state
    const submitBtn = e.target.querySelector('.auth-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="btn-text">🔄 Đang đăng nhập...</span>';
    submitBtn.disabled = true;

    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock successful login
        const userData = {
            id: 1,
            username: username,
            email: `${username}@gameducvong.com`,
            avatar: `https://via.placeholder.com/40x40/6366f1/ffffff?text=${username.charAt(0).toUpperCase()}`,
            level: Math.floor(Math.random() * 100) + 1,
            joinDate: new Date().toISOString(),
            favorites: [],
            downloads: []
        };

        loginSuccess(userData, rememberMe);
        showNotification('🎉 Đăng nhập thành công! Chào mừng bạn trở lại!', 'success');
        
    } catch (error) {
        showNotification('❌ Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!', 'error');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const agreeTerms = document.getElementById('agree-terms').checked;

    // Validation
    if (password !== confirmPassword) {
        showNotification('❌ Mật khẩu xác nhận không khớp!', 'error');
        return;
    }

    if (!agreeTerms) {
        showNotification('❌ Vui lòng đồng ý với điều khoản sử dụng!', 'error');
        return;
    }

    // Show loading state
    const submitBtn = e.target.querySelector('.auth-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="btn-text">🔄 Đang tạo tài khoản...</span>';
    submitBtn.disabled = true;

    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2500));
        
        // Mock successful registration
        const userData = {
            id: Date.now(),
            username: username,
            email: email,
            avatar: `https://via.placeholder.com/40x40/6366f1/ffffff?text=${username.charAt(0).toUpperCase()}`,
            level: 1,
            joinDate: new Date().toISOString(),
            favorites: [],
            downloads: []
        };

        loginSuccess(userData, true);
        showNotification('🎉 Tài khoản đã được tạo thành công! Chào mừng bạn đến với GAMEDUCVONG!', 'success');
        
    } catch (error) {
        showNotification('❌ Tạo tài khoản thất bại. Vui lòng thử lại!', 'error');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

function loginSuccess(userData, remember) {
    currentUser = userData;
    isLoggedIn = true;

    // Update UI
    updateUserInterface();
    
    // Save to localStorage if remember me
    if (remember) {
        localStorage.setItem('gameducvong_user', JSON.stringify(userData));
        localStorage.setItem('gameducvong_remember', 'true');
    } else {
        sessionStorage.setItem('gameducvong_user', JSON.stringify(userData));
    }

    // Close modal
    document.getElementById('auth-modal-overlay').style.display = 'none';
    document.body.style.overflow = '';
}

function logout() {
    currentUser = null;
    isLoggedIn = false;
    
    // Clear storage
    localStorage.removeItem('gameducvong_user');
    localStorage.removeItem('gameducvong_remember');
    sessionStorage.removeItem('gameducvong_user');
    
    // Update UI
    updateUserInterface();
    
    showNotification('👋 Đã đăng xuất thành công. Hẹn gặp lại!', 'info');
}

function updateUserInterface() {
    const loginBtn = document.getElementById('login-btn');
    const userDropdown = document.getElementById('user-dropdown');
    const userName = document.getElementById('user-name');
    const userAvatar = document.getElementById('user-avatar');

    if (isLoggedIn && currentUser) {
        // Hide login button, show user dropdown
        loginBtn.style.display = 'none';
        userDropdown.style.display = 'block';
        
        // Update user info
        userName.textContent = currentUser.username;
        userAvatar.src = currentUser.avatar;
        
        // Update user level
        const userLevel = document.querySelector('.user-level');
        userLevel.textContent = `Level ${currentUser.level}`;
        
    } else {
        // Show login button, hide user dropdown
        loginBtn.style.display = 'flex';
        userDropdown.style.display = 'none';
    }
}

// ===== Check for saved login =====
function checkSavedLogin() {
    const savedUser = localStorage.getItem('gameducvong_user') || sessionStorage.getItem('gameducvong_user');
    const rememberMe = localStorage.getItem('gameducvong_remember') === 'true';
    
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        isLoggedIn = true;
        updateUserInterface();
        
        if (rememberMe) {
            showNotification(`👋 Chào mừng ${currentUser.username} trở lại!`, 'success');
        }
    }
}

// ===== Enhanced Filter System =====
let activeFilters = {
    platform: null,
    language: null,
    engine: null,
    genre: null,
    tags: []
};

function setupEnhancedFilters() {
    // Platform tags
    const platformTags = document.querySelectorAll('.platform-tag');
    platformTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const platform = tag.dataset.platform;
            toggleFilter('platform', platform, tag);
        });
    });

    // Language tags
    const languageTags = document.querySelectorAll('.language-tag');
    languageTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const language = tag.dataset.language;
            toggleFilter('language', language, tag);
        });
    });

    // Engine tags
    const engineTags = document.querySelectorAll('.engine-tag');
    engineTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const engine = tag.dataset.engine;
            toggleFilter('engine', engine, tag);
        });
    });

    // Premium filter tags
    const filterTags = document.querySelectorAll('.filter-tag.premium');
    filterTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const filter = tag.dataset.filter;
            toggleArrayFilter('tags', filter, tag);
        });
    });

    // Traditional select filters
    const genreFilter = document.getElementById('genre-filter');
    const platformFilter = document.getElementById('platform-filter');
    const languageFilter = document.getElementById('language-filter');
    const engineFilter = document.getElementById('engine-filter');

    genreFilter?.addEventListener('change', (e) => {
        activeFilters.genre = e.target.value || null;
        applyFilters();
    });

    platformFilter?.addEventListener('change', (e) => {
        activeFilters.platform = e.target.value || null;
        updateTagState('.platform-tag', e.target.value);
        applyFilters();
    });

    languageFilter?.addEventListener('change', (e) => {
        activeFilters.language = e.target.value || null;
        updateTagState('.language-tag', e.target.value);
        applyFilters();
    });

    engineFilter?.addEventListener('change', (e) => {
        activeFilters.engine = e.target.value || null;
        updateTagState('.engine-tag', e.target.value);
        applyFilters();
    });
}

function toggleFilter(type, value, element) {
    // Remove active class from siblings
    const siblings = element.parentElement.querySelectorAll(`.${element.className.split(' ')[0]}`);
    siblings.forEach(sibling => sibling.classList.remove('active'));

    // Toggle current filter
    if (activeFilters[type] === value) {
        activeFilters[type] = null;
        element.classList.remove('active');
    } else {
        activeFilters[type] = value;
        element.classList.add('active');
    }

    // Update corresponding select
    updateSelectFilter(type, activeFilters[type]);
    applyFilters();
    
    showNotification(`🏷️ ${type === 'platform' ? 'Nền tảng' : type === 'language' ? 'Ngôn ngữ' : 'Engine'}: ${value || 'Tất cả'}`, 'info');
}

function toggleArrayFilter(type, value, element) {
    const index = activeFilters[type].indexOf(value);
    
    if (index > -1) {
        activeFilters[type].splice(index, 1);
        element.classList.remove('active');
    } else {
        activeFilters[type].push(value);
        element.classList.add('active');
    }

    applyFilters();
    showNotification(`🏷️ Filter: ${value}`, 'info');
}

function updateSelectFilter(type, value) {
    const selectMap = {
        platform: 'platform-filter',
        language: 'language-filter',
        engine: 'engine-filter'
    };
    
    const select = document.getElementById(selectMap[type]);
    if (select) {
        select.value = value || '';
    }
}

function updateTagState(selector, value) {
    const tags = document.querySelectorAll(selector);
    tags.forEach(tag => {
        tag.classList.remove('active');
        if (tag.dataset.platform === value || tag.dataset.language === value || tag.dataset.engine === value) {
            tag.classList.add('active');
        }
    });
}

function applyFilters() {
    let filtered = [...allGames];

    // Apply platform filter
    if (activeFilters.platform) {
        filtered = filtered.filter(game => 
            game.platform && game.platform.some(p => 
                p.toLowerCase().includes(activeFilters.platform.toLowerCase())
            )
        );
    }

    // Apply language filter
    if (activeFilters.language) {
        const languageMap = {
            'vietnamese': ['việt', 'vietnam'],
            'english': ['english', 'eng'],
            'japanese': ['japanese', 'japan', 'jp'],
            'korean': ['korean', 'korea', 'kr']
        };
        
        const searchTerms = languageMap[activeFilters.language] || [activeFilters.language];
        filtered = filtered.filter(game => 
            searchTerms.some(term => 
                (game.language || '').toLowerCase().includes(term)
            )
        );
    }

    // Apply engine filter
    if (activeFilters.engine) {
        filtered = filtered.filter(game => 
            (game.engine || '').toLowerCase().includes(activeFilters.engine.toLowerCase())
        );
    }

    // Apply genre filter
    if (activeFilters.genre) {
        filtered = filtered.filter(game => 
            game.genre && game.genre.includes(activeFilters.genre)
        );
    }

    // Apply tag filters
    if (activeFilters.tags.length > 0) {
        filtered = filtered.filter(game => {
            return activeFilters.tags.every(tag => {
                switch (tag) {
                    case 'featured':
                        return game.featured;
                    case 'new':
                        return isNewGame(game);
                    case 'popular':
                        return (game.downloads || 0) > 30000;
                    case 'small':
                        return isSmallGame(game);
                    case 'free':
                        return game.price === 0 || !game.price;
                    case 'multiplayer':
                        return game.tags && game.tags.some(t => t.toLowerCase().includes('multiplayer'));
                    case 'singleplayer':
                        return !game.tags || !game.tags.some(t => t.toLowerCase().includes('multiplayer'));
                    default:
                        return true;
                }
            });
        });
    }

    filteredGames = filtered;
    applySorting();
    renderGames(filteredGames);
    animateCards();

    // Update results count
    updateResultsCount(filteredGames.length);
}

function isNewGame(game) {
    if (!game.releaseDate) return false;
    const releaseDate = new Date(game.releaseDate);
    const now = new Date();
    const diffTime = Math.abs(now - releaseDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 90; // New if released within 90 days
}

function isSmallGame(game) {
    if (!game.size) return false;
    const sizeStr = game.size.toLowerCase();
    if (sizeStr.includes('mb')) {
        const size = parseFloat(sizeStr);
        return size < 1000; // Less than 1GB
    }
    if (sizeStr.includes('gb')) {
        const size = parseFloat(sizeStr);
        return size < 5; // Less than 5GB
    }
    return false;
}

function updateResultsCount(count) {
    const existingCounter = document.querySelector('.results-counter');
    if (existingCounter) {
        existingCounter.remove();
    }

    const counter = document.createElement('div');
    counter.className = 'results-counter';
    counter.style.cssText = `
        text-align: center;
        margin: 20px 0;
        padding: 15px 25px;
        background: rgba(99, 102, 241, 0.1);
        border: 1px solid rgba(99, 102, 241, 0.3);
        border-radius: 20px;
        color: var(--primary-light);
        font-weight: 700;
        font-size: 1.1rem;
        backdrop-filter: blur(10px);
    `;
    counter.innerHTML = `🎮 Tìm thấy <span style="color: var(--primary); font-size: 1.3rem;">${count}</span> game phù hợp`;

    const gameList = document.getElementById('game-list');
    gameList.parentNode.insertBefore(counter, gameList);
}

// ===== Clear All Filters =====
function setupClearFilters() {
    const clearBtn = document.createElement('button');
    clearBtn.className = 'clear-filters-btn';
    clearBtn.innerHTML = '🧹 Xóa tất cả bộ lọc';
    clearBtn.style.cssText = `
        padding: 12px 24px;
        background: linear-gradient(135deg, var(--error), #dc2626);
        border: none;
        border-radius: 15px;
        color: white;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-top: 20px;
    `;
    
    clearBtn.addEventListener('click', clearAllFilters);
    
    const filterContainer = document.querySelector('.filter-tags-container');
    filterContainer.appendChild(clearBtn);
}

function clearAllFilters() {
    // Reset active filters
    activeFilters = {
        platform: null,
        language: null,
        engine: null,
        genre: null,
        tags: []
    };

    // Remove active classes
    document.querySelectorAll('.platform-tag, .language-tag, .engine-tag, .filter-tag.premium').forEach(tag => {
        tag.classList.remove('active');
    });

    // Reset selects
    document.querySelectorAll('.filter-select').forEach(select => {
        select.value = '';
    });

    // Apply filters (which will show all games)
    applyFilters();
    
    showNotification('🧹 Đã xóa tất cả bộ lọc', 'success');
}

// ===== Initialize All Authentication & Filter Features =====
document.addEventListener('DOMContentLoaded', () => {
    setupAuthModal();
    setupPasswordStrength();
    setupPasswordToggle();
    setupFormSubmission();
    setupEnhancedFilters();
    setupClearFilters();
    checkSavedLogin();
    
    // Add some demo data to games for testing filters
    setTimeout(() => {
        if (allGames.length > 0) {
            // Add engine and enhanced platform data to existing games
            allGames.forEach((game, index) => {
                if (!game.engine) {
                    const engines = ['Unity', 'Unreal', 'Godot', 'GameMaker', 'Custom'];
                    game.engine = engines[index % engines.length];
                }
                
                // Enhance platform data
                if (game.platform && !Array.isArray(game.platform)) {
                    game.platform = [game.platform];
                }
                
                // Add some mobile games
                if (index % 5 === 0) {
                    game.platform = game.platform || [];
                    game.platform.push('Android', 'iOS');
                }
            });
        }
    }, 1000);
});

console.log('%c🔐 Authentication System Loaded!', 'background: linear-gradient(135deg, #10b981, #059669); color: white; font-size: 14px; font-weight: bold; padding: 8px 16px; border-radius: 6px;');
console.log('%c🏷️ Enhanced Filter System Loaded!', 'background: linear-gradient(135deg, #f59e0b, #d97706); color: white; font-size: 14px; font-weight: bold; padding: 8px 16px; border-radius: 6px;');