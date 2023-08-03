import { TStats } from '../controller/WordListController';

export class WordListView {
  private currentQuestionElement: HTMLElement;
  private totalQuestionsElement: HTMLElement;
  private statsElement: HTMLElement;

  constructor() {
    this.currentQuestionElement = document.getElementById('current_question');
    this.totalQuestionsElement = document.getElementById('total_questions');
    this.statsElement = document.getElementById('stats-container');
  }

  updateQuestionProgress(
    learningWords: number,
    currentWordIndex: number
  ): void {
    this.currentQuestionElement.textContent = (currentWordIndex + 1).toString();
    this.totalQuestionsElement.textContent = learningWords.toString();
  }

  clearAll() {
    const lettersElement = document.getElementById('letters-container');
    const processElement = document.getElementById('process-container');

    lettersElement.innerHTML = '';
    processElement.innerHTML = '';
  }

  showStatistic(stats: TStats) {
    this.createCorrectWordsElement(stats.correctWords);
    this.createTotalErrorsElement(stats.totalErrors);
    this.createWorstWordsElement(stats.worstWords);
  }

  createCorrectWordsElement(correctWords: number) {
    const totalWordsElement = document.createElement('li');

    totalWordsElement.textContent = `Число собранных слов без ошибок: ${correctWords}`;
    totalWordsElement.className = ``;

    this.statsElement.appendChild(totalWordsElement);
  }

  createTotalErrorsElement(totalErrors: number) {
    const totalErrorsElement = document.createElement('li');

    totalErrorsElement.textContent = `Число ошибок: ${totalErrors}`;
    totalErrorsElement.className = ``;

    this.statsElement.appendChild(totalErrorsElement);
  }

  createWorstWordsElement(worstWords: string[]) {
    if (worstWords.length === 0) return;

    const worstWordsElement = document.createElement('li');
    const errorsText = worstWords.length > 1 ? 'Слова' : 'Слово';

    worstWordsElement.textContent = `${errorsText} с самым большим числом ошибок: ${worstWords.join(
      ', '
    )}`;
    worstWordsElement.className = ``;

    this.statsElement.appendChild(worstWordsElement);
  }
}
