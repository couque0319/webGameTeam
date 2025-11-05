// assets/js/events/shop_event.js
(function(global){
  const ShopEvent = {
    _scene:null, _setBattle:null, _player:null,
    _gold:999,
    _ui:{ active:false, container:null, bg:null, keys:null, slots:[], holdBar:null, holdBarBg:null, holdLabel:null, dim:null, bigTitle:null, lines:[], nextRemoveAt:0, removeInterval:300 },
    _purchased:{ '1':false,'2':false,'3':false,'4':false },
    _tier:{ a:0, s:0, d:0 },
    holdMs:2000,
    onTakeOff: ()=>{},

    init({scene, player, setBattle, gold=999}){ this._scene=scene; this._player=player; this._setBattle=setBattle; this._gold=gold; },
    open(){ if(this._ui.active) return; this._ui.active = true; this._openPanel(); },
    update(delta,time){ if(!this._ui.active) return; this._updateShop(delta); this._updateLaunch(delta); },

    /* 내부: 슬롯/구매/홀드바/프리플라이트/점화/TAKE OFF는 이전 답변의 구현을 그대로 사용 */
  };
  global.ShopEvent = ShopEvent;
})(window);
