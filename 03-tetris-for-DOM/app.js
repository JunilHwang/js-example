// dom
const one = ele => document.querySelector(ele)
const all = ele => document.querySelectorAll(ele)
const on = (event, ele, callback) => all(ele).forEach(v => v.addEventListener(event, callback))

// apps
const Block = class {
  constructor (block, color) { this.block = block, this.color = color, this.view = this.block[0] }
  turn (step, size = this.blocks.length) {
    if (step < 0) step = size - 1
    this.step = step % size
    this.view = this.block[this.step]
  }
}

const blocks = [
  new Block([[[1,1],[1,1]]], '#09F'),
  new Block([[[1,1,1,1]], [[1],[1],[1],[1]]], '#F00'),
  new Block([[[1,1,0],[0,1,1]],[[0,1],[1,1],[1,0]]], '#9F0'),
  new Block([[[0,1,1],[1,1,0]],[[1,0],[1,1],[0,1]]], '#90F'),
  new Block([[[0,1,0],[1,1,1]],[[1,0],[1,1],[1,0]],[[1,1,1],[0,1,0]],[[0,1],[1,1],[0,1]]], '#f90'),
  new Block([[[1,1,1],[0,0,1]],[[0,1],[0,1],[1,1]],[[1,0,0],[1,1,1]],[[1,1],[1,0],[1,0]]], '#0F9'),
  new Block([[[1,1,1],[1,0,0]],[[1,1],[0,1],[0,1]],[[0,0,1],[1,1,1]],[[1,0],[1,0],[1,1]]], '#F09'),
]

const data = [
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
]

const render = () => {
  const preview = () => {
    return ``
  }

  const ground = () => `
    <div class="ground">
      ${data.map(col => `
        <div class="col">
          ${col.map(row => `<div class="row"></div>`).join('')}
        </div>
      `).join('')}
    </div>
  `
  document.body.innerHTML = `
    <div id="app">
      ${ground()}
      ${preview()}
    </div>
  `
}

one('head').innerHTML += `
  <style>
    *{margin:0;padding:0;}
    #app{display:flex;}
    .ground{border:2px solid #666;margin:30px;}
    .preview{padding:30px;border:2px solid #666}
    .col{display:flex;}
    .row{width:30px;height:30px;border:1px dotted #ddd;background:#fafafa;}
    .row+.row{margin-left:-1px;}
    .col+.col{margin-top:-1px}
  </style>
`

render()