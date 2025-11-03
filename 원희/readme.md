## 인트로 구현 ver1 

index.html
```
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PROJECT: MECH</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <div class="splash-screen">
        <div class="splash-content">
            <h1>PROJECT: DESTROYER</h1>
            <button id="enter-button">ENTER SITE</button>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
```

style.css
```
/* style.css */

/* 기본 여백 제거 및 전체 높이 설정 */
body, html {
    margin: 0;
    padding: 0;
    height: 100%;
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
}

.splash-screen {
    /* 사용자가 업로드한 파일 이름(intro_image.png)을 사용합니다. */
    background-image: url('intro_image.png');

    /* 화면 전체 높이(100vh)를 차지하도록 설정 */
    height: 100vh; 

    /* 이미지가 화면 중앙에 오도록 설정 */
    background-position: center;
    background-repeat: no-repeat;

    /* 이미지가 비율을 유지하며 화면을 꽉 채우도록 설정 */
    background-size: cover; 

    /* 콘텐츠(텍스트, 버튼)를 화면 정중앙에 배치하기 위한 Flexbox 설정 */
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
}

.splash-content {
    /* 텍스트와 버튼 색상을 흰색으로 설정 */
    color: white;
}

.splash-content h1 {
    font-size: 3.5rem; /* 제목 글자 크기 */
    margin-bottom: 20px;
    
    /* 어두운 배경에서도 글자가 잘 보이도록 그림자 추가 */
    text-shadow: 3px 3px 8px rgba(0, 0, 0, 0.9);
}

.splash-content button {
    font-size: 1.2rem;
    padding: 12px 25px;
    
    /* 버튼 배경을 살짝 투명하게 설정 */
    background-color: rgba(255, 255, 255, 0.15); 
    color: white;
    border: 2px solid white;
    border-radius: 5px;
    cursor: pointer;
    
    /* 마우스를 올렸을 때 부드럽게 변경되도록 transition 추가 */
    transition: background-color 0.3s, color 0.3s;
}

/* 버튼에 마우스를 올렸을 때 (hover) 스타일 변경 */
.splash-content button:hover {
    background-color: white;
    color: black;
}
```

script.js
```
// script.js

// 'enter-button' ID를 가진 버튼 요소를 찾습니다.
const enterButton = document.getElementById('enter-button');

// 버튼에 'click' 이벤트 리스너를 추가합니다.
enterButton.addEventListener('click', function() {
    
    // 버튼이 클릭되었을 때 실행할 동작
    console.log('Enter 버튼 클릭됨!');
    alert('메인 사이트로 이동합니다!');

    // (옵션) 만약 'main.html'이라는 다른 페이지로 이동하고 싶다면
    // 아래 코드의 주석을 해제
    // window.location.href = 'main.html';
});
```


파일 위치(이렇게 작업을 해야 파일이 안 꼬임)
```
📁 my-website/  (← 원하는 이름으로 폴더를 만드세요)
   |
   ├── 📄 index.html      (HTML 파일)
   ├── 📄 style.css        (CSS 파일)
   ├── 📄 script.js        (JavaScript 파일)
   └── 🖼️ intro_image.png (인트로 이미지 파일)
```

이거는 실행 화면 
<img width="1919" height="1024" alt="image" src="https://github.com/user-attachments/assets/55e4d6c5-e85d-4249-a9e6-bbbeb4b86065" />

--------------------------------------
## 인트로 구현 ver2 (인트로 글이 깜빡깜빡 거리고 버튼을 삭제하고 아무 곳이나 입력값이 들어오면 메인화면으로 넘어가도록 변경)

index.html
```
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PROJECT: MECH</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <div class="splash-screen">
        <div class="splash-content">
            <h1>PROJECT: DESTROYER</h1>
            </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
```

style.css
```
/* style.css */

/* 기본 여백 제거 및 전체 높이 설정 */
body, html {
    margin: 0;
    padding: 0;
    height: 100%;
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
}

.splash-screen {
    /*여기에 이미지 파일 경로를 정확히 입력하세요! */
    background-image: url('intro_image.png');

    height: 100vh; /* 화면 전체 높이 */

    /* 이미지가 화면 중앙에 오도록 설정 */
    background-position: center;
    background-repeat: no-repeat;

    /* 이미지가 비율을 유지하며 화면을 꽉 채우도록 설정 */
    background-size: cover; 

    /* 콘텐츠(텍스트)를 화면 정중앙에 배치 */
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
}

.splash-content {
    /* 텍스트 색상을 흰색으로 설정 */
    color: white;
}

/* 깜박임 애니메이션 정의 */
@keyframes blink {
    0% { opacity: 1; } /* 시작: 완전히 보임 */
    50% { opacity: 0; } /* 중간: 완전히 투명 */
    100% { opacity: 1; } /* 끝: 다시 완전히 보임 */
}

.splash-content h1 {
    font-size: 3.5rem; /* 제목 글자 크기 */
    margin-bottom: 20px;
    
    /* 어두운 배경에서도 글자가 잘 보이도록 그림자 추가 */
    text-shadow: 3px 3px 8px rgba(0, 0, 0, 0.9);
    
    /* 애니메이션 적용: blink 애니메이션을 1.5초 간격으로 무한 반복 */
    animation: blink 1.5s infinite; 
}
```

