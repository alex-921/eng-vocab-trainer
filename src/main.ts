import { WordListModel } from './model/WordListModel';
import { WordListController } from './controller/WordListController';
import { WordListView } from './view/WordListView';
import { WordModel } from './model/WordModel';
import { WordController } from './controller/WordController';
import { WordView } from './view/WordView';

import { words } from './words';

import './index.css';

if (module.hot) {
  module.hot.accept();
}

let isRestored: boolean;
const savedData = localStorage.getItem('eng-vocab-trainer-list');

if (savedData) {
  isRestored = confirm('Продолжить предыдущую сессию?');
}

// Создание моделей
const wordListModel = new WordListModel(words, isRestored);
const wordModel = new WordModel(wordListModel);

// Создание представлений
const wordListView = new WordListView();
const wordView = new WordView();

// Создание контроллеров
const wordListController = new WordListController(
  wordListModel,
  wordListView,
  isRestored
);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const wordController = new WordController(
  wordModel,
  wordView,
  wordListController,
  isRestored
);
