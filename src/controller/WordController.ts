import { WordModel } from '../model/WordModel';
import { WordView } from '../view/WordView';
import { WordListController } from './WordListController';

import { shuffle } from '../helpers/helper';

export class WordController {
  model: WordModel;
  view: WordView;
  wordListController: WordListController;
  isRestored: boolean;

  constructor(
    model: WordModel,
    view: WordView,
    wordListController: WordListController,
    isRestored: boolean
  ) {
    this.model = model;
    this.view = view;
    this.wordListController = wordListController;
    this.isRestored = isRestored;

    // при восстановлении сессии загружаем данные в модели
    if (this.isRestored) this.model.loadFromLocalStorage();

    // привязка обработчиков событий
    this.view.bindInputLetter(this.handleInputLetter);
    this.wordListController.setHandler(this.handleKeyboardClick.bind(this));

    this.startTraining();
  }

  startTraining() {
    this.wordListController.startTraining();
    this.handleUpdateWords();
  }

  // обработка нажатий на клавиатуре
  handleKeyboardClick(event: KeyboardEvent) {
    const letter = event.key;

    // Проверяем, что введена именно буква
    if (!/^[a-zA-Z]$/.test(letter)) return;

    if (this.model.shuffledWord.includes(letter)) {
      const index = this.model.shuffledWord.indexOf(letter);
      this.handleInputLetter(letter, index);
    } else {
      // Засчитываем ошибку без индикацию, в соответствии с ТЗ
      this.handleWrongLetter();
      this.isWordFail();

      if (!this.wordListController.isFinished())
        this.model.updateLocalStorage();
    }
  }

  handleInputLetter = (letter: string, index: number) => {
    if (this.model.originalWord[this.model.inputtedWord.length] === letter) {
      this.handleCorrectLetter(letter, index);
    } else {
      this.handleWrongLetter(index);
    }

    // Проверяем слово правильность/неправильность
    this.isWordCorrect();
    this.isWordFail();

    if (!this.wordListController.isFinished()) this.model.updateLocalStorage();
  };

  // Слово введено корректно
  isWordCorrect() {
    if (this.model.originalWord === this.model.inputtedWord.join('')) {
      this.handleCompleteWord();
    }
  }

  // Слово введено некорректно, превышен лимит ошибок
  isWordFail() {
    if (this.wordListController.getSingleWordErrorsCount() === 3) {
      this.handleFailWord();
    }
  }

  // Обработка правильно введенной буквы
  handleCorrectLetter(letter: string, index: number) {
    this.model.shuffledWord.splice(index, 1);
    this.model.inputtedWord.push(letter);

    this.handleUpdateWords();
  }

  // Обработка некорректно введенной буквы
  handleWrongLetter(index?: number) {
    // Если индекс не передан, значит нажата буква вне списка доступных букв.
    // По условиям ТЗ в таком случае идентификация должна отсутствовать.
    if (index !== undefined) this.view.showFailtureLetter(index);

    this.wordListController.increaseSingleWordErrorsCount();
    this.wordListController.processWorstWords(this.model.originalWord);
  }

  // Завершение работы с правильным словом и переход к следующему
  handleCompleteWord() {
    this.wordListController.unbindEvent();

    this.wordListController.nextWord();
    this.handleNextWord();
  }

  // Завершение работы с неправильным (3 ошибки) словом и переход к следующему
  async handleFailWord() {
    this.wordListController.unbindEvent();

    // задерка на отображение правильного варианта, в случае 3-х ошибок
    await this.view.showFailtureWord(this.model.originalWord.split(''));
    this.wordListController.nextWord();
    this.handleNextWord();
  }

  handleNextWord() {
    this.model.inputtedWord = [];
    this.wordListController.resetSingleWordErrorsCount();

    const newWord = this.wordListController.getNextWord();

    this.model.originalWord = newWord;
    this.model.shuffledWord = shuffle(newWord.split(''));

    this.handleUpdateWords();

    if (this.wordListController.isFinished()) {
      this.model.clearLocalStorage();
    } else {
      this.model.updateLocalStorage();
    }
  }

  // Обновление отображения
  handleUpdateWords() {
    this.view.clearAll();
    this.view.displayShuffledWord(this.model.shuffledWord);
    this.view.displayInputtedWord(this.model.inputtedWord);

    if (!this.wordListController.isFinished()) {
      this.wordListController.bindEvent();
    }
  }
}
