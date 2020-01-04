function getData(formValues) {
    let promiseArray = [];
    let dialogOptions = {};
    dialogOptions.type = 'error';
    dialogOptions.title = 'Fetch Data';
    dialogOptions.message = 'Couldn\'t get data from database.';
    dialogOptions.buttons = ['OK'];

    id = null;
    fname = null;
    lname = null;
    username = null;
    password = null;
    email = null;
    phone = null
    mobile = null;
    address = null;

    fnames = [];
    lnames = [];
    addresses = [];
    emails = [];
    phones = [];
    recordSet = [];

    for (let element of formValues) {

        switch (element.name) {
            case 'ID':
                id = element.value;
                break;
            case 'fname':
                fname = element.value;
                break;
            case 'lname':
                lname = element.value;
                break;
            case 'username':
                username = element.value;
                break;
            case 'password':
                password = element.value;
                break;
            case 'email':
                email = element.value;
                break;
            case 'phone':
                phone = element.value;
                break;
            case 'mobile':
                mobile = element.value;
                break;
            case 'address':
                address = element.value;
                break;

            case 'gender':
                gender = (fname || lname || username || email) ? element.value : null;
                break;
            case 'recNumber':
                recNumber = parseInt(element.value);
                break;
            case 'export2':
                export2 = element.value;
                break;
            case 'charLang':
                charLang = element.value;
                break;
        }

    }

    if (username || email) {
        const fnameProm = fetchDataFromDB('fnames')
            .then((data) => {
                getFNames(data);
            })
            .catch((err) => {
                dialogOptions.detail = err.message;
                dialog.showMessageBox(mainWin, dialogOptions);
                console.log(`Error while fetching fnames: ${err.message} `);
            });

        promiseArray.push(fnameProm);

        const lnameProm = fetchDataFromDB('lnames')
            .then((data) => {
                getLNames(data);
            })
            .catch((err) => {
                dialogOptions.detail = err.message;
                dialog.showMessageBox(mainWin, dialogOptions);
                console.log(`Error while fetching lnames: ${err.message} `);
            });

        promiseArray.push(lnameProm);

        if (email) {
            fetchDataFromDB('emails')
                .then((data) => {
                    getEmails(data);
                })
                .catch((err) => {
                    dialogOptions.detail = err.message;
                    dialog.showMessageBox(mainWin, dialogOptions);
                    console.log(`Error while fetching emails: ${err.message} `);
                });
        }

    } else {

        if (fname) {
            const fnameProm = fetchDataFromDB('fnames')
                .then((data) => {
                    getFNames(data);
                })
                .catch((err) => {
                    dialogOptions.detail = err.message;
                    dialog.showMessageBox(mainWin, dialogOptions);
                    console.log(`Error while fetching fnames: ${err.message} `);
                });

            promiseArray.push(fnameProm);
        }

        if (lname) {
            const lnameProm = fetchDataFromDB('lnames')
                .then((data) => {
                    getLNames(data);
                })
                .catch((err) => {
                    dialogOptions.detail = err.message;
                    dialog.showMessageBox(mainWin, dialogOptions);
                    console.log(`Error while fetching lnames: ${err.message} `);
                });

            promiseArray.push(lnameProm);
        }

    }

    if (phone || mobile) {
        const phoneProm = fetchDataFromDB('phones')
            .then((data) => {
                getPhoneNumbers(data);
            })
            .catch((err) => {
                dialogOptions.detail = err.message;
                dialog.showMessageBox(mainWin, dialogOptions);
                console.log(`Error while fetching phones: ${err.message} `);
            });

        promiseArray.push(phoneProm);
    }

    if (address) {
        const addressProm = fetchDataFromDB('addresses')
            .then((data) => {
                getAddresses(data);
            })
            .catch((err) => {
                dialogOptions.detail = err.message;
                dialog.showMessageBox(mainWin, dialogOptions);
                console.log(`Error while fetching addresses: ${err.message} `);
            });

        promiseArray.push(addressProm);

    }

    Promise.allSettled(promiseArray)
        .then(() => {
            createRecordset();
        })
        .catch((err) => {
            dialogOptions.detail = err.message;
            dialog.showMessageBox(mainWin, dialogOptions);
            console.log(`Error has occured: ${err.message} `);
        });
}


