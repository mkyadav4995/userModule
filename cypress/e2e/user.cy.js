
describe("Integration Test User Onboarding - 200", () =>
{
    var token;
    it("Integration Test User Onboarding", () =>
    {
        let payload={
            "email": "mk737010@gmail.com",
            "password": "123456789"
          }
        let injectionObject =
        {
            method: 'POST',
            url: `/login`,
            body: payload
        };
        cy.request(injectionObject).then((res) => {
            token=res.body.responseData.token;
            payload={
                "name":"monu",
                "email": "mk737010@gmail11.com",
                "password": "123456789",
                "phoneNumber": "65567667"
            }

            injectionObject =
            {
                method: 'POST',
                url: `/user`,
                "headers": {
                    "Authorization": token
                },
                body: payload
            };

            cy.request(injectionObject).then((res) => {
                payload={
                    "id": res.body.responseData.createdUser.id,
                    "name":"monu",
                    "email": "mk737010@gmail11.com",
                    "phoneNumber": "65567667",
                    "status":1
                }
    
                injectionObject =
                {
                    method: 'PATCH',
                    url: `/user`,
                    "headers": {
                        "Authorization": token
                    },
                    body: payload
                };
    
                cy.request(injectionObject).then((res) => {
                    payload={
                    }
        
                    injectionObject =
                    {
                        method: 'GET',
                        url: `/users`,
                        "headers": {
                            "Authorization": token
                        },
                        params: payload
                    };
        
                    cy.request(injectionObject,(res)=>{
                        cy.log(res)
                    })  
                })  
            })
        })

    });
});
