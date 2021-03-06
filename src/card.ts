import coursesData from './data.json';
import {getApiCourses} from './service';

export default function register() {
    customElements.define('m3-cards', M3Cards);
    customElements.define('m3-card', M3Card);
}

class M3Cards extends HTMLElement {
    private index: number;
    private cards: M3Card[];
    private readonly window: number;

    constructor() {
        super();
        // voting: "I want his course"
        this.index = 0;
        this.window = +this.dataset.window || 3;
    }

    async connectedCallback() {
        this.classList.add('e-cards', 'deck');
        if (!this.cards) {
            const placeholder = `
            <m3-card data-title="..." data-link="..." data-referral-code="..." data-rating="5" data-num-reviews="?" 
                data-logo="empty.jpg">
            </m3-card>
            `;
            for (let i = 0; i < this.window; ++i) {
                this.innerHTML += placeholder;
            }
            const apiCourses = (await getApiCourses()).data;
            this.cards = (coursesData as CoursesData).courses
                .filter(({logo}) => !!logo)
                .sort(() => Math.random() - 0.5)
                .map(({title, link, referralCode, logo}) => {
                    const {rating, numReviews, couponCode} = apiCourses
                        .find(({link: linkFromApi}) => link === linkFromApi) || {};
                    return {
                        title,
                        link,
                        referralCode,
                        couponCode,
                        rating,
                        numReviews,
                        logo
                    } as CardCourse;
                })
                .map(course => {
                    const result: M3Card = document.createElement('m3-card') as M3Card;
                    Object.entries(course)
                        .filter(([_, value]) => !!value)
                        .forEach(([key, value]) => result.dataset[key] = value);
                    return result;
                });
        }
        this.render();
    }

    increment() {
        if (++this.index >= this.cards.length) {
            this.index = 0;
        }
        this.render();
    }

    decrement() {
        if (--this.index < 0) {
            this.index = this.cards.length - 1;
        }
        this.render();
    }

    private render() {
        const cardsToAdd: M3Card[] = [];
        const lastIndex: number = this.index + this.window;
        for (let i = this.index; i < lastIndex && i < this.cards.length; ++i) {
            cardsToAdd.push(this.cards[i]);
        }
        const remaining: number = this.window - cardsToAdd.length;
        for (let i = 0; i < remaining; ++i) {
            cardsToAdd.push(this.cards[i]);
        }
        [...this.querySelectorAll('m3-card')]
            .filter((card: M3Card) => !cardsToAdd.includes(card))
            .forEach(card => card.remove());
        cardsToAdd.forEach(card => this.appendChild(card));
    }
}

class M3Card extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.classList.add('e-card', 'white', 'd-flex');
        const {title, link, couponCode, referralCode, logo, rating = 0, numReviews = 0} = (this.dataset as unknown) as CardCourse;
        this.innerHTML = `
          <img src="img/logo/${logo}" class="border-bottom" alt="${title} logo"/>
          <div class="card-body d-flex align-elements">
            <h3 class="card-title text-dark">${title}</h3>
            <p><m3-stars alt="${rating}" title="${rating}" max="5" current="${rating}" class="text-primary"></m3-stars> (${numReviews})</p>
            ${courseUrl({link, couponCode, referralCode})}
          </div>
        `;
    }
}

const FREE = new Map([
    // ['/course/nie-jquery/', '/nie-jq.html']
]);

function courseUrl({link, couponCode, referralCode}: Pick<CardCourse, "link" | "couponCode" | "referralCode">): string {
    return FREE.has(link) ? `
      <a class="e-btn anime plane success fullwidth" href="${FREE.get(link)}">
        Zapisuję się
      </a>
      ` : `
      <a class="e-btn anime plane danger fullwidth" href="https://www.udemy.com${link}?${couponCode ? `couponCode=${couponCode}` : `referralCode=${referralCode}`}">
        Kupuję
      </a>
    `;
}

interface CardCourse {
    title: string;
    link: string;
    referralCode: string;
    couponCode?: string;
    rating?: number,
    numReviews?: number,
    logo: string;

    [key: string]: any;
}

interface CoursesData {
    courses: CourseData[];

    [key: string]: any;
}

interface CourseData {
    title: string;
    link: string;
    referralCode: string;
    logo: string;

    [key: string]: any;
}
