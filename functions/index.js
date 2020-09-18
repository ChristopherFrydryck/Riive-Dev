const functions = require('firebase-functions');
const admin = require('firebase-admin');
const stripe = require('stripe')('sk_test_rhRKZJYIAphopgJZcoKX32yD00ciJsrqFl');
admin.initializeApp();
const db = admin.firestore();



// exports.payWithStripe = functions.https.onRequest((request, response) => {
    // Set your secret key: remember to change this to your live secret key in production
    // See your keys here: https://dashboard.stripe.com/account/apikeys

    // eslint-disable-next-line promise/catch-or-return
    exports.addCustomer = functions.https.onRequest((request, response) => {
        stripe.customers.create(
            {
              name: request.body.name,
              email: request.body.email,
              phone: request.body.phone,
              description: "FB ID = " + request.body.FBID,
            },
            function(err, customer) {
              if (err){
                  response.send(err)
              }else{
                  return db.collection('users').doc(request.body.FBID).get()
                  .then(doc => {
                    if(!doc.exists){
                        return console.log("User doesn't exist")
                    }else{
                        // console.log(customer)
                        // console.log(doc.data())
                        return db.collection('users').doc(request.body.FBID).update({
                            stripeID: customer.id,
                        })
                        .then(() => response.send(customer))
                    }
                  }).catch(err => {
                      console.log("ERROR! " + err)
                  })
                  
                  
              }
            }            
        )

    } )

    exports.addSource = functions.https.onRequest((request, response) => {
        stripe.customers.createSource(request.body.stripeID, {
            source: request.body.cardSource,
          },
          function(err, card) {
            if (err){
                response.send(err)
            }else{
                return db.collection('users').doc(request.body.FBID).get().then(doc => {
                  if(!doc.exists){
                      return console.log("User doesn't exist")
                  }else{
                      // console.log(customer)
                      // console.log(doc.data())
                      return console.log("Success sending stuff")
                      .then(() => response.send(card))
                  }
                }).catch(err => {
                    console.log("ERROR! " + err)
                    response.send(err)
                })
                
                
            }
          }   
        )         
    })

    exports.deleteSource = functions.https.onRequest((request, response) => {
        stripe.customers.deleteSource(
            request.body.stripeID,
            request.body.cardSource,
            function(err, confirmation) {
                if(err){
                    response.send(err)
                }else{
                    return db.collection('users').doc(request.body.FBID).get().then(doc => {
                    if(!doc.exists){
                        return console.log("User doesn't exist")
                    }else{
                        return console.log("Success deleting card stuff")
                        .then(() => response.send(confirmation))
                    }
                    }).catch(err => {
                        console.log("ERROR! " + err)
                    })
                }
            }
          );
    })

    exports.updateUserInfo = functions.firestore
    .document('users/{user-Id}')
    .onUpdate((snap, context) => {
        console.log("Changed user data!")
    })


    

    


        
    


//     stripe.charges.create({
//         amount: request.body.amount,
//         currency: request.body.currency,
//         source: request.body.token,
//     }).then((charge) => {
//             // asynchronously called
//             response.send(charge);
//         })
//         .catch(err =>{
//             console.log(err);
//         });

// });



// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
