class Map
{
  constructor(size, seed = null)
  {
    // Ensure the size is given as (N^2+1)
    size--;
    if (size & (size - 1))
    {
      this._size = 1;
      while(size)
      {
        this._size <<= 1;
        size >>= 1;
      }
      this._size = (this._size) | 1;
    }
    else
    {
      this._size = size + 1;
    }
    this._hsize = this._size * 0.5;

    // Initialise the prng
    this._prng = new Rand(seed);

    // Create the map
    this._a = [];
    this._l = this._size * this._size;

    // Generate the terrain
    this._generateTerrain();
  }

  _generateTerrain()
  {
    // Level the terrain (this also initialises the map array)
    this._flatten();

    // Set the height of the centre of the map
    this._a[this._l >> 1] = this._prng.float() * 3 + 2;

    // Get the initial terrain with DiamondSquare
    this._diamondSquare();

    // Turn it into an island by substracting the distance from the centre
    this._lowerEdges();

    // A side effect of this function is that it turns all negative heights into
    // 0
    this._flatten();
  }

  _diamondSquare()
  {
    // Set the center to a random value
    let side = this._size - 1;
    // Do the diamond square loop
    do
    {
      this._squareStep(side);
      side /= 2;
      this._diamondStep(side);
    } while(side > 2);
    this._squareStep(side);
  }

  _squareStep(l)
  {
    let hl = l * 0.5;
    for (let i = 0; i < this._size - 1; i += l)
      for (let j = 0; j < this._size - 1; j += l)
      {
        this._average(true, i + hl, j, hl);
        this._average(true, i, j + hl, hl);
        this._average(true, i + hl, j + this._size, hl);
        this._average(true, i + this._size, j + hl, hl);
      }
  }

  _diamondStep(l)
  {
    let hl = l * 0.5;
    for (let i = 0; i < this._size - 1; i += l)
      for (let j = 0; j < this._size - 1; j += l)
      {
        this._average(false, i + hl, j + hl, hl);
      }
  }

  _average(horizontal, c, r, d)
  {
    let h = 0;

    if (horizontal)
      h = this.getHeight(c, r - d) +
          this.getHeight(c, r + d) +
          this.getHeight(c - d, r) +
          this.getHeight(c + d, r);
    else
      h = this.getHeight(c - d, r - d) +
          this.getHeight(c - d, r + d) +
          this.getHeight(c + d, r - d) +
          this.getHeight(c + d, r + d);

    let v = (this._prng.float() - 0.5) * Math.log2(d) * 1;
    this.setHeight(c, r, h / 4 + v);
  }

  _distFromCenter(c, r)
  {
    let dc = this._hsize - c;
    let dr = this._hsize - r;
    return Math.sqrt(dc * dc + dr * dr) / this._size;
  }

  _lowerEdges()
  {
    for(let c = 0; c < this._size; c++)
      for(let r = 0; r < this._size; r++)
      {
        let d = this._distFromCenter(c, r);
        // Cubing the distance makes the effect stronger on the edges and leaves
        // the centre pretty much intact
        this.setHeight(c, r, this.getHeight(c, r) - d * d * d * 30);
      }
  }

  _flatten()
  {
    for (let i = 0; i < this._l; i++)
    {
      this._a[i] = Math.max(0, this._a[i] || 0);
    }
  }

  //============================================================================
  // API
  //============================================================================
  getHeight(r, c)
  {
    if (c >= 0 && c < this._size &&
        r >= 0 && r < this._size)
      return this._a[c * this._size + r];
    else
      return 0;
  }

  setHeight(r, c, h)
  {
    if (c >= 0 && c < this._size &&
        r >= 0 && r < this._size)
      this._a[c * this._size + r] = h;
  }

  size()
  {
    return this._size;
  }

}