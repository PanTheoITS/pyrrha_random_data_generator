const {
    app,
    BrowserWindow,
    ipcMain,
    shell,
    Menu,
    dialog
} = require('electron');
const prompt = require('electron-prompt');
const fs = require('fs');
const path = require('path');
const Excel = require('exceljs');

let mainWin;
let win;
let fname = null;
let lname = null;
let username = null;
let password = null;
let email = null;
let phone = null
let mobile = null;
let address = null;
let vatid = null;
let dob = null;

let recNumber = 0;
let gender = '';
let export2 = '';
let charLang = '';

let fnames = [];
let lnames = [];
let addresses = [];
let emails = [];
let phones = [];
let recordSet = [];

const template = [
    {
        label: 'Application',
        submenu: [
            {
                role: 'quit'
            }
        ]
    }, {
        label: 'About',
        submenu: [
            {
                label: 'View License',
                click() {
                    createLicenseWindow();
                }
            }, {
                label: 'Developed by PanTheo',
                click() {
                    shell.openExternal('http://pantheoplace.eu/');
                }
            }

        ]
    }

];

function createMainWindow() {

    mainWin = new BrowserWindow({
        backgroundColor: '#ffff',
        show: false,
        icon: `${__dirname}/assets/icons/win/icon.ico`,
        width: 1024,
        minWidth: 640,
        height: 768,
        minHeight: 480,
        webPreferences: {
            devTools: false,
            nodeIntegration: false,
            preload: path.join(__dirname, '/app/preload.js')
        }
    });

    mainWin.once('ready-to-show', () => {

        mainWin.maximize();
        mainWin.show();
    });

    mainWin.on('closed', () => {
        if (win)
            win.close();
        mainWin = null;
    });

    mainWin.loadURL(`file://${__dirname}/app/index.html`);

}

function createLicenseWindow() {
    if (win) {
        win.focus();
    } else {
        win = new BrowserWindow({
            backgroundColor: '#ffff',
            show: false,
            icon: `${__dirname}/assets/icons/mainWin-30.ico`,
            width: 1024,
            minWidth: 640,
            height: 768,
            minHeight: 480,
            webPreferences: {
                devTools: false
            }
        });

        win.setMenu(null);

        win.once('ready-to-show', () => {
            win.show();
        });

        win.on('closed', () => {
            win = null;
        });

        win.loadURL(`file://${__dirname}/app/license.html`);
    }
}

