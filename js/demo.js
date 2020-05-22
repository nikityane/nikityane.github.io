Demo = {

  init: function() {

    Demo.el = {
      blocks:   $('#blocks'),
      canvas:   $('#canvas')[0],
      size:     $('#size'),
      sort:     $('#sort'),
      ratio:    $('#ratio'),
      box:      $('#box'),
      nofit:    $('#nofit')
    };

    if (!Demo.el.canvas.getContext)
      return false;

    Demo.el.draw = Demo.el.canvas.getContext("2d");
    Demo.el.blocks.change(Demo.run);
    Demo.el.size.change(Demo.run);
    Demo.el.sort.change(Demo.run);
    Demo.run();
    Demo.el.blocks.keypress(function(ev) {
      if (ev.which == 13)
        Demo.run();
    });
  },

  timer: function() {
    console.log(performance.now());
    
  },
  //---------------------------------------------------------------------------

  run: function() {

    var blocks = Demo.blocks.deserialize(Demo.el.blocks.val());
    var packer = Demo.packer();
    Demo.timer();
    Demo.sort.now(blocks);

    packer.fit(blocks);

    Demo.canvas.reset(packer.root.w, packer.root.h);
    Demo.canvas.blocks(blocks);
    Demo.canvas.boundary(packer.root);
    Demo.report(blocks, packer.root.w, packer.root.h);

  },

  //---------------------------------------------------------------------------

  packer: function() {
    var size = Demo.el.size.val();
    if (size == 'Авто') {
      return new GrowingPacker();
    }
    else {
      var dims = size.split("x");
      return new Packer(parseInt(dims[0]), parseInt(dims[1]));
    }
  },

  //---------------------------------------------------------------------------

  report: function(blocks, w, h) {
    var fit = 0, nofit = [], block, n, len = blocks.length;
    for (n = 0 ; n < len ; n++) {
      block = blocks[n];
      if (block.fit)
        fit = fit + block.area;
      else
        nofit.push("" + block.w + "x" + block.h);
    }
    Demo.el.box.html("Размер<br>контейнера: " + (Demo.el.canvas.width-1) + "х" + (Demo.el.canvas.height - 1)).toggle(Demo.el.size.val() == 'Авто');
    Demo.el.ratio.html("Заполнено: " + Math.round(100 * fit / (w * h)) + "%").toggle(true);
    Demo.el.nofit.html("Не вошло в контейнер (" + nofit.length + ") :<br>" + nofit.join(", ")).toggle(nofit.length > 0);
    Demo.timer();
  },

  //---------------------------------------------------------------------------

  sort: {
    w       : function (a,b) { return b.w - a.w; },
    h     : function (a,b) { return b.h - a.h; },
    a       : function (a,b) { return b.area - a.area; },
    max     : function (a,b) { return Math.max(b.w, b.h) - Math.max(a.w, a.h); },
    min     : function (a,b) { return Math.min(b.w, b.h) - Math.min(a.w, a.h); },

    Ширина  : function (a,b) { return Demo.sort.msort(a, b, ['h', 'w']);               },
    Высота  : function (a,b) { return Demo.sort.msort(a, b, ['w', 'h']);               },
    Площадь : function (a,b) { return Demo.sort.msort(a, b, ['max', 'min', 'h', 'w']); },

    msort: function(a, b, criteria) {
      var diff, n;
      for (n = 0 ; n < criteria.length ; n++) {
        diff = Demo.sort[criteria[n]](a,b);
        if (diff != 0)
          return diff;  
      }
      return 0;
    },

    now: function(blocks) {
      var sort = Demo.el.sort.val();
      if (sort != 'Нет')
        blocks.sort(Demo.sort[sort]);
    }
  },

  //---------------------------------------------------------------------------

  canvas: {

    reset: function(width, height) {
      Demo.el.canvas.width  = width  + 1; 
      Demo.el.canvas.height = height + 1;
      Demo.el.draw.clearRect(0, 0, Demo.el.canvas.width, Demo.el.canvas.height);
    },

    rect:  function(x, y, w, h, color) {
      Demo.el.draw.fillStyle = color;
      Demo.el.draw.fillRect(x + 0.5, y + 0.5, w, h);
    },

    stroke: function(x, y, w, h) {
      Demo.el.draw.strokeRect(x + 0.5, y + 0.5, w, h);
    },

    blocks: function(blocks) {
      var n, block;
      var col = 0;
      for (n = 0 ; n < blocks.length ; n++) {
        if(col > 1) col = 0;
        block = blocks[n];
                if (block.fit)
          Demo.canvas.rect(block.fit.x, block.fit.y, block.w, block.h, Demo.color(n-col));
        col++;


      }
    },
    
    boundary: function(node) {
      if (node) {
        Demo.canvas.stroke(node.x, node.y, node.w, node.h);
        Demo.canvas.boundary(node.down);
        Demo.canvas.boundary(node.right);
        Demo.canvas.boundary(node.inside);
      }
    }
  },

  //---------------------------------------------------------------------------

  blocks: {
    // change: function() {
    //   Demo.el.blocks.val(Demo.blocks.deserialize(Demo.el.blocks.val()));
    //   Demo.run();
    // },

    deserialize: function(val) {
      var i, j, block, blocks = val.split("\n"), result = [];
      for(i = 0 ; i < blocks.length ; i++) {
        block = blocks[i].split("x");
        if (block.length >= 2)
          result.push({w: parseInt(block[0]), h: parseInt(block[1]), num: (block.length == 2 ? 1 : parseInt(block[2])) });
      }console.log(result);
      var expanded = [];
      for(i = 0 ; i < result.length ; i++) {
        for(j = 0 ; j < result[i].num ; j++)
          expanded.push({w: result[i].w, h: result[i].h, area: result[i].w * result[i].h});
      }
      console.log(expanded);
      return expanded;
    }
  },

  //---------------------------------------------------------------------------

  color: function(n) {
    var cols = [ "silver", "gray", "red", "maroon", "yellow", "olive", "lime", "green", "aqua", "teal", "blue", "navy", "fuchsia", "purple" ];
    return cols[n % cols.length];
  }

  //---------------------------------------------------------------------------

}
// var time = performance.now();
// // некий код
// time = performance.now() - time;
// console.log('Время выполнения = ', time);
//Demo.timer();
$(Demo.init);

