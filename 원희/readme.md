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
    /* ⚠️ 중요: 여기에 이미지 파일 경로를 정확히 입력하세요! */
    /* 사용자가 업로드한 파일 이름(1000000747.png)을 사용합니다. */
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








