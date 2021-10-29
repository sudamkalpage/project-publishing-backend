# project-publishing-backend

## Commands :-

### To run Backend:

##### > npm start

### To generate a new access token Secret:

##### > node

##### > require('crypto').randomBytes(64).toString('hex')

##### > .exit

<br>

## Features :-

### Security

<ul>
  <li> 64 bit hexadecimal random key was generated using crypto library for the session secret</li>
  <li>For the security of passwords in the database bcypt was using to have different salt values for different passwords </li>
  <li>Authorization is achieved using json web tokens with the possibility of having scalabilty with access to different ports.</li>
  <li>Authorization Json web tokens are valid only 1 hour per user. Then application will use refresh tokens and send the new access tokens</li>
</ul>
