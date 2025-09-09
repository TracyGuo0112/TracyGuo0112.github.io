// 莫奈睡莲风格个人网站 JavaScript

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initNavigation();
    initScrollAnimations();
    initSkillBars();
    initContactForm();
    // initPortraitUpload(); // 已移除上传功能
});


// 导航栏功能
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // 汉堡菜单切换
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // 导航链接点击
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // 移除移动端菜单
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }

            // 平滑滚动
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 70; // 导航栏高度
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // 导航栏滚动效果
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 导航栏背景透明度
        if (scrollTop > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(25px)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.9)';
            navbar.style.backdropFilter = 'blur(20px)';
        }

        // 活跃链接高亮
        updateActiveNavLink();
        
        lastScrollTop = scrollTop;
    });
}

// 更新活跃导航链接
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop && 
            window.pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// 滚动动画
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                
                // 特殊处理技能条动画
                if (entry.target.classList.contains('skill-category')) {
                    animateSkillBars(entry.target);
                }
            }
        });
    }, observerOptions);

    // 观察需要动画的元素
    const animateElements = document.querySelectorAll(
        '.about-card, .project-card, .skill-category, .contact-card, .section-header'
    );
    
    animateElements.forEach(el => {
        el.classList.add('loading');
        observer.observe(el);
    });
}

// 技能条动画
function initSkillBars() {
    // 这个函数在滚动动画中被调用
}

function animateSkillBars(skillCategory) {
    const skillBars = skillCategory.querySelectorAll('.skill-progress');
    
    skillBars.forEach((bar, index) => {
        const targetWidth = bar.style.width;
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.width = targetWidth;
        }, index * 200);
    });
}

// 联系表单处理
function initContactForm() {
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取表单数据
            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;
            
            // 简单验证
            if (!name || !email || !message) {
                showNotification('请填写所有必填字段', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('请输入有效的邮箱地址', 'error');
                return;
            }
            
            // 保存留言到本地存储
            saveMessage(name, email, message);
            
            showNotification('消息发送成功！我会尽快回复您', 'success');
            this.reset();
        });
    }
}

// 邮箱验证
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 通知显示
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // 样式
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease',
        maxWidth: '300px',
        wordWrap: 'break-word'
    });
    
    // 根据类型设置背景色
    switch (type) {
        case 'success':
            notification.style.background = 'linear-gradient(135deg, #4B8B3B, #B0E57C)';
            break;
        case 'error':
            notification.style.background = 'linear-gradient(135deg, #F28D8D, #FFB4A2)';
            break;
        default:
            notification.style.background = 'linear-gradient(135deg, #3A6B8C, #A9D0F5)';
    }
    
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// 平滑滚动到顶部
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 添加回到顶部按钮
function addScrollToTopButton() {
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '↑';
    scrollButton.className = 'scroll-to-top';
    
    Object.assign(scrollButton.style, {
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        border: 'none',
        background: 'linear-gradient(135deg, #3A6B8C, #4B8B3B)',
        color: 'white',
        fontSize: '20px',
        cursor: 'pointer',
        zIndex: '1000',
        opacity: '0',
        transform: 'translateY(100px)',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 20px rgba(42, 77, 105, 0.3)'
    });
    
    scrollButton.addEventListener('click', scrollToTop);
    
    // 滚动显示/隐藏
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollButton.style.opacity = '1';
            scrollButton.style.transform = 'translateY(0)';
        } else {
            scrollButton.style.opacity = '0';
            scrollButton.style.transform = 'translateY(100px)';
        }
    });
    
    scrollButton.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(0) scale(1.1)';
    });
    
    scrollButton.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
    
    document.body.appendChild(scrollButton);
}

// 打字机效果
function typewriterEffect(element, text, speed = 100) {
    if (!element) return;
    
    element.textContent = '';
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// 页面加载完成后的初始化
window.addEventListener('load', function() {
    // 添加回到顶部按钮
    addScrollToTopButton();
    
    // 为hero标题添加打字机效果
    const heroTitle = document.querySelector('.hero-title .gradient-text');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typewriterEffect(heroTitle, originalText, 150);
        }, 1000);
    }
    
    // 移除加载状态
    document.body.classList.add('loaded');
});

// 鼠标跟踪效果（可选）
function initMouseTracker() {
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // 为某些元素添加鼠标跟踪效果
    const trackElements = document.querySelectorAll('.about-card, .project-card');
    
    trackElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) rotateX(5deg) rotateY(5deg)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
        });
        
        element.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / centerY * 10;
            const rotateY = (x - centerX) / centerX * 10;
            
            this.style.transform = `translateY(-5px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
        });
    });
}

// 性能优化：节流函数
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

// 防抖函数
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}


// 添加一些额外的交互效果
document.addEventListener('DOMContentLoaded', function() {
    // 初始化鼠标跟踪（如果需要）
    // initMouseTracker();
    
    // 为按钮添加涟漪效果
    addRippleEffect();
});

function addRippleEffect() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// 添加涟漪效果的CSS（通过JavaScript动态添加）
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
.btn {
    position: relative;
    overflow: hidden;
}

.ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
}

@keyframes ripple-animation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
`;

