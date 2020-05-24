GrowingPacker = function() { };

GrowingPacker.prototype = {

  fit: function(blocks) {
    var n, node, block, block2, len = blocks.length;
    var w = len > 0 ? blocks[0].w + blocks[1].w : 0;
    var h = len > 0 ? blocks[0].h + blocks[1].h : 0;
    this.root = { x: 0, y: 0, w: w, h: h };
    for (n = 0; n < len ; n++) {
      block = blocks[n];
      block2 = blocks[n+1];
      if (node = this.findNode(this.root, (block.w+block2.w), Math.max(block.h,block2.h))) {
         block.fit = this.splitNode(node, (block.w+block2.w), Math.max(block.h,block2.h));
         block2.fit = { x: block.w + block.fit.x, y: block.fit.y};
         block2.fit.down = block.fit.down;
         block2.fit.right = block.fit.right;
         if(block.h != block2.h) {
           min = this.minBlock(block,block2);
           //console.log(min);
           block.fit.inside = {x: min.fit.x, y: min.fit.y + min.h, w: min.w, h: Math.max(block.h,block2.h) - min.h};
           block2.fit.inside = block.fit.inside;
         }
         else {
          block.fit.inside = {x: block.fit.x, y: block.fit.y + block.h, w: 0, h: 0};
           block2.fit.inside = block.fit.inside;
         }
      }
      else {
        block.fit = this.growNode((block.w+block2.w), Math.max(block.h,block2.h));
       //  block2.fit = { x: block.w + block.fit.x, y: block.fit.y};
       //   block2.fit.down = block.fit.down;
       //   block2.fit.right = block.fit.right;
       // if(block.h != block2.h) {
       //   min = this.minBlock(block,block2);
       //   //console.log(min);
       //   block.fit.inside = {x: min.fit.x, y: min.fit.y + min.h, w: min.w, h: Math.max(block.h,block2.h) - min.h};
       //   block2.fit.inside = block.fit.inside;
       // }
       // else {
       //  block.fit.inside = {x: block.fit.x, y: block.fit.y + block.h, w: 0, h: 0};
       //   block2.fit.inside = block.fit.inside;
       // }

      }
      n++;
    }
  },

  findNode: function(root, w, h) {
    if (root.used)
      return this.findNode(root.inside, w, h) || this.findNode(root.right, w, h) || this.findNode(root.down, w, h);
    else if ((w <= root.w) && (h <= root.h))
      return root;
    else
      return null;
  },

  splitNode: function(node, w, h) {
    node.used = true;
    node.down  = { x: node.x,     y: node.y + h, w: node.w,     h: node.h - h };
    node.right = { x: node.x + w, y: node.y,     w: node.w - w, h: h          };
    return node;
  },

  growNode: function(w, h) {
    var canGrowDown  = (w <= this.root.w);
    var canGrowRight = (h <= this.root.h);

    var shouldGrowRight = canGrowRight && (this.root.h >= (this.root.w + w)); 
    var shouldGrowDown  = canGrowDown  && (this.root.w >= (this.root.h + h)); 

    if (shouldGrowRight)
      return this.growRight(w, h);
    else if (shouldGrowDown)
      return this.growDown(w, h);
    else if (canGrowRight)
     return this.growRight(w, h);
    else if (canGrowDown)
      return this.growDown(w, h);
    else
      return null;
  },

  growRight: function(w, h) {
    this.root = {
      used: true,
      x: 0,
      y: 0,
      w: this.root.w + w,
      h: this.root.h,
      down: this.root,
      right: { x: this.root.w, y: 0, w: w, h: this.root.h }
    };
    if (node = this.findNode(this.root, w, h))
      return this.splitNode(node, w, h);
    else
      return null;
  },

  growDown: function(w, h) {
    this.root = {
      used: true,
      x: 0,
      y: 0,
      w: this.root.w,
      h: this.root.h + h,
      down:  { x: 0, y: this.root.h, w: this.root.w, h: h },
      right: this.root
    };
    if (node = this.findNode(this.root, w, h))
      return this.splitNode(node, w, h);
    else
      return null;
  },

  minBlock: function(bl1, bl2) {
    if(bl1.h < bl2.h)
    return bl1;
  else return bl2;
  }

}


