String.prototype.format = function() {
    var str = this;
    for (let key in arguments) {
        let reg = new RegExp("({)" + key + "(})", "g");
        str = str.replace(reg, arguments[key]);
    }
    return str;
}

var xurl = window.location.origin.startsWith("http") ? window.location.origin : "http://127.0.0.1:8001";
var xpaths = {
    summary: "basic/summary",
    xenum  : "basic/enum",
}

//option types
var opTypes = {
    qry: 1,
    add: 2,
    edt: 3,
    del: 4
}

//text types
var xTypes = {
    _text: 0,
    _bool: 1,
    _enum: 2,
    _time: 3,
    _area: 4,
    _pass: 9,
    _mult: 20,//multi enum select
}

var xcolumn = {
    list: function(c){return (c.show & 1) > 0;},
    edit: function(c){return (c.show & 2) > 0;},
    add : function(c){return (c.show & 4) > 0;},
    edel: function(c){return (c.show & 8) > 0;},
}

function xenum(key) {
    return $.parseJSON($.ajax({
        type: "GET",
        url: "{0}/{1}?key={2}".format(xurl, xpaths.xenum, key),
        cache: false,
        async: false
    }).responseText).data;
}

function showSummary() {
    doGet(xpaths.summary, showSiderbar);
}

function xsegpath(segment) {
    return '{0}/{1}'.format(segment.spath, segment.path);
}

function doGet(path, func) {
    $.ajax({
        type: 'get',
        url: '{0}/{1}'.format(xurl, path),
        headers: {"x-token": xtoken()},
        dataType: 'json',
        success: doResp(func)
    });
}

var xlatestOp;
var httpTypes = ['_', 'get', 'post', 'put', 'delete']
function doPost(path, op, data, func) {
    xlatestOp = op;
    $.ajax({
        type: httpTypes[op.opType],
        url: '{0}/{1}'.format(xurl, path),
        data: JSON.stringify(data),
        headers: {"x-token": xtoken()},
        dataType: 'json',
        success: doResp(func)
    });
}

function doResp(func) {
    return function(resp) {
        if(resp.status == -1) {
            if(resp.data) {
                xtoast.error(resp.data);
            } else {
                xtoast.error('{0} 失败'.format(xlatestOp.name));
            }
        } else if(xlatestOp && xlatestOp.name) {
            xtoast.succ('{0} 成功'.format(xlatestOp.name));
            func(resp.data);
        } else {
            func(resp.data);
        }
        xlatestOp = undefined;
    }
}

var xtoast = {
    show: function(type, msg) {
            Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500
        }).fire({
            type: type,
            title: msg
        });
    },
    succ : function(msg) {this.show('success', msg)},
    error: function(msg) {this.show('error', msg)}
}

function xclick(btn, func) {
    btn.off('click');
    btn.click(func);
}

function xdatepicker(e) {
    e.datepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        todayHighlight: true,
        isRTL: false,
        language: "zh-CN"
    });
}

function xselect2(e, xinput) {
    let k = xinput.enumKey;
    let d = xenum(k);
    let s = e.select2({
                theme: 'bootstrap4',
                dropdownAutoWidth : true,
                width: 'auto',
                data: d,
                multiple: xinput.type==xTypes._mult,
                minimumResultsForSearch: 10
            });
    if(xinput.indep) return;
    //设置cache值
    if(eCaches[k]) s.val(eCaches[k]).trigger('change');
    //设值完成之后添加值变化监听
    s.on('change', function(evt){
        eCaches[k] = this.value;
    });
}
var eCaches = {};

//main html
let chapterhtm= function(chapter){
return `<li class="nav-item has-treeview">
            <a class="nav-link" href="javascript:void(0);">
              <i class="nav-icon fab fa-gg"/>
              <p>
                {0}
                <i class="right fas fa-angle-left"/>
              </p>
            </a>
            <ul id="chapter_{1}" class="nav nav-treeview"/>
        </li>
        `.format(chapter.name, chapter.path)
}
let chapterdom= function(data){return $('#chapter_{0}'.format(data.spath?data.spath : data.path));};

let segmenthtm= function(seg){
    return `
        <li class="nav-item">
            <a id="seg_{0}_{1}" class="nav-link" href="javascript:void(0);">
              <i class="fas fa-paperclip"/>
              <p>{2}</p>
            </a>
        </li>
        `.format(seg.spath, seg.path, seg.name);
}
let segmentdom= function(seg){return $('#seg_{0}_{1}'.format(seg.spath, seg.path));}

function showSiderbar(data) {
    for(let chapter of data.chapters){
        $('#xsiderbar').append(chapterhtm(chapter));
        for(let seg of chapter.segments){//二级菜单
            seg.spath = chapter.path;
            seg.detail.path = seg.path;
            seg.detail.segname = seg.name;
            seg.detail.segpath = xsegpath(seg);
            chapterdom(chapter).append(segmenthtm(seg));
            xclick(segmentdom(seg), showDetailFunc(seg));
        }
    }
}

var xlatestSeg;
function showDetailFunc(seg) {
    return function() {
        if(xlatestSeg)
           segmentdom(xlatestSeg).removeClass('active'); 
        xlatestSeg = seg;
        segmentdom(seg).addClass('active');

        if(seg.detail.listable) {
            doGet('{0}/list'.format(xsegpath(seg)), function(data){showDetail(seg.detail, data);});
        } else {
            showDetail(seg.detail, []);
        }
    };
}

// popup dialog keypress listening
function initial() {
    $('#xdialog').on('hide.bs.modal ', function(){
        $(document).off('keyup');
    });
    $('#xdialog').on('shown.bs.modal', function(){
        $('#xdialog').focus();
        $(document).on('keyup', function(e){
            if(e.keyCode==13) {$("#xdialog_submit").trigger('click');}
            if(e.keyCode==27) {$("#xdialog_close").trigger('click');}
        });
    });
}

$(function () {
    initial();
    doLogin(showSummary);
});