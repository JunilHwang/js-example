// dom
const one = ele => document.querySelector(ele)
const all = ele => document.querySelectorAll(ele)
const on = (event, ele, callback) => all(ele).forEach(v => v.addEventListener(event, callback))

// ToDoApp
const Repository = class {
  constructor () { this.selected = 0, this.lastIdx = 1, this.data = [] }
  insert (obj) { this.data.push(obj); return this }
  delete (idx, data = this.data) { data.splice(data.findIndex(v => v.idx === idx * 1), 1) }
  select (idx) { this.selected = idx }
  toggle (idx, target = this.find(idx)) { target.state = !target.state }
  find   (idx) { return this.data.find(v => v.idx === idx * 1) }
  findChildren   (data, idx) { return data.filter(v => v.parent === idx * 1) }
  findCategories (data) { return data.filter(v => v.type === 'category') }
  findContents   (data) { return data.filter(v => v.type === 'content') }
}
const Renderer = class {
  constructor (repo) {this.render(this.repo = repo) }
  tree (list, {findCategories, findContents, findChildren, data, selected} = this.repo) {
    return !list.length ? `` : `
      <ul>
        ${findCategories(list).map(({ idx, name}) => `
          <li class="category ${selected === idx ? 'active' : ''}" data-idx="${idx}">
            <strong>${name}</strong>
            <button type="button" class="delete">삭제</button>
            ${this.tree(findChildren(data, idx))}
          </li>
        `).join('')}
        ${findContents(list).map(({ state, idx, name}) => `
          <li class="content ${state ? 'active' : ''}" data-idx="${idx}">
            <span>${name}</span>
            <button type="button" class="delete">삭제</button>
          </li>
        `).join('')}
      </ul>
    `
  }
  render ({ findChildren, data, selected } = this.repo) {
    document.body.innerHTML = `
      <form action="" method="post">
        <fieldset><legend>입력</legend>
          <label> 타입
            <select name="type">
              <option value="content">내용</option>
              <option value="category">카테고리</option>
            </select>
          </label>
          <label> 내용 <input type="text" name="name" size="20" /> </label>
          <button type="submit">전송</button>
          ${selected ? `<button type="button" class="cancel">취소</button>` : ''}
        </fieldset>
      </form>
      <div id="list">${this.tree(findChildren(data, 0))}</div>
    `
    this.setEvent()
  }

  setEvent (repo = this.repo) {
    on('click', 'button.cancel', _ => (repo.select(0), this.render()))
    on('click', '.category>strong', (e, idx = e.target.parentNode.dataset.idx * 1) => (repo.select(idx), this.render()))
    on('click', '.content>span',    (e, idx = e.target.parentNode.dataset.idx * 1) => (repo.toggle(idx), this.render()))
    on('click', 'button.delete',    (e, idx = e.target.parentNode.dataset.idx * 1) => (repo.delete(idx), this.render()))
    on('submit', 'form', (e, parent = repo.selected, idx = repo.lastIdx++, state = false) => {
      e.preventDefault()
      const [type, name] = [e.target.type.value, e.target.name.value]
      repo.insert({ parent, idx, state, type, name }), this.render()
      one('form').name.focus()
    })
  }
}
const ToDoApp = class {
  constructor () { this.styleSet(), new Renderer(new Repository()) }
  styleSet () {
    one('head').innerHTML += `
      <style>
        #list li {cursor:pointer}
        #list .category>strong{color:#09F;}
        #list .category.active>strong{color:#f09;}
        #list .content.active span::after{content:" [완료]";font-size:11px;color:#09F}
      </style>
    `
  }
}

window.onload = _ => new ToDoApp()