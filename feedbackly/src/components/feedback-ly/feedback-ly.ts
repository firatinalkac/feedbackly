import { CSSResultGroup, html, LitElement, unsafeCSS } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { classMap } from 'lit/directives/class-map.js';

import { FEEDBACKLY_ICON } from '../../utilities/constants';
import styles from './feedback-ly.scss?inline';
import '../feedback-ly-modal/feedback-ly-modal';

export type Position = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
type FeedbacklyClasses = { [key: string]: boolean };

@customElement('feedback-ly')
export default class FeedbackLy extends LitElement {
   static get styles(): CSSResultGroup {
      return [unsafeCSS(styles)];
   }

   @state() showModal: boolean = false;

   @property({ reflect: true })
   position: Position = 'bottom-right';
   @property({ reflect: true, type: String, attribute: 'icon-size' })
   iconSize: string = '24';
   @property({ reflect: true, type: String, attribute: 'icon-color' })
   iconColor: string = '#f27a1a';
   @property({ reflect: true, type: Boolean })
   disabled: boolean = false;
   @property({ reflect: true, type: String })
   minlength: string = '10';
   @property({ reflect: true, type: String })
   maxlength: string = '2000';
   @property({ reflect: true, type: String, attribute: 'customer-id' })
   customerId: string = '';
   @property({ reflect: true, type: String, attribute: 'full-name' })
   fullName: string = '';

   private toggleModalVisibility(): void {
      if (!this.disabled) {
         this.showModal = !this.showModal;
      }
   }

   render() {
      const feedbacklyClass: FeedbacklyClasses = {
         'feedbackly-icon': true,
         [this.position]: true,
         disabled: this.disabled,
      };

      const color: string = this.disabled ? '#B1B1B1' : this.iconColor;

      return html`
         ${when(
            this.showModal,
            () =>
               html`<feedback-ly-modal
                  .customerId="${this.customerId}"
                  .fullName="${this.fullName}"
                  .minlength="${this.minlength}"
                  .maxlength="${this.maxlength}"
                  @modal-close="${this.toggleModalVisibility}"
               ></feedback-ly-modal>`,
         )}
         <div class="${classMap(feedbacklyClass)}" @click="${this.toggleModalVisibility}">
            ${FEEDBACKLY_ICON(this.iconSize, color)}
         </div>
      `;
   }
}

declare global {
   interface HTMLElementTagNameMap {
      'feedback-ly': FeedbackLy;
   }
}
