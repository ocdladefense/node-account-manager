// Retrieves all of the contact information (by Salesforce Contact Id)
export function getContactQuery(contactId) {

    return `SELECT 
            Id,
            FirstName,
            LastName,
            MiddleName,
            Suffix,
            Salutation,
            Ocdla_Organization__c,
            OrderApi__Work_Phone__c,
            OrderApi__Work_Email__c,
            LegislativeAdvocacyOptIn__c,
            Ocdla_Is_Expert_Witness__c,
            Ocdla_Address_Line_1__c,
            Ocdla_Address_Line_2__c,
            Ocdla_Bar_Number__c,
            Ocdla_Investigator_License_Number__c,
            Ocdla_Home_Street__c,
            Ocdla_Home_City__c,
            Ocdla_Home_State__c,
            Ocdla_Home_Zip__c,
            Ocdla_Occupation_Field_Type__c,
            MailingAddress,
            Name,
            Phone,
            Ocdla_Cell_Phone__c,
            Fax,
            Ocdla_Website__c,
            Public_Defense_Survey__c,
            AccountId
            FROM Contact WHERE Id = '${contactId}'`;
}

