/**
 * Generates the SQL query string to fetch all active job postings.
 * @returns {string} The formatted SQL query string.
 */
export function getJobsQuery() {

    return `SELECT
            Id,
            AttachmentPath__c,
            AttachmentUrl__c,
            ClosingDate__c,
            CreatedById,
            IsActive__c,
            LastModifiedById,
            Location__c,
            MemberId__c,
            Name,
            OpenUntilFilled__c,
            Organization__c,
            OwnerId,
            PostingDate__c,
            Salary__c
            FROM Job__c WHERE IsActive__c = true`;
}









// export function getJobQuery(jobId) {

//     return `SELECT
//             Id,
//             AttachmentPath__c,
//             AttachmentUrl__c,
//             ClosingDate__c,
//             CreatedById,
//             IsActive__c,
//             LastModifiedById,
//             Location__c,
//             MemberId__c,
//             Name,
//             OpenUntilFilled__c,
//             Organization__c,
//             OwnerId,
//             PostingDate__c,
//             Salary__c
//             FROM Job__c WHERE Id = '${jobId}'`;
// }