document.head.appendChild(rippleStyle);

// 头像上传功能
function initPortraitUpload() {
    const portraitFrame = document.querySelector('.portrait-frame');
    const portraitUpload = document.getElementById('portraitUpload');
    const portraitImage = document.getElementById('portraitImage');
    const portraitPlaceholder = document.querySelector('.portrait-placeholder');
    
    if (!portraitFrame || !portraitUpload || !portraitImage || !portraitPlaceholder) {
        return;
    }
    
    // 点击头像框触发文件选择
    portraitFrame.addEventListener('click', function() {
        portraitUpload.click();
    });
    
    // 处理文件选择
    portraitUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            // 检查文件大小（限制为5MB）
            if (file.size > 5 * 1024 * 1024) {
                showNotification('图片文件大小不能超过5MB', 'error');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                portraitImage.src = e.target.result;
                portraitImage.classList.add('loaded');
                portraitPlaceholder.classList.add('hidden');
                
                // 保存到localStorage
                localStorage.setItem('userPortrait', e.target.result);
                
                showNotification('头像上传成功！', 'success');
            };
            reader.readAsDataURL(file);
        } else {
            showNotification('请选择有效的图片文件', 'error');
        }
    });
    
    // 加载已保存的头像
    loadSavedPortrait();
    
    // 添加拖拽上传功能
    initDragAndDrop();
}

// 加载已保存的头像
function loadSavedPortrait() {
    const savedPortrait = localStorage.getItem('userPortrait');
    const portraitImage = document.getElementById('portraitImage');
    const portraitPlaceholder = document.querySelector('.portrait-placeholder');
    
    if (savedPortrait && portraitImage && portraitPlaceholder) {
        portraitImage.src = savedPortrait;
        portraitImage.classList.add('loaded');
        portraitPlaceholder.classList.add('hidden');
    }
}

// 拖拽上传功能
function initDragAndDrop() {
    const portraitFrame = document.querySelector('.portrait-frame');
    
    if (!portraitFrame) return;
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        portraitFrame.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        portraitFrame.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        portraitFrame.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        portraitFrame.style.transform = 'scale(1.05)';
        portraitFrame.style.boxShadow = 'var(--shadow-strong), 0 0 30px rgba(169, 208, 245, 0.5)';
    }
    
    function unhighlight() {
        portraitFrame.style.transform = '';
        portraitFrame.style.boxShadow = '';
    }
    
    portraitFrame.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                // 模拟文件输入
                const portraitUpload = document.getElementById('portraitUpload');
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                portraitUpload.files = dataTransfer.files;
                
                // 触发change事件
                const event = new Event('change', { bubbles: true });
                portraitUpload.dispatchEvent(event);
            } else {
                showNotification('请拖拽图片文件', 'error');
            }
        }
    }
}

// 重置头像功能（可选）
function resetPortrait() {
    const portraitImage = document.getElementById('portraitImage');
    const portraitPlaceholder = document.querySelector('.portrait-placeholder');
    const portraitUpload = document.getElementById('portraitUpload');
    
    if (portraitImage && portraitPlaceholder && portraitUpload) {
        portraitImage.classList.remove('loaded');
        portraitPlaceholder.classList.remove('hidden');
        portraitUpload.value = '';
        localStorage.removeItem('userPortrait');
        showNotification('头像已重置', 'info');
    }
}

// 添加右键菜单功能（可选）
function addPortraitContextMenu() {
    const portraitFrame = document.querySelector('.portrait-frame');
    
    if (!portraitFrame) return;
    
    portraitFrame.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        
        const portraitImage = document.getElementById('portraitImage');
        if (portraitImage.classList.contains('loaded')) {
            const confirmReset = confirm('是否要重置头像？');
            if (confirmReset) {
                resetPortrait();
            }
        }
    });
}

// 留言管理功能
function saveMessage(name, email, message) {
    const messages = getMessages();
    const newMessage = {
        id: Date.now(),
        name: name,
        email: email,
        message: message,
        timestamp: new Date().toISOString(),
        read: false
    };
    
    messages.push(newMessage);
    localStorage.setItem('websiteMessages', JSON.stringify(messages));
}

function getMessages() {
    const messages = localStorage.getItem('websiteMessages');
    return messages ? JSON.parse(messages) : [];
}

