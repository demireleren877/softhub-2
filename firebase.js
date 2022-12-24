const serviceAccount = require('./service-account-key.json');
const admin = require('firebase-admin');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function getFaqs(res, req) {
    let data = [];
    let lang = req.headers["accept-language"].substring(0, 2) == "tr" ? "turkish" : "german";
    const faq = db.collection(lang).doc('pages').collection('faq');
    const snapshot = await faq.get();
    if (snapshot.empty) {
        console.log('No matching documents.');
        return;
    }

    snapshot.forEach(doc => {
        data.push(doc.data());

    });
    res.render('faq', { title: 'Hey', message: 'Hello there!', faqs: data });
}

async function getMain(res, req) {
    let lang = req.headers["accept-language"].substring(0, 2) == "tr" ? "turkish" : "german";
    let services = [];
    let how_it_works = [];
    let specialities = [];
    let welcome = [];
    let with_us = [];
    let our_story = [];

    const main = db.collection(lang).doc("pages")

    service_data = await main.collection('services').get()
    service_data.forEach(doc => {
        services.push(doc.data());
    });

    how_it_works_data = await main.collection('how_it_works').get()
    how_it_works_data.forEach(doc => {
        how_it_works.push(doc.data());
    });

    specialities_data = await main.collection('our_specialities').get()
    specialities_data.forEach(doc => {
        specialities.push(doc.data());
    });

    welcome_data = await main.collection('welcome_to_softhub').get()
    welcome_data.forEach(doc => {
        welcome.push(doc.data());
    });

    with_us_data = await main.collection('with_us_summary').get()
    with_us_data.forEach(doc => {
        with_us.push(doc.data());
    });

    our_story_data = await main.collection('our_story').get()
    our_story_data.forEach(doc => {
        our_story.push(doc.data());
    });

    res.render('main', { title: 'Hey', message: 'Hello there!', services: services, how_it_works: how_it_works, specialities: specialities, welcome: welcome, with_us: with_us, our_story: our_story });
}

async function getService(req, res) {
    let lang = req.headers["accept-language"].substring(0, 2) == "tr" ? "turkish" : "german";
    let complex_softwares = [];
    let qa = [];
    let gvoip = [];
    let development = [];
    let rpa = [];

    const col = db.collection(lang).doc("pages").collection("services")
    const snapshot = await col.get();
    if (snapshot.empty) {
        console.log('No matching documents.');
        return;
    }

    snapshot.forEach(doc => {
        complex_softwares.push(doc.data()["complex_softwares"]);
        qa.push(doc.data()["qa"]);
        gvoip.push(doc.data()["gvoip"]);
        development.push(doc.data()["development"]);
        rpa.push(doc.data()["rpa"]);
    });

    switch (req.url) {
        case "/complex_software":
            res.render('complex_software', { title: 'Hey', message: 'Hello there!', data: complex_softwares });
            break;

        case "/qa":
            res.render('qa', { title: 'Hey', message: 'Hello there!', data: qa });
            break;

        case "/gvoip":
            res.render('gvoip', { title: 'Hey', message: 'Hello there!', data: gvoip });
            break;

        case "/development":
            res.render('development', { title: 'Hey', message: 'Hello there!', data: development });
            break;

        case "/rpa":
            res.render('rpa', { title: 'Hey', message: 'Hello there!', data: rpa });
            break;

        default:
            res.send("404");
            break;
    }
}

async function getHiwd(res, req) {
    let data = [];
    let lang = req.headers["accept-language"].substring(0, 2) == "tr" ? "turkish" : "german";
    const main = db.collection(lang).doc('pages').collection('how_it_works_detail');
    const snapshot = await main.get();
    if (snapshot.empty) {
        console.log('No matching documents.');
        return;
    }

    snapshot.forEach(doc => {
        data.push(doc.data());

    });
    res.render('howitworks', { title: 'Hey', message: 'Hello there!', data: data });
}


module.exports = {
    getFaqs,
    getMain,
    getService,
    getHiwd
}