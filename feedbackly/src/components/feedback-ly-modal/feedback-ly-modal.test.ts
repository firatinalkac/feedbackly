import { assert, fixture, html, aTimeout } from '@open-wc/testing';
import sinon from 'sinon';
import FeedbackLyModal from './feedback-ly-modal';
import FeedbackLyModalType from './feedback-ly-modal';

describe('feedback-ly-modal element', () => {
   let originalFetch: typeof fetch;

   beforeEach(() => {
      originalFetch = window.fetch;
   });

   afterEach(() => {
      window.fetch = originalFetch;
   });

   it('rendern feedbackly modal', () => {
      const el: FeedbackLyModalType = document.createElement('feedback-ly-modal');
      assert.instanceOf(el, FeedbackLyModal);
   });

   it('render html element', async (): Promise<void> => {
      const el = await fixture<FeedbackLyModalType>(html`<feedback-ly-modal></feedback-ly-modal>`);
      await assert.shadowDom.equal(
         el,
         `<div class="modal-content">
            <div class="close-icon"></div>
            <form>
               <h2 class="title">
                   SEND YOUR FEEDBACK
               </h2>
               <div class="body">
                 <textarea
                      id="feedbackly-message"
                   maxlength="2000"
                   name="feedback"
                   rows="8"
                 >
                 </textarea>
               </div>
               <div class="footer">
                  <button class="button" disabled="" type="submit">
                      Send
                  </button>
               </div>
            </form>
         </div>`,
      );
   });

   it('sets feedback message correctly', async () => {
      const el: FeedbackLyModalType | any = await fixture(
         html`<feedback-ly-modal></feedback-ly-modal>`,
      );
      const textarea: any = el.shadowRoot?.querySelector('#feedbackly-message');
      textarea!.value = 'Test message';
      textarea!.dispatchEvent(new Event('input'));
      assert.strictEqual(el.feedbackMessage, 'Test message');
   });

   it('emits modal-close event on close icon click', async () => {
      const el: FeedbackLyModalType = await fixture(html`<feedback-ly-modal></feedback-ly-modal>`);
      const closeIcon: any = el.shadowRoot?.querySelector('.close-icon');
      const spy = sinon.spy();
      el.addEventListener('modal-close', spy);
      closeIcon?.click();
      assert.isTrue(spy.called);
   });

   it('shows success message after successful feedback', async () => {
      const mockSuccessResponse = {
         ok: true,
         json: async () => ({ status: 200, message: 'Success' }),
      };

      window.fetch = async () => <any>mockSuccessResponse;

      const el: FeedbackLyModalType | any = await fixture(
         html`<feedback-ly-modal></feedback-ly-modal>`,
      );
      const form: any = el.shadowRoot?.querySelector('form');
      form?.dispatchEvent(new Event('submit'));

      await aTimeout(100);

      assert.strictEqual(el.resultStatus, 'success');
      assert.isFalse(el.isInitial);
   });

   it('shows error message after failed feedback', async () => {
      const mockErrorResponse = {
         ok: false,
         json: async () => ({
            status: 400,
            message: 'An error occurred',
            errors: [{ msg: 'An error detail' }],
         }),
      };

      window.fetch = async () => <any>mockErrorResponse;

      const el: FeedbackLyModalType | any = await fixture(
         html`<feedback-ly-modal></feedback-ly-modal>`,
      );
      const form: any = el.shadowRoot?.querySelector('form');
      form?.dispatchEvent(new Event('submit'));

      await aTimeout(100);

      assert.strictEqual(el.resultStatus, 'error');
      assert.isFalse(el.isInitial);
   });

   it('shows generic error message when no specific error details are provided', async () => {
      const mockErrorResponse = {
         ok: false,
         json: async () => ({
            status: 400,
            message: 'Generic error occurred',
            errors: [],
         }),
      };

      window.fetch = async () => <any>mockErrorResponse;

      const el: FeedbackLyModalType | any = await fixture(
         html`<feedback-ly-modal></feedback-ly-modal>`,
      );
      const form: any = el.shadowRoot?.querySelector('form');
      form?.dispatchEvent(new Event('submit'));

      await aTimeout(400);

      assert.strictEqual(el.resultStatus, 'error');
      assert.isFalse(el.isInitial);
   });

   it('should emit "modal-close" event on ESC key press', async () => {
      const el = await fixture(html`<feedback-ly-modal></feedback-ly-modal>`);
      let eventEmitted = false;

      el.addEventListener('modal-close', () => {
         eventEmitted = true;
      });

      const event = new KeyboardEvent('keydown', {
         key: 'Escape',
      });
      document.dispatchEvent(event);

      assert.isTrue(eventEmitted);
   });
});
