document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  
  // Creates the div to show the requested email field according its id
  const currentEmail = document.createElement('div');
        currentEmail.id = "currentEmail";
        currentEmail.style.display = 'block';           
        document.querySelector('.container').appendChild(currentEmail);

  const sender = document.createElement('div');
        sender.id = "sender";   
        sender.style.display = 'block';    
        sender.className = 'col-5 ';       
        document.querySelector('#currentEmail').appendChild(sender);

  const timestamp = document.createElement('div');
        timestamp.id = "timestamp";
        timestamp.style.display = 'block';     
        document.querySelector('#currentEmail').appendChild(timestamp);

  
  const recipients = document.createElement('div');
        recipients.id = "recipients";
        recipients.style.display = 'block';           
        document.querySelector('#currentEmail').appendChild(recipients);
  
  const subject = document.createElement('div');
        subject.id = "subject";
        subject.style.display = 'block';           
        document.querySelector('#currentEmail').appendChild(subject);
  
  const body = document.createElement('div');
        body.id = "body";
        body.style.display = 'block';           
        document.querySelector('#currentEmail').appendChild(body);
 
  // Creates the reply btn into the selected email
  const reply = document.createElement("button");
        reply.id = "reply"
        reply.className = "btn btn-primary"
        reply.innerHTML = "Reply"
        document.querySelector('#currentEmail').appendChild(reply);

  // Creates the archive btn into the selected email
  const archive = document.createElement("button");
        archive.innerHTML = "Archive";   
        archive.id = "archive";
        archive.style.display = 'block';
        archive.className = "btn btn-outline-secondary"
        document.querySelector('#currentEmail').appendChild(archive);
  
  

  
  //document.querySelector('#submit').disabled = true;  
 

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
        
    
    load_mailbox('sent');  
        
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

   
    emails.forEach(showEmails);      

    function showEmails(emails) {
      //Create a div for every sinlge email.
      const email_div = document.createElement('div');
      const sender_div = document.createElement('p');
      const subject_div = document.createElement('p');
      const time_div = document.createElement('p')

      
      // Styles and display the required fields with its values.
      sender_div.className = 'sender';
      sender_div.innerHTML = `<h3> ${emails.sender}.</h3>`;
      email_div.appendChild(sender_div);

      subject_div.className = 'subject';
      subject_div.innerHTML = `<h3> ${emails.subject}.</h3>`;
      email_div.appendChild(subject_div);

      time_div.className = 'timestamp';
      time_div.innerHTML = `<h3> ${emails.timestamp}.</h3>`;
      email_div.appendChild(time_div);
    

      // Checks read or unread status for all emails and applies a corresponded style for each status. 
      if( emails.read ) {
        email_div.setAttribute('class', 'read');
      } else {
        email_div.setAttribute('class', 'unread');  
      }     
      

      email_div.addEventListener('click', () => singleEmail(emails.id));
      document.querySelector('#emails-view').append(email_div);
    }

    if (mailbox === 'sent') {
      archive.style.display = 'none';
    } else {
      archive.style.display = 'block';
    }

  }) 
  .catch(error => {
    console.log('Error:', error);
  }); 


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
  document.querySelector('#currentEmail').style.display = "block";  


  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
    // Print email
    console.log(email);

    // ... do something else with email ...

    // Function to read the mail 
    sender.innerHTML = `<h2>From: ${email.sender}</h2><hr>`;
    recipients.innerHTML = `<h2>To: ${email.recipients}</h2><hr>`;
    subject.innerHTML = `<h2> ${email.subject}</h2><hr>`;
    body.innerHTML = `<h2>${email.body}</h2><hr>`;
    timestamp.innerHTML = `${email.timestamp}`;

     
   
    reply.addEventListener('click', () =>  {

      document.querySelector('#currentEmail').style.display = 'none'; 
    
      compose_email();    
      
      f_recipients.value = `${email.sender}`; 
      f_subject.value = ((email.subject.match(/^(Re:)\s/)) ? email.subject : `Re: ${email.subject}`);
      f_body.value = `Re: "On ${email.timestamp} ${email.sender} wrote:"  ${email.body}`;
      
    });
       
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




