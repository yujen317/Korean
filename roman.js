// 韓文 → 羅馬拼音（依韓國「國語羅馬字表記法」，含連音、鼻音化、ㅎ 弱化等常見發音規則；約略發音）
(function(){
  const I = ['g','kk','n','d','tt','r','m','b','pp','s','ss','','j','jj','ch','k','t','p','h'];
  const V = ['a','ae','ya','yae','eo','e','yeo','ye','o','wa','wae','oe','yo','u','wo','we','wi','yu','eu','ui','i'];
  // 終聲索引：0 無,1 ㄱ,2 ㄲ,3 ㄳ,4 ㄴ,5 ㄵ,6 ㄶ,7 ㄷ,8 ㄹ,9 ㄺ,10 ㄻ,11 ㄼ,12 ㄽ,13 ㄾ,14 ㄿ,15 ㅀ,16 ㅁ,17 ㅂ,18 ㅄ,19 ㅅ,20 ㅆ,21 ㅇ,22 ㅈ,23 ㅊ,24 ㅋ,25 ㅌ,26 ㅍ,27 ㅎ
  const FCODA = ['', 'k','k','k','n','n','n','t','l','k','m','l','l','l','p','l','m','p','p','t','t','ng','t','t','k','t','p','t'];
  // 終聲移到下一個字當初聲時（連音）：[留下的終聲, 移過去的初聲索引]
  const MOVE = {1:[0,0],2:[0,1],3:[1,9],4:[0,2],5:[4,12],6:[4,-1],7:[0,3],8:[0,5],9:[8,0],10:[8,6],11:[8,7],12:[8,9],13:[8,16],14:[8,17],15:[8,-1],16:[0,6],17:[0,7],18:[17,9],19:[0,9],20:[0,10],22:[0,12],23:[0,14],24:[0,15],25:[0,16],26:[0,17],27:[0,-1]};
  const K = new Set([1,2,3,9,24]), T = new Set([7,19,20,22,23,25,27]), P = new Set([17,18,26,14]);
  function word(w){
    const s = [];
    for (const ch of w){
      const c = ch.charCodeAt(0) - 0xAC00;
      if (c < 0 || c > 11171) { s.push({raw: ch}); continue; }
      s.push({i: Math.floor(c / 588), v: Math.floor((c % 588) / 28), f: c % 28});
    }
    for (let k = 0; k < s.length - 1; k++){
      const a = s[k], b = s[k + 1];
      if (a.raw !== undefined || b.raw !== undefined) continue;
      if ((a.f === 25 || a.f === 7) && b.i === 11 && b.v === 20){ b.i = a.f === 25 ? 14 : 12; a.f = 0; continue; }   // 같이→가치、굳이→구지
      if (a.f && b.i === 11){                       // 下一字是 ㅇ 開頭 → 連音
        if (a.f === 21) continue;
        const m = MOVE[a.f]; if (!m) continue;
        a.f = m[0]; if (m[1] >= 0) b.i = m[1];
        continue;
      }
      if (a.f && b.i === 18){                       // 下一字是 ㅎ → 送氣
        if (K.has(a.f)) { a.f = 0; b.i = 15; continue; }
        if (a.f === 7 || a.f === 22 || a.f === 19) { b.i = (a.f === 22 ? 14 : 16); a.f = 0; continue; }
        if (P.has(a.f)) { a.f = 0; b.i = 17; continue; }
      }
      if ((a.f === 27 || a.f === 6 || a.f === 15) && [0,3,12].includes(b.i)){   // ㅎ＋ㄱㄷㅈ
        b.i = ({0:15,3:16,12:14})[b.i]; a.f = a.f === 6 ? 4 : a.f === 15 ? 8 : 0; continue;
      }
      if (b.i === 2 || b.i === 6){                  // 下一字 ㄴ、ㅁ 開頭 → 鼻音化
        if (K.has(a.f)) a.f = 21; else if (T.has(a.f)) a.f = 4; else if (P.has(a.f)) a.f = 16;
      }
      if (a.f === 4 && b.i === 5) a.f = 8;          // ㄴ＋ㄹ → ㄹㄹ
      else if (a.f === 8 && b.i === 2) b.i = 5;     // ㄹ＋ㄴ → ㄹㄹ
      else if ((a.f === 16 || a.f === 21) && b.i === 5) b.i = 2;   // ㅁ/ㅇ＋ㄹ → ㄴ
    }
    let out = '';
    s.forEach((x, k) => {
      if (x.raw !== undefined) { out += x.raw; return; }
      let ini = I[x.i];
      if (x.i === 5 && k > 0 && s[k - 1].f === 8) ini = 'l';
      out += ini + V[x.v] + FCODA[x.f];
    });
    return out;
  }
  window.romanize = function(text){
    return text.replace(/[가-힣]+/g, w => word(w));
  };
})();
