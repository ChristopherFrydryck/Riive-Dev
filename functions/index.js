const functions = require('firebase-functions');
const admin = require('firebase-admin');
const stripe = require('stripe')('sk_test_rhRKZJYIAphopgJZcoKX32yD00ciJsrqFl');
admin.initializeApp();
const db = admin.firestore();

const fs = require('fs');
const { UserRecordMetadata } = require('firebase-functions/lib/providers/auth');




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

    exports.deleteSpace = functions.firestore.document('listings/{listingID}').onDelete((snap, context) => {
        const { listingID } = context.params;
        const bucket = admin.storage().bucket('gs://riive-parking.appspot.com');

        bucket.deleteFiles({
            prefix: `listings/${listingID}`
        }).then(() => {
            return db.collection("users").doc(snap.data().hostID).update({
                listings: admin.firestore.FieldValue.arrayRemove(listingID)
            })
        }).then(() => {
            return null
        }).catch(e => {return e})

    })

    

    exports.deleteUser = functions.auth.user().onDelete((event) => {
        const { uid } = event;
        const bucket = admin.storage().bucket('gs://riive-parking.appspot.com');
       
        
        db.collection('users').doc(uid).get().then((doc) => {
            if(!doc.exists){
                console.log("User doesn't exist")
                throw new Error("User doesn't exist");
            }else{
                let userData = doc.data()
                

                return userData;




                



                // console.log(doc.data().listings)



                // for(let i = 0 ; i < userData.listings.length; i++){
                //     db.collection("listings").doc(userData.listings[i]).update({
                //         hidden: true,
                //         toBeDeleted: true
                //     })
                // }

                // return null
                // bucket.deleteFiles({
                //     prefix: `users/${uid}`
                // })
            
            }
        }).then((userData) => {
            let allListings = [];


            if(userData.listings.length > 0 && userData.listings.length <= 10){
                db.collection("listings").where(admin.firestore.FieldPath.documentId(), "in", userData.listings).get().then((qs) => {
                    for(let i = 0; i < qs.docs.length; i++){
                        allListings.push(qs.docs[i].data())
                    }
                    return allListings;
                }).catch(e => {
                    throw new Error("Failed to gather listing data")
                })

                return [userData, allListings]

            }else if(userData.listings.length > 10){
                let allArrs = [];
                while(userData.listings.length > 0){
                    allArrs.push(userData.listings.splice(0, 10))
                }
                for(let i = 0; i < allArrs.length; i++){
                    db.collection('listings').where(admin.firestore.FieldPath.documentId(), "in", allArrs[i]).get().then((qs) => {
                        for(let i = 0; i < qs.docs.length; i++){
                            allListings.push(qs.docs[i].data())
                        }
                        return allListings;
                    }).catch(e => {
                        throw new Error("Failed to gather listing data")
                    })
                }

                return [userData, allListings]

            }else{
                console.log("User had no listings")
                return [userData, null]
            }

            

        
        }).then((data) => {
            console.log(`
                user data: ${JSON.stringify(data[0])}
                listing data: ${JSON.stringify(data[1])}
            `)
            return null;
        }).catch(e => {
            return console.error(e)
        })

        return null;
        // bucket.deleteFiles({
        //     prefix: `users/${userID}`
        // }).then(() => {
        //     return console.log("Getting")
        //     // return db.collection('users').doc({userID}).get()
        // }).then((doc) => {
        //     return console.log("Uhhh")
        //     // if(!doc.exists){
        //     //     return console.log("User doesn't exist")
        //     // }else{
        //     //     return console.log(doc.data())
        //     // }
        // }).then(() => {
        //    return console.log("Completed Function")
        // }).catch(e => {return e})

    })
    

  

    exports.updateUserInfo = functions.firestore
    .document('users/{user_id}')
    .onUpdate((snap, context) => {
       var beforeUser = snap.before.data() 
       var afterUser = snap.after.data()
       var currentTime = admin.firestore.Timestamp.now();

        // When changelog updates, update the file located at https://firebasestorage.googleapis.com/v0/b/riive-parking.appspot.com/o/dev-team%2Fchangelog.json?alt=media&token=9210aa16-dd93-41df-8246-a17c58a4ee9e

        console.log(`User ${beforeUser.id} disabled: ${beforeUser.disabled}.`)
        // admin.auth().updateUser(uid, {
        //     disabled: true
        // });
       
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
