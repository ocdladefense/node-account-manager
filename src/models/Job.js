export default class Job {
    id;

    title;

    description;

    postDate;

    closeDate;

    organization;

    salary;

    documentName;

    constructor(title, salary) {
        this.title = title;
        this.salary = salary;
        this.postDate = Date.now();
    }
}
