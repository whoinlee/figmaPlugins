const JIRA_URL = "https://146a3axml6.execute-api.us-west-2.amazonaws.com/dev/jira/";

export async function createBug (fileUrl: string, summary: string, description: string, currentUser: string, type: string) {
    const BODY = {
        "fields": {
            "project":
            {
               "key": "DTECH"
            },
            "summary": `[FIGMA]: ${summary}`,
            "description": `${fileUrl} - ${description} - Submitted by: ${currentUser}`,
            "issuetype": {
               "name": type === "bug" ? "Bug" : "Design Tech Story"
            },
            "customfield_11322": "DTECH-393"
        }
    }

    return await fetch(`${JIRA_URL}create-bug`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(BODY)
    }).then(response => {
        return response.json()
    }).catch(error => {
        console.log(error)
    })
}

export async function createRequest (fileUrl: string, summary: string, description: string, currentUser: string, due: any) {
    const BODY = {
        "fields": {
            "project":
            {
               "key": "DTECH"
            },
            "summary": `[FIGMA]: ${summary}`,
            "description": `${fileUrl} - ${description} - Submitted by: ${currentUser} | Due by ${due}`,
            "issuetype": {
               "name": "Design Tech Story"
            },
            "customfield_11322": "DTECH-2162"
        }
    }

    return await fetch(`${JIRA_URL}create-bug`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(BODY)
    }).then(response => {
        return response.json()
    }).catch(error => {
        console.log(error)
    })
}

export async function getChangelogIssues () {
    return await fetch(`${JIRA_URL}get-issue-for-epic`, {
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

export async function searchUser (userName: string) {
    const BODY = {
        "username": userName
    }

    return await fetch(`${JIRA_URL}search-user`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(BODY)
    }).then(response => {
        return response.json()
    }).catch(error => {
        console.log(error)
    })
}

export async function createStory ( fileUrl: string, summary: string, currentUser: string, type: string, 
                                    description: string,uxNeeded: string = "", urNeeded: string = "") {

console.log("INFO :: description? ", description)
console.log("INFO :: uxNeeded? ", uxNeeded)
console.log("INFO :: urNeeded? ", urNeeded)
    let body = {
        "fields": {
            "project": {
                "key": type === "exp" ? "EXP" : "REPLEX"
            },         
            "issuetype": {
                "name": type === "exp" ? "Product Design Story" : "Story"           
            },
            "summary": `[FIGMA]: ${summary}`,
            "description": `${fileUrl} - ${description}: created for [DTECH-2479]. Please close this ticket. - Submitted by: ${currentUser}`
        }
    }

    if (type === "exp") {
        body["fields"]["customfield_34700"] = `${fileUrl}`;
        //-- "UX Writing Needed", 38000(Yes) & 38001(No)
        body["fields"]["customfield_35501"] = {
            "id": `${uxNeeded}`
        };
        //-- "UR Needed", 38700(Yes) & 38701(No)
        body["fields"]["customfield_36200"] = {
            "id": `${urNeeded}`
        };
    }

    console.log("body???", JSON.stringify(body));


    return await fetch(`${JIRA_URL}create-bug`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(body)
    }).then(response => {
        return response.json()
    }).catch(error => {
        console.log("ERROR::", error)
    })
}