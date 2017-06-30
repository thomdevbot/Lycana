#Documentation

Audio.js
========
### Attributes ###
<details>
```js
constructor(queue){
    this.bot = client;
    this.queue = queue;
    this.playing;
    this.paused = false;
    this.onPlay = false;
    this.stopped = true;
    this.volume = (Config.options.defaultVolume !== undefined)? Config.options.defaultVolume : 0.2;
    this.autoplay = (Config.options.autoplay !== undefined)? Config.options.autoplay : true;

    this.youTube = new YouTube();
    this.youTube.setKey(Config.ytsearch);
}
```
</details>
### Functions ###
<details>
```js
/**
 * @param Oject song
 * @param function cb(music)
 * @desc play a youtube link
 */
youtubePlay(song, cb){
    /* ... */
}

/**
 * @param mixed streamOrFile
 * @param Object opt
 * @param function cb(music)
 * @desc begin the song
 */
startSong(streamOrFile, opt, cb){
    /* ... */
}

/**
 * @param Object msg
 * @param function cb
 * @param Integer temp
 * @desc play next song
 */
playNext(msg, cb, temp) {
    /* ... */
}

/**
 * @desc Stop the vocal output
 * @param function cb
 * @param boolean nexting
 */
stop(cb, nexting) {
    /* ... */
}

/**
 * @desc Pause the vocal output
 * @param function cb
 */
pause(cb) {
    /* ... */
}

/**
 * @desc Resume the vocal output
 * @param function cb
 */
resume(cb) {
    /* ... */
}

/**
 * @param String url
 * @param function callback
 * @desc add object song to the queue
 */
addToQueue(msg, url, callback) {
    /* ... */
}

/**
 * @desc Changes the output volume
 * @param function cb
 */
setVolume(volume, cb) {
    /* ... */
}

/**
 * @param String url
 * @param function callback
 * @desc returns the song infos on a Youtube url
 */
mixedToSong(url, addMsg, callback) {
    /* ... */
}

/**
 * @param String url
 * @desc Parse the string url and return link and type
 * @return Object
 */
resolveUrlType(url) {
    /* ... */
}
```
</details>


Do.js
=====
### Attributes ###
<details>
```js
constructor(client, datas)
{
    self.bot = client;
    self.db = datas;
    self.cmds = {};
    self.restrictLevel = 0;
    self.doNot = false;
    self.users = {};
    /* ... */
}
```
</details>
### Functions ###
<details>
```js
/**
 * @desc Inintialize commands in cmds/
 */
self.initCmds = () => {
    /* ... */
}

/**
* @desc Inintialize commands in subfolders
*/
self.initFolderCmds = (folderPath, done) => {
    /* ... */
}

/**
* @desc Inintialize the command
*/
self.initCommand = (file, path) => {
    /* ... */
}

/**
 * @param String text
 * @param String|Array[String] mixed
 * @desc returns text contains mixed | any value of mixed
 * @return boolean
 */
self.contains = (text, mixed) => {
    /* ... */
}

/**
 * @param String text
 * @param String|Array[String] mixed
 * @desc returns text contains mixed | any value of mixed
 * @return boolean
 */
self.containsWord = (text, mixed) => {
    /* ... */
}

/**
 * @param String text
 * @param String|Array[String] mixed
 * @desc returns text begins by mixed | any value of mixed
 * @return boolean
 */
self.commandBegins = (text, mixed) => {
    /* ... */
}

/**
 * @param String text
 * @param String subtext
 * @desc returns position of subtext in text
 * @return Integer
 */
self.pos = (text, subtext) => {
    /* ... */
}

/**
 * @param Object msg
 * @desc Detect a command in the message
 * @return Boolean
 */
self.msgCmd = ( msg ) => {
    /* ... */
}

/**
 * @param String command
 * @param Object msg
 * @param Array array
 * @desc Try to execute the command
 */
self.exec = ( command, msg, array ) => {
    /* ... */
}

/**
 * @param Object msg
 * @param Boolean|Object|Array[Object] restricted
 * @desc Check if the comand is restricted for a specific channel
 * @return Boolean
 */
self.isRestricted = (msg, restricted) => {
    /* ... */
}

/**
 * @param Discord.User user
 * @param Array[String|Object] roles
 * @desc Test if user has one role in roles
 *	(if Object : the role.name on the server role.server)
 * @return Boolean
 */
self.isUserInRoleList = (user, roles) => {
    /* ... */
}

/**
 * @param Object msg
 * @desc Test if user in same voice channel than the bot
 * @return Boolean
 */
self.isUserInBotVoiceChannel = (msg) =>	{
    /* ... */
}

/**
 * @param Object msg
 * @desc Detect badwords and punish if actived
 */
self.niceSpeak = (msg) => {
    /* ... */
}

/**
 * @param Object msg
 * @desc Check the max numbers of command of user or for the bot
 * @return Boolean
 */
self.checkCmdLimit = (msg) => {
    /* ... */
}

/**
 * @param String id
 * @desc Create or get the User as lib/User Object
 */
self.users.getUser = (id) => {
  /* ... */
}

/**
 * @param String type
 * @param mixed
 * @desc Resolve mixed by the type to get a good value
 * @return Mixed
 */
self.resolve = (type, mixed) =>	{
    /* ... */
}

  // Custom methods on the Discord Client bot

/**
 * @param GuildMember user
 * @param GuildChannel channel
 * @param [function callback]
 * @desc Mute the user on the channel
 */
Discord.Client.muteUser = (user, channel, callback) => {
    /* ... */
}

/**
 * @param GuildMember user
 * @param GuildChannel channel
 * @param [function callback]
 * @desc Unmute the user on the channel
 */
Discord.Client.unmuteUser = (user, channel, callback) => {
    /* ... */
}

/**
 * @param GuildMember user
 * @param GuildChannel channel
 * @param Integer time
 * @param [[function cb]mute]
 * @param [[function cb]mute]
 * @desc Mute the user on the channel for time in seconds
 */
Discord.Client.muteUserFor = (user, channel, time, cbmute, cbunmute) => {
    /* ... */
}

```
</details>

