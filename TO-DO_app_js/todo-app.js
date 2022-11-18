(function () {

  // СОЗДАНИЕ СПИСКА ДЕЛ
  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }

  // СОЗДАНИЕ ЗАГОЛОВКА ДЛЯ СПИСКА ДЕЛ
  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }

  // СОЗДАНИЕ ЭЛЕМЕНТОВ ФОРМЫ ДЛЯ ДОБАВЛЕНИЯ ДЕЛ
  function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить дело';

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    button.disabled = true;

    return {
      form,
      input,
      button,
    };
  }

  // СОЗДАНИЕ НОВОГО ДЕЛА
  function createTodoItem(name = 'dsaads') {
    let item = document.createElement('li');
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = name;

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    return {
      item,
      doneButton,
      deleteButton,
    };
  }

  // // ЗАПОЛНЕНИЕ СПИСКА ДЕЛ ПРИ ЗАГРУЗКЕ СТР. ИЗ ЛОК. ХРАН.
  function fillListFromStorage(titleInner, list) {

    // ПРОВЕРКА, ЕСТЬ ЛИ ЧТО-НИБУДЬ В ХРАН.
    if (localStorage.getItem(titleInner)) {
      if (titleInner === 'Мои дела') {
        list.innerHTML = localStorage.getItem(titleInner);
      }
      else if (titleInner === 'Дела папы') {
        list.innerHTML = localStorage.getItem(titleInner);
      }
      else if (titleInner === 'Дела мамы') {
        list.innerHTML = localStorage.getItem(titleInner);
      }
    }

    // НАВЕШИВАНИЕ СОБЫТИЙ НА КНОПКИ
    document.querySelectorAll('.btn-success').forEach(button => {
      button.addEventListener('click', () => {
        button.parentElement.parentElement.classList.toggle('list-group-item-success');
        setTimeout(fillStorage, 500, titleInner, list);
      });
    });
    document.querySelectorAll('.btn-danger').forEach(button => {
      button.addEventListener('click', () => {
        if (confirm('Вы уверены?')) {
          button.parentElement.parentElement.remove();
        }
        setTimeout(fillStorage, 500, titleInner, list);
      });
    });

  }

  // ЗАПОЛНЕНИЕ ХРАНИЛИЩА СОДЕРЖИМЫМ СПИСКА
  function fillStorage(titleInner, list) {

    if (typeof list === 'object') {
      const todoListInner = list.innerHTML;
      if (titleInner === 'Мои дела') {
        localStorage.setItem(titleInner, todoListInner);
      }
      else if (titleInner === 'Дела папы') {
        localStorage.setItem(titleInner, todoListInner);
      }
      else if (titleInner === 'Дела мамы') {
        localStorage.setItem(titleInner, todoListInner);
      }
    }

    else {
      if (titleInner === 'Мои дела') {
        localStorage.setItem(titleInner, list);
      }
      else if (titleInner === 'Дела папы') {
        localStorage.setItem(titleInner, list);
      }
      else if (titleInner === 'Дела мамы') {
        localStorage.setItem(titleInner, list);
      }
    }

  }

  // МОМЕНТ ЗАГРУЗКИ СТРАНИЦЫ
  function createTodoApp(container, title = 'Список дел', todoListArr = null) {

    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);


    // ДОБАВЛЕНИЕ ДЕЛ ПО УМОЛЧАНИЮ, ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
    if (todoListArr !== null) {
      let todoItemOuter =
        localStorage.getItem(todoAppTitle.innerHTML) ? localStorage.getItem(todoAppTitle.innerHTML) : '',

        secondTodoItemOuter = '';
      for (let obj of todoListArr) {
        let todoItem = createTodoItem(obj.name);
        if (obj.done) {
          todoItem.item.classList.add('list-group-item-success');
        }
        todoItemOuter += todoItem.item.outerHTML;
        secondTodoItemOuter += todoItem.item.outerHTML;

        todoItem.doneButton.addEventListener('click', () => {
          todoItem.item.classList.toggle('list-group-item-success');
        });

        todoItem.deleteButton.addEventListener('click', () => {
          if (confirm('Вы уверены?')) {
            todoItem.item.remove();
          }
        });
      }
      if (secondTodoItemOuter === todoItemOuter) {
        fillStorage(todoAppTitle.innerHTML, todoItemOuter);
      }
    }

    fillListFromStorage(todoAppTitle.innerHTML, todoList);

    // СОБЫТИЕ ДОБАВЛЕНИЯ НОВОГО ДЕЛА
    todoItemForm.form.addEventListener('submit', function (e) {
      e.preventDefault();

      let todoItem = createTodoItem(todoItemForm.input.value);

      setTimeout(fillStorage, 500, todoAppTitle.innerHTML, todoList);

      if (!todoItemForm.input.value) {
        return;
      }

      todoItemForm.button.disabled = true;


      // СОБЫТИЕ НАЖАТИЯ НА "ГОТОВО"
      todoItem.doneButton.addEventListener('click', function () {
        todoItem.item.classList.toggle('list-group-item-success');
        setTimeout(fillStorage, 500, todoAppTitle.innerHTML, todoList);
      });

      // СОБЫТИЕ НАЖАТИЯ НА "УДАЛИТЬ"
      todoItem.deleteButton.addEventListener('click', function () {
        if (confirm('Вы уверены?')) {
          todoItem.item.remove();
        }
        setTimeout(fillStorage, 500, todoAppTitle.innerHTML, todoList);
      });

      todoList.append(todoItem.item);
      todoItemForm.input.value = '';
    });


    // СОБЫТИЕ ВВОДА ТЕКСТА В ИНПУТ (ПРИ ПУСТОМ ПОЛЕ КНОПКА БЛОКИРУЕТСЯ)
    todoItemForm.input.addEventListener('input', () => {
      if (todoItemForm.input.value) {
        todoItemForm.button.disabled = false;
      } else {
        todoItemForm.button.disabled = true;
      }
    });
  }

  window.createTodoApp = createTodoApp;
})();
