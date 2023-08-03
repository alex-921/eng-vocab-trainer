import { shuffle } from '../helpers/helper';

export class WordListModel {
  private NUMBER_TO_LEARN: number;

  wordList: string[];
  learningWords: string[];
  currentWordIndex: number;
  singleWordErrorsCount: number;
  wordsWithoutMistakes: number;
  worstWords: { [key in string]: number };
  isFinished: boolean;
  isRestored: boolean;

  constructor(words: string[], isRestored: boolean) {
    this.NUMBER_TO_LEARN = 6;

    this.wordList = words;
    this.currentWordIndex = 0;
    this.singleWordErrorsCount = 0;
    this.wordsWithoutMistakes = 0;
    this.worstWords = {};
    this.isFinished = false;
    this.isRestored = isRestored;

    this.startTraining();
  }

  startTraining() {
    if (this.isRestored) {
      this.loadFromLocalStorage();
    } else {
      this.pickWordsForLearning(this.NUMBER_TO_LEARN);
      this.setWordsWithoutMistakes(this.NUMBER_TO_LEARN);
    }

    this.updateLocalStorage();
  }

  pickWordsForLearning(num: number) {
    const shuffledWords = shuffle(this.wordList);
    this.learningWords = shuffledWords.slice(0, num);
  }

  loadFromLocalStorage() {
    const savedData = localStorage.getItem('eng-vocab-trainer-list');
    const savedWordListModel = JSON.parse(savedData) as WordListModel;

    Object.assign(this, savedWordListModel);
  }

  updateLocalStorage() {
    localStorage.setItem('eng-vocab-trainer-list', JSON.stringify(this));
  }

  clearLocalStorage() {
    localStorage.removeItem('eng-vocab-trainer-list');
  }

  getWorstWords() {
    const worstWordsArr: string[] = [];
    let maxErrors = 0;

    // находим наибольшее кол-во ошибок на слово
    for (const word in this.worstWords) {
      maxErrors =
        this.worstWords[word] > maxErrors ? this.worstWords[word] : maxErrors;
    }

    // собираем все слова с таким же кол-вом ошибок
    for (const word in this.worstWords) {
      if (this.worstWords[word] === maxErrors) worstWordsArr.push(word);
    }

    return worstWordsArr;
  }

  getTotalErrorsCount() {
    let num = 0;

    for (const word in this.worstWords) {
      num += this.worstWords[word];
    }

    return num;
  }

  getNextWord() {
    return this.learningWords[this.currentWordIndex];
  }

  setWordsWithoutMistakes(num: number) {
    this.wordsWithoutMistakes = num;
  }
}
