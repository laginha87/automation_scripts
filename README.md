# Automation scripts
[![CircleCI](https://circleci.com/gh/laginha87/automation_scripts/tree/master.svg?style=svg)](https://circleci.com/gh/laginha87/automation_scripts/tree/master) [![codecov](https://codecov.io/gh/laginha87/automation_scripts/branch/master/graph/badge.svg?token=AI1BWKI0GD)](https://codecov.io/gh/laginha87/automation_scripts)

## Motivation
From time to time I receive emails where I like to archive the attachments (bills, monthly bank statements, etc...). It's repetetive flow of archiving the email, downloading the attachment and storing it in a specific google drive depending on the origin of the email and with a specific file name. I tried automating it with something like zapier but the free tiers are very limited.

## How it works
Scripts for automating saving attachments from emails automatically.

The main flow of the app is:
1. Fetch the actions file.
1. It queries the inbox for any emails from the emails we want to process that haven't been tagged as process.
1. Process any matching emails sequentially.
1. Label the emails as processed

## Config

### 1. Env
For the script to work you need the following env vars.
From google
* CLIENT_ID, the google client id for your app
* CLIENT_SECRET, the google client secret for your app
* REFRESH_TOKEN, a refresh token
* ACTIONS_FILE, the id of the actions file in google drive

### 2. The actions file
The actions file is a json that describes what actions to apply to which emails, and it looks something like this:
```js
{
   // Email to look for in your inbox
  "info@service.account": {
    // subject to look out for
    "subject": "Monthly statement",
    // Actions to apply to an email
    "actions": [
      {
          // name of the action (for now it just has upload to google drive)
        "name": "uploadToDrive",
        // args of the action
        "args": [
          // folder id to save under
          "1KVn4b-mRBBfZHRw2Rko56ad9AL1pG2CT",
          // name suffix to apply to all files
          "Universo.pdf"
        ]
      }
    ]
  }
}
```
Just upload it to google drive and store the file google drive id.

### 3. Set up a scheduler to run every hour
```sh
npm run run
```