script.js
```
// script.js

// const enterButton = ... (버튼 관련 변수 삭제)
const splashScreen = document.querySelector('.splash-screen'); // 스플래시 스크린 요소

// 메인 페이지로 이동하는 함수
function goToMain() {
    splashScreen.style.opacity = '0'; 
    splashScreen.style.transition = 'opacity 1s ease-out'; 

    setTimeout(() => {
        splashScreen.style.display = 'none';

        console.log('메인 콘텐츠 로드!');
        
        // (옵션) 'main.html' 페이지로 이동
        // window.location.href = 'main.html';

    }, 1000); 
}


// 1. 'ENTER SITE' 버튼 클릭 (삭제됨)
// enterButton.addEventListener('click', ... (버튼 이벤트 리스너 삭제)


// 2. 아무 키나 눌렀을 때 (키보드 입력)
document.addEventListener('keydown', function(event) {
    console.log('아무 키나 눌림:', event.key);
    goToMain();
});

// 3. 아무 곳이나 마우스 클릭 시
document.addEventListener('click', function() {
    console.log('아무 곳이나 클릭됨!');
    goToMain();
});
```

화면 넘어가지는 중..
<img width="1914" height="1028" alt="image" src="https://github.com/user-attachments/assets/60556e87-981b-4da7-8f1b-3513134479fb" />

-------------------------------------

## 인트로 구현 ver3 (인트로 소리 나오게) - 아직 소리 테스트 못함

index.html
```
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PROJECT: MECH</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <div class="splash-screen">
        <div class="splash-content">
            <h1>PROJECT: DESTROYER</h1>
        </div>
    </div>

    <audio id="intro-music" src="intro_music.mp3" loop muted autoplay></audio>

    <script src="script.js"></script>
</body>
</html>
```

style.css - 변경 x
```
/* style.css */

/* 기본 여백 제거 및 전체 높이 설정 */
body, html {
    margin: 0;
    padding: 0;
    height: 100%;
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
}

.splash-screen {
    /*여기에 이미지 파일 경로를 정확히 입력하세요! */
    background-image: url('intro_image.png');

    height: 100vh; /* 화면 전체 높이 */

    /* 이미지가 화면 중앙에 오도록 설정 */
    background-position: center;
    background-repeat: no-repeat;

    /* 이미지가 비율을 유지하며 화면을 꽉 채우도록 설정 */
    background-size: cover; 

    /* 콘텐츠(텍스트)를 화면 정중앙에 배치 */
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
}

.splash-content {
    /* 텍스트 색상을 흰색으로 설정 */
    color: white;
}

/* 깜박임 애니메이션 정의 */
@keyframes blink {
    0% { opacity: 1; } /* 시작: 완전히 보임 */
    50% { opacity: 0; } /* 중간: 완전히 투명 */
    100% { opacity: 1; } /* 끝: 다시 완전히 보임 */
}

.splash-content h1 {
    font-size: 3.5rem; /* 제목 글자 크기 */
    margin-bottom: 20px;
    
    /* 어두운 배경에서도 글자가 잘 보이도록 그림자 추가 */
    text-shadow: 3px 3px 8px rgba(0, 0, 0, 0.9);
    
    /* 애니메이션 적용: blink 애니메이션을 1.5초 간격으로 무한 반복 */
    animation: blink 1.5s infinite; 
}
```

script.js
```
// script.js

const splashScreen = document.querySelector('.splash-screen');
const audio = document.getElementById('intro-music');
let isTransitioning = false; // 화면 전환 중복 실행 방지 플래그
let isUnmuted = false;     // 음소거 해제 여부 플래그

// --- 1. (참고) HTML의 'autoplay muted' 속성으로 인해
// 페이지 로드 시 음악이 '음소거' 상태로 '자동 재생'됩니다.
// 브라우저가 재생을 시작했는지 확인 (선택 사항)
audio.play().catch(e => console.log("음소거 자동재생 실패:", e));


// --- 3. 메인으로 이동하는 함수 (음악 페이드 아웃) ---
function goToMain() {
    if (isTransitioning) return;
    isTransitioning = true;
    console.log('goToMain 실행: 화면 및 음악 페이드 아웃');

    // 1. 화면 페이드 아웃
    splashScreen.style.opacity = '0';
    splashScreen.style.transition = 'opacity 1s ease-out';

    // 2. 음악 페이드 아웃 (1초)
    let volume = audio.volume;
    const fadeOutInterval = setInterval(() => {
        if (volume > 0.05) {
            volume -= 0.05;
            audio.volume = Math.max(0, volume);
        } else {
            clearInterval(fadeOutInterval);
            audio.pause();
            audio.currentTime = 0;
        }
    }, 50); // 0.05초마다 실행

    // 3. 1초 뒤 화면 숨김
    setTimeout(() => {
        splashScreen.style.display = 'none';
        console.log('메인 콘텐츠 로드!');
        // (옵션) 'main.html' 페이지로 이동
        // window.location.href = 'main.html';
    }, 1000);
}

// --- 2. 사용자의 상호작용을 처리하는 함수 ---
function handleInteraction() {
    if (isTransitioning) return; // 화면 전환 중이면 무시

    if (!isUnmuted) {
        // --- 첫 번째 상호작용: 음소거 해제 ---
        audio.muted = false; // 음소거 해제
        isUnmuted = true;
        console.log('첫 번째 상호작용: 음악 소리 켜짐');
    } else {
        // --- 두 번째 (이후) 상호작용: 메인으로 이동 ---
        goToMain();
    }
}

// --- 이벤트 리스너 등록 ---
document.addEventListener('keydown', handleInteraction);
document.addEventListener('click', handleInteraction);
```

혹시 모르니 파일 위치 
```
📁 WEBGAME/
   |
   ├── 📄 index.html
   ├── 📄 style.css
   ├── 📄 script.js
   ├── 🖼️ intro_image.png
   └── 🎵 intro_music.mp3
```