function fetchDataFromDB(fileName) {
    return new Promise((resolve, reject) => {
        let data = [];
        fs.readFile(path.resolve(__dirname, `dbase/${fileName}.json`), (err, rows) => {
            if (err)
                reject(err);
            let JSONRows = JSON.parse(rows);
            switch (fileName) {
                case 'fnames':
                    if (gender !== 'b') {
                        JSONRows.forEach(JSONRow => {
                            if (JSONRow.gender == gender) {
                                data.push(JSONRow);
                            }
                        });
                    } else {
                        data = Array.from(JSONRows);
                    }
                    break;
                case 'lnames':
                    if (gender !== 'b') {
                        JSONRows.forEach(JSONRow => {
                            if (JSONRow.gender == gender) {
                                data.push(JSONRow);
                            }
                        });
                    } else {
                        data = Array.from(JSONRows);
                    }
                    break;

                default:
                    data = Array.from(JSONRows);
            }
            resolve(data);

        });

    });
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getLNames(data) {
    lnames = Array.from(data);
}

function getFNames(data) {
    fnames = Array.from(data);
}

function getEmails(data) {
    emails = Array.from(data);
}

function getPhoneNumbers(data) {
    phones = Array.from(data);
}

function getAddresses(data) {
    addresses = Array.from(data);
}

function getSavePath(fileType) {
    let dName = '';

    switch (fileType) {
        case "xlsx":
            dName = 'Excel file';
            break;
        case "csv":
            dName = 'CSV file';
            break;
        case "json":
            dName = 'JSON file';
    }

    setPath = dialog.showSaveDialogSync(mainWin, {
        title: "Save as",
        defaultPath: app.getPath('documents'),
        filters: [
            {
                name: dName,
                ext: [fileType]
            }
        ]
    });

    return setPath;
}

function createPhoneNumber(phoneType) {
    let prefix = (phoneType === 'mobile')
        ? `${phones[getRandomNumber(0, phones.length)].mobile}`
        : `${phones[getRandomNumber(0, phones.length)].phone}`;
    let pNumber = '';

    for (let i = 0; i < 7; i++) {
        pNumber += getRandomNumber(0, 10);
    }

    return `${prefix}${pNumber}`;
}

function createEmail(username) {
    return `${username}@${emails[getRandomNumber(0, emails.length)].provider}`;
}

function createUsername(fname, lname) {
    return `${fname.slice(0, 1)}${lname.slice(0, 6)}`;
}

function createPassword(charAmount) {
    let chars = [
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'g',
        'h',
        'i',
        'j',
        'k',
        'l',
        'm',
        'n',
        'o',
        'p',
        'q',
        'r',
        's',
        't',
        'u',
        'v',
        'w',
        'x',
        'y',
        'z',
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z',
        '!',
        '*',
        '+',
        '-',
        '?',
        '@',
        '_',

    ];
    let pass = '';

    for (let i = 0; i < charAmount; i++) {

        pass += chars[getRandomNumber(0, chars.length)];
    }

    return pass;
}

function createVATID() {
    let digit = -1;
    let lastDigit = -1;
    let VATID = '';
    let result = 0;

    for (let i = 8; i >= 1; i--) {
        digit = getRandomNumber(0, 10);
        VATID += digit.toString();
        result += digit * Math.pow(2, i);
    }
    lastDigit = (result % 11) % 10;
    VATID += lastDigit;
    return VATID;
}

function createDOB(yearFrom, yearTo) {
    let beginDate = new Date(yearFrom, 0, 1);
    let endDate = new Date(yearTo, 11, 31);
    return new Date(Math.random() * (endDate.getTime() - beginDate.getTime()) + beginDate.getTime());
}

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
    vatid = null;
    dob = null;

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
            case 'vatid':
                vatid = element.value;
                break;
            case 'DOB':
                dob = element.value;
                break;

            case 'gender':
                gender = (fname || lname || username || email)
                    ? element.value
                    : null;
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
        const fnameProm = fetchDataFromDB('fnames').then((data) => {
            getFNames(data);
        }).catch((err) => {
            dialogOptions.detail = err.message;
            dialog.showMessageBox(mainWin, dialogOptions);
            console.log(`Error while fetching fnames: ${err.message} `);
        });

        promiseArray.push(fnameProm);

        const lnameProm = fetchDataFromDB('lnames').then((data) => {
            getLNames(data);
        }).catch((err) => {
            dialogOptions.detail = err.message;
            dialog.showMessageBox(mainWin, dialogOptions);
            console.log(`Error while fetching lnames: ${err.message} `);
        });

        promiseArray.push(lnameProm);

        if (email) {
            fetchDataFromDB('emails').then((data) => {
                getEmails(data);
            }).catch((err) => {
                dialogOptions.detail = err.message;
                dialog.showMessageBox(mainWin, dialogOptions);
                console.log(`Error while fetching emails: ${err.message} `);
            });
        }

    } else {

        if (fname) {
            const fnameProm = fetchDataFromDB('fnames').then((data) => {
                getFNames(data);
            }).catch((err) => {
                dialogOptions.detail = err.message;
                dialog.showMessageBox(mainWin, dialogOptions);
                console.log(`Error while fetching fnames: ${err.message} `);
            });

            promiseArray.push(fnameProm);
        }

        if (lname) {
            const lnameProm = fetchDataFromDB('lnames').then((data) => {
                getLNames(data);
            }).catch((err) => {
                dialogOptions.detail = err.message;
                dialog.showMessageBox(mainWin, dialogOptions);
                console.log(`Error while fetching lnames: ${err.message} `);
            });

            promiseArray.push(lnameProm);
        }

    }

    if (phone || mobile) {
        const phoneProm = fetchDataFromDB('phones').then((data) => {
            getPhoneNumbers(data);
        }).catch((err) => {
            dialogOptions.detail = err.message;
            dialog.showMessageBox(mainWin, dialogOptions);
            console.log(`Error while fetching phones: ${err.message} `);
        });

        promiseArray.push(phoneProm);
    }

    if (address) {
        const addressProm = fetchDataFromDB('addresses').then((data) => {
            getAddresses(data);
        }).catch((err) => {
            dialogOptions.detail = err.message;
            dialog.showMessageBox(mainWin, dialogOptions);
            console.log(`Error while fetching addresses: ${err.message} `);
        });

        promiseArray.push(addressProm);

    }

    Promise
        .allSettled(promiseArray)
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
        strObject = (id)
            ? `{"ID":${count + 1},`
            : '{';
        let fnameIndex = getRandomNumber(0, fnames.length);
        let lnameIndex = getRandomNumber(0, lnames.length);

        if ((gender == 'b') && (fnames.length > 0) && (lnames.length > 0)) {
            while (fnames[fnameIndex].gender != lnames[lnameIndex].gender) {
                lnameIndex = getRandomNumber(0, lnames.length);
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
                strObject += (charLang == 'el')
                    ? `"${fname}":"${fnames[fnameIndex].fname_el}",`
                    : `"${fname}":"${fnames[fnameIndex].fname_en}",`;
            }

        }

        if (lname) {
            if (charLang == 'bo') {
                strObject += `"${lname}_el":"${lnames[lnameIndex].lname_el}",`;
                strObject += `"${lname}_en":"${lnames[lnameIndex].lname_en}",`;
            } else {
                strObject += (charLang == 'el')
                    ? `"${lname}":"${lnames[lnameIndex].lname_el}",`
                    : `"${lname}":"${lnames[lnameIndex].lname_en}",`;
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
            let addressIndex = getRandomNumber(0, addresses.length);
            let streetNum = getRandomNumber(1, 101);
            if (charLang == 'bo') {
                strObject += `"street_el":"${addresses[addressIndex].street_el} ${streetNum}","zip":"${addresses[addressIndex].zip}","district_el":"${addresses[addressIndex].district_el}","region_el":"${addresses[addressIndex].region_el}",`;
                strObject += `"street_en":"${addresses[addressIndex].street_en} ${streetNum}","district_en":"${addresses[addressIndex].district_en}","region_en":"${addresses[addressIndex].region_en}",`;
            } else {
                strObject += (charLang == 'el')
                    ? `"street":"${addresses[addressIndex].street_el} ${streetNum}","zip":"${addresses[addressIndex].zip}","district":"${addresses[addressIndex].district_el}","region":"${addresses[addressIndex].region_el}",`
                    : `"street":"${addresses[addressIndex].street_en} ${streetNum}","zip":"${addresses[addressIndex].zip}","district":"${addresses[addressIndex].district_en}","region":"${addresses[addressIndex].region_en}",`;
            }
        }

        if (vatid) {
            strObject += `"${vatid}":"${createVATID()}",`;
        }

        if (dob) {
            let today = new Date();
            let yearFrom = today.getFullYear() - 67;
            let yearTo = today.getFullYear() - 18;
            let date = createDOB(yearFrom, yearTo);

            strObject += `"${dob}":"${(date.getDate() < 10) ? '0' + date.getDate() : date.getDate()}/${(date.getMonth() + 1 < 10) ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}/${date.getFullYear()}",`;
        }

        strObject = strObject.slice(0, strObject.length - 1);
        strObject += '}';
        recordSet.push(JSON.parse(strObject));
    }

    save2Disk();
}

