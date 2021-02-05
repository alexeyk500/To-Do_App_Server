(function(){
  // Создаем и возвращаем заголовок приложения
  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }

  // Создаем и возвращаем форму для создания дела
  function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    // очищаем input и делаем кнопку disabled
    input.value = '';
    button.disabled = true;
    // console.log('На старте установил - button.disabled = true;')

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить дело';

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    return { form,
             input,
             buttonWrapper,
             button,
            };
  }

  // Создаем и возвращаем список дел
  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }

  // Создаем и возвращаем элемент списка дел
  function createTodoItemElement(todoItem, {onDone, onDelete}) {
    // создаем елемент списка и задем ему стили
    let item = document.createElement('li');
    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = todoItem.name;

    // создем кнопки, задаем им стили и пакуем их в группу
    let doneButton = document.createElement('button');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    let deleteButton = document.createElement('button');
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить'
    let buttonGroup = document.createElement('div');
    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    // Если дело сделано, то отмечаем его классом list-group-item-success
    if (todoItem.done) {
      item.classList.add('list-group-item-success')
    }

    // вешаем обработчики событий на кнопки
    doneButton.addEventListener('click', function() {
      onDone({todoItem, element: item});
      item.classList.toggle('list-group-item-success', todoItem.done);
    });
    deleteButton.addEventListener('click', function() {
      onDelete({todoItem, element: item});
    });

    return item;
  };

  async function  createTodoApp(title = 'Список Дел') {
    const todoAppTitle = createAppTitle(title);
    const todoItemForm = createTodoItemForm();
    const todoList = createTodoList();
    const container = document.getElementById('todo-app');

    const handlers = {
      onDone({todoItem}) {
        console.log('before - todoItem.done', todoItem.done)
        todoItem.done = !todoItem.done;
        console.log('after - todoItem.done', todoItem.done)
        fetch(`http://localhost:3000/api/todos/${todoItem.id}`,{
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ done: todoItem.done })
        });
      },
      onDelete({todoItem, element}) {
        if (confirm('Вы уверены')) {
          element.remove();
          fetch(`http://localhost:3000/api/todos/${todoItem.id}`,{
            method: 'DELETE'
          });
        };
      }
    };

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    // Отправляем запрос к серверу на список всех дел по владельцу
    const response = await fetch(`http://localhost:3000/api/todos?owner=${title}`);
    const todoItemList = await response.json();
    console.log('todoItemList', todoItemList)

    // Создаем список дел
    todoItemList.forEach(todoItem => {
      const todoItemElement = createTodoItemElement(todoItem, handlers);
      todoList.append(todoItemElement);
    })

    // если в input что-то ввели,то делаем кнопку enabled
    todoItemForm.input.addEventListener('input', function() {
      if (todoItemForm.input.value) {
        // console.log('Обнаружил печать в input')
        todoItemForm.button.disabled = false;
      } else {
        // console.log('Обнаружил печать в input, input опять пустой')
        todoItemForm.button.disabled = true;
      }
    });

    // Cоздание нового элемента списка дел
    todoItemForm.form.addEventListener('submit', async function(e) {
      // предотвращаем перезагрузку страницы при отправке формы
      e.preventDefault();
      // если в input пусто то ничего не создаем
      if (!todoItemForm.input.value) {
        return;
      }
      // если поле input не пустое, то post дело на сервер
      const response = await fetch('http://localhost:3000/api/todos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: todoItemForm.input.value.trim(),
            owner: title,
          })
        });
      // создаем новый элемент списка с делом из ответа сервера
      const todoItem = await response.json();
      todoItemElement = createTodoItemElement(todoItem, handlers);
      todoList.append(todoItemElement)
      // очищаем поле ввода после создания элемента списка с делом и делаем кнопку disabled
      todoItemForm.input.value = '';
      todoItemForm.button.disabled = true;
    });

  }

  window.createTodoApp = createTodoApp;
})();
