const functions = require('firebase-functions');
const admin = require('firebase-admin');
const stripe = require('stripe')('sk_test_rhRKZJYIAphopgJZcoKX32yD00ciJsrqFl');
admin.initializeApp();
const db = admin.firestore();

const fs = require('fs')




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
                  return null
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
                        .then(() => {
                            response.send(customer)
                            return null
                        })
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
    .document('users/{user_id}')
    .onUpdate((snap, context) => {
       var beforeUser = snap.before.data() 
       var afterUser = snap.after.data()
       var currentTime = admin.firestore.Timestamp.now();

        // When changelog updates, update the file located at https://firebasestorage.googleapis.com/v0/b/riive-parking.appspot.com/o/dev-team%2Fchangelog.json?alt=media&token=9210aa16-dd93-41df-8246-a17c58a4ee9e
       
        // 5 second latency before we will update the last_update field in someone's profile
       if(currentTime - beforeUser.last_update >=5 || !beforeUser.last_update){
         
            db.collection('users').doc(context.params.user_id).update({
                last_update: currentTime
            })

            admin.storage().bucket('gs://riive-parking.appspot.com').file('dev-team/changelog.json').download().then((res) => {
            return JSON.parse(res)
            }).then((changelog) => {

            var versionsBehind;

            if(!beforeUser.last_update){
                versionsBehind = changelog.versions.filter(x => x.isReleased)
            }else{
                versionsBehind = changelog.versions.filter(x => x.dateUnix > beforeUser.last_update.toMillis() && x.isReleased)
            }


            // Checks if user is behind in changelog versions
            for(var i = 0; i < versionsBehind.length; i++){
                switch(versionsBehind[i].major){
                    // Version 1
                    case 1:
                        switch(versionsBehind[i].minor){
                            // Version 1.0
                            case 0:
                                switch(versionsBehind[i].patch){
                                    // Version 1.0.0
                                    case 0:
                                        // console.log("Patch 1.0.0")
                                        // db.collection('users').doc(context.params.user_id).update({
                                        //     otherValue: beforeUser.otherValue ? afterUser.otherValue : "hello",
                                        //     newValue: beforeUser.newValue ? afterUser.newValue :"world"
                                        // });
                                        for(let i = 0; i < afterUser.listings.length; i++){
                                            db.collection('listings').doc(afterUser.listings[i]).update({
                                                hidden: false,
                                                toBeDeleted: false,
                                                visits: 0, 
                                            })
                                        }
                                        
                                        break;

                                    // Version 1.0.1
                                    case 1: 
                                        // console.log("Patch 1.0.1")
                                        // db.collection('users').doc(context.params.user_id).update({
                                        //     otherValue: "goodbye"
                                        // })
                                      break;

                                }
                            break;
                        }
                    break
                }
            }
            return null
        }).catch((e) => {
            throw e
        })
            
            return null
        }else{
            return null
        }
       
    
   
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
