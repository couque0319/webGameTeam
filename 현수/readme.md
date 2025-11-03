@@@@이미지들 경로 확인 해주세요@@@@@



-------------수정부분1--------------------

let gameOver = false; 아래 

라인58 ~ 라인183까지

변수선언 + 수정&생성{
function spawnEnemy()
function setBattle()
function startCarrierApproach()
function drawGuides()
function startCarrierDocking()
function lockToCenter()
function playEngineShutdown()

----------------수정부분2-------------------

 function update(time) {
            if (gameOver) return; 아래

라인364 ~ 라인444 까지
if (docking.active)
if (Phaser.Input.Keyboard.JustDown(this.bKey))
if (sway.active)
if (battleOn && time > lastFired + 200) <- 기존 무장 발사코드 수정함
function updateCarrierDocking(scene, deltaMs) 

----------------수정부분3-------------------

그 외 

이미지 로드( 라인277 function preload() 아래로)
player1_2
player1_1
player1_0
carrier1

라인 339 마우스 감지 & 플레이어 이동
this.input.on('pointermove', (pointer) => {


