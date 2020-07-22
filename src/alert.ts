import {getApiCourses} from './service';

export default function register() {
    customElements.define('m3-alert', M3Alert);
}

class M3Alert extends HTMLElement {
    constructor() {
        super();
    }

    async connectedCallback() {
        const {coupon, deadline} = await getApiCourses();
        const localDeadline = new Date(deadline);
        const deadlineString = new Intl.DateTimeFormat('pl', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        }).format(localDeadline);
        if (new Date() < localDeadline) {
            this.innerHTML = `
                <div class="e-alert warning">
                  <i class="fas fa-exclamation-circle e-icon"></i> 
                  Kupuj z kuponem "<strong>${coupon}</strong>"!
                </div>
            `;
        }
    }
}
