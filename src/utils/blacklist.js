// Use a plain object instead of Map for token storage
const blacklist = {};

function addToBlacklist(token) {
   blacklist[token] = Date.now();
}

function isTokenBlacklisted(token) {
   return blacklist.hasOwnProperty(token);
}

function clearOldTokens(duration) {
   const currentTime = Date.now();
   for (const token in blacklist) {
      if (blacklist.hasOwnProperty(token)) {
         const tokenTime = blacklist[token];
         if (currentTime - tokenTime >= duration) {
            delete blacklist[token];
         }
      }
   }
}

setInterval(() => {
   clearOldTokens(60 * 60 * 1000); // Clear tokens older than 1 hour
}, 60 * 60 * 1000);

module.exports = { blacklist, addToBlacklist, isTokenBlacklisted };