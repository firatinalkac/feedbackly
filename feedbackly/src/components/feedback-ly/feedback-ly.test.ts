import { assert, fixture, html } from '@open-wc/testing';
import FeedbackLy from './feedback-ly';
import type FeedbackLyType from './feedback-ly';

describe('feedback-ly element', () => {
   it('is defined', () => {
      const el = document.createElement('feedback-ly');
      assert.instanceOf(el, FeedbackLy);
   });

   it('render html element', async (): Promise<void> => {
      const el = await fixture<FeedbackLyType>(html`<feedback-ly></feedback-ly>`);
      await assert.shadowDom.equal(el, `<div class="bottom-right feedbackly-icon"></div>`);
   });

   it('toggles modal visibility on click', async () => {
      const el: FeedbackLy = await fixture(html`<feedback-ly></feedback-ly>`);
      const icon: any = el.shadowRoot?.querySelector('.feedbackly-icon');
      icon?.click();
      assert.isTrue(el.showModal);
      icon?.click();
      assert.isFalse(el.showModal);
   });

   it('does not toggle modal when disabled', async () => {
      const el: FeedbackLy = await fixture(html`<feedback-ly .disabled=${true}></feedback-ly>`);
      const icon: any = el.shadowRoot?.querySelector('.feedbackly-icon');
      icon?.click();
      assert.isFalse(el.showModal);
   });

   it('renders modal when showModal is true', async () => {
      const el: FeedbackLy = await fixture(html`<feedback-ly .showModal=${true}></feedback-ly>`);
      const modal = el.shadowRoot?.querySelector('feedback-ly-modal');
      assert.exists(modal);
   });

   it('sets correct position class', async () => {
      const el: FeedbackLy = await fixture(html`<feedback-ly position="top-left"></feedback-ly>`);
      const icon = el.shadowRoot?.querySelector('.feedbackly-icon');
      assert.isTrue(icon?.classList.contains('top-left'));
   });

   it('sets correct maxlength prop', async () => {
      const el: FeedbackLy = await fixture(html`<feedback-ly maxlength="1000"></feedback-ly>`);
      assert.strictEqual(el.maxlength, '1000');
   });

   it('sets correct minlength prop', async () => {
      const el: FeedbackLy = await fixture(html`<feedback-ly minlength="100"></feedback-ly>`);
      assert.strictEqual(el.minlength, '100');
   });
});
