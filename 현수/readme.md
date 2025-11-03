@@@@이미지들 경로 확인하고 본인 폴더에 맞게 function preload() 수정해주세요@@@@@

항모호출 임시키 'B'

항등 등장 이후 유도선에 맞춰 흔들리는 기체를 정렬시키면 항모에 접근 / 유도선을 빠져나가면 접근 중지

항모에 일정수준 접근하면 기체가 중앙정렬 & 고정 -> 정지로 착함 완료

착함 완료 이후 player1_2 -> player1_1 -> player1_0 을 거쳐 엔진 정지


-------------수정부분1--------------------

let gameOver = false; 아래 

라인58 ~ 라인183까지

변수선언 + 함수수정&생성{
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
if (battleOn && time > lastFired + 200) @<- 기존 무장 발사코드 수정함@
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


