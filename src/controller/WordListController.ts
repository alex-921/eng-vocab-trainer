import { WordListModel } from '../model/WordListModel';
import { WordListView } from '../view/WordListView';

export type TStats = {
  correctWords: number;
  totalErrors: number;
  worstWords: string[];
};

export class WordListController {
  model: WordListModel;
  view: WordListView;
  isRestored: boolean;

  private handleKeyboardClick: (event: KeyboardEvent) => void;

  constructor(model: WordListModel, view: WordListView, isRestored: boolean) {
    this.model = model;
    this.view = view;
    this.isRestored = isRestored;

    this.handleKeyboardClick = () => {};
  }

  setHandler(handler: (event: KeyboardEvent) => void) {
    this.handleKeyboardClick = handler;
  }

  bindEvent() {
    window.addEventListener('keydown', this.handleKeyboardClick);
  }

  unbindEvent() {
    window.removeEventListener('keydown', this.handleKeyboardClick);
  }

  startTraining = () => {
    this.view.updateQuestionProgress(
      this.model.learningWords.length,
      this.model.currentWordIndex
    );

    this.bindEvent();
  };

  // добавляет ошибку в список слов с ошибками
  processWorstWords(word: string) {
    if (word in this.model.worstWords) {
      this.model.worstWords[word]++;
    } else {
      this.model.worstWords[word] = 1;
    }

    this.model.updateLocalStorage();
  }

  // увеличивает счетчик ошибок для текущего слова
  increaseSingleWordErrorsCount() {
    this.model.singleWordErrorsCount++;

    this.model.updateLocalStorage();
  }

  getSingleWordErrorsCount() {
    return this.model.singleWordErrorsCount;
  }

  resetSingleWordErrorsCount() {
    this.model.singleWordErrorsCount = 0;
  }

  getNextWord() {
    return this.model.getNextWord();
  }

  // слово было завершено без ошибок
  isWordWithoutMistakes() {
    if (this.model.singleWordErrorsCount) {
      this.model.wordsWithoutMistakes--;
    }
  }

  // переход к следующему слову для тренировки
  nextWord() {
    this.isWordWithoutMistakes();

    const words = this.model.learningWords;
    const wordIndex = this.model.currentWordIndex;

    if (wordIndex < words.length - 1) {
      this.model.currentWordIndex++;
    }

    this.model.updateLocalStorage();

    if (wordIndex === words.length - 1) {
      this.finish();
    }

    this.view.updateQuestionProgress(words.length, this.model.currentWordIndex);
  }

  finish() {
    this.model.isFinished = true;

    this.view.clearAll();
    this.view.showStatistic(this.getStats());
    this.model.clearLocalStorage();
  }

  isFinished() {
    return this.model.isFinished;
  }

  getStats() {
    return {
      correctWords: this.model.wordsWithoutMistakes,
      totalErrors: this.model.getTotalErrorsCount(),
      worstWords: this.model.getWorstWords(),
    };
  }
}
