// ===== Global Variables ===== 
let allGames = [];
let filteredGames = [];
let currentPlatform = 'pc';
let currentTheme = 'dark';
let currentView = 'grid';
let isLoading = false;
let searchTimeout = null;

// ===== DOM Elements =====
const platformModal = document.getElementById('platform-modal');
const loadingScreen = document.getElementById('loading-screen');
const navbar = document.getElementById('navbar');
const navProgress = document.getElementById('nav-progress');
const searchInput = document.getElementById('search-input');
const clearSearch = document.getElementById('clear-search');
const voiceSearch = document.getElementById('voice-search');
const gamesGrid = document.getElementById('games-grid');
const loadingGames = document.getElementById('loading-games');
const emptyGames = document.getElementById('empty-games');
const scrollTop = document.getElementById('scroll-top');
const notifications = document.getElementById('notifications');
const searchModal = document.getElementById('search-modal');
const modalSearchInput = document.getElementById('modal-search-input');
const searchResults = document.getElementById('search-results');

// ===== Initialize App =====
document.addEventListener('DOMContentLoaded', () => {
    initializePlatformDetection();
    setupEventListeners();
    loadGames();
    setupScrollEffects();
    setupThemeToggle();
    setupSearch();
    setupFilters();
    setupNotifications();
    
    // Hide loading screen after initialization
    setTimeout(() => {
        hideLoadingScreen();
    }, 2000);
});

// ===== Platform Detection & Selection =====
function initializePlatformDetection() {
    const savedPlatform = localStorage.getItem('gameducvong_platform');
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (savedPlatform) {
        setPlatform(savedPlatform);
        platformModal.style.display = 'none';
    } else {
        // Auto-detect but still show modal for confirmation
        const detectedPlatform = isMobile ? 'mobile' : 'pc';
        showPlatformModal();
        
        // Pre-select detected platform
        const detectedOption = document.querySelector(`[data-platform="${detectedPlatform}"]`);
        if (detectedOption) {
            detectedOption.style.borderColor = 'var(--primary)';
            detectedOption.style.transform = 'translateY(-2px)';
        }
    }
}

function showPlatformModal() {
    platformModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Add click handlers for platform options
    document.querySelectorAll('.platform-option').forEach(option => {
        option.addEventListener('click', () => {
            const platform = option.dataset.platform;
            setPlatform(platform);
            localStorage.setItem('gameducvong_platform', platform);
            hidePlatformModal();
            showNotification(`🎮 Đã chuyển sang chế độ ${platform === 'pc' ? 'PC' : 'Mobile'}`, 'success');
        });
    });
}

function hidePlatformModal() {
    platformModal.style.display = 'none';
    document.body.style.overflow = '';
}

function setPlatform(platform) {
    currentPlatform = platform;
    document.body.className = platform === 'mobile' ? 'mobile-mode' : '';
    
    // Update platform indicator
    const platformIndicator = document.getElementById('current-platform');
    if (platformIndicator) {
        platformIndicator.textContent = platform === 'pc' ? 'PC' : 'Mobile';
    }
    
    // Update platform button icon
    const platformIcon = document.querySelector('.platform-icon');
    if (platformIcon) {
        platformIcon.textContent = platform === 'pc' ? '🖥️' : '📱';
    }
    
    // Apply platform-specific optimizations
    if (platform === 'mobile') {
        // Disable heavy animations and effects
        document.documentElement.style.setProperty('--transition', 'all 0.2s ease');
        document.documentElement.style.setProperty('--transition-slow', 'all 0.3s ease');
        
        // Reduce particle count
        const particles = document.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            if (index > 2) particle.style.display = 'none';
        });
    } else {
        // Enable full effects for PC
        document.documentElement.style.setProperty('--transition', 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)');
        document.documentElement.style.setProperty('--transition-slow', 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)');
    }
}

// ===== Loading Screen =====
function hideLoadingScreen() {
    loadingScreen.classList.add('hidden');
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 500);
}

