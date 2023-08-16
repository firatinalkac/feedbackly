import { CSSResultGroup, html, LitElement, unsafeCSS } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import styles from './feedback-ly-modal.scss?inline';
import { CLOSE_ICON } from '../../utilities/constants';

type FeedbackStatus = 'success' | 'error' | '';

interface PostBody {
   customerId: string;
   fullName: string;
   feedbackMessage: string;
}

interface ErrorResponse {
   type: string;
   value: string;
   msg: string;
   path: string;
   location: string;
}

@customElement('feedback-ly-modal')
export default class FeedbackLyModal extends LitElement {
   static get styles(): CSSResultGroup {
      return [unsafeCSS(styles)];
   }

   @state() private feedbackMessage: string = '';
   @state() private isInitial: boolean = true;
   @state() private resultStatus: FeedbackStatus = '';

   @query('#feedbackly-message') textarea?: HTMLTextAreaElement;

   @property({ reflect: true, type: String })
   minlength: string = '10';
   @property({ reflect: true, type: String })
   maxlength: string = '2000';
   @property({ reflect: true, type: String })
   customerId: string = '';
   @property({ reflect: true, type: String, attribute: 'full-name' })
   fullName: string = '';

   private setFeedbackMessage(): void {
      if (this.textarea) {
         this.feedbackMessage = this.textarea.value;
      }
   }

   private async sendFeedback(event: Event): Promise<void> {
      event.preventDefault();
      const postBody: PostBody = {
         customerId: this.customerId,
         fullName: this.fullName,
         feedbackMessage: this.feedbackMessage,
      };

      const response = await fetch('http://34.91.97.188/api/v1/feedbacks', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(postBody),
      }).then((response: Response) => response.json());

      if (response.status < 300) {
         this.resultStatus = 'success';
      } else {
         this.resultStatus = 'error';
         const errorMessage = response.errors.map((error: ErrorResponse) => error.msg).join('\n');
         setTimeout(() => {
            alert(errorMessage ? errorMessage : response.message);
         }, 300);
      }

      this.isInitial = false;
   }

   private resultText = {
      success: 'WE HAVE GOT YOUR FEEDBACK',
      error: 'ERROR',
      '': null,
   };

   private emitCloseEvent(): void {
      const event = new CustomEvent('modal-close', {
         detail: { message: 'Modal closed' },
         bubbles: true,
         composed: true,
      });
      this.dispatchEvent(event);
   }

   connectedCallback() {
      super.connectedCallback();
      document.addEventListener('keydown', this.handleKeydown);
   }

   disconnectedCallback() {
      super.disconnectedCallback();
      document.removeEventListener('keydown', this.handleKeydown);
   }

   private handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
         this.emitCloseEvent();
      }
   };

   private renderDefaultCotent() {
      return html`
         <form @submit="${this.sendFeedback}">
            <h2 class="title">SEND YOUR FEEDBACK</h2>
            <div class="body">
               <textarea
                  @input="${this.setFeedbackMessage}"
                  name="feedback"
                  id="feedbackly-message"
                  rows="8"
                  maxlength="${this.maxlength}"
               ></textarea>
            </div>
            <div class="footer">
               <button
                  type="submit"
                  .disabled="${this.feedbackMessage.length < +this.minlength}"
                  class="button"
               >
                  Send
               </button>
            </div>
         </form>
      `;
   }

   private renderResultTemplate() {
      return html`<p class="feedback-message ${this.resultStatus}">
         ${this.resultText[this.resultStatus]}
      </p>`;
   }

   render() {
      return html`
         <div class="modal-content">
            <div @click="${this.emitCloseEvent}" class="close-icon">${CLOSE_ICON}</div>
            ${this.isInitial ? this.renderDefaultCotent() : this.renderResultTemplate()}
         </div>
      `;
   }
}

declare global {
   interface HTMLElementTagNameMap {
      'feedback-ly-modal': FeedbackLyModal;
   }
}
