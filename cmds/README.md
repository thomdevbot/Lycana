#Documentation

How to create a basic command
-----------------------------

First, create a new .js file in cmds/ directory like :

```js
module.exports = {
    usage: "`<cmd>` : " + __("Description"),

    exec: function (msg, values) {

        // Your code goes here

        return true;  // Put the `return true;` at the end of the exec function,
                      // it determines if the command has finished or is stuck  
    }
};
```

Note:
 * `__()` is a function that try to translate based on english key.
 * The name of the js file is the command name : example.js will be called with !example or +example depending the prefix in the config.

Full example :
--------------

You can refer to calsses to access functionalities :
 * [Audio.js](https://github.com/dayxhep/discord-nodebot/tree/master/lib#audiojs)
 * [Do.js](https://github.com/dayxhep/discord-nodebot/tree/master/lib#dojs)
 * [Queue.js](https://github.com/dayxhep/discord-nodebot/tree/master/lib#queuejs)
 * [User.js](https://github.com/dayxhep/discord-nodebot/tree/master/lib#userjs)

```js
module.exports = {

    // Setting attributes here will override the Config.options.cmds[ this command ]'s attributes.

    usage: "`<cmd>` : " + __("Description"),
    show: true, // Boolean : is command showed trought help command
    restricted: false, // Array[objects]|object|Boolean : Restrictions for utilisation
    calldelete: false, // Boolean : auto delete trigger message
    alias: ["exampl" /*, "expl", "ex" */ ], // Array[strings] : Aliases to use the command
    requireVC: true, // Boolean : require triggering user in same voice channel that the bot

    max: 5, // Custom variable that can be displayed in description like "This command has a max number : <max>"

    exec: function (msg, values) {
        /**
         * Do is the do-all-things object
         * Note that Do is accessible globally too
         */
        console.log(Do);
        
        /**
         * You can access the client.
         */
        console.log(client.user.id);

        /**
         * msg = {
         *     'author': message.author,
         *     'target': message.channel,
         *     'text': message.content,
         *     'msg': message,
         *     'prx': Config.prx
         * };
         */
        console.log(msg);

        /**
         * values is msg.content.split(" ");
         * So "!say hello world" = ["!say", "hello", "world"]
         */
        console.log(values);

        return true;
    },

    load: function() {
        /* The code here will be executed at command loading */
    },
    
    customFunction: function(hello, world) {
        // You can access this functions anywhere by : Do.cmds["example"].customFunction("hello", "world");
    },
};
```

More informations :
-------------------

 * command.restricted :

    - true : Owner only

    - false : All users in all channels

    - Object :

        * The object works like a AND : **`{"channelName1": ["role1", "role2"] , "channelName3": ["role1", "role2"]}`**

        This will autorise the command on the channel 1 and on the channel 3 for users that has role 1 or role 2 only.

        * You can use `"all"` as a channel name or role name to apply to all channels/roles

        * You can use ids : **`{"1625836537876": ["123456789123", "123456789124"], "tests": false, "dm": true}`**
        
         This will autorise the command on the channel 1625836537876 for users that has role 123456789123 or role 123456789124,
         all users on the channel "tests" and only the owner in private message to the bot
