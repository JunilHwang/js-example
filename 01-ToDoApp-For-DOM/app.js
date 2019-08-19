// dom
const one = ele => document.querySelector(ele)
const all = ele => document.querySelectorAll(ele)
const on = (event, ele, callback) => all(ele).forEach(v => v.addEventListener(event, callback))

// ToDoApp
const app = () => {
  const data = []
  let selected = 0, lastIdx = 1
  const doubleNum = num => `0${num}`.substr(-2)
  const render = _ => {
    const tree = (listData, categories = [], contents = []) => {
      if(!listData.length) return ''
      listData.forEach(v => v.type === 'category' ? categories.push(v) : contents.push(v) )
      return `
        <ul>
          ${categories.map(({ idx, name}) => `
            <li class="category ${selected === idx ? 'active' : ''}" data-idx="${idx}">
              <strong>${name}</strong>
              <button type="button" class="delete">삭제</button>
              ${tree(data.filter(({ parent }) => parent === idx))}
            </li>
          `).join('')}
          ${contents.map(({ state, idx, name}) => `
            <li class="content ${state ? 'active' : ''}" data-idx="${idx}">
              <span>${name}</span>
              <button type="button" class="delete">삭제</button>
            </li>
          `).join('')}
        </ul>
      `
    }
    document.body.innerHTML = `
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
              <input type="text" name="name" size="20" autofocus />
            </label>
          </p>
          <p>
            <button type="submit">전송</button>
            ${selected ? `<button type="button" class="cancel">취소</button>` : ''}
          </p>
        </fieldset>
      </form>
      <div id="list">${tree(data.filter(v => v.parent === 0))}</div>
    `

    on('click', 'button.cancel', cancel)
    on('click', '.category>strong', select)
    on('click', '.content>span', toggle)
    on('click', 'button.delete', dataDelete)
    on('submit', 'form', dataInsert)
  }
  const cancel = _ => (selected = 0, render())
  const select = (e, idx = e.target.parentNode.dataset.idx * 1) => { selected = idx, render() }
  const toggle = (e, idx = e.target.parentNode.dataset.idx * 1) => {
    data.forEach(v => (v.idx === idx) && (v.state = !v.state))
    render()
  }
  const dataDelete = (e, idx = e.target.parentNode.dataset.idx * 1) => {
    data.splice(data.findIndex(v => v.idx === idx), 1)
    render()
  }
  const dataInsert = (e, parent = selected, idx = lastIdx++, state = false) => {
    e.preventDefault()
    const [type, name] = [e.target.type.value, e.target.name.value]
    data.push({ parent, idx, state, type, name })
    render()
    one('form').name.focus()
  }
  one('head').innerHTML += `
    <style>
      #list li {cursor:pointer}
      #list .category>strong{color:#09F;}
      #list .category.active>strong{color:#f09;}
      #list .content.active span::after{content:" [완료]";font-size:11px;color:#09F}
    </style>
  `
  render()
}

window.onload = app