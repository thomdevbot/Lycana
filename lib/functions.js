Date.prototype.format = function () {
    this._nowFormat = arguments[0] || 'jj/mm/aaaa';
    this._toLen2 = (_nowStr) => {
        _nowStr = _nowStr.toString()
        return ('0'+_nowStr).substr(-2,2)
    }
    this._nowFormat = this._nowFormat.replace(/j+/, this._toLen2(this.getDate()))
    this._nowFormat = this._nowFormat.replace(/m+/, this._toLen2(this.getMonth()+1))
    this._nowFormat = this._nowFormat.replace(/a+/, this.getFullYear())
    this._nowFormat = this._nowFormat.replace(/h+/, this._toLen2(this.getHours()))
    this._nowFormat = this._nowFormat.replace(/i+/, this._toLen2(this.getMinutes()))
    this._nowFormat = this._nowFormat.replace(/s+/, this._toLen2(this.getSeconds()))
    return this._nowFormat;
}

Array.prototype.subarray = function (start,end) {
     if(!end){ end=-1;}
    return this.slice(start, this.length+1-(end*-1))
}
Array.prototype.rnd = function () {
  return this[Math.floor((Math.random()*this.length))];
}
String.prototype.getParam = function ( name ) {
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]")
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS )
    var results = regex.exec( this )
    return results == null ? null : results[1];
}
String.prototype.replaceArray = function(find, replace) {
  var replaceString = this;
  var i = 0;
  while (replaceString.indexOf(find) > -1) {
      replaceString = replaceString.replace(find, replace[i%replace.length])
      i++;
  }
  return replaceString;
}
String.prototype.jhms = function() {
    var j = this.match(new RegExp(/([0-9]*)j/))
    var h = this.match(new RegExp(/([0-9]*)h/))
    var m = this.match(new RegExp(/([0-9]*)m/))
    var s = this.match(new RegExp(/([0-9]*)s/))
    var time = (s == null)? 0 : Number(s[1])
    time += (m == null)? 0 : Number(m[1]) * 60;
    time += (h == null)? 0 : Number(h[1]) * 3600;
    time += (j == null)? 0 : Number(j[1]) * 24 * 3600;
    return time;
}
String.prototype.hmsToSecondsOnly = function() {
    var p = this.split(':'), s = 0, m = 1
    while (p.length > 0) {
        s += m * parseInt(p.pop(), 10)
        m *= 60
    }
    return s
}
String.prototype.strToTime = function() {
    var ptime = Number(this)
    var h = Math.floor(ptime / 3600)
    var m = Math.floor(ptime % 3600 / 60)
    var s = Math.floor(ptime % 3600 % 60)
    return ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s)
}
Array.prototype.shuffle = function() {
  let m = this.length, i;
  while (m) {
    i = (Math.random() * m--) >>> 0;
    [this[m], this[i]] = [this[i], this[m]]
  }
  return this;
}