function createRecordset() {
    let strObject = '';

    for (let count = 0; count < recNumber; count++) {
        strObject = (id) ? `{"ID":${count+1},` : '{';
        let fnameIndex = getRandomNumber(fnames.length);
        let lnameIndex = getRandomNumber(lnames.length);

        if ((gender == 'b') && (fnames.length > 0) && (lnames.length > 0)) {
            while (fnames[fnameIndex].gender != lnames[lnameIndex].gender) {
                lnameIndex = getRandomNumber(lnames.length);
            }

        }

        if (username) {
            strObject += `"${username}":"${createUsername(fnames[fnameIndex].fname_en, lnames[lnameIndex].lname_en)}",`;
        }

        if (password) {
            strObject += `"${password}":"${createPassword(10)}",`;
        }

        if (fname) {
            if (charLang == 'bo') {
                strObject += `"${fname}_el":"${fnames[fnameIndex].fname_el}",`;
                strObject += `"${fname}_en":"${fnames[fnameIndex].fname_en}",`;
            } else {
                strObject += (charLang == 'el') ? `"${fname}":"${fnames[fnameIndex].fname_el}",` :
                    `"${fname}":"${fnames[fnameIndex].fname_en}",`;
            }

        }

        if (lname) {
            if (charLang == 'bo') {
                strObject += `"${lname}_el":"${lnames[lnameIndex].lname_el}",`;
                strObject += `"${lname}_en":"${lnames[lnameIndex].lname_en}",`;
            } else {
                strObject += (charLang == 'el') ? `"${lname}":"${lnames[lnameIndex].lname_el}",` :
                    `"${lname}":"${lnames[lnameIndex].lname_en}",`;
            }
        }

        if (email) {
            strObject += `"${email}":"${createEmail(createUsername(fnames[fnameIndex].fname_en, lnames[lnameIndex].lname_en))}",`;
        }

        if (phone) {
            strObject += `"${phone}":"${createPhoneNumber('phone')}",`;
        }

        if (mobile) {
            strObject += `"${mobile}":"${createPhoneNumber('mobile')}",`;
        }

        if (address) {
            let addressIndex = getRandomNumber(addresses.length);
            let streetNum = (getRandomNumber(100) == 0) ? 1 : getRandomNumber(100);
            if (charLang == 'bo') {
                strObject += `"street_el":"${addresses[addressIndex].street_el} ${streetNum}","zip":"${addresses[addressIndex].zip}","district_el":"${addresses[addressIndex].district_el}","region_el":"${addresses[addressIndex].region_el}",`;
                strObject += `"street_en":"${addresses[addressIndex].street_en} ${streetNum}","district_en":"${addresses[addressIndex].district_en}","region_en":"${addresses[addressIndex].region_en}",`;
            } else {
                strObject += (charLang == 'el') ? `"street":"${addresses[addressIndex].street_el} ${streetNum}","zip":"${addresses[addressIndex].zip}","district":"${addresses[addressIndex].district_el}","region":"${addresses[addressIndex].region_el}",` :
                    `"street":"${addresses[addressIndex].street_en} ${streetNum}","zip":"${addresses[addressIndex].zip}","district":"${addresses[addressIndex].district_en}","region":"${addresses[addressIndex].region_en}",`;
            }
        }

        strObject = strObject.slice(0, strObject.length - 1);
        strObject += '}';
        recordSet.push(JSON.parse(strObject));
    }

    save2Disk();
}

exports.getData = getData;
exports.createRecordset = createRecordset;