class CanvasRenderer
{
  constructor(canvas)
  {
    this._ctx = canvas.getContext('2d');

    this._w = canvas.width;
    this._hw = this._w * 0.5;
    this._h = canvas.height;
    this._hh = this._h * 0.5;
  }

  _drawCell(r, c, map, dx, dy, scale)
  {
    let side = 10 * scale;
    let x = c * side;
    let y = r * side;
    let h = map.getHeight(r, c) * side;

    let d = side * 0.5 * map.size();

    // Calculate the edges of the tile
    let minx = this._hw + x - y - side + dx;
    let miny = (x + y) * 0.5 + this._hh - d + dy;
    let maxx = this._hw + x + side - y + dx;
    let maxy = (x + side * 2 + y) * 0.5 + this._hh - d + dy;

    // Avoid drawing tiles outside the screen
    if (maxx < 0 || minx > this._w ||
        maxy < 0 || miny > this._w)
      return;

    // Draw the top of the tile.
    this._ctx.beginPath();
    this._ctx.moveTo(this._hw + x - y + dx, miny - h);
    this._ctx.lineTo(maxx, (x + side + y) * 0.5 + this._hh - h - d + dy);
    this._ctx.lineTo(this._hw + x - y + dx, maxy - h);
    this._ctx.lineTo(minx, (x + y + side) * 0.5 + this._hh - h - d + dy);
    this._ctx.lineTo(this._hw + x - y + dx, miny - h);
    this._ctx.closePath();
    // Select the colour based on the height
    if (h == 0)
      this._ctx.fillStyle = '#8ED6FF';
    else if (h < 4)
      this._ctx.fillStyle = '#C2B280';
    else
      this._ctx.fillStyle = '#708238';
    this._ctx.fill();

    // Draw the edges of the tile so they don't just 'float' in the air
    if (h)
    {
      this._ctx.beginPath();
      this._ctx.moveTo(minx, (x + y + side) * 0.5 + this._hh - h - d + dy);
      this._ctx.lineTo(this._hw + x - y + dx, maxy - h);
      this._ctx.lineTo(maxx, (x + side + y) * 0.5 + this._hh - h - d + dy);
      this._ctx.lineTo(maxx, (x + side + y) * 0.5 + this._hh - d + dy);
      this._ctx.lineTo(this._hw + x - y + dx, maxy);
      this._ctx.lineTo(minx, (x + y + side) * 0.5 + this._hh - d + dy);
      this._ctx.lineTo(minx, (x + y + side) * 0.5 + this._hh - h - d + dy);
      this._ctx.closePath();
      this._ctx.fillStyle = h < 4 ? '#A69150' : '#6B5428';
      this._ctx.fill();
    }
  }

  //============================================================================
  // API
  //============================================================================
  viewportWidth()
  {
    return this._w;
  }

  viewportHeight()
  {
    return this._h;
  }

  renderMap(map, dx = 0, dy = 0, scale = 1)
  {
    this._ctx.clearRect(0, 0, this._w, this._h);

    let s = map.size();
    for (let r = 0; r < s; r++)
      for (let c = 0; c < s; c++)
      {
        this._drawCell(r, c, map, dx, dy, scale);
      }
  }

}