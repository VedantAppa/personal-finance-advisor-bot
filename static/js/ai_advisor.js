// AI Financial Advisor Client Handler — Modern Light Mode

document.addEventListener('DOMContentLoaded', function () {
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const sendBtn = document.getElementById('sendBtn');
    const quickPrompts = document.querySelectorAll('.quick-prompt-btn');

    if (!chatForm || !chatInput || !chatMessages) return;

    // Scroll to bottom on initial load
    scrollToBottom();

    // Re-initialize Lucide icons when dynamically updated
    function refreshIcons() {
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    }

    // Quick prompt buttons
    quickPrompts.forEach(btn => {
        btn.addEventListener('click', function () {
            const promptText = this.dataset.prompt || this.textContent.trim();
            chatInput.value = promptText;
            chatForm.dispatchEvent(new Event('submit'));
        });
    });

    chatForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (!text) return;

        // 1. Append user message
        appendMessage('user', text);
        chatInput.value = '';
        chatInput.disabled = true;
        if (sendBtn) sendBtn.disabled = true;

        // 2. Append temporary typing indicator
        const typingEl = appendTypingIndicator();
        scrollToBottom();

        // 3. Send request to backend
        fetch('/api/ai/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrfToken()
            },
            body: JSON.stringify({ message: text })
        })
        .then(res => {
            if (!res.ok) throw new Error('Network error or server error');
            return res.json();
        })
        .then(data => {
            typingEl.remove();
            appendMessage('assistant', data.response, data.is_fallback, data.created_at);
            scrollToBottom();
            refreshIcons();
        })
        .catch(err => {
            typingEl.remove();
            appendMessage('assistant', "I encountered an issue processing your request. Please try again.", true);
            scrollToBottom();
            refreshIcons();
        })
        .finally(() => {
            chatInput.disabled = false;
            if (sendBtn) sendBtn.disabled = false;
            chatInput.focus();
        });
    });

    function appendMessage(role, text, isFallback = false, timeStr = '') {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${role}`;

        let formattedText = escapeHtml(text)
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/^### (.*$)/gim, '<h6 class="fw-bold mt-2 mb-1">$1</h6>')
            .replace(/^## (.*$)/gim, '<h5 class="fw-bold mt-2 mb-1">$1</h5>')
            .replace(/^• (.*$)/gim, '<li class="ms-3">$1</li>')
            .replace(/^- (.*$)/gim, '<li class="ms-3">$1</li>')
            .replace(/\n/g, '<br>');

        let fallbackHtml = '';
        if (role === 'assistant' && isFallback) {
            fallbackHtml = '<div class="fallback-badge"><i data-lucide="shield-check" style="width:13px;height:13px;"></i> Rule-Based Financial Engine</div>';
        }

        bubble.innerHTML = `${fallbackHtml}<div>${formattedText}</div>`;
        chatMessages.appendChild(bubble);
    }

    function appendTypingIndicator() {
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble assistant typing-indicator-bubble';
        bubble.innerHTML = `
            <div class="d-flex align-items-center gap-2 text-muted small">
                <span class="typing-dots">
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                </span>
                <span>Analyzing your financial data...</span>
            </div>`;
        chatMessages.appendChild(bubble);
        return bubble;
    }

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function escapeHtml(string) {
        const div = document.createElement('div');
        div.innerText = string;
        return div.innerHTML;
    }
});
