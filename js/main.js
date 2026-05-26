// Starry Canvas Animation
function initStarfield() {
    const canvas = document.getElementById('star-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let stars = [];
    const starCount = 80;
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Create stars
    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 1.5 + 0.2,
            speedX: (Math.random() - 0.5) * 0.15,
            speedY: (Math.random() - 0.5) * 0.15,
            opacity: Math.random()
        });
    }
    
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffffff';
        
        stars.forEach(star => {
            ctx.globalAlpha = star.opacity;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Move star
            star.x += star.speedX;
            star.y += star.speedY;
            
            // Boundary wrap
            if (star.x < 0) star.x = canvas.width;
            if (star.x > canvas.width) star.x = 0;
            if (star.y < 0) star.y = canvas.height;
            if (star.y > canvas.height) star.y = 0;
            
            // Pulse opacity
            star.opacity += (Math.random() - 0.5) * 0.05;
            if (star.opacity < 0.1) star.opacity = 0.1;
            if (star.opacity > 0.9) star.opacity = 0.9;
        });
        
        requestAnimationFrame(draw);
    }
    
    draw();
}

// Fallback Personal Data in case info.json fails to fetch
const fallbackData = {
    "name": "毛希嘉",
    "birthday": "2006.11.16",
    "education": {
        "degree": "本科",
        "university": "长春理工大学",
        "major": "光电信息科学与工程（工）（中外合作办学）",
        "enrollment": "2024年9月"
    },
    "origin": "河南省濮阳市",
    "english": {
        "cet4": "已过",
        "cet6": "465分"
    },
    "skills": [
        "熟练掌握C语言",
        "自学MATLAB和Zemax",
        "熟练运用Gemini、ChatGPT、antigravity等AI工具"
    ],
    "contact": {
        "email": "mm2672653902@gmail.com",
        "github": "https://github.com/mm2672653902-star",
        "blog": "https://blog.maoxijia.top"
    },
    "slogan": "Action speaks louder than words.",
    "sub_slogan": "光电信息科学 & AI技术的交融探索",
    "backgrounds": [
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80",
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80",
        "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1920&q=80",
        "https://images.unsplash.com/photo-1486873249359-2731bd6dafc7?auto=format&fit=crop&w=1920&q=80",
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1920&q=80"
    ]
};

// Render Personal Information
function renderProfile(data) {
    // Basic texts
    document.getElementById('name-display').innerText = data.name;
    document.getElementById('birthday-display').innerText = data.birthday;
    document.getElementById('origin-display').innerText = data.origin;
    
    // Education
    document.getElementById('university-display').innerText = data.education.university;
    document.getElementById('major-display').innerText = data.education.major;
    document.getElementById('enrollment-display').innerText = `${data.education.enrollment}入学`;
    
    // English
    document.getElementById('english-display').innerText = `四级 ${data.english.cet4} / 六级 ${data.english.cet6}`;
    
    // Slogans
    document.getElementById('hero-slogan-display').innerText = data.slogan;
    document.getElementById('hero-subslogan-display').innerText = data.sub_slogan;
    
    // Skills
    const skillsList = document.getElementById('skills-list-container');
    if (skillsList) {
        skillsList.innerHTML = '';
        data.skills.forEach(skill => {
            const li = document.createElement('div');
            li.className = 'skill-tag-item';
            li.innerText = skill;
            skillsList.appendChild(li);
        });
    }
    
    // Contact buttons
    document.getElementById('contact-btn-display').href = `mailto:${data.contact.email}`;
    document.getElementById('social-email').href = `mailto:${data.contact.email}`;
    document.getElementById('social-github').href = data.contact.github;
    document.getElementById('nav-github-link').href = data.contact.github;
    document.getElementById('nav-blog-link').href = data.contact.blog;
    document.getElementById('social-blog').href = data.contact.blog;
    document.getElementById('portal-blog-card').href = data.contact.blog;
    document.getElementById('portal-github-card').href = data.contact.github;
}