Queue.js
========
### Attributes ###
<details>
```js
constructor(db){
    this.datas = db; // Songs queued in DB file
    /* ... */
}
```
</details>
### Functions ###
<details>
```js
/**
 * @param Object link
 * @param [[function cb]]
 * @desc Add link to queue
 * @return Boolean
 */
push(link, cb) { /* ... */ }

/**
 * @desc return the position 0 song
 * @return Object
 */
next(){ /* ... */ }

/**
 * @desc Shift the position 0 song
 */
shift(){ /* ... */ }

/**
 * @desc queue getter
 */
getQu(){ /* ... */ }

/**
 * @desc queue setter
 */
setQu(val){ /* ... */ }
```
</details>

Resolver.js
===========
### Attributes ###
<details>
```js
constructor(Do) {
    this.do = Do; // Discord bot client
}
```
</details>
### Functions ###
<details>
```js
/**
 * @param string|Object|null mixed
 * @desc resolve the server
 * @return Guild
 */
getServer(mixed) {
    /* ... */
}

/**
 * @param string|Object|null mixed
 * @desc resolve the channel
 * @return GuildChannel
 */
getChannel(mixed) {
    /* ... */
}

/**
 * @param string|Object mixed
 * @desc resolve the command name
 * @return String
 */
getAlias(mixed) {
    /* ... */
}

/**
 * @param string|Object mixed
 * @desc resolve the role
 * @return Role
 */
getRole(mixed) {
    /* ... */
}

/**
 * @param string|Object mixed
 * @desc resolve the user
 * @return GuildUser
 */
getUser(mixed) {
    /* ... */
}

/**
 * @param string|Object mixed
 * @desc resolve the color of user
 * @return hexColor
 */
getColor(mixed) {
    /* ... */
}
```
</details>

Restriction.js
==============
### Attributes ###
<details>
```js
constructor(Do) {
    this.do = Do; // Discord bot client
}
```
</details>
### Functions ###
<details>
```js
/**
 * @param User user
 * @param Object bdw
 * @param Object msg
 */
stopBadwords(user, bdw, msg) {
    /* ... */
}

/**
 * @param User user
 * @param Object bdw
 * @param Object msg
 */
stopCaps(user, bdw, msg, callback) {
    /* ... */
}

/**
 * @param User user
 * @param Object bdw
 * @param Object msg
 */
stopFlood(user, bdw, msg, callback) {
    /* ... */
}

/**
 * @param User user
 * @param Object bdw
 * @param Object msg
 */
stopSpam(user, bdw, msg, callback) {
    /* ... */
}

/**
 * @param Object msg
 * @return Boolean
 */
cmdLimits(msg) {
    /* ... */
}

/**
 * @param String name
 * @param Object|Array mixed
 * @param String index
 * @return boolean
 */
 channelRestriction(name, mixed, index) {
    /* ... */
}
```
</details>

User.js
========
### Attributes ###
<details>
```js
constructor(id){
    this.id = id; // User id
    this.nbCmds = 0; // Commands in 60s
    this.badwords = 0; // Badwords counter
    this.nbMsg = 0; // Number messages in 5s
    this.alert = 0; // Number of alerts
}
```
</details>

#Some custom functions to help

functions.js
============
<details>
```js
/**
 * @desc return date to nice format
 * @return string
 */
Date.prototype.format = function () {
    /* ... */
}

/**
 * @desc subarray from array
 * @param integer start
 * @param integer end
 * @return array
 */
Array.prototype.subarray = function (start,end) {
    /* ... */
}

/**
 * @desc get random value in array
 * @return array value
 */
Array.prototype.rnd = function () {
    /* ... */
}

/**
 * @desc get url param from url
 * @param string name
 * @return string
 */
String.prototype.getParam = function ( name ) {
    /* ... */
}

/**
 * @desc replace {find} in string by the values of the array
 * @param string find
 * @param array[string] replace
 * @return string
 */
String.prototype.replaceArray = function(find, replace) {
  /* ... */
}

/**
 * @desc convert string to seconds
 * @return integer
 */
String.prototype.jhms = function() {
    /* ... */
}

/**
 * @desc convert string seconds to 00:05:12 for example
 * @return string
 */
String.prototype.strToTime = function() {
    /* ... */
}

/**
 * @desc randomize values in array
 * @return array
 */
Array.prototype.shuffle = function() {
    /* ... */
}
```
</details>

#Some global functions callable everywhere

global.js
=========
<details>
```js

/**
 * @desc APPDIR is a constant, this is the full path of the application
 */
global.APPDIR;

/**
 * @desc function to translate text
 * @param string key
 * @param [array arr]
 * @return string
 */
global.__ = (key, arr) => {
    /* ... */
}

/**
 * @desc throw the error in the console
 * @param mixed err
 * @param [boolean tryCatch]
 * @return mixed | false
 */
global.throwErr = ( err , tryCatch ) => {
    /* ... */
}

/**
 * @desc display some logs in console with date time
 * @param string text
 * @param [boolean err]
 * @return string
 */
global.niceLog = (text, err) => {
    /* ... */
}

/**
 * @desc test if inexistant or wrong type
 * @param mixed variable
 * @param string type
 * @return boolean
 */
global.not = (variable, type) => {
    /* ... */
}

```
</details>