// ===== Event Listeners =====
function setupEventListeners() {
    // Navigation
    document.getElementById('search-btn')?.addEventListener('click', toggleSearchModal);
    document.getElementById('theme-btn')?.addEventListener('click', toggleTheme);
    document.getElementById('platform-btn')?.addEventListener('click', showPlatformModal);
    document.getElementById('menu-btn')?.addEventListener('click', toggleMobileMenu);
    
    // Search
    searchInput?.addEventListener('input', handleSearch);
    clearSearch?.addEventListener('click', clearSearchInput);
    voiceSearch?.addEventListener('click', startVoiceSearch);
    
    // Search Modal
    document.getElementById('close-search-modal')?.addEventListener('click', hideSearchModal);
    modalSearchInput?.addEventListener('input', handleModalSearch);
    
    // Suggestion buttons
    document.querySelectorAll('.suggestion-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const query = btn.textContent;
            searchInput.value = query;
            modalSearchInput.value = query;
            handleSearch();
            hideSearchModal();
        });
    });
    
    // Filter tags
    document.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('click', () => {
            document.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            applyFilters();
        });
    });
    
    // View toggle
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentView = btn.dataset.view;
            updateGameView();
        });
    });
    
    // Scroll to top
    scrollTop?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Close modals on outside click
    platformModal?.addEventListener('click', (e) => {
        if (e.target === platformModal) hidePlatformModal();
    });
    
    searchModal?.addEventListener('click', (e) => {
        if (e.target === searchModal) hideSearchModal();
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            toggleSearchModal();
        }
        if (e.key === 'Escape') {
            hideSearchModal();
            hidePlatformModal();
        }
    });
}

// ===== Load Games Data =====
async function loadGames() {
    try {
        showLoadingGames();
        
        // Simulate loading delay for better UX
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const response = await fetch('game.json');
        if (!response.ok) throw new Error('Failed to load games');
        
        allGames = await response.json();
        filteredGames = [...allGames];
        
        hideLoadingGames();
        renderGames();
        updateStats();
        renderFeaturedGames();
        
        showNotification('🎮 Đã tải thành công danh sách games!', 'success');
        
    } catch (error) {
        console.error('Error loading games:', error);
        hideLoadingGames();
        showError('Không thể tải danh sách games. Vui lòng thử lại sau.');
        showNotification('❌ Lỗi tải dữ liệu games', 'error');
    }
}

function showLoadingGames() {
    loadingGames.style.display = 'block';
    gamesGrid.style.display = 'none';
    emptyGames.style.display = 'none';
}

function hideLoadingGames() {
    loadingGames.style.display = 'none';
    gamesGrid.style.display = 'grid';
}

function showEmptyGames() {
    emptyGames.style.display = 'block';
    gamesGrid.style.display = 'none';
}

