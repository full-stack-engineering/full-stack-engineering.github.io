const apiUrl = 'https://r53a9vitsc.execute-api.eu-west-1.amazonaws.com/default/udemy';

export async function getApiCourses(): Promise<ApiResponse> {
    const cachedResult: string = sessionStorage.getItem(apiUrl);
    if (cachedResult) {
        return JSON.parse(cachedResult);
    }
    const apiResult: ApiResponse = await fetch(apiUrl).then(response => response.json());
    sessionStorage.setItem(apiUrl, JSON.stringify(apiResult));
    return apiResult;
}

interface ApiResponse {
    coupon: string;
    deadline: string;
    data: ApiCourse[];
}

interface ApiCourse {
    rating: number;
    numReviews: number;
    link: string;
    couponCode?: string;

    [key: string]: any;
}