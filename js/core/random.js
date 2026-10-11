// Aleatoriedade injetável: as funções recebem rng para os testes serem determinísticos.
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function rng() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle(items, rng = Math.random) {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function weightedSample(items, weightOf, k, rng = Math.random) {
  const pool = items.map((item) => ({ item, w: Math.max(0, weightOf(item)) }));
  const out = [];
  while (out.length < k && pool.length > 0) {
    const total = pool.reduce((sum, p) => sum + p.w, 0);
    let idx = pool.length - 1;
    if (total <= 0) {
      idx = Math.floor(rng() * pool.length);
    } else {
      let r = rng() * total;
      for (let i = 0; i < pool.length; i++) {
        r -= pool[i].w;
        if (r < 0) { idx = i; break; }
      }
    }
    out.push(pool[idx].item);
    pool.splice(idx, 1);
  }
  return out;
}