function showError(message) {
    gamesGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
            <div style="font-size: 3rem; margin-bottom: 20px;">😔</div>
            <h3 style="color: var(--text-secondary); margin-bottom: 15px;">Đã xảy ra lỗi</h3>
            <p style="color: var(--text-muted);">${message}</p>
            <button onclick="loadGames()" style="margin-top: 20px; padding: 10px 20px; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer;">
                🔄 Thử lại
            </button>
        </div>
    `;
    gamesGrid.style.display = 'grid';
}

// ===== Render Games =====
function renderGames() {
    if (filteredGames.length === 0) {
        showEmptyGames();
        return;
    }
    
    hideLoadingGames();
    emptyGames.style.display = 'none';
    
    gamesGrid.innerHTML = '';
    
    filteredGames.forEach((game, index) => {
        const gameCard = createGameCard(game, index);
        gamesGrid.appendChild(gameCard);
    });
    
    // Add stagger animation
    const cards = gamesGrid.querySelectorAll('.game-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('animate-fade-in');
    });
}

function createGameCard(game, index) {
    const card = document.createElement('div');
    card.className = 'game-card';
    
    // Generate genre tags
    const genreTags = game.genre 
        ? game.genre.slice(0, 3).map(g => `<span class="game-tag">${g}</span>`).join('')
        : '';
    
    // Platform display
    const platforms = game.platform 
        ? game.platform.slice(0, 3).join(', ')
        : 'PC';
    
    // Rating display
    const rating = game.rating 
        ? `⭐ ${game.rating.toFixed(1)}`
        : 'N/A';
    
    // Featured badge
    const featuredBadge = game.featured 
        ? '<div class="game-badge">Nổi Bật</div>' 
        : '';
    
    // Alternative download links
    const altLinks = game.alternativeLinks && game.alternativeLinks.length > 0
        ? `
            <div style="margin-top: 15px; display: flex; flex-wrap: wrap; gap: 8px;">
                ${game.alternativeLinks.map(link => `
                    <a href="${link.url}" target="_blank" rel="noopener" 
                       style="display: inline-block; padding: 6px 12px; 
                              background: rgba(99, 102, 241, 0.1); color: var(--primary); 
                              text-decoration: none; border-radius: 12px; font-size: 0.8rem;
                              border: 1px solid rgba(99, 102, 241, 0.3); font-weight: 600;
                              transition: var(--transition);"
                       onmouseover="this.style.background='rgba(99, 102, 241, 0.2)'; this.style.transform='translateY(-1px)'"
                       onmouseout="this.style.background='rgba(99, 102, 241, 0.1)'; this.style.transform='translateY(0)'">
                        ${link.name}
                    </a>
                `).join('')}
            </div>
        `
        : '';
    
    card.innerHTML = `
        <div class="game-image">
            <img src="${game.image}" alt="${game.title}" loading="lazy" 
                 onerror="this.src='https://via.placeholder.com/400x200/1a1f35/64748b?text=${encodeURIComponent(game.title)}'">
            ${featuredBadge}
        </div>
        <div class="game-content">
            <h3 class="game-title">${game.title}</h3>
            
            <div class="game-meta">
                <span class="game-rating">${rating}</span>
                <span class="game-size">${game.size || 'N/A'}</span>
            </div>
            
            <p class="game-description">${game.description}</p>
            
            ${game.genre ? `<div class="game-tags">${genreTags}</div>` : ''}
            
            <div class="game-info">
                <span class="game-platform">📱 ${platforms}</span>
                <span class="game-language">🇻🇳 ${game.language || 'Tiếng Việt'}</span>
            </div>
            
            <a href="${game.download}" target="_blank" rel="noopener" 
               class="download-btn" onclick="trackDownload('${game.id}', '${game.title}')">
                ⬇️ Tải Game Ngay
            </a>
            
            ${altLinks}
            
            ${game.trailer ? `
                <a href="${game.trailer}" target="_blank" rel="noopener"
                   style="display: block; margin-top: 10px; padding: 10px 16px; 
                          background: rgba(236, 72, 153, 0.1); color: var(--accent); 
                          text-decoration: none; border-radius: 8px; font-weight: 600;
                          border: 1px solid rgba(236, 72, 153, 0.3); text-align: center;
                          transition: var(--transition); font-size: 0.9rem;"
                   onmouseover="this.style.background='rgba(236, 72, 153, 0.2)'; this.style.transform='translateY(-2px)'"
                   onmouseout="this.style.background='rgba(236, 72, 153, 0.1)'; this.style.transform='translateY(0)'">
                    🎬 Xem Trailer
                </a>
            ` : ''}
        </div>
    `;
    
    return card;
}

function updateGameView() {
    gamesGrid.className = `games-grid ${currentView}-view`;
}

// ===== Search Functionality =====
function setupSearch() {
    // Real-time search with debouncing
    searchInput?.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim();
        
        if (query.length > 0) {
            clearSearch.classList.add('show');
        } else {
            clearSearch.classList.remove('show');
        }
        
        searchTimeout = setTimeout(() => {
            performSearch(query);
        }, 300);
    });
}

function handleSearch() {
    const query = searchInput.value.trim();
    performSearch(query);
}

function performSearch(query) {
    if (!query) {
        filteredGames = [...allGames];
    } else {
        filteredGames = allGames.filter(game => {
            const searchableText = [
                game.title,
                game.description,
                ...(game.genre || []),
                ...(game.tags || []),
                game.developer || '',
                game.platform?.join(' ') || ''
            ].join(' ').toLowerCase();
            
            return searchableText.includes(query.toLowerCase());
        });
    }
    
    applyFilters();
    renderGames();
    
    if (query && filteredGames.length > 0) {
        showNotification(`🔍 Tìm thấy ${filteredGames.length} game cho "${query}"`, 'info');
    }
}

function clearSearchInput() {
    searchInput.value = '';
    modalSearchInput.value = '';
    clearSearch.classList.remove('show');
    performSearch('');
}

// ===== Voice Search =====
function startVoiceSearch() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        showNotification('❌ Trình duyệt không hỗ trợ nhận diện giọng nói', 'error');
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'vi-VN';

    const originalText = voiceSearch.textContent;
    voiceSearch.textContent = '🎤';
    voiceSearch.style.background = 'linear-gradient(135deg, var(--error), var(--warning))';
    voiceSearch.style.animation = 'pulse 1s infinite';

    recognition.start();

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        searchInput.value = transcript;
        modalSearchInput.value = transcript;
        performSearch(transcript);
        showNotification(`🎤 Đã nhận diện: "${transcript}"`, 'success');
    };

    recognition.onend = () => {
        voiceSearch.textContent = originalText;
        voiceSearch.style.background = '';
        voiceSearch.style.animation = '';
    };

    recognition.onerror = (event) => {
        showNotification('❌ Không thể nhận diện giọng nói. Vui lòng thử lại!', 'error');
        voiceSearch.textContent = originalText;
        voiceSearch.style.background = '';
        voiceSearch.style.animation = '';
    };
}

// ===== Search Modal =====
function toggleSearchModal() {
    if (searchModal.classList.contains('show')) {
        hideSearchModal();
    } else {
        showSearchModal();
    }
}

function showSearchModal() {
    searchModal.classList.add('show');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
        modalSearchInput.focus();
    }, 100);
}

function hideSearchModal() {
    searchModal.classList.remove('show');
    document.body.style.overflow = '';
}

function handleModalSearch() {
    const query = modalSearchInput.value.trim();
    if (query.length > 2) {
        const results = allGames.filter(game => {
            const searchableText = [
                game.title,
                game.description,
                ...(game.genre || [])
            ].join(' ').toLowerCase();
            
            return searchableText.includes(query.toLowerCase());
        });
        
        displaySearchResults(results, query);
    } else {
        searchResults.innerHTML = '';
    }
}

function displaySearchResults(results, query) {
    if (results.length === 0) {
        searchResults.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
                <div style="font-size: 2rem; margin-bottom: 10px;">😔</div>
                <p>Không tìm thấy game nào cho "${query}"</p>
            </div>
        `;
        return;
    }

    const resultsHTML = results.slice(0, 5).map(game => `
        <div style="display: flex; gap: 15px; padding: 15px; 
             background: var(--bg-glass); border: 1px solid var(--border); 
             border-radius: 12px; cursor: pointer; transition: var(--transition);
             margin-bottom: 10px;"
             onclick="selectSearchResult('${game.title}')">
            <img src="${game.image}" alt="${game.title}" 
                 style="width: 60px; height: 40px; object-fit: cover; border-radius: 8px;"
                 onerror="this.src='https://via.placeholder.com/60x40/1a1f35/64748b?text=Game'">
            <div style="flex: 1;">
                <h5 style="color: var(--text-primary); margin-bottom: 5px;">${game.title}</h5>
                <p style="color: var(--text-muted); font-size: 0.85rem; line-height: 1.4;">
                    ${game.description.substring(0, 80)}...
                </p>
                <div style="margin-top: 8px;">
                    ${(game.genre || []).slice(0, 2).map(g => 
                        `<span style="background: rgba(99, 102, 241, 0.2); color: var(--primary); 
                         padding: 2px 8px; border-radius: 10px; font-size: 0.75rem; margin-right: 5px;">${g}</span>`
                    ).join('')}
                </div>
            </div>
        </div>
    `).join('');

    searchResults.innerHTML = resultsHTML;
}

function selectSearchResult(gameTitle) {
    searchInput.value = gameTitle;
    modalSearchInput.value = gameTitle;
    performSearch(gameTitle);
    hideSearchModal();
    showNotification(`🎮 Đã chọn: "${gameTitle}"`, 'success');
}

// ===== Filters =====
function setupFilters() {
    // Sort filter
    document.getElementById('sort-filter')?.addEventListener('change', applyFilters);
    document.getElementById('genre-filter')?.addEventListener('change', applyFilters);
    document.getElementById('platform-filter')?.addEventListener('change', applyFilters);
}

function applyFilters() {
    let filtered = [...filteredGames];
    
    // Apply active tag filter
    const activeTag = document.querySelector('.tag.active');
    if (activeTag && activeTag.dataset.filter !== 'all') {
        const filter = activeTag.dataset.filter;
        filtered = filtered.filter(game => {
            switch (filter) {
                case 'featured':
                    return game.featured;
                case 'new':
                    const releaseDate = new Date(game.releaseDate);
                    const monthsAgo = new Date();
                    monthsAgo.setMonth(monthsAgo.getMonth() - 3);
                    return releaseDate > monthsAgo;
                case 'popular':
                    return (game.downloads || 0) > 50000;
                case 'free':
                    return game.price === 0;
                default:
                    return true;
            }
        });
    }
    
    // Apply genre filter
    const genreFilter = document.getElementById('genre-filter')?.value;
    if (genreFilter) {
        filtered = filtered.filter(game => 
            game.genre && game.genre.includes(genreFilter)
        );
    }
    
    // Apply platform filter
    const platformFilter = document.getElementById('platform-filter')?.value;
    if (platformFilter) {
        filtered = filtered.filter(game => 
            game.platform && game.platform.includes(platformFilter)
        );
    }
    
    // Apply sorting
    const sortFilter = document.getElementById('sort-filter')?.value || 'name';
    filtered.sort((a, b) => {
        switch (sortFilter) {
            case 'name':
                return a.title.localeCompare(b.title, 'vi');
            case 'rating':
                return (b.rating || 0) - (a.rating || 0);
            case 'downloads':
                return (b.downloads || 0) - (a.downloads || 0);
            case 'newest':
                return new Date(b.releaseDate || 0) - new Date(a.releaseDate || 0);
            default:
                return 0;
        }
    });
    
    filteredGames = filtered;
    renderGames();
}

// ===== Featured Games =====
function renderFeaturedGames() {
    const featuredGrid = document.getElementById('featured-grid');
    if (!featuredGrid) return;
    
    const featuredGames = allGames.filter(game => game.featured).slice(0, 6);
    
    featuredGrid.innerHTML = featuredGames.map(game => `
        <div class="game-card">
            <div class="game-image">
                <img src="${game.image}" alt="${game.title}" loading="lazy">
                <div class="game-badge">Nổi Bật</div>
            </div>
            <div class="game-content">
                <h3 class="game-title">${game.title}</h3>
                <div class="game-meta">
                    <span class="game-rating">⭐ ${game.rating?.toFixed(1) || 'N/A'}</span>
                    <span class="game-size">${game.size || 'N/A'}</span>
                </div>
                <p class="game-description">${game.description}</p>
                <a href="${game.download}" target="_blank" class="download-btn">
                    ⬇️ Tải Game Ngay
                </a>
            </div>
        </div>
    `).join('');
}

// ===== Statistics =====
function updateStats() {
    // Update game count
    const gameCountElements = document.querySelectorAll('#total-games, #quick-games');
    gameCountElements.forEach(el => {
        if (el) animateValue(el, 0, allGames.length, 1000);
    });
    
    // Update average rating
    const avgRating = allGames.length > 0
        ? (allGames.reduce((sum, game) => sum + (game.rating || 0), 0) / allGames.length)
        : 0;
    
    // Update total downloads
    const totalDownloads = allGames.reduce((sum, game) => sum + (game.downloads || 0), 0);
    const downloadElements = document.querySelectorAll('#total-downloads');
    downloadElements.forEach(el => {
        if (el) el.textContent = formatNumber(totalDownloads);
    });
}

function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + (end > 20 ? '+' : '');
    }, 16);
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M+';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K+';
    }
    return num.toString();
}

// ===== Scroll Effects =====
function setupScrollEffects() {
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Update navigation
        if (currentScrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update progress bar
        const scrollProgress = (currentScrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        navProgress.style.transform = `scaleX(${scrollProgress / 100})`;
        
        // Show/hide scroll to top button
        if (currentScrollY > 500) {
            scrollTop.classList.add('show');
        } else {
            scrollTop.classList.remove('show');
        }
        
        // Update active navigation link
        updateActiveNavLink();
        
        lastScrollY = currentScrollY;
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.id;
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// ===== Theme Toggle =====
function setupThemeToggle() {
    const themeBtn = document.getElementById('theme-btn');
    const savedTheme = localStorage.getItem('gameducvong_theme') || 'dark';
    
    setTheme(savedTheme);
    
    themeBtn?.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('gameducvong_theme', newTheme);
}

function setTheme(theme) {
    currentTheme = theme;
    document.body.setAttribute('data-theme', theme);
    
    const themeIcon = document.querySelector('#theme-btn .btn-icon');
    if (themeIcon) {
        themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
    
    // Update CSS variables for light theme
    if (theme === 'light') {
        document.documentElement.style.setProperty('--bg-dark', '#ffffff');
        document.documentElement.style.setProperty('--bg-card', '#f8fafc');
        document.documentElement.style.setProperty('--text-primary', '#1e293b');
        document.documentElement.style.setProperty('--text-secondary', '#475569');
        document.documentElement.style.setProperty('--text-muted', '#64748b');
        document.documentElement.style.setProperty('--border', '#e2e8f0');
    } else {
        // Reset to dark theme variables
        document.documentElement.style.setProperty('--bg-dark', '#0a0e1a');
        document.documentElement.style.setProperty('--bg-card', '#1a1f35');
        document.documentElement.style.setProperty('--text-primary', '#f8fafc');
        document.documentElement.style.setProperty('--text-secondary', '#cbd5e1');
        document.documentElement.style.setProperty('--text-muted', '#94a3b8');
        document.documentElement.style.setProperty('--border', '#2d3548');
    }
}

// ===== Mobile Menu =====
function toggleMobileMenu() {
    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.toggle('show');
}

// ===== Notifications =====
function setupNotifications() {
    // Auto-hide notifications after 5 seconds
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.classList && node.classList.contains('notification')) {
                        setTimeout(() => {
                            hideNotification(node);
                        }, 5000);
                    }
                });
            }
        });
    });
    
    observer.observe(notifications, { childList: true });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add click to dismiss
    notification.addEventListener('click', () => {
        hideNotification(notification);
    });
    
    notifications.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
}

function hideNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// ===== Download Tracking =====
function trackDownload(gameId, gameTitle) {
    // Track download analytics
    console.log(`Download tracked: ${gameTitle} (${gameId})`);
    
    // Update download count in localStorage
    const downloads = JSON.parse(localStorage.getItem('gameducvong_downloads') || '{}');
    downloads[gameId] = (downloads[gameId] || 0) + 1;
    localStorage.setItem('gameducvong_downloads', JSON.stringify(downloads));
    
    showNotification(`🎮 Đang tải "${gameTitle}"...`, 'success');
    
    // You can add Google Analytics or other tracking here
    if (typeof gtag !== 'undefined') {
        gtag('event', 'download', {
            'event_category': 'Games',
            'event_label': gameTitle,
            'value': 1
        });
    }
}

// ===== Utility Functions =====
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// ===== Performance Optimizations =====
// Lazy load images
function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Preload critical resources
function preloadCriticalResources() {
    const criticalImages = [
        'images/game1.jpg',
        'images/game1-thumb.jpg'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// ===== PWA Support =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// ===== Error Handling =====
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    showNotification('❌ Đã xảy ra lỗi. Vui lòng thử lại!', 'error');
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    showNotification('❌ Lỗi kết nối. Vui lòng kiểm tra mạng!', 'error');
});

// ===== Analytics =====
function initAnalytics() {
    // Track page view
    if (typeof gtag !== 'undefined') {
        gtag('config', 'GA_MEASUREMENT_ID', {
            page_title: 'GAMEDUCVONG - Game Việt Hóa',
            page_location: window.location.href
        });
    }
    
    // Track platform selection
    document.addEventListener('platform-selected', (e) => {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'platform_select', {
                'event_category': 'User Preference',
                'event_label': e.detail.platform,
                'value': 1
            });
        }
    });
}

// Initialize analytics
initAnalytics();

// ===== Export for testing =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        setPlatform,
        performSearch,
        applyFilters,
        showNotification,
        trackDownload
    };
}