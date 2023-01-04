const JIRA_URL = "https://us-central1-design-tech-figma.cloudfunctions.net/jira/";

export async function getServiceData () {
    return await fetch(`${JIRA_URL}services`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
          }
    }).then(response => {
        return response.json()
    }).catch(error => {
        console.log(error)
    })

}