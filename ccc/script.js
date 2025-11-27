// 1. 감정 데이터 정의 (미리 정의된 격려 문구(feedback) 포함)
const emotions = [
    { name: '행복', emoji: '😄', color: '#FFD94B', feedback: '환한 미소가 지어지는 날이군요! 이 기분 오래오래 간직하세요.😊' },
    { name: '평온', emoji: '😌', color: '#4BFF91', feedback: '마음이 고요한 하루! 이 평화로운 기운으로 에너지를 충전하세요.🧘' },
    { name: '슬픔', emoji: '😢', color: '#4B7BFF', feedback: '괜찮아요, 슬픈 감정은 자연스러운 거예요. 잠깐 심호흡하고 물 한 잔 마셔봐요.💧' },
    { name: '화남', emoji: '😡', color: '#FF4B4B', feedback: '화가 나는 건 힘든 일이죠. 종이에 감정을 써보거나 잠시 자리를 피해 보세요.🔥' },
    { name: '불안', emoji: '😥', color: '#C54BFF', feedback: '걱정의 무게가 느껴지는군요. 지금 당장 할 수 있는 작은 일부터 시작해 봐요.✨' },
    { name: '피곤', emoji: '🥱', color: '#FF994B', feedback: '몸과 마음이 쉬고 싶다고 말하고 있어요. 오늘은 모든 걸 멈추고 일찍 쉬는 날로 정해봐요.😴' },
    { name: '무덤덤', emoji: '😐', color: '#CCCCCC', feedback: '특별한 감정이 없다는 것도 하나의 상태예요. 가벼운 산책으로 기분 전환은 어떨까요?🚶' },
];

let selectedEmotion = null; 

const paletteEl = document.getElementById('emotion-palette');
const saveButton = document.getElementById('save-button');
const memoInput = document.getElementById('emotion-memo');
const historyDisplayEl = document.getElementById('history-display');
const feedbackMessageEl = document.getElementById('feedback-message');
const clearHistoryButton = document.getElementById('clear-history-button'); // ★ 초기화 버튼 변수

/**
 * 2. 감정 색깔 팔레트를 화면에 렌더링하고 이벤트 리스너를 추가합니다.
 */
function renderPalette() {
    emotions.forEach(emotion => {
        const optionEl = document.createElement('div');
        optionEl.className = 'color-option';
        optionEl.style.backgroundColor = emotion.color;
        optionEl.dataset.name = emotion.name;

        optionEl.innerHTML = `
            <span class="emoji">${emotion.emoji}</span>
            <span class="label">${emotion.name}</span>
        `;
        
        optionEl.addEventListener('click', () => selectEmotion(optionEl, emotion));
        
        paletteEl.appendChild(optionEl);
    });
}

/**
 * 3. 감정 선택 시 처리
 */
function selectEmotion(element, emotionData) {
    document.querySelectorAll('.color-option').forEach(el => {
        el.classList.remove('selected');
    });

    element.classList.add('selected');

    selectedEmotion = emotionData;

    saveButton.disabled = false;
    
    feedbackMessageEl.classList.add('hidden');
    feedbackMessageEl.textContent = '';
}

/**
 * 4. 감정 기록 및 로컬 저장소 저장
 */
function saveEmotion() {
    if (!selectedEmotion) {
        alert('먼저 오늘의 기분 색깔을 선택해 주세요!');
        return;
    }

    const memo = memoInput.value.trim();
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    const newRecord = {
        date: formattedDate,
        time: now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        emotion: selectedEmotion.name,
        color: selectedEmotion.color,
        emoji: selectedEmotion.emoji,
        memo: memo
    };

    const records = JSON.parse(localStorage.getItem('emotionRecords')) || [];
    
    records.unshift(newRecord);

    localStorage.setItem('emotionRecords', JSON.stringify(records));

    renderHistory();
    
    displayFeedback(selectedEmotion.feedback);

    memoInput.value = '';
    selectedEmotion = null;
    saveButton.disabled = true;
    document.querySelectorAll('.color-option').forEach(el => el.classList.remove('selected'));
}

/**
 * 5. 기록 후 피드백 메시지를 표시합니다.
 */
function displayFeedback(message) {
    feedbackMessageEl.textContent = message;
    feedbackMessageEl.classList.remove('hidden');
    
    setTimeout(() => {
        feedbackMessageEl.classList.add('hidden');
    }, 3000);
}

/**
 * 6. 로컬 저장소의 기록을 불러와 화면에 표시합니다.
 */
function renderHistory() {
    historyDisplayEl.innerHTML = ''; 

    const records = JSON.parse(localStorage.getItem('emotionRecords')) || [];

    if (records.length === 0) {
        historyDisplayEl.innerHTML = '<p style="text-align: center; color: #777;">아직 기록된 감정이 없습니다. 오늘의 감정을 선택해 보세요!</p>';
        return;
    }
    
    records.forEach(record => {
        const tileEl = document.createElement('div');
        tileEl.className = 'record-tile';
        tileEl.style.backgroundColor = record.color;
        
        const memoHtml = record.memo ? `<div class="memo">${record.memo}</div>` : '';

        tileEl.innerHTML = `
            <div class="date">${record.date} ${record.time}</div>
            <div class="emotion-label">${record.emoji} ${record.emotion}</div>
            ${memoHtml}
        `;
        
        historyDisplayEl.appendChild(tileEl);
    });
}

/**
 * 7. 로컬 저장소의 모든 기록을 삭제하고 화면을 초기화합니다.
 */
function clearAllHistory() {
    const confirmDelete = confirm("정말로 모든 감정 기록을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.");
    
    if (confirmDelete) {
        localStorage.removeItem('emotionRecords');
        renderHistory();
        displayFeedback("🗑️ 모든 감정 기록이 삭제되었습니다.");
    }
}

// 8. 웹페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
    renderPalette();
    renderHistory();
    saveButton.addEventListener('click', saveEmotion);
    
    clearHistoryButton.addEventListener('click', clearAllHistory); // ★ 이벤트 리스너 연결
});

// 메모 입력 시 엔터 키를 눌러도 기록되도록 설정
memoInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        saveEmotion(); 
    }
});