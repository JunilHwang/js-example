// dom
const one = (ele, parent = document) => parent.querySelector(ele)
const all = (ele, parent = document) => parent.querySelectorAll(ele)
const create = ele => document.createElement(ele)
const addClass = (ele, className) => ele.classList.add(className)
const removeClass = (ele, className) => ele.classList.remove(className)
const toggleClass = (ele, className) => ele.classList.toggle(className)
const hasClass = (ele, className) => ele.classList.contains(className)
const t2e = (text, wrap = create('div')) => (wrap.innerHTML = text, wrap.children[0])
const on = (event, ele, callback) => all(ele).forEach(v => v.addEventListener(event, callback))

const app = () => {

  const data = []
  let selected = 0, lastIdx = 1
  const doubleNum = num => `0${num}`.substr(-2)
  const render = _ => {
    const listRender = listData => {
      if(!listData.length) return ''
      const categories = listData.filter(v => v.type === 'category' )
      const contents = listData.filter(v => v.type !== 'category' )
      return `
        <ul>
          ${categories.map(v => `
            <li class="category ${selected === v.idx ? 'active' : ''}" data-idx="${v.idx}">
              <strong>${v.name}</strong>
              <button type="button" class="delete">삭제</button>
              ${listRender(v.children)}
            </li>
          `).join('')}
          ${contents.map(v => `
            <li class="content ${v.state ? 'active' : ''}" data-idx="${v.idx}">
              <span>${v.name}</span>
              <button type="button" class="delete">삭제</button>
            </li>
          `).join('')}
        </ul>
      `
    }
    const minDate = (date = new Date()) => `${date.getFullYear()}-${doubleNum(date.getMonth() + 1)}-${doubleNum(date.getDate())}`
    data.forEach(v => v.children = data.filter(v2 => v2.parent === v.idx))
    const bodyRender = `
      <form action="" method="post">
        <fieldset><legend>입력</legend>
          <p>
            <label>
              <span>타입</span>
              <select name="type">
                <option value="content">내용</option>
                <option value="category">카테고리</option>
              </select>
            </label>
          </p>
          <p>
            <label>
              <span>내용</span>
              <input type="text" name="name" size="20" />
            </label>
          </p>
          <p>
            <button type="submit">전송</button>
            ${selected ? `<button type="button" class="cancel">취소</button>` : ''}
          </p>
        </fieldset>
      </form>
      <div id="list">${listRender(data.filter(v => v.parent === 0))}</div>
    `

    document.body.innerHTML = bodyRender

    on('click', 'button.cancel', cancel)
    on('click', '.category>strong', select)
    on('click', '.content>span', toggle)
    on('click', 'button.delete', dataDelete)
    on('submit', 'form', dataInsert)
  }
  const cancel = e => {
    selected = 0
    render()
  }
  const select = e => {
    const idx = e.target.parentNode.dataset.idx * 1
    selected = idx === selected ? null : idx
    render()
  }
  const toggle = e => {
    const idx = e.target.parentNode.dataset.idx * 1
    const content = data.find(v => v.idx === idx * 1)
    content.state = !content.state
    render()
  }
  const dataInsert = e => {
    e.preventDefault()
    const { target } = e
    const [type, name] = Array.from(new FormData(target).values())
    const obj = {parent: selected , idx: lastIdx++, type, name}
    if (type === 'category') obj.children = []
    else obj.state = false
    data.push(obj)
    render()
    one('form').name.focus()
  }
  const dataDelete = e => {
    const idx = e.target.parentNode.dataset.idx * 1
    const key = data.findIndex(v => v.idx === idx)
    data.splice(key, 1)
    render()
  }

  one('head').appendChild(t2e(`
    <style>
      #list li {cursor:pointer}
      #list .category>strong{color:#09F;}
      #list .category.active>strong{color:#f09;}
      #list .content.active span::after{content:" [완료]";font-size:11px;color:#09F}
    </style>
  `))
  render()
}

window.onload = app