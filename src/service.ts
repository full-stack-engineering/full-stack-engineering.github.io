const apiCoursesUrl = 'https://r53a9vitsc.execute-api.eu-west-1.amazonaws.com/default/udemy';

export async function getApiCourses(): Promise<ApiCourse[]> {
    const result: string = sessionStorage.getItem(apiCoursesUrl);
    if (result) {
        return JSON.parse(result);
    }
    const apiCourses: ApiCourse[] = await fetch(apiCoursesUrl).then(response => response.json());
    sessionStorage.setItem(apiCoursesUrl, JSON.stringify(apiCourses));
    return apiCourses;
}

interface ApiCourse {
    rating: number;
    numReviews: number;
    link: string;
    couponCode?: string;

    [key: string]: any;
}