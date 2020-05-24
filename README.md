# CDISC Library API Compression Comparison

## How to use

* Download the repository:

```sh
git clone https://github.com/DmitryMK/clacompression.git
cd clacompression
```

* Configure src/claTest.js
  * Specify claMirror URL in the **claMirrorUrl** variable.
  * Select needed endpoints in the **endPointsSource** variable.
  * Specify number of times endpoints will be cycles through in the **repeats** variable.

* Setup cla-mirror
  * Enable cache, otherwise you may use a lot of CDISC Library traffic
  * It is required to enable CORS for this test to run

* Install it and run:

```sh
npm install
npm start
```

* When running the tests, disable All Cache in the Network tab of the Developer Tools.
