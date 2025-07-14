import { ensureElement } from '../utils/utils';

export class MainPage {
  protected container: HTMLElement;
  protected gallery: HTMLElement;

  constructor(containerSelector = '.page') {
    this.container = document.querySelector(containerSelector);
    this.gallery = ensureElement<HTMLElement>('.gallery', this.container);
  }

  renderCards(cards: HTMLElement[]): void {
    this.gallery.replaceChildren(...cards);
  }
}