var xuser;

let userhtm= `<i class="fas fa-user"></i> {0}`;

function xtoken() {
    return xuser ? xuser.token : '';
}

var xuserseg = {//用户登录/修改密码...
    spath: "basic",
    path:  "profile",
    name:  "用户",
    columns: [
      {key:"name",hint:"用户名",type:xTypes._text,show:13},
      {key:"passw",hint:"密码",type:xTypes._pass,show:15}
    ]
};

function doLogin(func) {
    let op = {
        name: "登录",
        opType: opTypes.add
    };
    showDialog(xuserseg, op, undefined, function(data){
        onLogin(data);
        func();
    });
}

function onLogin(data) {
    showUser(data);
}

function showUser(user) {
    xuser = user;
    $('#xuser').empty();
    $('#xuser').append(userhtm.format(user.name));

    $('#xboxhead').append('<h3>Welcome</h3>');

    xclick($('#xuser_logout'), function(){
        let op = {
            // name: "登出",
            opType: opTypes.del
        };
        doPost(segpath(xuserseg), op, {name: xuser.name, passw: ''}, function(resp){
            xuser = undefined;
            location.reload();
        });
    });

    xclick($('#xuser_profile'), function(){
        let op = {
            name: "修改密码",
            opType: opTypes.edt
        };
        let model = {
            name: xuser.name,
            passw: ''
        }
        showDialog(xuserseg, op, model, function(){});
    });
}