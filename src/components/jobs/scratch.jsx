// Query for the list of jobs from salesforce

// fetch list of jobs from the jobs endpoint


useEffect(() => {
    async function fetchJobs() {
        const contactQuery = getJob(contactId);


        try {
            setLoading(true);
            const response = await client.query(contactQuery);
            setContact(response.records[0]);
        } catch (err) {
            setError(err);
            console.error("Error fetching contact:", err);
        } finally {
            setLoading(false);
        }
    }

    fetchContact();
}, []);
