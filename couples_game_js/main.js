(() => {

  // СОЗДАЁМ И ВОЗВРАЩАЕМ ЗАГОЛОВОК ИГРЫ
  function createAppTitle(title) {
    const appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    appTitle.classList.add('app_title');
    return appTitle;
  }

  // СОЗДАЁМ И ВОЗВРАЩАЕМ ФОРМУ ДЛЯ ВХОДА КОЛ-ВА КАРТОЧЕК
  function createNumberOfCardsForm() {
    const form = document.createElement('form');
    const input = document.createElement('input');
    const button = document.createElement('button');

    form.classList.add('number-card_form');
    form.innerText = 'Кол-во карточек по вертикали/горизонтали';
    input.classList.add('number-card_input');
    input.type = 'text';
    input.placeholder = 'Введите четное число от 2 до 10';
    button.classList.add('number-card_button');
    button.textContent = 'Начать игру';

    form.append(input);
    form.append(button);

    return {
      form,
      input,
      button,
    };
  }

  // ПЕРЕМЕННАЯ ДЛЯ setTimeout
  let timerId;

  // ОТРИСОВЫВАЕМ ФОРМЫ И ПЕРЕДАЁМ ВАЛИДНОЕ ЧИСЛО КАРТОЧЕК
  function getNumberOfCards() {
    const formContainer = document.querySelector('.header');
    const gameAppTitle = createAppTitle('Игра в пары');
    const numberOfCardsForm = createNumberOfCardsForm();

    formContainer.append(gameAppTitle);
    formContainer.append(numberOfCardsForm.form);

    // Ввод и проверка чисел на валидность
    numberOfCardsForm.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const inputValue = numberOfCardsForm.input.value;
      if (!inputValue) {
        return;
      }

      const validNumber = checkOnValidation(inputValue);
      if (!validNumber) {
        numberOfCardsForm.input.value = '4';
      } else {
        numberOfCardsForm.input.value = '';
        numberOfCardsForm.button.disabled = true;
        timerId = setTimeout(() => {
          alert('Время игры закончилось');
          window.location.reload();
        }, 60000);
        startOfGame(Math.pow(validNumber, 2));
      }
    });
  }

  // ПРОВЕРЯЕМ ЧИСЛО НА ВХОДЕ
  function checkOnValidation(numb) {
    if (numb > 1 && numb < 11) {
      if (!(numb % 2)) {
        return numb;
      }
    }
    return null;
  }

  // ПЕРЕМЕШИВАЕМ ЗНАЧЕНИЯ В МАССИВЕ ПО МЕТОДУ ФИШЕРА-ЙЕТСА
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      // случайный индекс от 0 до i
      let j = Math.floor(Math.random() * (i + 1));
      let t = array[i];
      array[i] = array[j];
      array[j] = t;
    }
    return array;
  }

  // СОЗДАНИЕ БЛОКА ДЛЯ КАРТОЧЕК, НЕНУМЕРОВАННЫЙ СПИСОК
  function createCardList() {
    const list = document.createElement('ul');
    list.classList.add('cards_list');
    return list;
  }

  // СОЗДАЕТ И ВОЗВРАЩАЕТ КАРТОЧКУ С АТРИБУТАМИ 
  function createCard(idValue, numberOfCards) {
    // Берем ширину контейнера
    const containerWidth = document.querySelector('.main').offsetWidth;
    // Расчет ширины карточки
    const cardWidth = containerWidth * 0.85 / (Math.sqrt(numberOfCards));
    const card = document.createElement('li');
    const button = document.createElement('button');

    card.classList.add('card');
    card.setAttribute("style", `width: ${cardWidth}px; height: ${cardWidth}px;`);
    button.classList.add('btn');
    button.id = idValue;
    button.setAttribute("style", `font-size: ${cardWidth * 0.7}px;`)

    card.append(button);

    return {
      card,
      button,
    };
  }

  // СЧЕТЧИК СОВПАВШИХ ПАР
  let numberOfCoincidences = 0;

  function startOfGame(numberOfCards) {
    // Создаем массив пар цифр расположенных в случайном порядке
    const arrayOfCards = [];
    let valueOfCards = numberOfCards / 2;

    for (let i = 0; i < numberOfCards; ++i) {
      arrayOfCards.push(valueOfCards);
      if (i % 2) {
        --valueOfCards;
      }
    }

    const shuffledArray = shuffle(arrayOfCards); // Перемешиваем массив

    createListOfCards(numberOfCards, shuffledArray); // Создаем карточки и вешаем обработчик
  }

  // СОЗДАЁМ СПИСОК КАРТОЧЕК
  function createListOfCards(numberOfCards, shuffledArray) {
    const section = document.querySelector('.main');
    const listOfCards = createCardList();

    for (let i = 0; i < numberOfCards; ++i) {
      let currentCard = createCard(i, numberOfCards);
      listOfCards.append(currentCard.card);
      currentCard.button.addEventListener('click', () => {
        let valueOfCard = shuffledArray[currentCard.button.id];
        currentCard.button.innerHTML = valueOfCard;
        comparePairs(currentCard, valueOfCard);
        if (numberOfCards === numberOfCoincidences * 2) {  // Проверка на достижение конца игры
          playAgain(); // Функция повтора игры
        }
      });
    }
    section.appendChild(listOfCards);
  }

  // Для записи значения первой карточки {card: currentCard, value: valueOfCards}
  let firstNumberObj = {};
  // Для записи значения второй карточки
  let secondNumberObj = {};
  let isEqual = false;

  // Сравниваем значения карточек, показываем / скрываем их
  function comparePairs(card, value) {
    // Если значение первой карточки пусто записываем переданное значение в эту карточку
    if (!Object.keys(firstNumberObj).length) {
      firstNumberObj = {
        card: card,
        value: value,
      };
      card.button.setAttribute('disabled', 'true');
      // Если значение второй карточки пусто записываем переданное значение в эту карточку
    } else if (!Object.keys(secondNumberObj).length) {
      secondNumberObj = {
        card: card,
        value: value,
      };
      card.button.setAttribute('disabled', 'true');
      if (firstNumberObj.value === secondNumberObj.value) {
        isEqual = true;
        ++numberOfCoincidences;
        return;
      }
    } else {  // Если есть значение и первой и второй карточки
      if (!isEqual) {
        firstNumberObj.card.button.innerHTML = '';
        secondNumberObj.card.button.innerHTML = '';
        firstNumberObj.card.button.removeAttribute('disabled');
        secondNumberObj.card.button.removeAttribute('disabled');
      } else {
        isEqual = false;
      }

      firstNumberObj = {
        card: card,
        value: value,
      };

      card.button.setAttribute('disabled', 'true');
      secondNumberObj = {};
    }
  }

  // КНОПКА "ИГРАТЬ ЕЩЁ РАЗ"
  function playAgain() {
    const section = document.querySelector('.main');
    const button = document.createElement('button');
    button.innerText = 'Сыграть ещё раз';
    button.classList.add('btn-1');
    section.after(button);

    clearTimeout(timerId);

    button.addEventListener('click', () => {
      console.log('Играем ещё раз!');
      window.location.reload();
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    getNumberOfCards();
  });

})();