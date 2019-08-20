// dom
const one = ele => document.querySelector(ele)
const all = ele => document.querySelectorAll(ele)
const on = (event, ele, callback) => all(ele).forEach(v => v.addEventListener(event, callback))

// apps
const Block = class {
  constructor (block, color) { this._block = block, this._color = color, this._view = this._block[0] }
  turn (type, size = this._blocks.length) {
    let step = this._step + type
    if (step < 0) step = size - 1
    this._step = step % size
    this._view = this._block[this._step]
  }
  get () { return this._view }
  getColor () { return this._color }
}

const blocks = [
  _ => new Block([[[1,1],[1,1]]], '#59C'),
  _ => new Block([[[1,1,1,1]], [[1],[1],[1],[1]]], '#C00'),
  _ => new Block([[[1,1,0],[0,1,1]],[[0,1],[1,1],[1,0]]], '#9C5'),
  _ => new Block([[[0,1,1],[1,1,0]],[[1,0],[1,1],[0,1]]], '#95C'),
  _ => new Block([[[0,1,0],[1,1,1]],[[1,0],[1,1],[1,0]],[[1,1,1],[0,1,0]],[[0,1],[1,1],[0,1]]], '#C95'),
  _ => new Block([[[1,1,1],[0,0,1]],[[0,1],[0,1],[1,1]],[[1,0,0],[1,1,1]],[[1,1],[1,0],[1,0]]], '#5C9'),
  _ => new Block([[[1,1,1],[1,0,0]],[[1,1],[0,1],[0,1]],[[0,0,1],[1,1,1]],[[1,0],[1,0],[1,1]]], '#C59'),
]

const nextBlock = (rand = ~~(Math.random() * 7)) => blocks[rand]()
const game = () => {
  const groundData = [
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

  const initX = _ => 5 - ~~(now.get()[0].length / 2)

  let now = nextBlock(), next = nextBlock(), x = initX(), y = 0, crashed = false
  const preview = ([data, bg] = [next.get(), next.getColor()]) => `
    <div class="preview">
      ${data.map(col => `
        <div class="col">
          ${col.map(row => `<div class="row"${row ? ` style="background:${bg}"` : '' }></div>`).join('')}
        </div>
      `).join('')}
    </div>
  `

  const ground = () => {
    const block = now.get(), bg = now.getColor()
    let bY = block.length, bX = block[0].length, i = 0
    return `
      <div class="ground">
        ${groundData.map((col, gY) => {
          const chk1 = gY === y + i
          let j = 0
          const colTpl = `
            <div class="col">
              ${col.map((row, gX) => {
                const chk2 = chk1 && gX === x + j && i < bY && j < bX
                return `
                  <div class="row" ${chk2 && block[i][j++] ? `style="background:${bg}"` : ''}></div>
                `
              }).join('')}
            </div>
          `
          if (chk1) i++;
          if (y === 20 - bY) {
            crashed = true
          }
          return colTpl
        }).join('')}
      </div>
    `
  }

  const render = () => {
    document.body.innerHTML = `
      <div id="app">
        ${ground()}
        ${preview()}
      </div>
    ` 
  }

  setInterval(_ => {
    y += 1
    if (crashed) {
      now = next, next = nextBlock(), x = initX(), y = 0
      crashed = false
    }
    render()
  }, 100)

  render()
}

one('head').innerHTML += `
  <style>
    *{margin:0;padding:0;}
    #app{display:flex;padding:30px;align-items:flex-start;}
    .ground{border:2px solid #666;margin-right:30px;}
    .preview{padding:30px;border:2px solid #666}
    .col{display:flex;}
    .row{width:40px;height:40px;border:1px dotted #ddd;background:#fafafa;}
    .row+.row{margin-left:-1px;}
    .col+.col{margin-top:-1px}
  </style>
`

game()