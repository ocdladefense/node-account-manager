export default class Job {
    id;

    title;

    description;

    postDate;

    closeDate;

    organization;

    salary;

    documentName;

    constructor(title) {
        this.title = title;
        this.postDate = Date.now();
    }
}
