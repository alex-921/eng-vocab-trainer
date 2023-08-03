export class WordView {
  private answerElement: HTMLElement;
  private shuffledElement: HTMLElement;
  private handleLetterClick: (letter: string, index: number) => void;

  constructor() {
    this.answerElement = document.getElementById('answer-letters')!;
    this.shuffledElement = document.getElementById('shuffled-letters')!;
    this.handleLetterClick = () => {};
  }

  clearAll() {
    this.answerElement.innerHTML = '';
    this.shuffledElement.innerHTML = '';
  }

  // контейнер с перемешанными буквами
  displayShuffledWord(letters: string[]): void {
    letters.forEach((letter, index) => {
      const letterElement = document.createElement('button');

      letterElement.textContent = letter;
      letterElement.id = `user-letter-${index}`;
      letterElement.className = 'btn btn-primary letter';

      letterElement.addEventListener('click', () => {
        this.handleLetterClick(letter, index);
      });

      this.shuffledElement.appendChild(letterElement);
    });
  }

  // введенное пользователем слвоо
  displayInputtedWord(letters: string[]): void {
    letters.forEach((letter) => {
      const letterElement = document.createElement('div');

      letterElement.textContent = letter;
      letterElement.className = 'btn btn-success letter';

      this.answerElement.appendChild(letterElement);
    });
  }

  bindInputLetter(handler: (letter: string, index: number) => void): void {
    this.handleLetterClick = handler;
  }

  // Подсветка введенной некорректной буквы
  showFailtureLetter(index: number) {
    const letterElement = document.getElementById(`user-letter-${index}`);

    if (letterElement) {
      letterElement.className = 'btn btn-danger letter';

      setTimeout(
        () => (letterElement.className = 'btn btn-primary letter'),
        1000
      );
    }
  }

  // Отображение правильного слово, при достижении 3-х ошибок
  showFailtureWord(letters: string[]) {
    this.clearAll();

    letters.forEach((letter) => {
      const letterElement = document.createElement('button');

      letterElement.textContent = letter;
      letterElement.className = 'btn btn-danger letter';

      this.answerElement.appendChild(letterElement);
    });

    return new Promise((res) => setTimeout(res, 1000));
  }
}