function save2Disk() {
    let filePath = getSavePath();
    let dialogOptions = {};
    let strObject = '';

    if (filePath) {
        filePath += `.${export2}`;
        dialogOptions.type = 'info';
        dialogOptions.title = 'Save File';
        dialogOptions.message = 'File saved successfully.';
        dialogOptions.buttons = ['OK'];

        switch (export2) {
            case "xlsx":
            case "csv":
                let xlArray = [];
                const workbook = new Excel.Workbook();
                workbook.created = new Date();
                const sheet = workbook.addWorksheet('Data');
                Object
                    .keys(recordSet[0])
                    .forEach(key => {
                        strObject = `{"header":"${key}","key":"${key}"}`;
                        xlArray.push(JSON.parse(strObject));
                    });

                sheet.columns = Array.from(xlArray);

                recordSet.forEach((record) => {
                    strObject = '{';
                    Object
                        .values(record)
                        .forEach((value) => {
                            strObject += `"${Object
                                .keys(record)
                                .find(key => record[key] === value)}":"${value}",`;
                        });
                    strObject = strObject.slice(0, strObject.length - 1);
                    strObject += '}';
                    sheet.addRow(JSON.parse(strObject));
                });

                if (export2 == 'xlsx') {
                    workbook
                        .xlsx
                        .writeFile(filePath)
                        .then(function () {
                            dialog.showMessageBox(mainWin, dialogOptions);
                        })
                        .catch((err) => {
                            dialogOptions.message = 'Couldn\'t save the file.';
                            dialogOptions.type = 'error';
                            dialogOptions.detail = err.message;
                            dialog.showMessageBox(mainWin, dialogOptions);
                        });
                } else {
                    workbook
                        .csv
                        .writeFile(filePath)
                        .then(function () {
                            dialog.showMessageBox(mainWin, dialogOptions);
                        })
                        .catch((err) => {
                            dialogOptions.message = 'Couldn\'t save the file.';
                            dialogOptions.type = 'error';
                            dialogOptions.detail = err.message;
                            dialog.showMessageBox(mainWin, dialogOptions);
                        });
                }
                break;
            case "sql":
                let tableName = 'userData';
                let fieldNames = Object.keys(recordSet[0]);

                prompt({
                    title: 'Database Table Name',
                    label: 'Give table name:',
                    value: tableName,
                    inputAttrs: {
                        type: 'text'
                    },
                    type: 'input'
                }).then((res) => {
                    if (res != null) {
                        tableName = res;
                    }

                    recordSet.forEach((record) => {
                        strObject += `Insert into ${tableName}(${fieldNames}) values(`;

                        Object
                            .values(record)
                            .forEach((value) => {
                                strObject += (record["ID"] === value) ? `${value},` : `'${value}',`;
                            });

                        strObject = strObject.slice(0, strObject.length - 1);
                        strObject += ');\n';
                    });

                    fs.writeFile(filePath, strObject, 'utf8', (err) => {
                        if (err) {
                            dialogOptions.message = 'Couldn\'t save the file.';
                            dialogOptions.type = 'error';
                            dialogOptions.detail = err.message;
                        }
                        dialog.showMessageBox(mainWin, dialogOptions);
                    });

                }).catch(console.error);

                break;
            case "json":

                fs.writeFile(filePath, JSON.stringify(recordSet), 'utf8', (err) => {
                    if (err) {
                        dialogOptions.message = 'Couldn\'t save the file.';
                        dialogOptions.type = 'error';
                        dialogOptions.detail = err.message;
                    }
                    dialog.showMessageBox(mainWin, dialogOptions);
                });
                break;
            case "xml":
                strObject = '<?xml version="1.0" encoding="UTF-8"?>\n<userData>\n';
                recordSet.forEach((record) => {
                    strObject += '<user>\n';

                    Object
                        .keys(record)
                        .forEach((key) => {
                            strObject += `<${key}>${record[key]}</${key}>\n`;
                        });

                    strObject += '</user>\n';
                });
                strObject += '</userData>';

                fs.writeFile(filePath, strObject, 'utf8', (err) => {
                    if (err) {
                        dialogOptions.message = 'Couldn\'t save the file.';
                        dialogOptions.type = 'error';
                        dialogOptions.detail = err.message;
                    }
                    dialog.showMessageBox(mainWin, dialogOptions);
                });
        }
    }

}

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

app.on('ready', createMainWindow);

app.on('window-all-closed', () => {

    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {

    if (mainWin === null) {
        createWindow();
    }
});

ipcMain.on('formSubmit', (event, formData) => {
    getData(formData);
});

ipcMain.on('noFields', () => {
    let dialogOptions = {};
    dialogOptions.type = 'error';
    dialogOptions.title = 'Create Data';
    dialogOptions.message = 'All fields are disabled. Enable at least one to proceed.';
    dialogOptions.buttons = ['OK'];
    dialog.showMessageBox(mainWin, dialogOptions);
});