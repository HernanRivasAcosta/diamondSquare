class MouseHandler
{
  constructor(target)
  {
    this._x0 = -1;
    this._y0 = -1;
    this._target = target.body;
  }

  _onStartDrag(callback)
  {
    return function(e)
           {
             this._x0 = e.clientX;
             this._y0 = e.clientY;
             if (callback)
               callback(this._x0, this._y0);
           }
  }

  _onDrag(callback)
  {
    return function(e)
           {
             if (this._x0 >= 0 && callback)
               callback(e.clientX - this._x0, e.clientY - this._y0);
           }
  }

  _onEndDrag(callback)
  {
    return function(e)
           {
             if (callback)
               callback(e.clientX - this._x0, e.clientY - this._y0);
             this._x0 = -1;
             this._y0 = -1;
           }
  }

  //============================================================================
  // API
  //============================================================================
  onDrag(onStart = null, onMove = null, onEnd = null)
  {
    this._target.onmousedown = this._onStartDrag(onStart);
    this._target.onmousemove = this._onDrag(onMove);
    this._target.onmouseup = this._onEndDrag(onEnd);
  }
}