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
  function createTodoItem(name) {
    // создаем елемент списка и задем ему стили
    let item = document.createElement('li');
    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = name;

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

    return { item,
             doneButton,
             deleteButton,
            };
  };

  // Кладем массив обьектов в LocalStorage
  function pushToLocalStorage(title) {
    // Собираем текущий массив дел из DOM
    let curTodoArr = getCurentTodoArr();
    // Переводим в JSON формат
    let curJsonStr = JSON.stringify(curTodoArr);
    // кладем массив в localstorage
    localStorage.setItem(title, curJsonStr);
    // Смотрим что положили
    console.log('Кладем в ', title, curJsonStr);
  }

  // Достаем массив обьектов из LocalStorage по селектору - title
  function getFromLocalStorage(title) {
    // забираем JSON по селектору из из LocalStorage
    let curJsonStr = localStorage.getItem(title);
    // переводим JSON в маcсив обьектов
    let curDoArr = JSON.parse(curJsonStr);
    // Смотрим что достали и распарсили
    console.log('Достали и распарсили в ', title, curDoArr);
    return curDoArr
  };

  // получаем массив списка дел из DOM через CSS селектор
  function getCurentTodoArr() {
    let toDoArr = []
    let todoElements = document.querySelectorAll('li.list-group-item');
    for (curTodoElements of todoElements) {
      // Получаем имя дела
      let curName = curTodoElements.childNodes[0].textContent;
      // проверяем его на сделанность
      let curDone = false;
      if(curTodoElements.classList.contains('list-group-item-success')) {
        curDone = true;
      }
      // собираем обьект
      let curToDo = {name:curName, done:curDone}
      // Пушим обьект в массив
      toDoArr.push(curToDo)
    }
    return toDoArr;
  };

  function makePage(container, title = 'Список Дел', doArr = []) {
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

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

    // Если массив с делами на входе не пустой
    if (doArr.length > 0) {
      // console.log('Массив на вход не пустой');
      // Перебираем элементы массива
      for (cur_item of doArr) {
        // console.log(cur_item);
        // создаем элементы списка
        let todoItem = createTodoItem(cur_item['name']);
        // делаем элемент зеленым, если дело 'done' == true
        if (cur_item['done'] == true) {
          todoItem.item.classList.add('list-group-item-success');
        }
        // добавляем обработчики на кнопки
        todoItem.doneButton.addEventListener('click', function() {
          todoItem.item.classList.toggle('list-group-item-success');
          pushToLocalStorage(title);
        })
        todoItem.deleteButton.addEventListener('click', function() {
          if (confirm('Вы уверены')) {
            todoItem.item.remove();
            pushToLocalStorage(title);
          }
        })
        todoList.append(todoItem.item)
      }
      pushToLocalStorage(title);
    };

    // Функция создания нового элемента списка дел
    todoItemForm.form.addEventListener('submit', function(e) {
      // предотвращаем перезагрузку страницы при отправке формы
      e.preventDefault();
      // если в input пусто то ничего не создаем
      if (!todoItemForm.input.value) {
        return;
      }
      // если поле input не пустое, то создаем новый элемент списка с делом
      // и вешаем обработчики событий на кнопки
      let todoItem = createTodoItem(todoItemForm.input.value);
      // добавляем обработчики на кнопки
      todoItem.doneButton.addEventListener('click', function() {
        todoItem.item.classList.toggle('list-group-item-success');
        pushToLocalStorage(title);
      })
      todoItem.deleteButton.addEventListener('click', function() {
        if (confirm('Вы уверены')) {
          todoItem.item.remove();
          pushToLocalStorage(title);
        }
      })
      todoList.append(todoItem.item)
      // очищаем поле ввода после создания элемента списка с делом
      // и делаем кнопку disabled
      todoItemForm.input.value = '';
      todoItemForm.button.disabled = true;
      pushToLocalStorage(title);
    });
  }

  // Функция проверки наличия и создания ключа для списка дел пользователя
  function createTodoApp(title, doArr) {
    // Проверяем хранилище на наличие массива дел по ключу
    let my_storage = getFromLocalStorage(title);
    console.log(my_storage)
    if (my_storage !== null) {
      // Ключ есть в хранилище
      console.log('my_storage - ', my_storage)
      makePage(document.getElementById('todo-app'), title = title, my_storage);
      pushToLocalStorage(title);
    } else {
      console.log('typeof doArr', typeof doArr)
      if ((typeof doArr !== "undefined") && (doArr.length > 0)) {
        // ключа в хранилище нет, но передан массив с делами на вход
        console.log('doArr - ', doArr)
        // создаем приложение и  список дел для пользователя из LocalStorage
        makePage(document.getElementById('todo-app'), title = title, doArr);
        pushToLocalStorage(title);
      } else {
        // создаем пустой ключ с пустым списком дел для пользователя в LocalStorage
        makePage(document.getElementById('todo-app'), title = title, []);
        pushToLocalStorage(title);
      }
    }
  };

  //window.createTodoApp = createTodoApp;
  window.createTodoApp = createTodoApp;
})();
