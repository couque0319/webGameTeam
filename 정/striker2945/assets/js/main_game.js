// main_game.js — PROJECT: MECH (확정 스폰/디버그 보강 + 튜토리얼 HUD + 무적 깜빡임)
(() => {
  const W = 480, H = 720;

  // --- URL 파라미터 ---
  const qp = (k, fb=null) => { try{ return new URLSearchParams(location.search).get(k) ?? fb; }catch{ return fb; } };
  const pad2 = (n)=> String(n).padStart(2,'0');

  // --- Phaser 설정 ---
  const config = {
    type: Phaser.AUTO, parent: 'game-root', width: W, height: H, backgroundColor: '#000',
    physics: { default:'arcade', arcade:{ gravity:{y:0}, debug:false } },
    scene: { preload, create, update }
  };

  let scene, player, enemies, pBullets, eBullets, items;
  let hudTextEl;
  let metaState = { safeMode:false, bulletScale:1.0, enemyFire:true };

  // 튜토리얼 판단
  const DIFF = (qp('difficulty','easy')||'easy').toLowerCase();
  const STG  = qp('stage','01');
  const IS_TUTORIAL = (DIFF==='easy' && (STG==='01' || STG==='1' || STG==='E1'));

  // --- 튜토리얼 체크리스트 HUD ---
  let checklist;
  function mountChecklist() {
    if (!IS_TUTORIAL) return;
    const root = document.createElement('div');
    Object.assign(root.style, {
      position:'fixed', right:'10px', top:'10px', width:'220px', zIndex:1000,
      font:'13px/1.5 ui-monospace,Consolas,monospace', color:'#eaf6ff'
    });
    root.innerHTML = `
      <div style="background:#0b1928cc;border:1px solid #335a86;border-radius:10px;padding:10px 12px;">
        <div style="font-weight:800;margin-bottom:6px;">튜토리얼 목표</div>
        <ul id="todo" style="list-style:none;padding:0;margin:0;display:grid;gap:6px;">
          <li data-k="move">⬜ 이동해 보기</li>
          <li data-k="shoot">⬜ 사격해 보기</li>
          <li data-k="dodge">⬜ 탄 회피해 보기</li>
          <li data-k="item">⬜ 아이템 줍기</li>
        </ul>
      </div>`;
    document.body.appendChild(root);
    checklist = {
      el: root,
      done: { move:false, shoot:false, dodge:false, item:false },
      set(k,v=true){
        if (this.done[k]) return;
        this.done[k]=v;
        const li = root.querySelector(`li[data-k="${k}"]`);
        if (li){ li.textContent = `✅ ${li.textContent.replace(/^⬜\s?|✅\s?/,'')}`; }
        if (Object.values(this.done).every(Boolean)) showTip('튜토리얼 완료! 이제 적을 처치해 보세요.');
      }
    };
  }

  // --- 프리로드 ---
  function preload(){
    scene = this;
    hudTextEl = document.getElementById('hud');

    // 사운드/이미지
    this.load.audio('hit', 'assets/audio/피격사운드.mp3');
    this.load.image('player', 'assets/images/player1.png');

    // 폴백 텍스처
    this.textures.exists('tx_enemy')  || this.textures.generate('tx_enemy',  { data:['1111','1111','1111','1111'], pixelWidth:6 });
    this.textures.exists('tx_bullet') || this.textures.generate('tx_bullet', { data:['22','22'], pixelWidth:3 });
    this.textures.exists('tx_item')   || this.textures.generate('tx_item',   { data:[' 33 ','3333',' 33 '], pixelWidth:4 });
    this.textures.exists('tx_player') || this.textures.generate('tx_player', { data:['  0  ',' 000 ','00000',' 000 ','  0  '], pixelWidth:6 });

    mountChecklist();
  }

  // === 확정 적 스폰 헬퍼 (get 실패 시 create 보강, 눈에 띄게 표시) ===
  function spawnEnemySure(x, y, opts = {}) {
    const key = opts.key || 'tx_enemy';
    let e = enemies.get(x, y, key);
    if (!e) e = enemies.create ? enemies.create(x, y, key) : null;

    if (!e) {
      console.warn('[SPAWN] failed: pool exhausted or group misconfigured');
      return null;
    }
    e.setActive(true).setVisible(true).setDepth(10);
    e.setDisplaySize(opts.size || 40, opts.size || 40);        // 눈에 띄게
    e.setTint(opts.tint ?? 0xff3333);                          // 눈에 띄게
    const vy = opts.vy ?? 80;
    e.setVelocity(opts.vx ?? 0, vy);
    e.hp = opts.hp ?? 3;
    console.log('[SPAWN] enemy', { x, y, vy, key, hp: e.hp });
    return e;
  }

  // --- 생성 ---
  function create(){
    // 물리 경계 지정 + 그룹/플레이어 생성
    this.physics.world.setBounds(0, 0, W, H);

    // 플레이어
    const playerKey = this.textures.exists('player') ? 'player' : 'tx_player';
    player = this.physics.add.sprite(W * 0.5, H - 84, playerKey).setDepth(10);
    player.setOrigin(0.5, 0.5);
    if (playerKey === 'player') {
      player.setScale(0.06);
      const r = 12;
      player.body.setCircle(
        r,
        (player.width * player.scaleX) / 2 - r,
        (player.height * player.scaleY) / 2 - r
      );
    } else {
      player.setScale(0.85);
      player.body.setCircle(
        12,
        (player.width * player.scaleX) / 2 - 12,
        (player.height * player.scaleY) / 2 - 12
      );
    }
    player.setCollideWorldBounds(true);
    player.body.onWorldBounds = true;
    player.speed = 260;
    player._movedAccum = 0;
    player._lastPos = new Phaser.Math.Vector2(player.x, player.y);

    // 입력
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys('W,A,S,D,SPACE');

    // 그룹
    pBullets = this.physics.add.group({ classType: Phaser.Physics.Arcade.Image, maxSize:300, runChildUpdate:true });
    eBullets = this.physics.add.group({ classType: Phaser.Physics.Arcade.Image, maxSize:600, runChildUpdate:true });
    enemies  = this.physics.add.group({ classType: Phaser.Physics.Arcade.Sprite, maxSize:180, runChildUpdate:true });
    items    = this.physics.add.group({ classType: Phaser.Physics.Arcade.Image, maxSize:20,  runChildUpdate:true });

    // 충돌
    this.physics.add.overlap(pBullets, enemies, onHitEnemy, null, this);
    this.physics.add.overlap(eBullets, player,  onHitPlayer, null, this);
    this.physics.add.overlap(items, player, onPickupItem, null, this);

    function onHitEnemy(bullet, enemy){
      bullet.destroy();
      enemy.hp = (enemy.hp ?? 3) - 1;
      if (enemy.hp <= 0) enemy.destroy();
    }
    function onHitPlayer(playerSpr, bullet){
      bullet.destroy();
      if (playerSpr.isInvincible) return;
      if (metaState.safeMode) return;

      // 무적 시작
      playerSpr.isInvincible = true;

      // 사운드/진동
      if (scene.sound && scene.sound.play) scene.sound.play('hit', { volume: 0.4 });
      if (navigator.vibrate) navigator.vibrate(100);

      // 깜빡임 1초
      scene.tweens.add({
        targets: playerSpr,
        alpha: 0.3, yoyo: true, repeat: 5, duration: 100,
        onComplete: () => { playerSpr.alpha = 1; playerSpr.isInvincible = false; }
      });

      // 빨간 점멸
      playerSpr.setTint(0xff6666);
      scene.time.delayedCall(100, () => playerSpr.clearTint());
    }
    function onPickupItem(item, playerSpr){
      item.destroy();
      if (checklist) checklist.set('item');
      showTip('아이템 획득!');
    }

    // HUD
    setHUD(DIFF, STG);

    // 사격 쿨다운
    this.shootCooldown = 0;
    this.playerShootInterval = 120;

    // ===== StageManager 연결 =====
    if (window.StageManager){
      StageManager.init({ scene:this, enemiesGroup:enemies });

      StageManager.onApplyMeta = ({ safeMode, bulletScale, enemyFire })=>{
        metaState.safeMode   = !!safeMode;
        metaState.bulletScale= Number(bulletScale||1.0);
        metaState.enemyFire  = enemyFire !== false;
      };
      StageManager.onShowTip = (text)=> showTip(text);

      // 핵심: 확정 스폰 헬퍼 사용
      StageManager.onSpawnEnemy = ({ x, y, type, def, params }) => {
        console.log('[SM] onSpawnEnemy', type, x, y);

        const e = spawnEnemySure(x, y, {
          key: 'tx_enemy',
          size: (def.size || 28),
          tint: (def.tint || 0xffffff),
          vy:  randIn(def.speedY || [60, 120]) * (metaState.bulletScale || 1.0)
        });
        if (!e) return;

        // HP 스케일
        const baseHP = def.hp || 3;
        e.hp = baseHP * ((DIFF === 'hard') ? 1.2 : 1.0);

        // 공통 타이머
        e.t = 0; e.fireT = 0;

        // 지그재그 트윈(요청 시)
        const amp = (params && params.amp) || def.zigAmp || 0;
        const hz  = (params && params.hz)  || def.zigHz || 0;
        if (amp > 0 && hz > 0) {
          scene.tweens.add({
            targets: e, x: { from: x - amp, to: x + amp },
            duration: Math.max(300, Math.floor(1000 / hz)), yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
          });
        }

        // 타입별 AI
        const kind = (type || 'Grunt');
        const shoot1 = ()=> fireBulletAt(scene, e, player, 1.0);
        const spread3 = ()=> fireSpread(scene, e, player, 3, 24, 1.0);

        switch (kind) {
          case 'Basic': { // == Grunt
            e.fireInt = params?.noBullet ? 999999 : 1000;
            e.update = function (time, delta) {
              if (!this.active) return;
              this.fireT += delta;
              if (this.fireT >= this.fireInt && metaState.enemyFire) {
                this.fireT = 0; shoot1();
              }
            };
            break;
          }
          case 'ZigZag': {
            e.fireInt = 1200;
            e.update = function (time, delta) {
              if (!this.active) return;
              this.fireT += delta;
              if (this.fireT >= this.fireInt && metaState.enemyFire) {
                this.fireT = 0; spread3();
              }
            };
            break;
          }
          case 'Tank': {
            e.hp = (def.hp||6) * ((DIFF==='hard')?1.3:1.0);
            e.fireInt = 900;
            e.update = function (time, delta) {
              if (!this.active) return;
              this.fireT += delta;
              if (this.fireT >= this.fireInt && metaState.enemyFire) {
                this.fireT = 0;
                fireSpread(scene, this, player, 5, 28, 0.95);
              }
            };
            break;
          }
          case 'Grunt': {
            e.fireInt = 1000;
            e.update = function (time, delta) {
              if (!this.active) return;
              this.fireT += delta;
              if (this.fireT >= this.fireInt && metaState.enemyFire) {
                this.fireT = 0; shoot1();
              }
            };
            break;
          }
          case 'Turret': {
            e.stopY = (params && params.stopY) || 110;
            e.rot = Math.random() * Math.PI;
            e.fireInt = 900;
            e.update = function (time, delta) {
              if (!this.active) return;
              if (this.y < this.stopY) this.setVelocity(0, 60 * (metaState.bulletScale||1.0));
              else this.setVelocity(0, 0);

              this.fireT += delta; this.rot += 0.04;
              if (this.fireT >= this.fireInt && metaState.enemyFire) {
                this.fireT = 0;
                const n = 6, step = (Math.PI*2)/n;
                for (let i=0;i<n;i++) {
                  const ang = this.rot + i*step;
                  const b = eBullets.get(this.x, this.y, 'tx_bullet'); if (!b) continue;
                  const spd = 140 * (metaState.bulletScale || 1.0);
                  b.setActive(true).setVisible(true);
                  b.setVelocity(Math.cos(ang)*spd, Math.sin(ang)*spd);
                  b.setCircle(3,0,0);
                }
              }
            };
            break;
          }
          case 'Kamikaze': {
            e.state = 'approach';
            e.fireInt = 999999; // 쏘지 않음
            e.timer = 600 + Math.random()*300;
            e.update = function (time, delta) {
              if (!this.active) return;
              if (this.state === 'approach') {
                this.setVelocity(0, 80 * (metaState.bulletScale||1.0));
                this.timer -= delta;
                if (this.timer <= 0) {
                  this.state = 'telegraph';
                  this.setTint(0xffcc00);
                  scene.tweens.add({ targets:this, alpha:0.5, yoyo:true, repeat:4, duration:80,
                    onComplete:()=> { this.clearTint(); this.alpha = 1; this.state='dash'; }
                  });
                }
              } else if (this.state === 'dash') {
                const ang = aimAngle(this.x, this.y, player.x, player.y);
                const spd = 320 * (metaState.bulletScale||1.0);
                this.setVelocity(Math.cos(ang)*spd, Math.sin(ang)*spd);
              }
            };
            break;
          }
          case 'MiniBoss': {
            e.hp = (def.hp || 40) * ((DIFF==='hard')?1.25:1.0);
            e.setVelocity(0, 40 * (metaState.bulletScale||1.0));
            e.phase = 0; e.fireInt = 220; e.rot = 0;
            e.update = function (time, delta) {
              if (!this.active) return;
              if (this.y > 160) this.setVelocity(0,0);
              this.fireT += delta; this.rot += 0.06;
              if (this.fireT >= this.fireInt && metaState.enemyFire) {
                this.fireT = 0;
                if (this.phase === 0) {
                  const n = 12, step=(Math.PI*2)/n;
                  for (let i=0;i<n;i++){
                    const ang = this.rot + i*step;
                    const b = eBullets.get(this.x, this.y, 'tx_bullet'); if (!b) continue;
                    const spd = 130*(metaState.bulletScale||1.0);
                    b.setActive(true).setVisible(true);
                    b.setVelocity(Math.cos(ang)*spd, Math.sin(ang)*spd);
                    b.setCircle(3,0,0);
                  }
                } else if (this.phase === 1) {
                  fireSpread(scene, this, player, 5, 28, 1.2);
                }
              }
              if (this.hp < ((def.hp||40)*0.5)) this.phase = 1;
            };
            break;
          }
          default: { // 폴백
            e.fireInt = 1000;
            e.update = function (time, delta) {
              this.fireT += delta;
              if (this.fireT >= this.fireInt && metaState.enemyFire) {
                this.fireT = 0; shoot1();
              }
            };
          }
        }
      };

      // 스테이지 로드 & 시작 (URL 쿼리 기반)
      StageManager.loadStageByQuery(DIFF, STG);
      StageManager.start();

      // 튜토리얼 보조 연출
      if (IS_TUTORIAL){
        this.time.delayedCall(6000, ()=> spawnTutorialItem(W*0.5, H*0.5));
        this.time.delayedCall(8000, ()=> { if (window.MONSTERS && MONSTERS.respawnGruntTop) MONSTERS.respawnGruntTop(); });
      }
    } else {
      console.warn('[StageManager] not loaded — fallback only');
    }

    // === 빠른 테스트 스폰(확인용) ===
    this.time.delayedCall(2000, () => { // 2초 후 빨간 적 등장
      spawnEnemySure(W * 0.5, -30, { size: 48, tint: 0xff0000, vy: 80 });
    });
    this.input.keyboard.on('keydown-T', () => { // T키로 즉시 스폰
      spawnEnemySure(Phaser.Math.Between(40, W-40), -30, { size: 48, tint: 0xff0000, vy: 90 });
      showTip('Test spawn (T)');
    });

    // 디버그 토글
    this.debugKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H);
    this.debugDraw = false;
  }

  // --- 업데이트 ---
  const nearBullets = new WeakSet();
  function update(time, delta){
    const dt = delta/1000;

    // 이동
    let vx=0, vy=0;
    const C=this.cursors, K=this.keys;
    if (C.left.isDown || K.A.isDown)  vx -= 1;
    if (C.right.isDown|| K.D.isDown)  vx += 1;
    if (C.up.isDown   || K.W.isDown)  vy -= 1;
    if (C.down.isDown || K.S.isDown)  vy += 1;
    const len=Math.hypot(vx,vy)||1;
    player.setVelocity((vx/len)*player.speed, (vy/len)*player.speed);

    // 경계 Clamp(절대 이탈 방지)
    const halfW = (player.width * player.scaleX) * 0.5;
    const halfH = (player.height * player.scaleY) * 0.5;
    const marginLeft = halfW, marginRight = W - halfW;
    const marginTop  = 6 + halfH, marginBottom = H - halfH - 6;
    player.x = Phaser.Math.Clamp(player.x, marginLeft, marginRight);
    player.y = Phaser.Math.Clamp(player.y, marginTop,  marginBottom);

    // 튜토리얼 체크
    if (IS_TUTORIAL && checklist){
      const d = Phaser.Math.Distance.Between(player._lastPos.x, player._lastPos.y, player.x, player.y);
      player._movedAccum += d; player._lastPos.set(player.x, player.y);
      if (player._movedAccum > 40) checklist.set('move');
    }

    // 사격
    this.shootCooldown -= delta;
    if ((Phaser.Input.Keyboard.JustDown(K.SPACE) || (C.space && C.space.isDown)) && this.shootCooldown <= 0){
      this.shootCooldown = this.playerShootInterval;
      spawnPlayerBullet(this, player.x, player.y - 20, -360 * (metaState.bulletScale || 1.0));
      if (IS_TUTORIAL && checklist) checklist.set('shoot');
    }

    // 회피 判定
    if (IS_TUTORIAL && checklist){
      eBullets.children.iterate(b=>{
        if (!b || !b.active) return;
        const dist = Phaser.Math.Distance.Between(player.x, player.y, b.x, b.y);
        if (dist < 48) nearBullets.add(b);
        else if (dist > 140 && nearBullets.has(b)){ nearBullets.delete(b); checklist.set('dodge'); }
      });
    }

    // 정리
    purgeOffscreen(pBullets, W, H);
    purgeOffscreen(eBullets, W, H);
    purgeOffscreen(enemies,  W, H, true);
    purgeOffscreen(items,    W, H, true);

    // 디버그 토글
    if (Phaser.Input.Keyboard.JustDown(this.debugKey)){
      this.debugDraw = !this.debugDraw;
      this.physics.world.drawDebug = this.debugDraw;
      this.physics.world.debugGraphic.clear();
    }
  }

  // --- HUD & TIP ---
  function setHUD(diff, stg){
    if (!hudTextEl) return;
    const sNum = /^\d+$/.test(String(stg)) ? pad2(parseInt(stg,10)||1) : String(stg).toUpperCase();
    hudTextEl.textContent = `[ ${diff.toUpperCase()} ] STAGE ${sNum}${IS_TUTORIAL?'  (TUTORIAL)':''}`;
  }
  function showTip(text){
    const x=W/2, y=Math.round(H*0.2);
    const t = scene.add.text(x,y,text,{fontSize:'18px',fontFamily:'monospace',color:'#e8fdff',stroke:'#0b2a3a',strokeThickness:3})
      .setOrigin(0.5).setAlpha(0).setDepth(999);
    scene.tweens.add({ targets:t, alpha:1, y:y-6, duration:220, ease:'Cubic.easeOut',
      onComplete:()=> scene.time.delayedCall(2000, ()=> scene.tweens.add({targets:t, alpha:0, y:y-12, duration:260, onComplete:()=> t.destroy()})) });
  }

  // --- 발사/정리 ---
  function spawnPlayerBullet(scene, x, y, vy){
    const b = pBullets.get(x,y,'tx_bullet'); if (!b) return;
    b.setActive(true).setVisible(true); b.setVelocity(0, vy); b.setCircle(3,0,0);
  }
  function enemyShoot(scene, enemy){
    if (!metaState.enemyFire) return;
    const px = player.x, py = player.y;
    const a = Math.atan2(py - enemy.y, px - enemy.x);
    const s = 160 * (metaState.bulletScale || 1.0);
    const b = eBullets.get(enemy.x, enemy.y, 'tx_bullet'); if (!b) return;
    b.setActive(true).setVisible(true); b.setVelocity(Math.cos(a)*s, Math.sin(a)*s); b.setCircle(3,0,0);
  }
  function purgeOffscreen(group, W, H, removeBelowOnly=false){
    group.children.iterate(obj=>{
      if (!obj || !obj.active) return;
      if (obj.x < -20 || obj.x > W+20 || obj.y < -40 || obj.y > H+40){
        if (removeBelowOnly){ if (obj.y > H+40) obj.destroy(); }
        else obj.destroy();
      }
    });
  }

  // === 공용 각도/탄발 ===
  function aimAngle(ax, ay, bx, by) { return Math.atan2(by - ay, bx - ax); }
  function fireBulletAt(scene, from, to, speedMul=1, spreadRad=0) {
    if (!metaState.enemyFire) return;
    const base = 160;
    const spd = base * (metaState.bulletScale || 1.0) * (speedMul || 1.0);
    const ang = aimAngle(from.x, from.y, to.x, to.y) + (spreadRad || 0);
    const b = eBullets.get(from.x, from.y, 'tx_bullet'); if (!b) return;
    b.setActive(true).setVisible(true);
    b.setVelocity(Math.cos(ang) * spd, Math.sin(ang) * spd);
    b.setCircle(3, 0, 0);
  }
  function fireSpread(scene, from, to, count, totalDeg=24, speedMul=1) {
    if (count <= 1) return fireBulletAt(scene, from, to, speedMul, 0);
    const half = (count - 1) / 2;
    const baseAng = aimAngle(from.x, from.y, to.x, to.y);
    const step = (totalDeg * Math.PI / 180) / (count - 1);
    for (let i = -half; i <= half; i++) {
      const ang = baseAng + (i * step);
      const b = eBullets.get(from.x, from.y, 'tx_bullet'); if (!b) continue;
      const spd = 150 * (metaState.bulletScale || 1.0) * (speedMul || 1.0);
      b.setActive(true).setVisible(true);
      b.setVelocity(Math.cos(ang) * spd, Math.sin(ang) * spd);
      b.setCircle(3, 0, 0);
    }
  }

  // --- 튜토리얼 아이템 ---
  function spawnTutorialItem(x,y){
    const it = items.get(x,y,'tx_item'); if (!it) return;
    it.setActive(true).setVisible(true).setDepth(9);
    it.setVelocity(0, 30);
    it.setCircle(6, 0, 0);
  }

  // --- 보조 ---
  function randIn(range){ if (Array.isArray(range)&&range.length===2){ return Phaser.Math.Between(range[0], range[1]); } return Number(range)||100; }

  // --- 시작 ---
  new Phaser.Game(config);
})();
