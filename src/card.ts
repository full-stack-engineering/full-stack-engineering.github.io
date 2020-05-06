import coursesData from './data.json';
import {getApiCourses} from './service';

export default function register() {
    customElements.define('m3-cards', M3Cards);
    customElements.define('m3-card', M3Card);
}

/*
Scrolling with:
<a class="e-btn circle transparent"><i class="fas fa-angle-left"></i></a>
<a class="e-btn circle transparent"><i class="fas fa-angle-right"></i></a>
 */
class M3Cards extends HTMLElement {
    constructor() {
        super();
        // voting: "I want his course"
    }

    async connectedCallback() {
        this.innerHTML = '';
        this.classList.add('e-cards', 'deck');
        const apiCourses = await getApiCourses();
        (coursesData as CoursesData).courses
            .filter(({logo}) => !!logo)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(({title, link, referralCode, logo }) => {
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
                const result: HTMLElement = document.createElement('m3-card');
                Object.entries(course)
                    .filter(([_, value]) => !!value)
                    .forEach(([key, value]) => result.dataset[key] = value);
                return result;
            })
            .forEach(element => this.appendChild(element));
    }
}

class M3Card extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.classList.add('e-card', 'no-mobile', 'white', 'd-flex');
        const {title, link, couponCode, referralCode, logo, rating, numReviews} = (this.dataset as unknown) as CardCourse;
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
