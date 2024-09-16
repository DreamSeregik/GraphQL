const { request, gql } = require('graphql-request');
const { exit } = require('node:process');
const readline = require('node:readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const PORT = 4000
var Query = null

async function doRequest(req, vars) {
  await request('http://localhost:' + PORT, req, vars).then(ans => {
    console.log(ans)
  })
}

function updateUser() {
  rl.question("ID (Enter '-' for back to menue): ", _id => {
     if (_id == '-')
     {
      drawMenue()
      return
     } 
    _id = Number(_id)
    Query = gql`
          query GetUserByID($id: Int) {
           getUserByID(id: $id) {
            id
            name
            age
           }
         }
       `

    doRequest(Query, { id: _id }).then(() => {
      console.log("Which field you want to update:")
      console.log("1. Name")
      console.log("2. Age")
      console.log("3. Back to selection of user")
      console.log("4. Back to main menue")

      rl.question("Your choice: ", ans => {
        switch (ans) {
          case '1':
            rl.question("Enter new name: ", _name => {
              Query = gql`
                    mutation UpdateUserName($id: Int, $name: String) {
                     updateUserName(id: $id, name: $name) 
                  }
                  `

              doRequest(Query, {
                id: _id,
                name: _name
              }).then(() => {
                drawMenue()
              })
            })
            break;
          case '2':
            rl.question("Enter new age: ", _age => {
              _age = Number(_age)
              Query = gql`
                    mutation UpdateUserAge($id: Int, $age: Int) {
                     updateUserAge(id: $id, age: $age) 
                  }
                  `

              doRequest(Query, {
                id: _id,
                age: _age
              }).then(() => {
                drawMenue()
              })
            })
            break
          case '3':
            updateUser(_id)
            break
          case '4':
            drawMenue()
            break
          default:
            updateUser(_id)
            break;
        }
      })
    })
  })
}


function drawMenue() {
  console.log("1. Add new user")
  console.log("2. Get all users")
  console.log("3. Get user by id")
  console.log("4. Update user info")
  console.log("5. Delete user")
  console.log("6. Exit\n")

  rl.question('Your choice: ', c => {
    switch (c) {
      case '1':
        rl.question("Enter name of new user (Enter '-' for back to menue): ", _name => {
          if (_name == '-')
          {
            drawMenue()
            return            
          }            
          rl.question("Enter age of new user: ", _age => {
            _age = Number(_age)
            Query = gql`
              mutation AddUser($name: String, $age: Int) {
               insertUser(name: $name, age: $age) 
             }
           `

            doRequest(Query, {
              name: _name,
              age: _age
            }).then(() => {
              drawMenue()
            })
          })
        })

        break;
      case '2':
        Query = gql`
        query GetUsers {
         getAllusers {
          id
          name
          age
          }
        }
      `
        doRequest(Query).then(() => {
          drawMenue()
        })
        break;

      case '3':
        rl.question("ID (Enter '-' for back to menue): ", _id => {
          if (_id == '-')
          {
            drawMenue()
            return
          }
          _id = Number(_id)
          Query = gql`
           query GetUserByID($id: Int) {
            getUserByID(id: $id) {
             id
             name
             age
            }
          }
        `
          doRequest(Query, { id: _id }).then(() => {
            drawMenue()
          })
        })
        break
      case '4':
        updateUser()
        break
      case '5':
        rl.question("ID (Enter '-' for back to menue): ", _id => {
          _id = Number(_id)

          Query = gql`
           query GetUserByID($id: Int) {
            getUserByID(id: $id) {
             id
             name
             age
            }
          }
        `

          vars = {
            id: _id
          }
          doRequest(Query, vars).then(() => {
            rl.question("Are you sure (y/n): ", ans => {
              switch (ans) {
                case 'y':
                  Query = gql`
                  mutation DelUser($id: Int) {
                   deleteUser(id: $id) 
                }
                `
                  doRequest(Query, vars).then(() => {
                    drawMenue()
                  })
                  break;
                case 'n':
                  drawMenue()
                  break
                default:
                  drawMenue()
                  break
              }
            })
          })
        })
        break
      case '6':
        console.log("Bye Bye...")
        exit(0)
      default:
        drawMenue()
        break;
    }
  });
}
drawMenue()


