# discord-verification

Simple verification system I made using djs, express and request. 

## Prerequisites

- Discord Application
- A Guild
- Google reCAPTCHA v2 API keys

## Setup

Firstly, install all the dependencies by doing 
```
npm install
```
Next, open template_config.json and fill out all the data the rename it to just config.json.
Finally, go to your application in the discord dev portal [here](https://discord.com/developers/applications).
Then go to the Bot tab and tick "SERVER MEMBERS INTENT"
![image](https://user-images.githubusercontent.com/44944178/113594608-d4a2cb00-962f-11eb-9341-85fe190a33d8.png)

### Put the public google API key into html/captcha.html at data-sitekey

If you've set it up all correctly run npm start and it will run.
