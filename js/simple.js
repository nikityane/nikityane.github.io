Packer = function(w, h) {
  this.init(w, h);
};

Packer.prototype = {

  init: function(w, h) {
    this.root = { x: 0, y: 0, w: w, h: h };
  },

  fit: function(blocks) {
    var n, node, block, min;
    for (n = 0; n < blocks.length; n++) {
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
    //node.inside = {x: node.x + w, y: node.y,     w: node.w - w, h: h          };
    return node;
  },

  minBlock: function(bl1, bl2) {
    if(bl1.h < bl2.h)
    return bl1;
  else return bl2;
  }

}