function deleteMessage(messageId) {
    const messages = getMessages();
    const filteredMessages = messages.filter(msg => msg.id !== messageId);
    localStorage.setItem('websiteMessages', JSON.stringify(filteredMessages));
}

function markMessageAsRead(messageId) {
    const messages = getMessages();
    const message = messages.find(msg => msg.id === messageId);
    if (message) {
        message.read = true;
        localStorage.setItem('websiteMessages', JSON.stringify(messages));
    }
}

// 管理员面板功能
function showAdminPanel() {
    // 简单的密码验证
    const password = prompt('请输入管理员密码：');
    if (password !== 'tracy2025') {
        showNotification('密码错误！', 'error');
        return;
    }
    
    const messages = getMessages();
    
    if (messages.length === 0) {
        showNotification('暂无留言', 'info');
        return;
    }
    
    // 创建管理面板
    const adminPanel = createAdminPanel(messages);
    document.body.appendChild(adminPanel);
}

function createAdminPanel(messages) {
    const panel = document.createElement('div');
    panel.className = 'admin-panel';
    panel.innerHTML = `
        <div class="admin-content">
            <div class="admin-header">
                <h2>留言管理</h2>
                <button class="close-admin" onclick="closeAdminPanel()">×</button>
            </div>
            <div class="admin-body">
                ${messages.map(msg => `
                    <div class="message-item ${msg.read ? 'read' : 'unread'}" data-id="${msg.id}">
                        <div class="message-header">
                            <strong>${msg.name}</strong>
                            <span class="message-email">${msg.email}</span>
                            <span class="message-time">${formatDate(msg.timestamp)}</span>
                        </div>
                        <div class="message-content">${msg.message}</div>
                        <div class="message-actions">
                            ${!msg.read ? `<button onclick="markAsRead(${msg.id})">标为已读</button>` : ''}
                            <button onclick="deleteMsg(${msg.id})">删除</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .admin-panel {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .admin-content {
            background: white;
            border-radius: 12px;
            width: 90%;
            max-width: 800px;
            max-height: 80%;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        
        .admin-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem;
            background: linear-gradient(135deg, #3A6B8C, #4B8B3B);
            color: white;
        }
        
        .admin-header h2 {
            margin: 0;
        }
        
        .close-admin {
            background: none;
            border: none;
            color: white;
            font-size: 2rem;
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .close-admin:hover {
            background: rgba(255, 255, 255, 0.2);
        }
        
        .admin-body {
            padding: 1.5rem;
            max-height: 500px;
            overflow-y: auto;
        }
        
        .message-item {
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 1rem;
            margin-bottom: 1rem;
            background: #f9f9f9;
        }
        
        .message-item.unread {
            background: #fff3cd;
            border-color: #ffc107;
        }
        
        .message-header {
            display: flex;
            gap: 1rem;
            margin-bottom: 0.5rem;
            flex-wrap: wrap;
        }
        
        .message-email {
            color: #666;
        }
        
        .message-time {
            color: #999;
            font-size: 0.9rem;
        }
        
        .message-content {
            margin: 1rem 0;
            line-height: 1.5;
        }
        
        .message-actions {
            display: flex;
            gap: 0.5rem;
        }
        
        .message-actions button {
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.9rem;
        }
        
        .message-actions button:first-child {
            background: #28a745;
            color: white;
        }
        
        .message-actions button:last-child {
            background: #dc3545;
            color: white;
        }
    `;
    
    if (!document.querySelector('.admin-panel-style')) {
        style.className = 'admin-panel-style';
        document.head.appendChild(style);
    }
    
    return panel;
}

function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString('zh-CN');
}

function closeAdminPanel() {
    const panel = document.querySelector('.admin-panel');
    if (panel) {
        panel.remove();
    }
}

function markAsRead(messageId) {
    markMessageAsRead(messageId);
    const messageItem = document.querySelector(`[data-id="${messageId}"]`);
    if (messageItem) {
        messageItem.classList.remove('unread');
        messageItem.classList.add('read');
        const markButton = messageItem.querySelector('.message-actions button:first-child');
        if (markButton && markButton.textContent === '标为已读') {
            markButton.remove();
        }
    }
    showNotification('已标记为已读', 'success');
}

function deleteMsg(messageId) {
    if (confirm('确定要删除这条留言吗？')) {
        deleteMessage(messageId);
        const messageItem = document.querySelector(`[data-id="${messageId}"]`);
        if (messageItem) {
            messageItem.remove();
        }
        showNotification('留言已删除', 'success');
    }
}

// 添加管理员入口（键盘快捷键）
document.addEventListener('keydown', function(e) {
    // 按下 Ctrl + Shift + A 打开管理面板
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        showAdminPanel();
    }
});
