# mbox_creator

This guide explains how to use the provided files to run the `mbox_creator` script to generate a test mbox file.
<br>I'm using this script to create emails to test [ThunderStats](https://github.com/micz/ThunderStats) my statistics add-on for Thunderbird.
<br>The emails wil be sent and received, also with replies, that will be matched in the same conversation.

There isn't much creativity in the subject, body, or correspondents addresses of the emails, but testing the statistical add-on doesn't require it at the moment. I believe we'll eventually reach the point where we'll perform statistical analysis of the text, but we're not there yet.
<br>Please feel free to enhance the script with any necessary creativity :smile: and submit a pull request. Thank you!


<br>




## Overview

- **`mbox_creator.js`**: It's the script that creates the mbox file.
- **`test_mailbox`**: It's the example mbox file generated with the `mbox_creator.js` script.



<br>




## Defining the parameters

These are the parameters you can change:
- **`ownerEmail`**: The email address of the mailbox owner.

  _Example:_
```javascript
   const ownerEmail = "author@example.com";
```

<br>

- **`numEmailsToday`**: The number of emails to create for today.

  _Example:_
```javascript
const numEmailsToday = 5;
```

<br>

- **`numEmailsYesterday`**: The number of emails to create for yesterday.

  _Example:_
```javascript
const numEmailsYesterday = 7;
```

<br>

- **`numEmailsLast7Days`**: The number of emails to create for the last 7 days.

  _Example:_
```javascript
const numEmailsLast7Days = 30;
```

<br>

- **`mboxFileName`**: The name of the mbox file to create.

  _Example:_
```javascript
const mboxFileName = 'test_mailbox';
```



<br>




## Usage

Ensure you have installed [Node.js](https://nodejs.org/).

Run the script with `node mbox_creator.js`.



<br>



## How to import the mbox file in a mail client (Thunderbird example)

Using Thunderbird, you need to locate your profile path. With Thunderbird closed, copy the file to the `Local Folders` directory. Then, open Thunderbird, and you'll find a new folder in the tree view with the name of the file you copied earlier. If needed, move the emails to another folder or to the test account you're using, and you're done.




<br>




## How to contribute

Feel free to fork the repository and make a pull request to improve the code or this guide.




<br>




## LICENSE

This code is distributed under the [MPL 2.0 license](LICENSE).

