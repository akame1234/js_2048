var UserSQL = {
    insert :'insert into user(name,account,password) values(?,?,?)',
    queryAll : 'select * from user',
    queryUser : 'select * from user where account = ?',
    validPwd : 'select * from user where account =? and password = ?'
};
module.exports = UserSQL;