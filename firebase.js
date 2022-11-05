const serviceAccount = require('./service-account-key.json');
const admin = require('firebase-admin');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function getDataFirestore(res) {
    console.log('getDataFirestore');
    let data = [];

    const faq = db.collection('faq');
    const snapshot = await faq.get();
    if (snapshot.empty) {
        console.log('No matching documents.');
        return;
    }

    snapshot.forEach(doc => {
        data.push(doc.data());
    });
    res.render('faq', { title: 'Hey', message: 'Hello there!', faqs: data });


    // try {

    //     //firestore get document
    //     const docRef = db.doc("faq/questions");

    //     docRef.get().then((data) => {
    //         if (data && data.exists) {
    //             const responseData = data.data();
    //             res.send(responseData);
    //         }
    //     })
    // } catch (error) { }
}

module.exports = getDataFirestore;