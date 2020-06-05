var UserSQL = {
    insert :'insert into user(name,account,password) values(?,?,?)',
    queryAll : 'select * from user',
    queryUser : 'select * from user where account = ?',
    validPwd : 'select * from user where account =? and password = ?',
    updataScore : 'UPDATE user SET score=? where name = ? and ? > user.score ',
    queryScore : 'select score from user where name = ?',
    queryAllScore: 'select name,score from user order by score DESC'
};
module.exports = UserSQL;