// Select Random Background
function setRandomBackground(backgrounds) {
    const bgElement = document.getElementById('bg-image');
    if (!bgElement || !backgrounds || backgrounds.length === 0) return;
    
    const randomIdx = Math.floor(Math.random() * backgrounds.length);
    const bgUrl = backgrounds[randomIdx];
    
    // Load image in memory first to avoid flash of blank background
    const img = new Image();
    img.src = bgUrl;
    img.onload = () => {
        bgElement.style.backgroundImage = `url('${bgUrl}')`;
        bgElement.style.opacity = '1';
    };
}

// Fetch and Parse Blog search.xml
async function loadBlogFeed() {
    const feedList = document.getElementById('blog-feed-list');
    if (!feedList) return;
    
    try {
        // Fetch from GitHub raw to bypass CORS completely
        const response = await fetch('https://raw.githubusercontent.com/mm2672653902-star/mm2672653902-star.github.io/main/search.xml');
        if (!response.ok) throw new Error('Failed to fetch blog search.xml');
        
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        const entries = xmlDoc.getElementsByTagName('entry');
        
        if (entries.length === 0) {
            feedList.innerHTML = '<div class="feed-error">暂无博客文章发布</div>';
            return;
        }
        
        feedList.innerHTML = '';
        const limit = Math.min(entries.length, 3); // Display latest 3 articles
        
        for (let i = 0; i < limit; i++) {
            const entry = entries[i];
            const title = entry.getElementsByTagName('title')[0].textContent.trim();
            const urlPath = entry.getElementsByTagName('url')[0].textContent.trim();
            const fullUrl = `https://blog.maoxijia.top${urlPath}`;
            
            // Extract date from URL path (/2026/05/25/...)
            const dateMatch = urlPath.match(/\/(\d{4})\/(\d{2})\/(\d{2})\//);
            let dateStr = '2026-05-25'; // Fallback
            if (dateMatch) {
                dateStr = `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`;
            }
            
            const item = document.createElement('a');
            item.href = fullUrl;
            item.target = '_blank';
            item.className = 'feed-item';
            // Stop propagation to avoid clicking the outer card redirection
            item.onclick = (e) => {
                e.stopPropagation();
            };
            
            item.innerHTML = `
                <span class="feed-item-title" title="${title}">${title}</span>
                <span class="feed-item-date">${dateStr}</span>
            `;
            feedList.appendChild(item);
        }
    } catch (err) {
        console.error('Error fetching blog feed:', err);
        feedList.innerHTML = '<div class="feed-error">获取博客动态失败，请刷新页面</div>';
    }
}

// Mobile Responsive Menu Toggle
function setupMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            // Toggle hamburger icon animation if needed
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = navMenu.classList.contains('active') ? 'rotate(45deg) translate(5px, 6px)' : 'none';
            spans[1].style.opacity = navMenu.classList.contains('active') ? '0' : '1';
            spans[2].style.transform = navMenu.classList.contains('active') ? 'rotate(-45deg) translate(5px, -6px)' : 'none';
        });
        
        // Close menu on clicking nav link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }
}

// Initialize Page
window.addEventListener('DOMContentLoaded', async () => {
    // Start canvas stars
    initStarfield();
    
    // Setup mobile menu
    setupMobileMenu();
    
    // Default fallback load
    renderProfile(fallbackData);
    setRandomBackground(fallbackData.backgrounds);
    
    // Load dynamic blog feed
    loadBlogFeed();
    
    // Try to fetch dynamic info.json
    try {
        const response = await fetch('./info.json');
        if (response.ok) {
            const data = await response.json();
            renderProfile(data);
            setRandomBackground(data.backgrounds);
        }
    } catch (err) {
        console.warn('Failed to load info.json, using fallback credentials.', err);
    }
});
