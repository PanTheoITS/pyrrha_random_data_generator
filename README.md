# **Pyrrha: Random User Data Generator**

Pyrrha is a native desktop application that creates dynamic and realistic data to help developers test their software. It also provides other IT professionals such as system administrators with the opportunity to try out different scenarios for their company’s network infrastructure (databases, active directories, etc.) on a test server without using actual employee data.

Features: 

* It generates various types of user data (username, password, first and last name, email, etc.).
* You can enable or disable any field to produce only the kind of information you require. You can also change the field names.
* Addresses are created using a range of real districts in Athens (Greece). This way, you can use Pyrrha whenever you want to test apps that have geolocation capabilities.
* The program produces Greek names and addresses that are available in both Greek and Latin characters. 


##  **Installation**

1. Download and install [Node.js](https://nodejs.org/en/).
2. Clone or download the code from this repository.
3. Run `npm install` inside application's main folder.

Now, if you want to:

* **Run the app.** Just execute the command `npm start`.
* **Build and distribute the app.** Run `npm run package-win`, `npm run package-linux` or `npm run package-mac` for Windows,  Linux or Mac OS builds respectively. You can find the distributable folders inside the folder `release-builds` in your root folder of this project. 


##  **Updates**

* Version 1.1.1: Minor bug fixes were made.

* Version 1.1.0: Date of birth and VAT ID were added.

* Version 1.0.5: Two more output formats were added (SQL and XML).


