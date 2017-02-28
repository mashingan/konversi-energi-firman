function simpleTest(){
  var canvasWidth = 1024;
  var canvasHeight = 768;
  var xScale = 1;
  var yScale = 1;
  /*
    kode bahasa
    
    id = indonesia
    en = inggris
    nl = belanda
  */
  var bahasa = "id";
  var container = null;
  var containerSize = "default";
  var showSplash = true;
  var resetStorgeData = false;
  var canvas,ctx;  
  var modeDE=null;
  
  var sndID;
  var imgID;
  var touchable;
  var canvasPos;  
  var listCanvas,listCtx;
  
  
  this.setLanguage = function(s){
    bahasa = s||"id";
  };
  this.resetStorge = function(b){
    resetStorgeData = b;
  };
  this.showLoading = function(b){
    showSplash = b;
  };
  this.setContainerSize = function(s){
    containerSize = s||"default";
  };
  this.setMode = function(n){
    modeDE = n;
  };
  this.start = function(containerName,size) {    
    container = document.getElementById(containerName);
    containerSize = size||"default";
    
    var splash = document.createElement("div");
    container.appendChild(splash);
    if(showSplash){    
      splash.style.position = "absolute";
      splash.style.width = "100%";
      splash.style.textAlign = "center";
      splash.style.fontSize = "xx-large";
      splash.style.top = "50%";
      splash.innerHTML = "Loading 0%";
    }
    
    canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.position = "absolute";  
    canvas.style.left = "0px";  
    canvas.style.top = "0px";    
    canvas.style.zIndex = 0;    
    ctx = canvas.getContext("2d");
    container.appendChild(canvas);
    
    listCanvas = [canvas];
    listCtx = [ctx];    
    setSize(listCanvas,listCtx);  
    
    sndID = getResourceSound();
    
    var imgSrc = getResourceImage();
    var totalResource = imgSrc.length;
    imgID = new Array(totalResource);
    
    if(totalResource===0){
      container.removeChild(splash);
      ready();  
    }else{
      for (var i=0; i<imgSrc.length; i++) {
        var gmbr = new Image();        
        gmbr.addEventListener("load",eventImageLoaded, false);
        gmbr.src = "images/"+imgSrc[i];
        var el = imgSrc[i].indexOf(".") == -1 ? imgSrc[i].length : imgSrc[i].indexOf(".");
        var nma = imgSrc[i].substr(0,el);
        var cn = nma.indexOf("/");
        if(cn != - 1){
          nma = nma.substr(cn+1,el);
        }
        imgID[nma] = gmbr;
      }
    }
    
    function eventImageLoaded(){  
      totalResource--;
      if(showSplash){
        var ttl = imgSrc.length;
        splash.innerHTML = "Loading "+Math.round((ttl-totalResource)/ttl*100)+"%";
      }
      if(totalResource===0){
        container.removeChild(splash);
        ready();
      }
    }
  };
  
  //--link resource
  function getResourceImage(){  
    //var imgSrc = new Array();
   var imgSrc = [];
    imgSrc.push("bg-fix.png");
    imgSrc.push("bglabel-fix.png");
    imgSrc.push("panah.png");
    imgSrc.push("bingkai-jawaban.png");
    imgSrc.push("tombol-pendek2.png");
    imgSrc.push("bingkai-tv.png");
    imgSrc.push("bingkai-tv-bayangan.png");

    imgSrc.push("jam-dinding.png");
      
    //--ambil gambar di folder bahasa
    //imgSrc.push(bahasa+"/bg.png");
    
    return imgSrc;
  }
  
  function getResourceSound(){  
    //var snd = new Array();  
          var snd = [];
    
    //snd.push("win");
    
    //snd.push(bahasa+"/snd1");
    
    //-----------jangan di hapus
    for (var i=0; i<snd.length; i++) {
      var el = snd[i].indexOf(".") == -1 ? snd[i].length : snd[i].indexOf(".");
      var ur = snd[i].substr(0,el);      
      var nn = ur;
      var cn = nn.indexOf("/");
      if(cn != - 1){
        nn = nn.substr(cn+1,el);
      }
      snd[nn] = ur;
    }
    
    return snd;
  }
  
  window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame || 
    window.webkitRequestAnimationFrame || 
    window.mozRequestAnimationFrame || 
    window.oRequestAnimationFrame || 
    window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
  })();
  
  function winResize() {
    var rExp=/%/;
    if (rExp.test(container.style.width)) {
      setSize(listCanvas,listCtx);
    }
  }
  function setSize(cvsArr,ctxArr) {
    var size = containerSize;
    var i;
    switch (size) {
      case "":
      case "default":
        container.style.width = canvasWidth + "px";
        container.style.height = canvasHeight + "px";
        xScale = 1; yScale = 1;
        for (i=0; i<cvsArr.length; i++) {
          cvsArr[i].width=canvasWidth;
          cvsArr[i].height=canvasHeight;
          cvsArr[i].style.left = cvsArr[i].style.left+"px";
          cvsArr[i].style.top = cvsArr[i].style.top+"px";
        }
        break;
      case "auto":
        var ws = container.offsetWidth/canvasWidth;
        var hs = container.offsetHeight/canvasHeight;
        xScale = Math.min(ws,hs);
        yScale = xScale;
        var cw = container.offsetWidth;
        var ch = container.offsetHeight;
        for (i=0; i<cvsArr.length; i++) {
          cvsArr[i].width=canvasWidth*xScale;
          cvsArr[i].height=canvasHeight*yScale;
          ctxArr[i].scale(xScale, yScale);
          cvsArr[i].style.left= ((cw-canvasWidth*xScale)/2)+"px";
          cvsArr[i].style.top=((ch-canvasHeight*yScale)/2)+"px";
        }
        break;
      case "fit":
        xScale = container.offsetWidth/canvasWidth;
        yScale = container.offsetHeight/canvasHeight;
        for (i=0; i<cvsArr.length; i++) {
          cvsArr[i].width=container.offsetWidth;
          cvsArr[i].height=container.offsetHeight;
          ctxArr[i].scale(xScale, yScale);
          cvsArr[i].style.left= ((container.offsetWidth-canvasWidth*xScale)/2)+"px";
          cvsArr[i].style.top=((container.offsetHeight-canvasHeight*yScale)/2)+"px";
        }
        break;
      case "fitwidth":
        xScale = container.offsetWidth/canvasWidth;
        yScale = xScale;
        container.style.height = (canvasHeight*yScale) + "px";
        for (i=0; i<cvsArr.length; i++) {
          cvsArr[i].width=container.offsetWidth;
          cvsArr[i].height=canvasHeight*yScale;
          ctxArr[i].scale(xScale, yScale);
          cvsArr[i].style.left= ((container.offsetWidth-canvasWidth*xScale)/2)+"px";
          cvsArr[i].style.top=((container.offsetHeight-canvasHeight*yScale)/2)+"px";
        }
        break;
      case "fitheight":
        yScale = container.offsetHeight/canvasHeight;
        xScale = yScale;
        container.style.width = (canvasWidth*xScale) + "px";
        for (i=0; i<cvsArr.length; i++) {
          cvsArr[i].height=container.offsetHeight;
          cvsArr[i].width=canvasWidth*xScale;
          ctxArr[i].scale(xScale, yScale);
          cvsArr[i].style.left= ((container.offsetWidth-canvasWidth*xScale)/2)+"px";
          cvsArr[i].style.top=((container.offsetHeight-canvasHeight*yScale)/2)+"px";
        }
        break;
    }
  }  
  function findAbsolutePosition(obj) {
    var curleft = 0;
    var curtop = 0;
    if (obj && obj.offsetParent) {
      while (obj) {
        curleft += obj.offsetLeft;
        curtop += obj.offsetTop;
        obj = obj.offsetParent;
      }
      /*
      do {
        curleft += obj.offsetLeft;
        curtop += obj.offsetTop;
      } while (obj = obj.offsetParent);
      */
    }
    return [curleft,curtop];
  }    


  function classSuara(s){// class suara
    var a = document.createElement('audio');
    a.innerHTML = '<source src="sounds/'+s+'.ogg" type="audio/ogg">' +
      '<source src="sounds/'+s+'.aac" type="audio/mpeg">';    
    this.play = function(f){
      a.play();
      if (f !== null)
        a.addEventListener("ended", f);
    };
  }

  function buatSuara(s,f){// jalankan suara
    var a = document.createElement('audio');
    a.innerHTML = '<source src="sounds/'+s+'.ogg" type="audio/ogg">' +
      '<source src="sounds/'+s+'.aac" type="audio/mpeg">';  
    a.play();
    if (f !== null)
        a.addEventListener("ended", f);
  }
  
  //---------------------------------------------------------------------------------------  
  
  function ready(){    
    var frametime = 1 / 60 * 1000;  // 60fps;
      
    function ObjectProp(){
      this.x = 0;
      this.y = 0;
      this.width = 0;
      this.height = 0;
      this.alpha = 1;
      this.rotation = 0;
      this.scaleX = 1;
      this.scaleY = 1;
      this.visible = true;
      this.img = null;

      this.oldscale = [0,0];

      this.setScale = function (x, y) {
        console.log("x:", x, ", y: ", y);
        if (x) {
          this.oldscale[0] = this.scaleX;
          this.scaleX = x;
          //this.x *= x;
          //this.width *= x;
        }
        if (y) {
          this.oldscale[1] = this.scaleY;
          this.scaleY = y;
          //this.y *= y;
          //this.height *= y; 
        }
        //return this;
      };

      this.updatedScale = function() {
        var samex = Math.abs(this.oldscale[0] - this.scaleX) > 0.1;
        var samey = Math.abs(this.oldscale[1] - this.scaleY) > 0.1;
        return samex && samey;
      };

      this.update = function () {
        console.error("ERROR: implementation of update is needed!");
      };
    }


    function Tombol(x, y, img, type, opts) {
      this.x = x? x * xScale : 0;
      this.y = y? y * yScale : 0;
      this.img = imgID[img];
      this.draggable = false;
      // "static", "holder", and "dynamic" combination
      this.type = type || "static";
      this.held = null;
      this.width = this.img.width;
      this.height = this.img.height;
      this.label = "";

      if (opts)
        for (var key in opts)
          this[key] = opts[key];

      this.oldpos = [this.x, this.y];
      this.initpos = [this.x, this.y];


      this.inArea = function (x, y) {
        var x1 = this.x;
        var x2 = x1 + this.width;
        var y1 = this.y;
        var y2 = y1 + this.height;
        return within(x, x1, x2) && within(y, y1, y2);
      };

      this.render = function (_ctx, opts) {
        _ctx.save();
        _ctx.translate(this.x, this.y);

        if (this.updatedScale()) {
          _ctx.scale(this.scaleX, this.scaleY);
          this.oldscale[0] = this.scaleX;
          this.oldscale[1] = this.scaleY;
        }

        var imgx = opts? opts.imgx : 0;
        var imgy = opts? opts.imgy : 0;
        var imgw = (opts? opts.imgw : this.width) || this.img.width;
        var imgh = (opts? opts.imgh : this.height) || this.img.height;

        //if (opts) console.log(opts);

        _ctx.rotate(this.rotation * Math.PI / 180);
        if (this.overrideRender) {
          this.overrideRender.apply(this, this.renderParams);
        } else {
          _ctx.drawImage(this.img, 0, 0, this.width, this.height,
            imgx, imgy, imgw, imgh);
        }
        _ctx.restore();
      };

      this.setHolder = function (tombol) {
        this.held = tombol;
      };

      this.setDragging = function (dragstate) {
        if (this.draggable) this.dragging = dragstate;
      };

      this.update = function (x, y, opts) {
        // dynamic dispatch
        // opts: {
        //    precb: function ... ,
        //    postcb: function ...,
        //    preparams: Array,
        //    postparams: Array,
        // }
        if (opts.precb) opts.precb.apply(this, opts.preparams);
        if (opts.postcb) opts.postcb.apply(this, opts.postparams);
      };


      function within(x, x1, x2) {
        return x >= x1 && x <= x2;
      }
    } // end of Tombol class definition

    Tombol.prototype = new ObjectProp();

    var gambar = [];
    gambar.push(new Tombol(150, 24, "panah", "static", {
      label: "Perubahan energi apakah yang terjadi dibawah ini?",
      width: 300, height: 50,
      overrideRender: function (_ctx) {
        _ctx.font = 20 + "px sans-serif";
        _ctx.fillStyle = "blue";
        _ctx.textAlign = "center";
        _ctx.textBaseline = "middle";
        _ctx.fillText(this.label, this.width/2, this.height/2);
      },
      renderParams: [ctx]
    }));
    gambar.push(new Tombol(250, 115, "panah", "static"));
    gambar.push(new Tombol(300, 100, "bingkai-jawaban", "static holder", {
      occupied: false
    }));
    gambar.push(new Tombol(100, 100, "bingkai-jawaban", "static holder", {
      occupied: false
    }));
    gambar.push(new Tombol(100, 250, "bg-fix", "static", {
      width: 500 * xScale, height: 400 * yScale,
      overrideRender: function (_ctx) {
        _ctx.drawImage(this.img, 0, 0, this.img.width, this.img.height/2,
          0, 0, this.width, this.height);
      },
      renderParams: [ctx]
    }));
    gambar.push(new Tombol(100, 250, "jam-dinding", "static", {
      width: 450 * xScale, height: 350 * yScale,
      overrideRender: function (_ctx) {
        _ctx.drawImage(this.img, this.width/15, this.height/10,
          this.width - this.width/20, this.height - this.height/10);
      },
      renderParams: [ctx]
    }));
    ["bingkai-tv", "bingkai-tv-bayangan"]
      .forEach(function (imgid) {
        gambar.push(new Tombol(100, 250, imgid, "static", {
          width: 500 * xScale,
          height: (imgid === "bingkai-tv" ? 425 : 400) *yScale,
          overrideRender: function (_ctx) {
            _ctx.drawImage(this.img, 0, 0, this.width, this.height);
          },
          renderParams: [ctx]
        }));
      });
    var labels = ["cahaya", "listrik", "magnet", "gravitasi", "panas"];
    for (var i = 250 * yScale, j = 0; j < labels.length;
      j++, i += (100*yScale))
      gambar.push(new Tombol((canvasWidth- 200) * xScale, i,
        "tombol-pendek2", "dynamic", {
          draggable: true, hitx: 0, hity: 0, label: labels[j],
          overrideRender: function (_ctx) {
            _ctx.drawImage(this.img, 0, 0, this.width, this.height);
            _ctx.font = this.height/2 + "px sans-serif";
            _ctx.fillStyle = "red";
            _ctx.textAlign = "center";
            _ctx.textBaseline = "middle";
            _ctx.fillText(this.label, this.width/2, this.height/2);
          },
          renderParams: [ctx]
        }));


    //------------------------    
    function AnimationLoop() {// jangan di hapus;<<<---
      requestAnimFrame(function() {
        AnimationLoopFix();
      });
    }
    function AnimationLoopFix() {    

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      putrear(gambar, gambar.findIndex(function (gbr) {
        return gbr.dragging;
      }));
      gambar.forEach(function (obj) {
        var opts = null;
        obj.render(ctx, opts);
      });
      requestAnimFrame(function() {
        AnimationLoopFix();
      });
    }

    function putrear(arr, pos) {
      if (pos >= arr.length) return;
      var tail = arr.splice(pos);
      var head = tail.shift();
      tail.push(head);
      tail.forEach(function (el) { arr.push(el); });
    }
    
    function mouseDown(e){
      //jangan dihapus
      e = e || window.event;
      
      touchable = false;
      if (TouchEvent)
        touchable = e instanceof TouchEvent;
      
      if(touchable && e.touches.length>1)return;        
      if(touchable)e = e.changedTouches[0];
      var tx = (e.pageX - canvasPos[0])/xScale;
      var ty = (e.pageY - canvasPos[1])/yScale;
      //---------------stat bebas

      gambar.forEach(function (obj) {
        obj.update(tx, ty, {
          postcb: function (x, y) {
            var inArea = this.inArea(x, y);
            if (inArea && this.type.includes("holder"))
              this.occupied = false;
            if (!this.draggable) return;
            if (inArea) {
              this.setDragging(true);
              this.hitx = x - this.x;
              this.hity = y - this.y;
              for (var i = 0; i < this.oldpos.length; i++)
                this.oldpos[i] = this.initpos[i];
            }
          },
          postparams: [tx, ty]
        });
      });

      if (e.preventDefault) e.preventDefault();
      if (e.stopPropagation) e.stopPropagation();
      
    }

    function mouseMove(e){
      //jangan dihapus
      e = e || window.event;
      
      touchable = false;
      if (TouchEvent)
        touchable = e instanceof TouchEvent;
      
      if(touchable)e = e.touches[0];    
      var tx = (e.pageX-canvasPos[0])/xScale;
      var ty = (e.pageY-canvasPos[1])/yScale;
      
      //---------------stat bebas

      gambar.forEach(function (obj) {
        if (obj.dragging)
          obj.update(tx, ty, {
            postcb: function (x, y) {
              this.x = x - this.hitx;
              this.y = y - this.hity;
            },
            postparams: [tx, ty]
          });
      });

      return true;
    }
    function mouseUp(e){
      e = e || window.event;
      //if (!e) var e = window.event;
      
      
      //touchable = false;try{touchable = e instanceof TouchEvent;}catch(e){}
      touchable = false;
      if (TouchEvent)
        touchable = e instanceof TouchEvent;
      //try{touchable = e instanceof TouchEvent;}catch(e){}
      
      if(touchable)e = e.changedTouches[0];        
      var tx = (e.pageX - canvasPos[0])/xScale;
      var ty = (e.pageY - canvasPos[1])/yScale;
      
      //---------------stat

      gambar.forEach(function (obj) {
        if (obj.draggable && obj.dragging) {
          gambar
            .filter(function (o) {
              return o.type.includes("holder");
            })
            .forEach(function (o) {
              if (o.inArea(tx, ty) && !o.occupied && o.occupied !== undefined)
              {
                o.occupied = true;
                obj.update(tx, ty, {
                  postcb: function () {
                    var newx = (o.x + o.width/2) - this.width/2;
                    var newy = (o.y + o.height/2) - this.height/2;
                    this.x = newx;
                    this.y = newy;
                    console.log("x:", this.x, ", y:", this.y);
                    this.oldpos = [newx, newy];
                  }
                }); // end of update
              } else {
                obj.update(tx, ty, {
                  postcb: function () {
                    this.x = this.oldpos[0];
                    this.y = this.oldpos[1];
                  }
                }); // end of update
              }
            }); // end of forEach within filtered gambar
          obj.setDragging(false);
        }
      });

      // check holder occupying state
      gambar
        .filter(function (e) {
          return e.type.includes("holder") && e.occupied; })
        .forEach(function (e) {
          if (gambar
            .filter(function (el) {
              return el.type.includes("dynamic"); })
            .findIndex(function (dyn) {
              return e.inArea(dyn.x, dyn.y); }) === -1)
          {
            e.occupied = false;
          }
        });
      console.log("occupied obj is:", gambar.filter(function (e) {
        return e.type.includes("holder") && e.occupied; }).length);


      if (e.preventDefault) e.preventDefault();
      if (e.stopPropagation) e.stopPropagation();

      return true;
    }
    
    canvas.addEventListener('touchstart',mouseDown,false);  
    canvas.addEventListener('touchmove',mouseMove,false);  
    document.addEventListener('touchend',mouseUp,false);  
    canvas.addEventListener('mousedown',mouseDown,false);  
    canvas.addEventListener('mousemove',mouseMove,false);  
    document.addEventListener('mouseup',mouseUp,false);  
    
    canvasPos = findAbsolutePosition(canvas);
    window.addEventListener("resize",function(){//---jangan di hapus
      setSize(listCanvas,listCtx);
      canvasPos = findAbsolutePosition(canvas);
      gambar.forEach(function (obj) { obj.setScale(xScale, yScale); });
    },false);
    
    AnimationLoop();
  }
}
