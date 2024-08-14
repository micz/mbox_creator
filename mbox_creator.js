/*
 *  Copyright  Mic  (email: m@micz.it)
 *
 *  This Source Code Form is subject to the terms of the Mozilla Public
 *  License, v. 2.0. If a copy of the MPL was not distributed with this
 *  file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * 
 *  This file is avalable in the original repo: https://github.com/micz/mbox_creator
 * 
 */


const fs = require('fs');
const path = require('path');

// Configuration variables
const ownerEmail = "sender@test.com"; // The email address of the mailbox owner
const numEmailsToday = 5; // The number of emails to create for today
const numEmailsYesterday = 7; // The number of emails to create for yesterday
const numEmailsLast7Days = 20; // The number of emails to create for the last 7 days
const mboxFileName = 'test_mailbox'; // The name of the mbox file to create

// To store received emails for potential replies
let receivedEmails = [];

// Function to generate a random date within a given range
function getRandomDateWithinRange(startDate, endDate) {
    const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
    return new Date(randomTime).toUTCString();
}

// Function to generate a random Message-ID
function generateMessageID(index) {
    return `<message-${index}@example.com>`;
}

// Function to create a test email
function createTestEmail(i, date, isSent, isReply = false, originalEmail = null) {
    let from, to, subject, body, messageId, inReplyTo, references;

    messageId = generateMessageID(i);

    if (isReply && originalEmail) {
        from = ownerEmail;
        to = originalEmail.from;
        subject = "Re: " + originalEmail.subject;
        body = `This is a reply to your email titled "${originalEmail.subject}".\n\nOriginal message:\n${originalEmail.body}`;
        inReplyTo = originalEmail.messageId;
        references = originalEmail.references ? originalEmail.references + ' ' + originalEmail.messageId : originalEmail.messageId;
    } else {
        from = isSent ? ownerEmail : `sender${i}@example.com`;
        to = isSent ? `recipient${i}@example.com` : ownerEmail;
        subject = `Test Email ${i}`;
        body = `This is the body of test email number ${i}. It was ${isSent ? 'sent' : 'received'}.`;
        inReplyTo = null;
        references = null;
    }

    const email = {
        from: from,
        to: to,
        subject: subject,
        date: date,
        body: body,
        messageId: messageId,
        inReplyTo: inReplyTo,
        references: references
    };

    return `From \n` +
           `From: ${email.from}\n` +
           `Message-ID: ${email.messageId}\n` +
           (email.inReplyTo ? `In-Reply-To: ${email.inReplyTo}\n` : '') +
           (email.references ? `References: ${email.references}\n` : '') +
           `Subject: ${email.subject}\n` +
           `To: ${email.to}\n` +
           `Date: ${email.date}\n` +
           `\n${email.body}\n`;
}

// Create the Mbox file and write the test emails
function createMboxFile() {
    const mboxFilePath = path.join(__dirname, mboxFileName);
    const stream = fs.createWriteStream(mboxFilePath);

    let emailCounter = 1;

    // Function to decide if an email should be a reply
    function shouldReply() {
        return Math.random() > 0.7 && receivedEmails.length > 0; // 30% chance to be a reply if there are received emails
    }

    // Generate today's emails with times before now
    const now = new Date();
    for (let i = 0; i < numEmailsToday; i++) {
        const date = getRandomDateWithinRange(new Date(now.setHours(0, 0, 0, 0)), new Date());
        const isSent = Math.random() > 0.5; // Randomly determine if the email is sent or received
        let email;

        if (isSent && shouldReply()) {
            const originalEmail = receivedEmails[Math.floor(Math.random() * receivedEmails.length)];
            email = createTestEmail(emailCounter++, date, true, true, originalEmail);
        } else {
            email = createTestEmail(emailCounter++, date, isSent);
            if (!isSent) {
                receivedEmails.push({
                    from: `sender${emailCounter}@example.com`,
                    subject: `Test Email ${emailCounter}`,
                    body: `This is the body of test email number ${emailCounter}.`,
                    messageId: generateMessageID(emailCounter),
                    references: null
                });
            }
        }
        stream.write(email + '\n');
    }

    // Generate yesterday's emails
    const yesterdayStart = new Date(now);
    yesterdayStart.setDate(now.getDate() - 1);
    yesterdayStart.setHours(0, 0, 0, 0);

    const yesterdayEnd = new Date(yesterdayStart);
    yesterdayEnd.setHours(23, 59, 59, 999);

    for (let i = 0; i < numEmailsYesterday; i++) {
        const date = getRandomDateWithinRange(yesterdayStart, yesterdayEnd);
        const isSent = Math.random() > 0.5; // Randomly determine if the email is sent or received
        let email;

        if (isSent && shouldReply()) {
            const originalEmail = receivedEmails[Math.floor(Math.random() * receivedEmails.length)];
            email = createTestEmail(emailCounter++, date, true, true, originalEmail);
        } else {
            email = createTestEmail(emailCounter++, date, isSent);
            if (!isSent) {
                receivedEmails.push({
                    from: `sender${emailCounter}@example.com`,
                    subject: `Test Email ${emailCounter}`,
                    body: `This is the body of test email number ${emailCounter}.`,
                    messageId: generateMessageID(emailCounter),
                    references: null
                });
            }
        }
        stream.write(email + '\n');
    }

    // Generate emails from the last 7 days (excluding yesterday)
    for (let i = 0; i < numEmailsLast7Days; i++) {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - 7);

        const date = getRandomDateWithinRange(startOfWeek, yesterdayStart);
        const isSent = Math.random() > 0.5; // Randomly determine if the email is sent or received
        let email;

        if (isSent && shouldReply()) {
            const originalEmail = receivedEmails[Math.floor(Math.random() * receivedEmails.length)];
            email = createTestEmail(emailCounter++, date, true, true, originalEmail);
        } else {
            email = createTestEmail(emailCounter++, date, isSent);
            if (!isSent) {
                receivedEmails.push({
                    from: `sender${emailCounter}@example.com`,
                    subject: `Test Email ${emailCounter}`,
                    body: `This is the body of test email number ${emailCounter}.`,
                    messageId: generateMessageID(emailCounter),
                    references: null
                });
            }
        }
        stream.write(email + '\n');
    }

    stream.end(() => {
        console.log(`Created ${mboxFileName} with ${numEmailsToday + numEmailsYesterday + numEmailsLast7Days} emails.`);
    });
}

createMboxFile();
