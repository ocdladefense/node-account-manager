/**
 * Generates the SQL query string to fetch all active job postings.
 * @param {int} The job Id as an int
 * @returns {string} The formatted SQL query string.
 */
export function getJobsQuery(jobId) {

    const SQL_FIELD_SEPERATOR = ",";

    let fields = [
        "Id",
        "AttachmentPath__c",
        "AttachmentUrl__c",
        "ClosingDate__c",
        "CreatedById",
        "IsActive__c",
        "LastModifiedById",
        "Location__c",
        "MemberId__c",
        "Name",
        "OpenUntilFilled__c",
        "Organization__c",
        "OwnerId",
        "PostingDate__c",
        "Salary__c"
    ];

    let query = `SELECT ${fields.join(SQL_FIELD_SEPERATOR)} FROM Job__c`;

    if(jobId) query += `WHERE Id='${jobId}'"`;

    return query;
}
