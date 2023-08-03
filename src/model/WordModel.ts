import { WordListModel } from '../model/WordListModel';

import { shuffle } from '../helpers/helper';

export class WordModel {
  originalWord: string;
  shuffledWord: string[];
  inputtedWord: string[];

  constructor(wordModel: WordListModel) {
    this.originalWord = wordModel.learningWords[wordModel.currentWordIndex];
    this.shuffledWord = shuffle(this.originalWord.split(''));
    this.inputtedWord = [];
  }

  loadFromLocalStorage() {
    const savedData = localStorage.getItem('eng-vocab-trainer-word');
    const savedWordModel = JSON.parse(savedData) as WordModel;

    Object.assign(this, savedWordModel);
  }

  updateLocalStorage() {
    localStorage.setItem('eng-vocab-trainer-word', JSON.stringify(this));
  }

  clearLocalStorage() {
    localStorage.removeItem('eng-vocab-trainer-word');
  }
}
