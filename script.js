// ===== Global State Management =====
let allGames = [];
let filteredGames = [];
let currentView = 'grid';

// ===== DOM Elements =====
const gameList = document.getElementById('game-list');
const gameCount = document.getElementById('game-count');
const totalRating = document.getElementById('total-rating');
const searchInput = document.getElementById('search-input');
const clearSearch = document.getElementById('clear-search');
const sortSelect = document.getElementById('sort-select');
const viewButtons = document.querySelectorAll('.view-btn');
const scrollTopBtn = document.getElementById('scroll-top');
const loadingState = document.getElementById('loading-state');
const emptyState = document.getElementById('empty-state');

// ===== Initialize App =====
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    setupScrollButton();
    addEnhancedAnimations();
});

// ===== Fetch and Load Games =====
async function initializeApp() {
    try {
        showLoading();
        const response = await fetch('games.json');
        
        if (!response.ok) {
            throw new Error('Failed to load games data');
        }
        
        allGames = await response.json();
        filteredGames = [...allGames];
        
        hideLoading();
        updateStats();
        renderGames(filteredGames);
        animateCards();
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

// ===== View Toggle =====
function toggleView(view) {
    currentView = view;
    
    viewButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.view === view) {
            btn.classList.add('active');
        }
    });
    
    if (view === 'list') {
        gameList.classList.add('list-view');
    } else {
        gameList.classList.remove('list-view');
    }
    
    // Re-animate cards on view change
    animateCards();
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
        
        .game-card {
            opacity: 0;
            transform: translateY(30px);
        }
        
        /* Smooth transitions for all interactive elements */
        a, button, .tag, .game-card {
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        /* Enhanced loading spinner */
        .loading-spinner {
            position: relative;
        }
        
        .loading-spinner::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 50px;
            height: 50px;
            margin: -25px 0 0 -25px;
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
    `;
    document.head.appendChild(style);
}

// ===== Initialize Performance Monitoring =====
console.log('%c🎮 GAMEDUCVONG Website Loaded Successfully! ', 'background: linear-gradient(135deg, #667eea, #764ba2); color: white; font-size: 16px; font-weight: bold; padding: 10px 20px; border-radius: 8px;');
console.log('%cDeveloped with ❤️ for gaming community', 'color: #94a3b8; font-size: 12px;');