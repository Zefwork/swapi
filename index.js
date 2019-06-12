window.addEventListener('DOMContentLoaded', function () {

  // Получаем HTML-элементы со страницы
  let btn = document.querySelector('.sw-btn'),
      content = document.querySelector('.content'),
      modal = document.querySelector('.modal'),
      modalBody = document.querySelector('.modal-body'),
      closeBtn = document.querySelector('.close-btn'),
      filmsList = document.createElement('ul');

  // Получаем фильмы из swapi
  function getFilms() {
    axios.get('https://swapi.co/api/films/').then(res => {
      // Добавляем список к блоку с контентом
      content.appendChild(filmsList);
      // Цикл, который добавляет фильмы в зависимости от их кол-ва на swapi.co
      for (var i = 0; i < res.data.results.length; i++) {
        // Сортируем фильмы по дате выхода
        res.data.results.sort(function (a, b) {
          let dateA = new Date(a.release_date), dateB = new Date(b.release_date);
          return dateA - dateB;
        });

        (function updateFilms() {
          // Создаём html-элементы для описания фильма
          let addFilm = document.createElement('li'),
              addFilmAnchor = document.createElement('a'),
              addFilmId = document.createElement('p'),
              addFilmCrawl = document.createElement('p'),
              addFilmDirector = document.createElement('p'),
              addFilmDate = document.createElement('p');
          
          // Добавляем текст в созданные элементы
          addFilmAnchor.textContent = res.data.results[i].title;
          addFilmId.textContent = `Episode ID: ${res.data.results[i].episode_id}`;
          addFilmCrawl.textContent = `Episode description: ${res.data.results[i].opening_crawl}`;
          addFilmDirector.textContent = `Episode director: ${res.data.results[i].director}`;
          addFilmDate.textContent = `Episode release date: ${res.data.results[i].release_date}`;

          // Добавляем созданные элементы к списку
          filmsList.appendChild(addFilm);
          addFilm.append(addFilmAnchor, addFilmId, addFilmCrawl, addFilmDirector, addFilmDate);
        })();
      }

      // Находим все названия фильмов по тегу
      let links = document.getElementsByTagName('a');
      // Цикл, который обрабатывает все найденные ссылки
      for (let j = 0; j < links.length; j++) {
        // Функция, срабатывающая при нажатии на ссылку
        links[j].onclick = function() {
          // Включение модального окна
          modal.style.display = 'block';
          // Создание нуерованного списка для персонажей фильма
          let charsList = document.createElement('ol');
          // Добавляем к телу модального окна список персонажей
          modalBody.appendChild(charsList);
          // Создаём переменную для получения списка персонажей из swapi.co
          let chars = res.data.results[j].characters;
          // Цикл, перебирающий всех персонажей фильма
          for (let k = 0; k < chars.length; k++) {
            const element = chars[k];
            // Получаем список персонажей из swapi.co
            axios.get(element).then(res => {
              // Создаём html-элементы для описания персонажей
              let addChar = document.createElement('li'),
                  addCharName = document.createElement('p'),
                  addCharGender = document.createElement('p');

              // Добавляем текст к созданным элементам
              addCharName.textContent = `Character name: ${res.data.name}`;
              addCharGender.textContent = `Character gender: ${res.data.gender}`;

              // Добавляем созданные элементы к нумерованному списку
              charsList.appendChild(addChar);
              addChar.append(addCharName, addCharGender);
            })
          }
          // Вешаем на кнопку Х закрытие модального окна
          closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            // Удаляем список с именами и полом персонажей, для того чтобы при следующем нажатии создавался новый список
            modalBody.removeChild(modalBody.childNodes[0]);
          });
          // Закрытие модального окна при клике не на модальное окно
          window.addEventListener('click', (e) => {
            if (e.target == modal) {
              modal.style.display = 'none';
              modalBody.removeChild(modalBody.childNodes[0]);
            }
          })
        }
      }
    }).catch(err => {
      // Фиксация возможных ошибок
      console.log("An error occured");
    })
  };

  // Вешаем событие - при клике на кнопку загружается список фильмов
  btn.addEventListener('click', getFilms);
});