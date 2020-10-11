const{default: Db}=require('mysql2-async');
const{baseexp,addexp}=require('./level.json');
const{host,user,password,database}=require('./database.json');
const{botGuild,idLength}=require('./config.json');
const{levelRoles}=require('./roles.json');
const{addRole,removeRole,hasRole,randomInt}=require('./functions');
const db_config={host:host,user:user,password:password,database:database,skiptzfix:true};
let db;function handleError(){try{db=new Db(db_config);}catch(error){if(error.sqlMessage=="Unknown or incorrect time zone: 'UTC'"){setTimeout(handleError,100);}else{throw error;}}}handleError();
exports.query=async(query,options=[])=>{return db.query(query,options);}
exports.addUser=async(userId)=>{if(isNaN(userId)||userId.length!=18)return;const result=await this.query(`SELECT * FROM \`user\` WHERE userId = ?`,[userId]);if(result.length)return;this.query(`INSERT INTO \`user\`(userId) VALUES(?)`,[userId]);}
exports.addExp=async(client,userId,amount)=>{
    amount=parseInt(amount);
    if(isNaN(userId)||userId.length!=18||isNaN(amount))return;
    const results=await this.query("SELECT `exp` FROM `user` WHERE userId = ?",[userId]);
    if(!results.length)return;
    const wantedExp=results[0].exp+amount;
    if(wantedExp<0)return;
    this.setExp(client,userId,wantedExp);
}
exports.setExp=(client,userId,amount)=>{
    amount=parseInt(amount);
    console.log(userId,amount);
    if(isNaN(userId)||userId.length!=18||isNaN(amount)||amount<0)return;
    this.query("UPDATE `user` SET `exp` = ? WHERE userId = ?",[amount,userId]).then(()=>{
        this.checkLevel(client,userId);
    });
}
exports.addLevel=async(client,userId,amount)=>{
    amount=parseInt(amount);
    if(isNaN(userId)||userId.length!=18||isNaN(amount))return;
    const results=await this.query("SELECT `level` FROM `user` WHERE userId = ?",[userId]);
    if(!results.length)return;
    const wantedLevel=results[0].level+amount;
    if(wantedLevel<0)return;
    this.setLevel(client,userId,wantedLevel);
}
exports.setLevel=(client,userId,amount)=>{
    amount=parseInt(amount);
    if(isNaN(userId)||userId.length!=18||isNaN(amount)||amount<0)return;
    if(amount==0)return this.setExp(client,userId,amount);
    const neededExp=baseexp*(amount)+addexp*(amount-1);
    this.setExp(client,userId,neededExp);
}
exports.checkLevel=async(client,userId)=>{if(isNaN(userId)||userId.length!=18)return;const result=await this.query("SELECT exp, `level` FROM user WHERE userId = ?",[userId]);if(!result.length)return;const exp=result[0].exp;let level=result[0].level;while(true){let expNeeded=baseexp*(level+1)+addexp*level;let expNeededPrev=baseexp*level+addexp*(level-1);if(exp<expNeededPrev){level--;}else if(exp>=expNeeded){level++;}else{break;}}this.query("UPDATE user SET `level` = ? WHERE userId = ?",[level,userId]).then(()=>{this.checkLevelRoles(client,userId);});}
exports.checkLevelRoles=async(client,userId)=>{if(isNaN(userId)||userId.length!=18)return;const result=await this.query("SELECT `level` FROM user WHERE userId = ?",[userId]);if(!result.length)return;const level=result[0].level;const guild=client.guilds.cache.get(botGuild);const member=guild.members.cache.get(userId);if(level>=5&&!hasRole(member,levelRoles.five)){addRole(member,levelRoles.five);}else if(level<5&&hasRole(member,levelRoles.five)){removeRole(member,levelRoles.five);}if(level>=10&&!hasRole(member,levelRoles.ten)){addRole(member,levelRoles.ten);}else if(level<10&&hasRole(member,levelRoles.ten)){removeRole(member,levelRoles.ten);}if(level>=25&&!hasRole(member,levelRoles.twentyfive)){addRole(member,levelRoles.twentyfive);}else if(level<25&&hasRole(member,levelRoles.twentyfive)){removeRole(member,levelRoles.twentyfive);}if(level>=50&&!hasRole(member,levelRoles.fifty)){addRole(member,levelRoles.fifty);}else if(level<50&&hasRole(member,levelRoles.fifty)){removeRole(member,levelRoles.fifty);}if(level>=100&&!hasRole(member,levelRoles.hundered)){addRole(member,levelRoles.hundered);}else if(level<100&&hasRole(member,levelRoles.hundered)){removeRole(member,levelRoles.hundered);}}
exports.isBlacklisted=async(userId)=>{if(isNaN(userId)||userId.length!=18)return false;const result=await this.query("SELECT * FROM blacklisted WHERE userId = ?",[userId]);if(!result.length)return false;return true;}
exports.makeOrderId=async()=>{const characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";let id="";for(let i=0;i<idLength;i++){id+=characters.charAt(randomInt(0,characters.length));}const result=await this.query("SELECT orderId FROM `order` WHERE orderId = ?",[id]);if(result.length){return this.makeOrderId();}else{return id;}}
exports.deleteOrders=async(client)=>{const results=await this.query("SELECT orderId, userId, guildId FROM `order` WHERE status NOT IN('delivered','deleted')");const deletedGuilds=[];for(let result of results){const guild=client.guilds.cache.get(result.guildId);if (!guild && !deletedGuilds.includes(result.guildId)){deletedGuilds.push(result.guildId);this.query("DELETE FROM `order` WHERE guildId = ?",[result.guildId]);} else if (guild) {const member=guild.members.cache.get(result.userId);if(!member){this.query("DELETE FROM `order` WHERE userId = ?",[result.userId]);}}}}
