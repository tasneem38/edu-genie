document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const loading = document.getElementById('loading');
    const resultContainer = document.getElementById('result-container');
    const resultContent = document.getElementById('result-content');
    const quizContainer = document.getElementById('quiz-container');
    const copyBtn = document.getElementById('copy-btn');

    const errorDisplay = document.getElementById('error-display');
    const errorMessage = document.getElementById('error-message');
    const errorClose = document.getElementById('error-close');

    // Tab Switching
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            if (tab.classList.contains('active')) return;

            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.add('hidden'));

            tab.classList.add('active');
            const activeContent = document.getElementById(`${tab.dataset.tab}-tab`);
            activeContent.classList.remove('hidden');

            // Clear previous results/errors
            hideError();
            resultContainer.classList.add('hidden');
            quizContainer.classList.add('hidden');

            // Focus on input
            const input = activeContent.querySelector('textarea, input');
            if (input) input.focus();
        });
    });

    // Error Handling
    function showError(msg) {
        errorMessage.textContent = msg;
        errorDisplay.classList.remove('hidden');
        errorDisplay.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function hideError() {
        errorDisplay.classList.add('hidden');
    }

    errorClose.addEventListener('click', hideError);

    // API Helpers
    async function callApi(endpoint, data) {
        hideError();
        loading.classList.remove('hidden');
        resultContainer.classList.add('hidden');
        quizContainer.classList.add('hidden');

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (!response.ok) {
                const errorMsg = result.detail || 'Something went wrong with EduGenie.';
                showError(errorMsg);
                return null;
            }
            return result;
        } catch (error) {
            console.error(error);
            showError("Network error. Please check your connection.");
            return null;
        } finally {
            loading.classList.add('hidden');
        }
    }

    function renderMarkdown(text) {
        resultContent.innerHTML = marked.parse(text);

        // Render math formulas
        if (window.renderMathInElement) {
            renderMathInElement(resultContent, {
                delimiters: [
                    { left: '$$', right: '$$', display: true },
                    { left: '$', right: '$', display: false },
                    { left: '\\(', right: '\\)', display: false },
                    { left: '\\[', right: '\\]', display: true }
                ],
                throwOnError: false
            });
        }

        resultContainer.classList.remove('hidden');
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

        resultContent.style.opacity = '0';
        resultContent.style.transform = 'translateY(10px)';
        setTimeout(() => {
            resultContent.style.transition = 'all 0.5s ease-out';
            resultContent.style.opacity = '1';
            resultContent.style.transform = 'translateY(0)';
        }, 50);
    }

    // Keyboard support (Enter to submit)
    document.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                if (input.tagName === 'TEXTAREA') {
                    // Only submit textareas on Enter if they aren't empty
                    if (input.value.trim().length > 0) {
                        e.preventDefault();
                        const btn = input.closest('.tab-content').querySelector('.primary-btn');
                        if (btn) btn.click();
                    }
                } else {
                    e.preventDefault();
                    const btn = input.closest('.tab-content').querySelector('.primary-btn');
                    if (btn) btn.click();
                }
            }
        });
    });

    // Module Handlers
    document.getElementById('ask-submit').addEventListener('click', async () => {
        const input = document.getElementById('ask-input');
        const question = input.value.trim();
        if (!question) return;
        const res = await callApi('/api/ask', { question });
        if (res) renderMarkdown(res.response);
    });

    document.getElementById('explain-submit').addEventListener('click', async () => {
        const input = document.getElementById('explain-input');
        const topic = input.value.trim();
        const level = document.getElementById('explain-level').value;
        if (!topic) return;
        const res = await callApi('/api/explain', { topic, level });
        if (res) renderMarkdown(res.response);
    });

    document.getElementById('summarize-submit').addEventListener('click', async () => {
        const input = document.getElementById('summarize-input');
        const text = input.value.trim();
        const mode = document.getElementById('summarize-mode').value;
        if (!text) return;
        const res = await callApi('/api/summarize', { text, mode });
        if (res) renderMarkdown(res.response);
    });

    document.getElementById('quiz-submit').addEventListener('click', async () => {
        const input = document.getElementById('quiz-input');
        const topic = input.value.trim();
        const difficulty = document.getElementById('quiz-difficulty').value;
        if (!topic) return;
        const res = await callApi('/api/quiz', { topic, difficulty });
        if (res && res.quiz) {
            renderQuiz(res.quiz);
        } else if (res && res.raw_response) {
            renderMarkdown(res.raw_response);
        }
    });

    function renderQuiz(quizItems) {
        quizContainer.innerHTML = '<h3>Practice Quiz</h3>';
        quizItems.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'quiz-card';
            card.innerHTML = `
                <p><strong>Q${index + 1}:</strong> ${item.question}</p>
                <div class="quiz-options">
                    ${item.options.map(opt => `<button class="option-btn" data-answer="${item.answer}">${opt}</button>`).join('')}
                </div>
                <p class="feedback hidden"></p>
            `;
            quizContainer.appendChild(card);
        });

        quizContainer.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const selected = e.target.textContent;
                const correct = e.target.dataset.answer;
                const options = btn.parentElement.querySelectorAll('.option-btn');
                const feedback = btn.parentElement.nextElementSibling;

                options.forEach(opt => opt.disabled = true);

                if (selected === correct) {
                    btn.classList.add('correct');
                    feedback.textContent = "✨ Correct! Well done.";
                    feedback.style.color = "#4ade80";
                } else {
                    btn.classList.add('wrong');
                    feedback.textContent = `❌ Incorrect. The correct answer is: ${correct}`;
                    feedback.style.color = "#f87171";
                }
                feedback.classList.remove('hidden');
            });
        });

        quizContainer.classList.remove('hidden');
        quizContainer.scrollIntoView({ behavior: 'smooth' });
    }

    // Copy to clipboard
    copyBtn.addEventListener('click', () => {
        const text = resultContent.innerText;
        navigator.clipboard.writeText(text).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = '✅';
            setTimeout(() => copyBtn.textContent = originalText, 2000);
        });
    });
});
