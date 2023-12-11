var backhttp = 'http://154.209.86.201:8888/'
var freshcode = localStorage.getItem("freshcode");
window.deletenum = 0;
function getUser() {
    return JSON.parse(localStorage.getItem("labels"));
}

function setUser(data) {
    localStorage.setItem("labels", JSON.stringify(data));
    return;
}


function freshtable(labels) {
    var bookmark = $('#bookmark');
    bookmark.empty();
    var str = '';
    for (var i = 0; i < labels.length; i++) {
        if (labels[i].isRandom) {
            str += '<div class="list"><div index="' + i + '" class="imgcover" onclick="jumpOrDelete(event,' + i + ',\'' + labels[i].address + '\')"><div class="img" onclick="jumpOrDelete(event,' + i + ',\'' + labels[i].address + '\')" index="' + i + '" style="background-image:url(' + getRandomUrl(labels[i].name) + ')"><div class="delbook"></div></div></div><div class="text">' + labels[i].name + '</div></div>'
        } else {
            str += '<div class="list"><div index="' + i + '" class="imgcover" onclick="jumpOrDelete(event,' + i + ',\'' + labels[i].address + '\')"><div class="img" onclick="jumpOrDelete(event,' + i + ',\'' + labels[i].address + '\')" index="' + i + '" style="background-image:url(' + getIconUrl(labels[i].address) + ')"><div class="delbook"></div></div></div><div class="text">' + labels[i].name + '</div></div>'
        }
    }
    str += '<div class="list addbook"><div class="imgcover"><div class="img" onclick="cusNavClick(event,this)"><svg viewBox="0 0 1024 1024"><path class="st0" d="M673,489.2H534.8V350.9c0-12.7-10.4-23-23-23c-12.7,0-23,10.4-23,23v138.2H350.6c-12.7,0-23,10.4-23,23c0,12.7,10.4,23,23,23h138.2v138.2c0,12.7,10.4,23,23,23c12.7,0,23-10.4,23-23V535.2H673c12.7,0,23-10.4,23-23C696.1,499.5,685.7,489.2,673,489.2z" fill="#222"></path></svg></div></div></div>'
    bookmark.append(str)
}

function initlabels() {
    var lab = getUser();
    var code = '2021/8/20';
    if (lab && freshcode == code) {
        window.labels = lab;
        freshtable(lab);
    } else {
        setUser(labels);
        freshtable(labels);
        localStorage.setItem('freshcode', code)
    }
    window.timeOutEvent = null;
}



function initEvent() {
    if (IsPC()) {
        window.oncontextmenu = (e) => {
            // console.log(e)
            if (e.target.classList.contains('imgcover')||e.target.classList.contains('img')) {
                // console.log(e.target.attributes.index.value)
                var num = e.target.attributes.index.value;
                deletenum = parseInt(num);
                showDeleteMenu(e);
            }
            // e.preventDefault();
            return false;
        };
    } else {
        window.oncontextmenu = function(event) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        };
        document.ontouchstart = function(e) {
            if (e.target.classList.contains('img')) {
                timeOutEvent = setTimeout(function() {
                    $('.delbook').css({ "display": "block" })
                    isDelete = true;
                }, 500)
            }
            e.preventDefault();
            return false;
        }
        document.ontouchend = function(e) {

            if (e.target.classList.contains('img')) {
                clearTimeout(timeOutEvent);
            }
        }
    }
}


function deletelabel() {
    labels.splice(parseInt(deletenum), 1)
    freshtable(labels)
    setUser(labels)
    $('.el-notification__content p').html("删除成功")
    $('.el-notification').fadeIn(500).delay(1000).fadeOut(500);
}

function jumpOrDelete(event, deletenum, url) {
    if (isDelete) {
        labels.splice(parseInt(deletenum), 1)
        freshtable(labels)
        setUser(labels)
        $('.el-notification__content p').html("删除成功")
        $('.el-notification').fadeIn(500).delay(1000).fadeOut(500);
        $('.delbook').css({ "display": "block" })
    } else {
        window.open(url);
    }
    event.stopPropagation();
}

function addlabel() {


    cusNavUrl = inputCustomUrl.value;
    cusNavTitle = inputCustomTitle.value;

    if (cusNavUrl == '' || cusNavTitle == '') {
        // closeFrmCusNav()
        $('.el-notification__content p').html("网址与标题不能为空！")
        $('.el-notification').fadeIn("slow").delay(2000).fadeOut(1000);
        return;
    }
    const strRegex = '^((https|http|ftp)://)?' //(https或http或ftp):// 可有可无
        +
        '(([\\w_!~*\'()\\.&=+$%-]+: )?[\\w_!~*\'()\\.&=+$%-]+@)?' //ftp的user@ 可有可无
        +
        '(([0-9]{1,3}\\.){3}[0-9]{1,3}' // IP形式的URL- 3位数字.3位数字.3位数字.3位数字
        +
        '|' // 允许IP和DOMAIN（域名）
        +
        '(localhost)|' //匹配localhost
        +
        '([\\w_!~*\'()-]+\\.)*' // 域名- 至少一个[英文或数字_!~*\'()-]加上.
        +
        '\\w+\\.' // 一级域名 -英文或数字 加上.
        +
        '[a-zA-Z]{1,6})' // 顶级域名- 1-6位英文
        +
        '(:[0-9]{1,5})?' // 端口- :80 ,1-5位数字
        +
        '((/?)|' // url无参数结尾 - 斜杆或这没有
        +
        '(/[\\w_!~*\'()\\.;?:@&=+$,%#-]+)+/?)$'; //请求参数结尾- 英文或数字和[]内的各种字符
    const re = new RegExp(strRegex, 'i'); // 大小写不敏感
    if (!re.test(encodeURI(cusNavUrl))) {
        $('.el-notification__content p').html("请检查网址格式！")
        $('.el-notification').fadeIn("slow").delay(2000).fadeOut(1000);
        return;
    }
    if (!cusNavUrl.startsWith("http")) {
        cusNavUrl = "http://" + cusNavUrl;
    }
    var la = {
        name: cusNavTitle,
        address: cusNavUrl,
        isRandom: window.isRandom.checked
    }
    labels.push(la)
    freshtable(labels)
    setUser(labels)
    closeFrmCusNav()
    inputCustomUrl.value = ''
    inputCustomTitle.value = ''
    // console.log(labels)
}

function getIconUrl(url) {
    var icon = new URL(url);
    var iconurl = icon.protocol + "//" + icon.host + "/favicon.ico";
    return iconurl;
}

function getRandomUrl(name) {
    var canvas = document.createElement("canvas");
    canvas.height = 100;
    canvas.width = 100;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#f5f5f5";
    ctx.fillRect(0, 0, 100, 100);
    ctx.fill();
    ctx.fillStyle = "#222";
    ctx.font = "70px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(name.substr(0, 1), 50, 52);
    return canvas.toDataURL("image/png");
}

function stopclick(event) {
    event.stopPropagation();
}

initlabels()
initEvent()