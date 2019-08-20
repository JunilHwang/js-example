// dom
const one = ele => document.querySelector(ele)
const all = ele => document.querySelectorAll(ele)
const on = (event, ele, callback) => all(ele).forEach(v => v.addEventListener(event, callback))

// apps
const Block = class {
  constructor (block, color) { this._block = block, this._color = color, this._view = this._block[0] }
  turn (size = this._block.length) {
    this._step = ((this._step || 0) + 1) % size
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

  let now = nextBlock(), next = nextBlock(), x = initX(), y = 0, nextX = x

  const preview = ([data, bg] = [next.get(), next.getColor()]) => `
    <div class="preview">
      ${data.map(col => `
        <div class="col">
          ${col.map(row => `<div class="row"${row ? ` style="background:${bg}"` : '' }></div>`).join('')}
        </div>
      `).join('')}
    </div>
  `

  const ground = (block = now.get(), bg = now.getColor()) => {
    let bY = block.length, bX = block[0].length, i = 0, crashChk2 = 0, crashChk3 = 0
    const crashChk1 = y === 20 - bY

    if (!crashChk1) block.forEach((v1, k1) => v1.forEach((v2, k2) => {
      if (v2) {
        const gy = y + k1, gx = x + k2, nextgx = nextX + k2
        if (groundData[gy][gx] || groundData[gy + 1][gx]) crashChk2 += 1
        if (groundData[gy][nextgx]) crashChk3 += 1
      }
    }))

    if (crashChk1 || crashChk2) {
      block.forEach((v1, k1) => {
        v1.forEach((v2, k2) => {
          if (v2) groundData[y + k1][x + k2] = 1
        })
      })
      now = next, next = nextBlock(), x = initX(), y = 0
    }

    if (!crashChk3) x = nextX
    if (x + bX > 9) x = 10 - bX
    else if (x < 0) x = 0

    return `
      <div class="ground">
        ${groundData.map((col, gY) => {
          const chk1 = gY === y + i
          let j = 0
          const colTpl = `
            <div class="col">
              ${col.map((row, gX) => {
                const chk2 = chk1 && gX === x + j && i < bY && j < bX && block[i][j++]
                return `
                  <div class="row" style="background:${chk2 ? bg : (row ? '#aaa' : 'none')}"></div>
                `
              }).join('')}
            </div>
          `
          if (chk1) i++;
          return colTpl
        }).join('')}
      </div>
    `
  }

  const render = () => {
    document.body.innerHTML = `<div id="app">${ground()} ${preview()}</div>`
  }

  const play = _ => (y += 1, render())

  let clear = false, setTime = 1000, timer = setInterval(play, setTime)

  render()

  document.onkeydown = e => {
    switch (e.keyCode) {
      case 38 : now.turn(); break;
      case 40 : y += 1; break;
      case 37 : nextX = x - 1; break;
      case 39 : nextX = x + 1; break;
    }
    if ([37, 38, 39, 40].indexOf(e.keyCode) !== -1) render()
  }
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