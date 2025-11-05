// assets/js/events/carrier_event.js
(function(global){
  const CarrierEvent = {
    _active:false, _eventOn:false,
    _scene:null, _player:null, _setBattle:null,
    _docking:{ active:false, carrier:null, guide:null,
      guideLeftX:200, guideRightX:280, tolerance:12,
      descentPxPerSec:40, ascentPxPerSec:20, targetY:0, minY:0, lockOffsetPx:0 },
    _sway:{ active:false, locked:false, baseX:null, phase:0, ampP:14, hzP:0.9, tween:null },
    _bannerShown:false, _engineShutdownPlayed:false,
    onDocked: () => {},

    init({scene, player, setBattle}){ this._scene=scene; this._player=player; this._setBattle=setBattle; },
    startApproach(){ /* … (배너→항모 등장→도킹 시작) … */ },
    update(delta,time){ /* … (도킹/스웨이/정렬/완료→_playEngineShutdown) … */ },
    setPlayerBaseX(x){ this._sway.baseX = x; },
    flyOutCarrier(){ /* … 항모 하강 퇴장 트윈 … */ },

    /* 내부: 배너/스폰/도킹/가이드/엔진소등 등 상세 로직은 이전 답변과 동일 구현 */
  };
  global.CarrierEvent = CarrierEvent;
})(window);
