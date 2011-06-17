qwebirc.ui.UI_COMMANDS = [
  ["Options", "options"],
  ["Add webchat to your site", "embedded"],
  ["Privacy policy", "privacy"],
  ["Feedback", "feedback"],
  ["Frequently asked questions", "faq"],
  ["About qwebirc", "about"]
];

qwebirc.ui.MENU_ITEMS = function() {
  var isOwner = function(nick) {
    var channel = this.name; /* window name */
    var myNick = this.client.nickname;

    return this.client.nickOnChanHasAtLeastPrefix(myNick, channel, "~");
  };
  
  var isProtected = function(nick) {
    var channel = this.name; /* window name */
    var myNick = this.client.nickname;

    return this.client.nickOnChanHasAtLeastPrefix(myNick, channel, "&");
  };
  
  var isOpped = function(nick) {
    var channel = this.name; /* window name */
    var myNick = this.client.nickname;

    return this.client.nickOnChanHasAtLeastPrefix(myNick, channel, "@");
  };
  
  var isHalfOpped = function(nick) {
    var channel = this.name; /* window name */
    var myNick = this.client.nickname;

    return this.client.nickOnChanHasAtLeastPrefix(myNick, channel, "%");
  };

  var isVoiced = function(nick) {
    var channel = this.name;
    var myNick = this.client.nickname;

    return this.client.nickOnChanHasPrefix(myNick, channel, "+");
  };

  var targetProtected = function(nick) {
    var channel = this.name;
    return this.client.nickOnChanHasPrefix(nick, channel, "&");
  };
  
  var targetOpped = function(nick) {
    var channel = this.name;
    return this.client.nickOnChanHasPrefix(nick, channel, "@");
  };
  
  var targetHalfOpped = function(nick) {
    var channel = this.name;
    return this.client.nickOnChanHasPrefix(nick, channel, "%");
  };

  var targetVoiced = function(nick) {
    var channel = this.name;
    return this.client.nickOnChanHasPrefix(nick, channel, "+");
  };

  var invert = qwebirc.util.invertFn, compose = qwebirc.util.composeAnd;
  
  var command = function(cmd) {
    return function(nick) { this.client.exec("/" + cmd + " " + nick); };
  };
  
  return [
    {
      text: "whois", 
      fn: command("whois"),
      predicate: true
    },
    {
      text: "query",
      fn: command("query"),
      predicate: true
    },
    {
      text: "kick", /* TODO: disappear when we're deopped */
      fn: function(nick) { this.client.exec("/KICK " + nick + " wibble"); },
      predicate: isHalfOpped
    },
    {
      text: "ban", /* TODO: disappear when we're deopped */
      fn: function(nick) { this.client.exec("/BAN " + nick); },
      predicate: isHalfOpped
    },
    {
      text: "kickban", /* TODO: disappear when we're deopped */
      fn: function(nick) { this.client.exec("/BAN " + nick); this.client.exec("/KICK " + nick + " goodbye");  },
      predicate: isHalfOpped
    },
    {
      text: "protect",
      fn: command("protect"),
      predicate: compose(isOwner, invert(targetOpped))
    },
    {
      text: "deprotect",
      fn: command("deprotect"),
      predicate: compose(isOwner, targetOpped)
    },
    {
      text: "op",
      fn: command("op"),
      predicate: compose(isOpped, invert(targetOpped))
    },
    {
      text: "deop",
      fn: command("deop"),
      predicate: compose(isOpped, targetOpped)
    },
    {
      text: "halfop",
      fn: command("halfop"),
      predicate: compose(isOpped, invert(targetHalfOpped))
    },
    {
      text: "dehalfop",
      fn: command("dehalfop"),
      predicate: compose(isOpped, targetHalfOpped)
    },
    {
      text: "voice",
      fn: command("voice"),
      predicate: compose(isHalfOpped, invert(targetVoiced))
    },
    {
      text: "devoice",
      fn: command("devoice"),
      predicate: compose(isHalfOpped, targetVoiced)
    }
  ];
}();
