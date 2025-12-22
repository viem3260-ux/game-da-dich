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
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
            <div style="font-size: 4rem; margin-bottom: 20px;">⚠️</div>
            <h3 style="color: var(--text-secondary); margin-bottom: 10px;">Đã xảy ra lỗi</h3>
            <p style="color: var(--text-muted);">${message}</p>
        </div>
    `;
    gameList.style.display = 'grid';
}

// ===== Update Statistics =====
function updateStats() {
    gameCount.textContent = allGames.length;
    
    const avgRating = allGames.length > 0
        ? (allGames.reduce((sum, game) => sum + (game.rating || 0), 0) / allGames.length).toFixed(1)
        : '0.0';
    
    totalRating.textContent = avgRating;
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

// ===== Create Game Card =====
function createGameCard(game, index) {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    // Generate genre badges
    const genreTags = game.genre 
        ? game.genre.slice(0, 3).map(g => `<span class="tag">${g}</span>`).join('')
        : '';
    
    // Generate platform icons
    const platformIcons = {
        'PC': '🖥️',
        'PlayStation 5': '🎮',
        'PlayStation 4': '🎮',
        'Xbox Series X': '🎮',
        'Xbox': '🎮',
        'Nintendo Switch': '🎮',
        'Mobile': '📱'
    };
    
    const platforms = game.platform 
        ? game.platform.slice(0, 3).map(p => platformIcons[p] || '🎮').join(' ')
        : '🎮';
    
    // Rating stars
    const stars = generateStars(game.rating || 0);
    
    // Featured badge
    const featuredBadge = game.featured 
        ? '<div class="game-badge">⭐ Nổi bật</div>' 
        : '';
    
    // Alternative download links
    const altLinks = game.alternativeLinks && game.alternativeLinks.length > 0
        ? `
            <div class="alt-links" style="margin-top: 10px;">
                ${game.alternativeLinks.map(link => `
                    <a href="${link.url}" target="_blank" rel="noopener" 
                       style="display: inline-block; margin-right: 8px; padding: 6px 12px; 
                              background: rgba(99, 102, 241, 0.1); color: var(--primary); 
                              text-decoration: none; border-radius: 6px; font-size: 0.85rem;
                              border: 1px solid rgba(99, 102, 241, 0.3);">
                        📦 ${link.name}
                    </a>
                `).join('')}
            </div>
        `
        : '';
    
    card.innerHTML = `
        <div class="game-card-image">
            <img src="${game.image}" alt="${game.title}" loading="lazy" 
                 onerror="this.src='https://via.placeholder.com/400x200/1e293b/64748b?text=No+Image'">
            ${featuredBadge}
        </div>
        <div class="content">
            <h3>${game.title}</h3>
            
            <div class="game-meta">
                <div class="meta-item">
                    <span class="meta-icon">${stars}</span>
                    <span>${game.rating || 'N/A'}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-icon">💾</span>
                    <span>${game.size || 'N/A'}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-icon">⬇️</span>
                    <span>${formatDownloads(game.downloads || 0)}</span>
                </div>
            </div>
            
            <p>${game.description}</p>
            
            ${game.genre ? `
                <div class="game-tags">
                    ${genreTags}
                </div>
            ` : ''}
            
            <div style="margin-top: 15px;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px; 
                            color: var(--text-muted); font-size: 0.9rem;">
                    <span>🎮 ${platforms}</span>
                    <span>|</span>
                    <span>🌐 ${game.language || 'Tiếng Việt'}</span>
                </div>
                
                <a href="${game.download}" target="_blank" rel="noopener" 
                   class="download-btn" onclick="trackDownload('${game.id}', '${game.title}')">
                    📥 Tải game
                </a>
                
                ${altLinks}
                
                ${game.trailer ? `
                    <a href="${game.trailer}" target="_blank" rel="noopener"
                       style="display: inline-block; margin-top: 10px; padding: 10px 20px; 
                              background: rgba(236, 72, 153, 0.1); color: var(--accent); 
                              text-decoration: none; border-radius: 8px; font-weight: 600;
                              border: 1px solid rgba(236, 72, 153, 0.3);">
                        🎬 Xem trailer
                    </a>
                ` : ''}
            </div>
        </div>
    `;
    
    // Add click event for card details (optional)
    card.addEventListener('click', (e) => {
        // Prevent triggering when clicking links
        if (e.target.tagName !== 'A') {
            showGameDetails(game);
        }
    });
    
    return card;
}

// ===== Generate Star Rating =====
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '⭐';
    }
    
    if (hasHalfStar && fullStars < 5) {
        stars += '✨';
    }
    
    return stars || '☆';
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
}

// ===== Sorting Functionality =====
function applySorting() {
    const sortValue = sortSelect.value;
    
    switch (sortValue) {
        case 'name':
            filteredGames.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'name-desc':
            filteredGames.sort((a, b) => b.title.localeCompare(a.title));
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
}

// ===== Animate Cards on Load =====
function animateCards() {
    const cards = document.querySelectorAll('.game-card');
    cards.forEach((card, index) => {
        card.style.animation = 'none';
        setTimeout(() => {
            card.style.animation = `fadeIn 0.5s ease forwards ${index * 0.05}s`;
        }, 10);
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
    });
    
    // View toggle buttons
    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            toggleView(btn.dataset.view);
        });
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K for search focus
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
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
    // You can add analytics tracking here (Google Analytics, etc.)
    
    // Optional: Show download notification
    showNotification(`Đang tải ${gameTitle}...`);
}

// ===== Show Notification =====
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--primary);
        color: white;
        padding: 15px 30px;
        border-radius: 50px;
        box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
        z-index: 10000;
        animation: slideUp 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== Show Game Details Modal (Optional Enhancement) =====
function showGameDetails(game) {
    // You can implement a modal here to show full game details
    console.log('Show details for:', game.title);
    // Modal implementation can be added here
}

// ===== Additional CSS for animations =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from {
            transform: translateX(-50%) translateY(100px);
            opacity: 0;
        }
        to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes slideDown {
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
        animation: fadeIn 0.5s ease forwards;
        opacity: 0;
    }
`;
document.head.appendChild(style);