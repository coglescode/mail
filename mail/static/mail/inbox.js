document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  
  // Creates the div to show the requested email field according its id
  const currentEmail = document.createElement('div');
        currentEmail.id = "currentEmail";
        currentEmail.setAttribute("class", "grid");      
               
        document.querySelector('.container').appendChild(currentEmail);

  const sender = document.createElement('div');
        sender.id = "sender";   
        sender.setAttribute("class", "read_sender");  
        document.querySelector('#currentEmail').appendChild(sender);
 
  
  const recipients = document.createElement('div');
        recipients.id = "recipients";
        recipients.setAttribute("class", "read_recipients");
        document.querySelector('#currentEmail').appendChild(recipients);

  const timestamp = document.createElement('div');
        timestamp.id = "timestamp";
        timestamp.setAttribute("class", "read_timestamp");
        currentEmail.appendChild(timestamp);

  
  const subject = document.createElement('div');
        subject.id = "subject";     
        subject.setAttribute("class", "read_subject");     
        document.querySelector('#currentEmail').appendChild(subject);
        
  const body = document.createElement("div");
        body.id = "body";
        body.setAttribute("class", "read_body");    
        document.querySelector('#currentEmail').appendChild(body);
 
  // Div that holds both reply and archive btns      
  const buttons_div = document.createElement('div');
        buttons_div.id = "buttons_div";
        buttons_div.setAttribute("class", "buttons_div");
        document.querySelector('#currentEmail').appendChild(buttons_div);

   
  // Creates the archive btn into the selected email
  const archive = document.createElement("button");
        archive.innerHTML = "Archive";   
        archive.id = "archive";
        archive.className = "btn btn-lg btn-outline-secondary m-3";
        buttons_div.appendChild(archive);
  
  // Creates the reply btn into the selected email
  const reply = document.createElement("button");
        reply.id = "reply"
        reply.className = "btn btn-lg btn-primary m-3"
        reply.innerHTML = "Reply"
        buttons_div.appendChild(reply);

  

  // Disabel the submit btn
  document.querySelector('#submit').disabled = true;  

  // Submit btn actives after a message have been written
  document.querySelector('#compose-body').addEventListener('keyup', () => {
      document.querySelector('#submit').disabled = false;  
  });
  

  // By default, load the inbox
  load_mailbox('inbox'); 

});

// Global variables
let f_recipients;
let f_subject;
let f_body; 


function compose_email() { 

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#currentEmail').style.display = 'none';

  // Clear out composition fields   
  f_recipients = document.querySelector('#compose-recipients');
  f_recipients.value = '';

  f_subject = document.querySelector('#compose-subject');
  f_subject.value = '';

  f_body = document.querySelector('#compose-body');
  f_body.value = '';
 
  
  document.querySelector('form').onsubmit = () => {

    fetch ('/emails', {
      method: 'POST',
      body: JSON.stringify({
        recipients: f_recipients.value,
        subject: f_subject.value,
        body: f_body.value
      })
    })
    .then(response => response.json())
    .then(result => {
      // Print result
      console.log(result); 
    })
    
    .catch(error => {
      console.log('Error:', error);
    });         
    
    setTimeout(() => {
      load_mailbox('sent');   
      
    }, 10);
    
        
    return false;
  }

}


//Function to load a mailbox
function load_mailbox(mailbox) {  

  // Show all emails for this inbox  
  fetch(`/emails/${mailbox}`)  
  .then(response => response.json())
  .then(emails => {
    // Print emails
    console.log(emails);      

    // ... do something else with emails ...

    if (emails.length <= 0 ) {
      const msg = document.createElement('p');
            msg.innerHTML = '<h1>No mails to show.</h1>'
            msg.style.color = '#CA503D';
            document.querySelector('#emails-view').appendChild(msg);
    } else {
      
    emails.forEach(showEmails);      
    }
   
    function showEmails(emails) {
      //Create a div for every sinlge email.
      const previewEmail = document.createElement('div');
      const sender_div = document.createElement('p');
      const subject_div = document.createElement('p');
      const time_div = document.createElement('p')

      
      // Styles and display the required fields with its values.
      sender_div.className = 'sender';
      sender_div.innerHTML = `<h3> ${emails.sender}.</h3>`;
      previewEmail.appendChild(sender_div);

      subject_div.className = 'subject';
      subject_div.innerHTML = `<h3> ${emails.subject}.</h3>`;
      previewEmail.appendChild(subject_div);

      time_div.className = 'timestamp';
      time_div.innerHTML = `<h3> ${emails.timestamp}.</h3>`;
      previewEmail.appendChild(time_div);
    

      // Checks read or unread status for all emails and applies a corresponded style for each status. 
      if( emails.read ) {
        previewEmail.setAttribute('class', 'read');
      } else {
        previewEmail.setAttribute('class', 'unread');  
      }      

      // Send every preview mail to be read by a function.
      previewEmail.addEventListener('click', () => singleEmail(emails.id));
      
      // Add every preview mail to the requested mailbox.
      document.querySelector('#emails-view').append(previewEmail);
    }

    // Hides the archive btn for mails inside the sent mailbox.
    if (mailbox === 'sent') {
      archive.style.display = 'none';
    } else {
      archive.style.display = 'block';
    }

  }) 
  .catch(error => {
    console.log('Error:', error);
  }); 

  // Disabel the submit btn.
  document.querySelector('#submit').disabled = true;

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#currentEmail').style.display = 'none';
    
}
 


// Function to retrieve one email content
function singleEmail(id) {
  // Show the mailbox and hide other views    
  document.querySelector('#emails-view').style.display = 'none';    
  document.querySelector('#compose-view').style.display = 'none'; 
  document.querySelector('#currentEmail').style.display = "grid";  

 
  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
    // Print email
    console.log(email);

    // ... do something else with email ...

    // Function to read the mail 
    sender.innerHTML = `<h3>From: ${email.sender}</h3><hr>`;
    recipients.innerHTML = `<h3>To: <span>${email.recipients}</span></h3>`;
    subject.innerHTML = `<h3>Subject: <span>${email.subject}</span></h3><hr>`;
    body.innerHTML = `<p>${email.body}</p>`;
    timestamp.innerHTML = `${email.timestamp}`;

     
    // Function to reply mails
    reply.addEventListener('click', () =>  {

      document.querySelector('#currentEmail').style.display = 'none'; 
    
      compose_email();    
      
      f_recipients.value = `${email.sender}`; 
      f_subject.value = ((email.subject.match(/^(Re:)\s/)) ? email.subject : `Re: ${email.subject}`);
      f_body.value = `Re: "On ${email.timestamp} ${email.sender} wrote:"  ${email.body}`;
      
    });
    
    // Change the place holder for archive btn accordingly if a mail is archived or not
    if (email.archived) {
      archive.innerHTML = "Unarchive";
    } else {
      archive.innerHTML = "Archive";
    }  

 
    // Mark email has read
    fetch (`/emails/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ read: true })
    })
    
    
    // Archive email
    archive.addEventListener('click', () => { 
      
      fetch (`/emails/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ archived: !email.archived })
      });

      
      setTimeout(() => {
        load_mailbox('inbox'); 
        window.location.reload(true);
      }, 10); 
      
           
    })
 
  })
  .catch(error => {
  console.log(error);
  });

 
  
}




