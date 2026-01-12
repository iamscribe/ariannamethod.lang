// raycaster.js — DDA raycasting for ariannamethod.lang
// "the walls are words, you walk and the vectors move"

export class Raycaster {
  constructor(field) {
    this.field = field;
    this.maxDist = 24;
  }

  castFrame(p, screenW) {
    const rays = new Array(screenW);
    const zbuf = new Float32Array(screenW);

    for (let x = 0; x < screenW; x++) {
      const camX = (x / screenW) * 2 - 1; // -1..1
      const ra = p.a + camX * (p.fov / 2);

      const r = this.castRay(p.x, p.y, ra);
      // fish-eye correction for depth comparisons
      const corrected = Math.max(0.0001, r.dist * Math.cos(ra - p.a));
      zbuf[x] = corrected;
      rays[x] = r;
    }

    return { rays, zbuf };
  }

  castRay(px, py, ang) {
    const f = this.field;
    const dx = Math.cos(ang), dy = Math.sin(ang);

    let mapX = Math.floor(px), mapY = Math.floor(py);
    const deltaDistX = Math.abs(1 / (dx || 1e-9));
    const deltaDistY = Math.abs(1 / (dy || 1e-9));

    let stepX, stepY, sideDistX, sideDistY;

    if (dx < 0) { 
      stepX = -1; 
      sideDistX = (px - mapX) * deltaDistX; 
    } else { 
      stepX = 1; 
      sideDistX = (mapX + 1.0 - px) * deltaDistX; 
    }

    if (dy < 0) { 
      stepY = -1; 
      sideDistY = (py - mapY) * deltaDistY; 
    } else { 
      stepY = 1; 
      sideDistY = (mapY + 1.0 - py) * deltaDistY; 
    }

    let hit = false;
    let side = 0;
    let dist = 0;

    for (let i = 0; i < 160; i++) {
      if (sideDistX < sideDistY) { 
        sideDistX += deltaDistX; 
        mapX += stepX; 
        side = 0; 
      } else { 
        sideDistY += deltaDistY; 
        mapY += stepY; 
        side = 1; 
      }

      if (mapX < 0 || mapY < 0 || mapX >= f.w || mapY >= f.h) break;

      if (f.solid[f.idx(mapX, mapY)] === 1) {
        hit = true;
        dist = side === 0 ? (sideDistX - deltaDistX) : (sideDistY - deltaDistY);
        break;
      }
      if (Math.max(sideDistX, sideDistY) > this.maxDist) break;
    }

    if (!hit) dist = this.maxDist;

    const tok = hit ? f.tokenAtCell(mapX, mapY) : 0;
    return { hit, dist, side, cellX: mapX, cellY: mapY, tok };
  }
}
