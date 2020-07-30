var fy= '1516',
    IP;

ThisSession= rndtime();
document.write('<script src="/scripts/SmartTable.js?'+ThisSession+'"></script>');

if(typeof jq == 'undefined') {
  document.write('<script src="http://128.192.142.240/scripts/jq1.11.2.js"></script>');  //full path needed for Data Transfer
}

afy=fy.substr(2); if(afy.length==1) afy='0'+afy
afyo=right(afy-1,2)
fyo=right(afy-2,2)+''+right(afy-1,2)

fyLast=fyo
afyLast=afyo

fyNext=right(afy*1,2)+''+right(afy*1+1,2)
afyNext=right(afy*1+1,2)

fyThis=fy
afyThis=afy


SQLFieldNames=SQLTable=false
SQLChar= '$';

if(location.toString().toLowerCase().indexOf('georgiaadoptastream')>-1 || 
   location.toString().toLowerCase().indexOf('riversalive')>-1 ||
   location.toString().toLowerCase().indexOf('gaprojectwet')>-1) {
  QPath= '';
}
else {
  QPath= 'http://aesl.ces.uga.edu';
}

DoExcel=false

User=''

var ajax=[]
var aj2=[] //keep aj2 separate for IE6

if (!window.JSON) {
  window.JSON = {
    parse: function(sJSON) { return eval('(' + sJSON + ')'); },
    stringify: (function () {
      var toString = Object.prototype.toString;
      var isArray = Array.isArray || function (a) { return toString.call(a) === '[object Array]'; };
      var escMap = {'"': '\\"', '\\': '\\\\', '\b': '\\b', '\f': '\\f', '\n': '\\n', '\r': '\\r', '\t': '\\t'};
      var escFunc = function (m) { return escMap[m] || '\\u' + (m.charCodeAt(0) + 0x10000).toString(16).substr(1); };
      var escRE = /[\\"\u0000-\u001F\u2028\u2029]/g;
      return function stringify(value) {
        if (value == null) {
          return 'null';
        } else if (typeof value === 'number') {
          return isFinite(value) ? value.toString() : 'null';
        } else if (typeof value === 'boolean') {
          return value.toString();
        } else if (typeof value === 'object') {
          if (typeof value.toJSON === 'function') {
            return stringify(value.toJSON());
          } else if (isArray(value)) {
            var res = '[';
            for (var i = 0; i < value.length; i++)
              res += (i ? ', ' : '') + stringify(value[i]);
            return res + ']';
          } else if (toString.call(value) === '[object Object]') {
            var tmp = [];
            for (var k in value) {
              if (value.hasOwnProperty(k))
                tmp.push(stringify(k) + ': ' + stringify(value[k]));
            }
            return '{' + tmp.join(', ') + '}';
          }
        }
        return '"' + value.toString().replace(escRE, escFunc) + '"';
      };
    })()
  };
}

String.prototype.trim = function() {return this.replace(/(^\s*)|(\s*$)/g, "")}

Number.prototype.indexOf = function(needle) {return this.toString().indexOf(needle)}  //must put number in quotes!!
Number.prototype.replace = function(s1,s2) {return this.toString().replace(s1,s2)}    //must put number in quotes!!

var Acrobat = function() {
  var getBrowserName = function() {
    return this.name = this.name || function() {
      var userAgent = navigator ? navigator.userAgent.toLowerCase() : "other";

      if(userAgent.indexOf("chrome") > -1)        return "chrome";
      else if(userAgent.indexOf("safari") > -1)   return "safari";
      else if(userAgent.indexOf("msie") > -1)     return "ie";
      else if(userAgent.indexOf("firefox") > -1)  return "firefox";
      return userAgent;
    }();
  };

  var getActiveXObject = function(name) {
    try { return new ActiveXObject(name); } catch(e) {}
  };

  var getNavigatorPlugin = function(name) {
    for(key in navigator.plugins) {
      var plugin = navigator.plugins[key];
      if(plugin.name == name) return plugin;
    }
  };

  var getPDFPlugin = function() {
    return this.plugin = this.plugin || function() {
      if(getBrowserName() == 'ie') {
        //
        // load the activeX control
        // AcroPDF.PDF is used by version 7 and later
        // PDF.PdfCtrl is used by version 6 and earlier
        return getActiveXObject('AcroPDF.PDF') || getActiveXObject('PDF.PdfCtrl');
      }
      else {
        return getNavigatorPlugin('Adobe Acrobat') || getNavigatorPlugin('Chrome PDF Viewer') || getNavigatorPlugin('WebKit built-in PDF');
      }
    }();
  };

  var isAcrobatInstalled = function() {
    return !!getPDFPlugin();
  };

  var getAcrobatVersion = function() {
    try {
      var plugin = getPDFPlugin();

      if(getBrowserName() == 'ie') {
        var versions = plugin.GetVersions().split(',');
        var latest   = versions[0].split('=');
        return parseFloat(latest[1]);
      }

      if(plugin.version) return parseInt(plugin.version);
      return plugin.name

    }
    catch(e) {
      return 'unknown';
    }
  }

  //
  // The returned object
  //
  return {
    browser:   getBrowserName(),
    installed: isAcrobatInstalled(),
    version:   getAcrobatVersion()
  };
} //Acrobat

function htmlDecode(input){
  var e = document.createElement('div')
  e.innerHTML = input
  for(var s='',i=0;i<e.childNodes.length;i++) s+=e.childNodes[i].nodeValue
  return s
} //htmlDecode

function zclone(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    var temp = obj.constructor(); // give temp the original obj's constructor
    for (var key in obj) {
        temp[key] = clone(obj[key]);
    }

    return temp;
}

function clone(obj) {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        var copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
//        alert('Array\r'+copy)
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    alert('clone')
    throw new Error("Unable to copy obj! Its type isn't supported.");
} //clone

function merge(r1,r2){
//  if(typeof(r1)==='undefined') {alert(123); r1=[]}
  for(var i in r2) try{
//    if(typeof r2[i]=='object' && r1[i]) r1[i]=merge(r1[i],r2[i])
//    if(typeof r1[i]==='undefined') r1[i]=null
//    if(typeof r2[i]==='object') r1[i]=clone(r2[i]) //merge(r1[i],r2[i])
//    else r1[i]=r2[i]

//    else if(typeof r2[i] != 'undefined') r1[i]=r2[i]
    if(typeof r2[i]==='object') {
//      if(i=='center') alert(r1[i]+'\r'+r2[i]+'\r'+typeof(r2[i])+'\r'+(r2[i] instanceof Array))
      r1[i]=clone(r2[i])
//      if(i=='center') alert(r1[i]+'\r'+r2[i])
    }
    else r1[i]=clone(r2[i]) //r1[i]=r2[i]
  }catch(ee){alert('2: '+i+' '+r1)}
//  alert(output(r1))
  return r1
} //merge

function obsmerge(r1,r2){
  for(var i in r2) r1[i]=r2[i]
  return r1
} //obsmerge

function output(obj,n){
  if(!n) n=''
  var s=[]
  for(var i in obj){
    if(typeof obj[i]==='object') s.push(output(obj[i],i+'.'))
    else if(typeof obj[i]!='function') s.push(n+i+': '+obj[i])
  }
  return s.join('\r')
} //output

function inputWhole(evt) {
  evt = evt || window.event
  var kc=(typeof evt.which == "undefined") ? evt.keyCode : evt.which
  if(kc==0 || kc==8) return true //GD Firefox triggers keypress on the TAB and Backspace keys!!!
  var key = String.fromCharCode(kc)
  return key>='0' && key<='9'
} //inputWhole

function inputReal(evt) {
  evt = evt || window.event
  var target = evt.target || evt.srcElement
  var kc=(typeof evt.which == "undefined") ? evt.keyCode : evt.which
  if(kc==0 || kc==8) return true //GD Firefox triggers keypress on the TAB and Backspace keys!!!
  var key = String.fromCharCode(kc)
  var res=target.value+key
  setTimeout(function(){
               if(target.value.split('\-').length>2) target.value=target.value.substr(0,target.value.indexOf('-')+1)+(target.value.substr(target.value.indexOf('-')+1).replace('-',''))
               if(target.value.split('\.').length>2) target.value=target.value.substr(0,target.value.indexOf('.')+1)+(target.value.substr(target.value.indexOf('.')+1).replace('.',''))
               if(target.value.indexOf('-')>0) target.value=target.value.replace('\-','')
             },0
            )
  return (key=='-' || (key>='0' && key<='9') || key=='.')
} //inputReal

function inputRealPositive(evt) {
  evt = evt || window.event
  var target = evt.target || evt.srcElement
  var kc=(typeof evt.which == "undefined") ? evt.keyCode : evt.which
  if(kc==0 || kc==8) return true //GD Firefox triggers keypress on the TAB and Backspace keys!!!
  var key = String.fromCharCode(kc)
  setTimeout(function(){
               if(target.value.split('\-').length>2) target.value=target.value.substr(0,target.value.indexOf('-')+1)+(target.value.substr(target.value.indexOf('-')+1).replace('-',''))
               if(target.value.split('\.').length>2) target.value=target.value.substr(0,target.value.indexOf('.')+1)+(target.value.substr(target.value.indexOf('.')+1).replace('.',''))
               if(target.value.indexOf('-')>0) target.value=target.value.replace('\-','')
             },0
            )
  return ((key>='0' && key<='9') || key=='.') && (target.value+key).split('\.').length<3
} //inputRealPositive

function inputRealTrace(evt) {
  evt = evt || window.event
  var target = evt.target || evt.srcElement
  var kc=(typeof evt.which == "undefined") ? evt.keyCode : evt.which
  if(kc==0 || kc==8) return true //GD Firefox triggers keypress on the TAB and Backspace keys!!!
  var key = String.fromCharCode(kc)
  setTimeout(function(){
               if(target.value.split('\-').length>2) target.value=target.value.substr(0,target.value.indexOf('-')+1)+(target.value.substr(target.value.indexOf('-')+1).replace('-',''))
               if(target.value.split('\.').length>2) target.value=target.value.substr(0,target.value.indexOf('.')+1)+(target.value.substr(target.value.indexOf('.')+1).replace('.',''))
               if(target.value.indexOf('-')>0) target.value=target.value.replace('\-','')
               if(target.value.toUpperCase().indexOf('T')>-1) target.value='Trace'
             },0
            )
  return ((key>='0' && key<='9') || key=='.' || key.toUpperCase()=='T') && (target.value+key).split('\.').length<3
} //inputRealTrace

inputDouble=inputReal

function inputDate(evt) {
  evt = evt || window.event
  var kc=(typeof evt.which == "undefined") ? evt.keyCode : evt.which
  if(kc==0 || kc==8) return true //GD Firefox triggers keypress on the TAB and Backspace keys!!!
  var key = String.fromCharCode(kc)
  return (key>='0' && key<='9') || key=='/'
} //inputDate

function inputTime(evt) {
  evt = evt || window.event
  var kc=(typeof evt.which == "undefined") ? evt.keyCode : evt.which
  if(kc==0 || kc==8) return true //GD Firefox triggers keypress on the TAB and Backspace keys!!!
  var key = String.fromCharCode(kc)
  return (key>='0' && key<='9') || key==':' || key=='/' || key=='a' || key=='p' || key=='m' || key=='A' || key=='P' || key=='M' || key==' '
} //inputTime

function destroy(obj){
  if(typeof obj==='string') obj= $(obj);
  obj.parentNode.removeChild(obj);
}

function chr(x){return String.fromCharCode(x)}
function ord(x){return x.charCodeAt(0)}

function getParen(id) {
  if($t(id)>'') {
    var s= $t(id).split('(')
    s=s[s.length-1].replace(')','')
//        alert(s)
    return s
  }
  else return -1
} //getParen

function IE()     {return !window.Node}
function Firefox(){return  window.Node}

function SetInnerText(obj,s) {
  if(!window.Node) obj.innerText=s
  else obj.textContent=s
}

function GetInnerText(obj) {
  if(!window.Node) return obj.innerText.trim()
  else return obj.textContent.trim()
}

getInnerText=GetInnerText

function rndtime() {
  var r=new Date()
  return r.getDate()+r.getMilliseconds()+Math.random()
}

function randBetween(min,max){
  return Math.floor(Math.random() * (max - min + 1)) + min
} //randBetween

function Ready(x) {
  return x.readyState==4 && x.status==200
}

function AJAXWrapper(n,p1,p2,p3,p4,p5) {
  return function() {
//    if(dopost) try{alert(ajax[n].responseText)}catch(ee){}
    if(Ready(ajax[n])) {
      if(window.Node) try{ajax[n].responseXML.normalize()} catch(ee){} //FireFox limits to 4096 characters otherwise

      if(aj2[n].FieldNames) {
        var r=ajax[n].responseText.split('^^')[0].split('|')
        for(var i=0;i<r.length;i++) try{
          var z=r[i].replace(/[^a-zA-Z0-9]/g,'')
          if(z!='') eval(aj2[n].SQLChar+z+'='+i)
        }catch(ee){alert('AJAXWrapper: '+r[i])}
      }

      aj2[n].func(ajax[n],p1,p2,p3,p4,p5)
      aj2[n]=ajax[n]=null

    }
  }
} //AJAXWrapper

//var dopost=false

function AJAX(s,func,p1,p2,p3,p4,p5) {
  var n=ajax.length
  aj2[n]=new Object()
  aj2[n].FieldNames=SQLFieldNames; SQLFieldNames=false
  aj2[n].SQLChar=SQLChar;          SQLChar='$'

//  aj2[n].FieldNames=false
  ajax[n]=window.XMLHttpRequest?new XMLHttpRequest():window.ActiveXObject?new ActiveXObject("Microsoft.XMLHTTP"):null

//NOTES: Post doesn't cache; Get has a URL limit of 2083 characters in IE
  dopost=(s.length>1000) //& (s.indexOf('?')>0) & (s.toLowerCase().indexOf('.asp')>0)

  if(dopost) {
//    alert(123)
    var z=s.split('\?')
    ajax[n].open('POST',z[0],true)

//still experimenting with charset
//    var charset='windows-1251'
//    var charset='ISO-8859-1'
    var charset='UTF-8'
    ajax[n].setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset="+charset)
//    ajax[n].setRequestHeader("Content-Transfer-Encoding", charset)

//    ajax[n].setRequestHeader("Content-length", z[1].length)
//    ajax[n].setRequestHeader("Connection", "close")
  }
  else try{
    ajax[n].open('GET',s,true)
  }catch(ee){alert('DT: '+s)}

  if(func) {
    aj2[n].func=func
    ajax[n].onreadystatechange=AJAXWrapper(n,p1,p2,p3,p4,p5)
  }

/*
  if(window.Node) {
    netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
    ajax[n].overrideMimeType('charset=x-user-defined')
  }
*/

  if(dopost) ajax[n].send(z[1])
  else       ajax[n].send(null)

  return ajax[n]
} //AJAX

function AJAXPage(page,div) {
  function Gotit(x) {div.innerHTML=x.responseText}
  AJAX(page+'?'+ThisSession,Gotit)
} //AJAXPage

function Excel(html,fn){
  var f=$('XFRM')
  if(!f) {
    f=document.createElement("DIV")
    f.style.display='none'
    f.innerHTML='<form id="XFRM" method="post" action="http://aesl.ces.uga.edu/scripts/excel.asp">'+
                ' <textarea name="HTML" id="HTML"></textarea>'+
                ' <input name="Filename" id="Filename">'+
                '</form>'
    document.body.appendChild(f)
  }
  $('Filename').value=fn?fn+'.xls':'Data.xls'
  $('HTML').value="<html xmlns:o='urn:schemas-microsoft-com:office:office'\n" +
                    "xmlns:x='urn:schemas-microsoft-com:office:excel'\n" +
                    "xmlns='http://www.w3.org/TR/REC-html40'>\n" +
                    html.replace(/\&lt;/g,'<').replace(/\&gt;/g,'>')+
                   "</html>"
  $('XFRM').submit()
} //Excel

function functionize(obj , func ) {
  out = func;
  for( i in obj ){ out[i] = obj[i]; } ;
  return out;
} //functionize

function View(flds,data){
  this.fldno=[];
  for(var i=0;i<flds.length;i++) this.fldno[flds[i]]=i;

  this.raw= data;

  this.HTMLTable=function(options){
    if(this.recordCount===0) return '<b style="color:red">Not found.</b>';

    if(!options) options={};
    options=merge(options,{tableStyle:'background:white;border:1px solid black'});

    var s

    s= '<table cellspacing=0 cellpadding=0 style="background:white;border:1px solid black">';
    if(options.toprow) s+= options.toprow;
    s+= '<tr style="background:#def"><th>'+flds.join('<th>');
    for(var i=1;i<data.length;i++) {
      s+='<tr><td>'+data[i].join('<td>');
    };
    s+='</table>';
    return s;
  } //HTMLTable

  this.record=function(n,fld){
    if(typeof fld==='number') return data[n][fld];
    else if(!fld)             return data[n];
    else                      return data[n][this.fldno[fld]];
  } //record

  this.recordCount=data.length-1;
  this.fldCount=flds.length;

} //View

function fSQL(sql,fnc,options){
  if(!options) options={};
  options=merge(options,{aas:false});
  var sq=options.aas?ASQL:ISQL;
  SQLFieldNames= true;
  sq(sql,
     function(x){
       var r=x.responseText.split('^^'); r.pop();
       for(var i=0;i<r.length;i++) r[i]=r[i].split('|');
       var flds=r[0];
       var V=new View(flds,r);
       if(fnc){
         if(typeof fnc==='string') {
           $(fnc).innerHTML=V.HTMLTable(options);
           if(options.smartTable) {
             smartTable($(fnc).getElementsByTagName('table')[0], options.smartTable)
           }
         }
         else fnc(V);
       }
     }
    )
} //fSQL

ffSQL=fSQL  //for FEWLogin

function Announcements(obj,list,options) {
  obj.onmouseover=function(){
    clearTimeout(glob.sto);
    this.inAnnounce=true;
    obj.childNodes[3].style.overflowY='scroll';
    obj.childNodes[0].style.display='none'
    obj.childNodes[1].style.display='none'
  } //onmouseover

  obj.onmouseout=function(){
    clearTimeout(glob.sto);
    this.inAnnounce=false;
    glob.sto=setTimeout(glob.xscroll,this.speed);
    obj.childNodes[3].style.overflowY='hidden';
    obj.childNodes[0].style.display='inline'
    obj.childNodes[1].style.display='inline'
  } //onmouseout

  this.inAnnounce=false;

  this.init=function(n){
    var s=[];

    for(var i=0;i<list.length*2;i++) {
      var j=i+n;
      var t=[];

      var w=(glob.width-glob.scrollwidth*2-10)

      t.push('<div id="A'+j+'" cellspacing=0 cellpadding=0 style="width:'+w+'px;opacity:0.8;padding:10px 5px;border-bottom:1px solid silver;background:white">');
      t.push('<table cellspacing=0 cellpadding=0 style="width:100%">')
      t.push('<tr><td style="padding:0px;border:0;width:90%">'+list[j%list.length]);
      if(pt.length) t.push('<td style="padding:0px;border:0;width:10%;text-align:right"><ZIMG style="float:right;padding-left:0.5em;max-height:XXXpx;zmax-width:50px" src="'+pt[j%list.length]+'">');
      t.push('</table>');
      t.push('</div>');

      pf.innerHTML=t.join('');

      var ht=pf.clientHeight;
//      ht=Math.max(ht,30)
//      ht=Math.min(ht,60)

      t=t.join('').replace('ZIMG','IMG').replace('XXX',ht);
      s.push(t);
    }
    obj.innerHTML='<img src="images/scrolltop.png"    style="z-index:1;right:0px;top:25px  ;position:absolute">'+
                  '<img src="images/scrollbottom.png" style="z-index:1;right:0px;bottom:0px;position:absolute">'+
                  '<div style="text-align:center;font-size:110%;background:#eee;color:#369;height:25px"><b>Announcements</b></div>'+
                  '<div style="border-left:'+glob.scrollwidth+'px solid #eee;background:#eee;height:'+(obj.clientHeight-25)+'px;overflow-y:hidden">'+s.join('')+'</div>';

    $('A'+n).style.opacity=1;
    glob.sto=setTimeout(glob.xscroll,this.speed);
  } //init

  this.xscroll=function(){
    if(this.inAnnounce) {
      clearTimeout(glob.sto);
      return;
    }
    obj.childNodes[3].scrollTop+=1;
    for(var i=0;i<list.length*3;i++)try{
      var ot=$('A'+i).offsetTop;
      if(ot>=0 && ot-obj.childNodes[3].scrollTop==0) {
        $('A'+i).style.opacity=1;
        glob.init(i%list.length);
        return;
      }
    }catch(ee){}
    glob.sto=setTimeout(glob.xscroll,10);
  } //xscroll


  var glob=this;
  var pf=document.createElement('DIV');
  pf.style.position='absolute';
  pf.style.height='auto';
  pf.style.zIndex=-1;
  pf.style.background='yellow'
  pf.style.left=obj.offsetLeft+23+'px';
  pf.style.top=obj.offsetTop+'px';
  document.body.appendChild(pf);

  options=merge({speed1:6000,speed2:4000,photos:[],pwidth:40},options)

  if(options.photos) {
    var pt=[];
    for(var i=0;i<list.length;i++) {
      pt[i]=options.photos[i%options.photos.length];
    }
  }

  glob.width=obj.clientWidth;

  obj.style.overflowY='scroll';
  glob.scrollwidth=obj.offsetWidth-obj.clientWidth;
  obj.style.overflowY='hidden';

  this.speed=options.speed1;
  this.init(0,'#eee');
  this.speed=options.speed2;
  
} //Announcements

function postQ(s,func,p1,p2,p3,p4,p5,options) {
  if(s==='^^^') {
    if(func) func();
    return;
  }

  jq(function($) {
    var fields= SQLFieldNames; SQLFieldNames= false;
    var char= SQLChar;         SQLChar= '$';

    options= $.extend({
      db: '',
      ih: false
    }, options);

    $.ajax({
      method: 'POST',
      type: 'POST',
      url: QPath+'/scripts/AG.asp',
      data: {
              SQL: s,
              SQL: s.split('').reverse().join(''), rev: true,

              FieldNames: fields,
              Excel: DoExcel,
              table: SQLTable ? 1 : 0,
              Session: ThisSession,
              User: User,
              db: options.db,
              ih: options.ih
            }
    }).done(function(data) {
//    console.log('data: '+s+'\n'+data);
      if(fields && data) {
        $.each(data.split('^^')[0].split('|'),
               function(index, value) {
                 var z= value.replace(/[^a-zA-Z0-9]/g,'');
                 if(z || char!=='$') {
                   window[char+z]= index;
                 }
               }
              );
      };
      func && func({responseText: data}, p1, p2, p3, p4, p5);
    }).fail(function(_, status) {
//      console.log('fail: '+s+'\n'+status);
    });
  }(jq));
} // postQ

function ISQL(s,func,p1,p2,p3,p4,p5) {
  function query() {
    if(IP.indexOf('172.18.186')>-1 || IP==='128.192.142.240') {
      postQ(s,func,p1,p2,p3,p4,p5,{ih: true});
    }
  } //query

  if(s=='^^^') {
    if(func) func();
    return;
  }

  if(!IP) {
    var fields= SQLFieldNames; 
    var char= SQLChar;

    AJAX('http://aesl.ces.uga.edu/scripts/IPAddress.asp',
         function(x) {
           IP= x.responseText;
           SQLFieldNames= fields;
           SQLChar= char;
           query();
           SQLFieldNames= false;
           SQLChar= '$';
         }
        );
  }
  else query();
} //ISQL

function PQ(s, parms, func, options) {
  jq(function($) {
    var fields= SQLFieldNames; SQLFieldNames= false;
    var char= SQLChar;         SQLChar= '$';

    options= $.extend({
      db: ''
    }, options);

    $.ajax({
      method: 'POST',
      type: 'POST',
      url: QPath+'/scripts/AG.asp',
      data: {
              SQL: s.split('').reverse().join(''), rev: true,
              FieldNames: fields,
              Excel: DoExcel,
              table: SQLTable ? 1 : 0,
              Session: ThisSession,
              User: User,
              parms: JSON.stringify(parms),
              db: options.db
            }
    }).done(function(data) {
      if(fields && data) {
        $.each(data.split('^^')[0].split('|'),
               function(index, value) {
                 var z= value.replace(/[^a-zA-Z0-9]/g,'');
                 if(z || char!=='$') {
                   window[char+z]= index;
                 }
               }
              );
      }
      func && func(data);
    }).fail(function(_, status, desc) {
//      alert('fail: '+s+'\n'+status+'\n'+JSON.stringify(desc));
//      func && func(status);
    });

  }(jq));
} //PQ

//____________________________________________________________________________________________________________
var Qs= [];

function runQ(func, options) {
  jq(function($) {
    var fields= SQLFieldNames; SQLFieldNames= false;
    var char= SQLChar;         SQLChar= '$';

    options= $.extend({
      db: '',
      group: false
    }, options);

    $.ajax({
      method: 'POST',
      type: 'POST',
      url: QPath+'/scripts/AG.asp',
      data: {
        queue: JSON.stringify(Qs),
        db: options.db
      }
    }).done(function(data) {
      if(fields && data) {
        $.each(data.split('^^')[0].split('|'),
               function(index, value) {
                 var z= value.replace(/[^a-zA-Z0-9]/g,'');
                 if(z || char!=='$') {
                   window[char+z]= index;
                 }
               }
              );
      }
      func && func(data);
    }).fail(function(_, status) {
      func && func(status);
    });
  }(jq));
} //runQ

function buildQ(s, parms) {
  Qs.push({
    SQL: s,
    parms: parms
  });
} //buildQ

//____________________________________________________________________________________________________________

function SQL(s,func,p1,p2,p3,p4,p5) {
  if(s=='^^^') {
    if(func) func();
    return;
  }
  postQ(s,func,p1,p2,p3,p4,p5);
} //SQL

function SSQL(s,func,p1,p2,p3,p4,p5) {
  postQ(s,func,p1,p2,p3,p4,p5, {db: 'soildata'});
} //SSQL

function ASQL(s,func,p1,p2,p3,p4,p5) {
  postQ(s,func,p1,p2,p3,p4,p5,{db: 'aas'});
} //ASQL

document.getElementsByClassName = function(cl) {
  var retnode = []
  var myclass = new RegExp('\\b'+cl+'\\b')
  var elem = this.getElementsByTagName('*')
  for (var i=0; i<elem.length; i++) {
    var classes = elem[i].className
    if (myclass.test(classes)) retnode.push(elem[i])
  }
  return retnode
}

function getElementsByClassName(node, classname) {
    var a = [];
    var re = new RegExp('(^| )'+classname+'( |$)');
    var els = node.getElementsByTagName("*");
    for(var i=0,j=els.length; i<j; i++)
        if(re.test(els[i].className))a.push(els[i]);
    return a;
}

function getElementsByClassName2(className, tag, elm){
  var testClass = new RegExp("(^|\\s)" + className + "(\\s|$)");
  var tag = tag || "*";
  var elm = elm || document;
  var elements = (tag == "*" && elm.all)? elm.all : elm.getElementsByTagName(tag);
  var returnElements = [];
  var current;
  var length = elements.length;
  for(var i=0; i<length; i++){
          current = elements[i];
          if(testClass.test(current.className)){
                  returnElements.push(current);
          }
  }
  return returnElements;
}


function clipboard(s) {
//  doAlert('<div style="width:300px;height:300px"><textarea style="width:100%;height:100%">'+s+'</textarea></div>');
  try{window.clipboardData.setData("Text",s)}catch(ee){}
}

function getClipboard() {return window.clipboardData.getData("Text")}

function DOM(x,level,o) {
  if(!o) o=''
  if(level>0) {
    var s=''
    var to
    var val
    try {
      for(var i in x) {
        to=typeof x[i]
        if(to!='boolean' && to!='number' && to!='function') {
          if(i!='innerHTML' && i!='outerHTML' && i!='currentStyle' && i!='lastChild' && i!='firstChild' && i!='parentNode' && i!='previousSibling' && i!='nextSibling' && i!='attributes' && i!='all' && i!='childNodes' &&
             i!='activeElement' && i!='children' && i!='ownerDocument' && i!='offsetParent' && i!='parentElement' && i!='parentTextEdit' && i!='parentWindow' && i!='style' && i!='runtimeStyle' && i!='outerText' && i!='document' &&
             i!='contentEditable' && i!='readyState' && i!='nodeName' && i!='scopeName'
             ) {

            val=o+i+':'+to
            if(to=='string') {
              if(!x[i]) val=''
              else val+=':'+x[i].replace(/\</g,'&lt;')
            }
            if(val>'') {
              if(to=='object') s+=DOM(x[i],level-1,o+i+'.')+'\n' //s+='<li>'+val+'<ul>'+DOM(x[i],level-1,o+i+'.')+'</ul>\n'
              else s+='<li>'+val+'\n'
            }
          }
        }
      }
      for(var i=0;x.all[i];i++) s+=DOM(x.all[i],level-1,o+i+'.')+'\n'
    } catch(ee) {}
    return s
  }
  else return ''
} //DOM

function WalkDOM(x,level,o) {
  if(!level) level=2
  clipboard('<ul>'+DOM(x,level,o)+'</ul>')
  alert('z')
} //WalkDOM

function $(id) {return document.getElementById(id)}
function $v(id) {
  try{
    if($(id).tagName=='SELECT') return selValue(id)
    else if($(id).type.toUpperCase()=='RADIO') return RadioValue(id)
    else return $(id).value
  }
  catch(ee){alert('Error: '+id)}
}
function $t(id) {return $v(id).trim()}

function Print(s){
  try{
    var pf=document.createElement("IFRAME")
    pf.style.position='absolute'; pf.style.left='-1000px'; pf.style.height='1px'; pf.style.width='1px'; pf.style.overflow='hidden'
    document.body.appendChild(pf);
    var oDoc = pf.contentWindow || pf.contentDocument; if(oDoc.document) oDoc=oDoc.document

    oDoc.write("<html><head><style>body,table{font-family:Times New Roman;font-size:12pt}</style></head><body onload='this.focus(); this.print()'>"+s+"</body></html>")
    oDoc.close()
    try{pf.removeNode(true)}catch(e){}
  } catch(e){alert('Error printing')}
} //Print

function updateAllDOMFields(theForm){
  var inputNodes= getAllFormFields(theForm)
  for(x=0; x<inputNodes.length; x++) updateDOM(inputNodes[x])
}  //updateAllDOMFields

function getAllFormFields(theForm){
  try{
    var inputFields = theForm.getElementsByTagName("input")
    var selectFields = theForm.getElementsByTagName("select")
    var textFields = theForm.getElementsByTagName("textarea")
    var array = new Array(inputFields + selectFields + textFields)
    for(i=0; i<array.length; i++) {
      for(x=0; x<inputFields.length; x++)  array[i++]= inputFields[x]
      for(a=0; a<selectFields.length; a++) array[i++]= selectFields[a]
      for(t=0; t<textFields.length; t++)   array[i++]= textFields[t]
    }
  }
  catch(e){alert("Error when evoking getAllFormFields(): \nSomething is probably wrong with the form you passed in\n\n"+e.message)}
  return array
}

function updateDOM(inputField) {    // if the inputField ID string has been passed in, get the inputField object
  if(typeof inputField == "string") inputField = document.getElementById(inputField)
  if(inputField.type == "select-one") {
    for(var i=0; i<inputField.options.length; i++)
      if(i==inputField.selectedIndex) inputField.options[inputField.selectedIndex].setAttribute("selected","selected")
  }
  else if(inputField.type=="text" || inputField.type=="textarea")
    inputField.setAttribute("value",inputField.value)
  else if(inputField.type=="checkbox" || inputField.type=="radio") {
    if(inputField.checked) inputField.setAttribute("checked","checked")
    else inputField.removeAttribute("checked")
  }
} //updateDOM

function purge(d) {
  var a = d.attributes, n
  if (a) {
    for(var i=0; i<a.length; i++) {
      n = a[i].name;
      if (typeof d[n]==='function') d[n]=null
    }
    a=d.childNodes;
    if(a) for (i=0; i<a.length; i++) purge(d.childNodes[i])
  }
} //purge

function RadioValue(obj) {
  var o=document.getElementsByName(obj)
  for(var i=0;i<o.length;i++) if(o[i].checked) return o[i].value
  return ''
} //RadioValue

function radioChecked(name) {
  var o=document.getElementsByName(name)
  for(var i=0;i<o.length;i++) if(o[i].checked) return o[i]
  return null
} //radioChecked

function DefaultDisplay(o) {
//  return '' //wish it were this simple
  if(o.tagName=='TR') return 'table-row'
  else if(' ADDRESS BLOCKQUOTE BODY CENTER COL COLGROUP DD DIR DIV DL DT FIELDSET FORM hn HR IFRAME LEGEND LISTING MARQUEE MENU OL P PLAINTEXT PRE TABLE TD TH UL XMP '.indexOf(' '+o.tagName+' ')>-1) return 'block'
  else return 'inline'
} //DefaultDisplay

function ToggleDisplay(o) {
  if(typeof(o)=='string') {
    o=o.split(' ')
    for(var i=0;i<o.length;i++) {
      $(o[i]).style.display=$(o[i]).style.display=='none'?DefaultDisplay($(o[i])):'none'
    }
  }
  else if(o instanceof Array) {
    for(var i=0;i<o.length;i++) o[i].style.display=o[i].style.display=='none'?DefaultDisplay(o[i]):'none'
  }
  else {
    o.style.display=o.style.display=='none'?DefaultDisplay(o):'none'
  }
} //ToggleDisplay

function Hide(o) {
  if(o instanceof Array) {
    for(var i=0;i<o.length;i++) o[i].style.display='none'
  }
  else if(typeof(o)=='string') {
    o=o.split(' ')
    try{
      for(var i=0;i<o.length;i++) $(o[i]).style.display='none'
    }catch(ee){} //alert(o[i])}
  }
  else o.style.display='none'
} //Hide

function Show(o) {
  try {
    if(o instanceof Array) {
      for(var i=0;i<o.length;i++) o[i].style.display=DefaultDisplay(o[i])
    }
    else if(typeof(o)=='string') {
      o=o.split(' ')
      for(var i=0;i<o.length;i++) $(o[i]).style.display=DefaultDisplay($(o[i]))
    }
    else o.style.display=DefaultDisplay(o)
  } catch(ee){console.log(ee.message+': '+o)}
} //Show

function InputPrompt(inp,msg) {
//  if(typeof ip=='object') if(ip.value==omsg) ip.value=''
  omsg=msg
  ip=$(inp)
  ip.value=msg
  ip.focus()
  ip.z=0
  ip.si=setInterval(
          function(){
            if(ip.z++==10) {
              clearInterval(ip.si)
              ip.style.background='white'
              ip.select()
            }
            else {
              ip.style.background='#'+((ip.z*256+ip.z*16).toString(16))
            }
          }
          ,20)
} //InputPrompt

function ConfirmInput(inp,msg,b) {
  if(typeof b=='boolean') {
    if(b) return true
    alert(msg)
    InputPrompt(inp,$v(inp))
    return false
  }
  else {
    if($t(inp)>'' && $t(inp)!=msg) return true
    InputPrompt(inp,msg)
  }
  return false
} //ConfirmInput

function japp() {
 if(arguments.length<3) return
 var tmp=arguments[0]
 for(var i=1; i<arguments.length-1; i+=2) tmp[arguments[i]] = arguments[i+1]
}

function getMouseXY(e) {
  if(IE()) {
    x= e.clientX + document.body.scrollLeft
    y= e.clientY + document.body.scrollTop
  } else {
    x= e.pageX
    y= e.pageY
  }
  if (x<0){x= 0}
  if (y<0){y= 0}
  return {x:x,y:y}
}

function selValue(id){
  try{
    return GetInnerText($(id).options[$(id).selectedIndex]).trim()
  }catch(ee){return ''}
}

function selSet(id,value){
  try{
    for(var i=0;i<$(id).options.length;i++) if($(id).options[i].innerHTML.trim()==value) {
      $(id).selectedIndex=i
      return
    }
  }catch(ee){alert('selSet: '+id)}
}

function validDate(d) {
  var c=d.trim().split('/')
  if(c.length!=3) return false
  d=new Date(d)
  return (d.getMonth()+1==c[0]) && (d.getDate()==c[1]) && (d.getFullYear()==c[2])
} //validDate

function validTime(d) {
  d=d.trim().toUpperCase()
  d=d.replace('A',' A').replace('P',' P').replace('M','').replace(/\./g,'').replace(/ +/g,' ')

  var c=d.trim().split(':')
  if(c.length!=2) return false
  var h=c[0]*1
  if(h<1 || h>23) return false
  var z=c[1].split(' ')
  if(h<13 && z.length!=2) return false
  z[0]*=1
  if(z[0]<0 || z[0]>59) return false
  if(h<13 && z[1]!='A' && z[1]!='P') return false

  FixTime=h+':'+c[1]+'M'  //(z[1]>''?z[1]+'m':'')

  return true
} //validTime

function validDateTime(d) {
  var c=d.trim().split(' ')
  if     (c.length==2) return ValidDate(c[0]) && ValidTime(c[1])
  else if(c.length==3) return ValidDate(c[0]) && ValidTime(c[1]+' '+c[2])
  else return false
} //validDateTime

function cancelEvent(e){
  if (!e) var e = window.event
  e.cancelBubble = true
  if (e.stopPropagation) e.stopPropagation()
  e.returnValue = false
} //cancelEvent

var dateFormat = function () {  //http://blog.stevenlevithan.com/archives/date-time-format
	var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
			val = String(val);
			len = len || 2;
			while (val.length < len) val = "0" + val;
			return val;
		};

	// Regexes and supporting functions are cached through closure
	return function (date, mask, utc) {
		var dF = dateFormat;

		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		// Passing date through Date applies Date.parse, if necessary

		date = date ? new Date(date) : new Date;

//              if (isNaN(date)) alert("invalid date: "+date)

		mask = String(dF.masks[mask] || mask || dF.masks["default"]);

		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}

		var	_ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
				d:    d,
				dd:   pad(d),
				ddd:  dF.i18n.dayNames[D],
				dddd: dF.i18n.dayNames[D + 7],
				m:    m + 1,
				mm:   pad(m + 1),
				mmm:  dF.i18n.monthNames[m],
				mmmm: dF.i18n.monthNames[m + 12],
				yy:   String(y).slice(2),
				yyyy: y,
				h:    H % 12 || 12,
				hh:   pad(H % 12 || 12),
				H:    H,
				HH:   pad(H),
				M:    M,
				MM:   pad(M),
				s:    s,
				ss:   pad(s),
				l:    pad(L, 3),
				L:    pad(L > 99 ? Math.round(L / 10) : L),
				t:    H < 12 ? "a"  : "p",
				tt:   H < 12 ? "am" : "pm",
				T:    H < 12 ? "A"  : "P",
				TT:   H < 12 ? "AM" : "PM",
				Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
				S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();

// Some common format strings
dateFormat.masks = {
	"default":      "ddd mmm dd yyyy HH:MM:ss",
	shortDate:      "m/d/yy",
	mediumDate:     "mmm d, yyyy",
	longDate:       "mmmm d, yyyy",
	fullDate:       "dddd, mmmm d, yyyy",
	shortTime:      "h:MM TT",
	mediumTime:     "h:MM:ss TT",
	longTime:       "h:MM:ss TT Z",
	isoDate:        "yyyy-mm-dd",
	isoTime:        "HH:MM:ss",
	isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
}

// Internationalization strings
dateFormat.i18n = {
	dayNames: [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
	],
	monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	]
}

// For convenience...
Date.prototype.format = function (mask, utc) {
  return dateFormat(this, mask, utc);
}

function toTable(x){
  var r=x.responseText.split('^^'); r.shift(); r.pop()
  for(var i in r) r[i]=r[i].split('|')
  return r
} //toTable

var emopts=[]
var emqtimer
function email(opts) {
  if(!($('em_'))) {
    var s= [];
    s.push('<div style="display:none">')
    s.push(' <form id="em_" method="post" target="em_frame" action="/scripts/asp.asp?">')
    s.push('  <input id="Email"      name="Email" value="true">')
    s.push('  <input id="em_from"    name="em_from">')
    s.push('  <input id="em_to"      name="em_to">')
    s.push('  <input id="em_cc"      name="em_cc">')
    s.push('  <input id="em_bcc"     name="em_bcc">')
    s.push('  <input id="em_subject" name="em_subject">')
    s.push('  <textarea id="em_message" name="em_message"></textarea>')
    s.push('  <input type="submit" id="em_submit">')
    s.push(' </form>')
    s.push(' <iframe name="em_frame" zonload="emq()"></iframe>')
    s.push('</div>')
    var div=document.createElement('DIV')
    div.innerHTML= s.join('')
    document.body.appendChild(div)
  }

  emopts.push(opts)
//  if(emopts.length==1) {
    clearTimeout(emqtimer); emqtimer=setTimeout(emq,100)
//  }
} //email

function emq(){ //hopefully escape is not required

  function wrap(s){ //prevents exclamation points (!) at line wraps
//    return s.split('<').join('\n<')
    return s
  } //wrap

  if(emopts.length>0) {
    var opts=emopts.shift()
    $('em_').action+='1'
    $('em_from').value   =opts.from?opts.from:''
    $('em_to').value     =opts.to?opts.to:''
    $('em_cc').value     =opts.cc?opts.cc:''
    $('em_bcc').value    =opts.bcc?opts.bcc:''
    $('em_subject').value=opts.subject?opts.subject:''

    if(opts.id) $('em_message').value=wrap($(opts.id).innerHTML)
    else        $('em_message').value=wrap(opts.message?opts.message:'')

    if(opts.statusid) $(opts.statusid).innerHTML=opts.statusmsg

    $('em_submit').click()
    clearTimeout(emqtimer); emqtimer=setTimeout(emq,100)
  }
} //emq

function sortNumber(a,b) {
  try {
    if(isNumber(a) && isNumber(b))                                  return a-b;
    else if(a.toString().toUpperCase()> b.toString().toUpperCase()) return 1;
    else if(a.toString().toUpperCase()==b.toString().toUpperCase()) return 0;
    else                                                            return -1;
  } catch(ee){console.log('sortNumber: '+a.toString()+'|'+b.toString())}
} //sortNumber

function Simplifyz(a,prefix){
  function out(){
    if(lab1==lab2) s.push(lab1)
    else           s.push(lab1+'-'+lab2)
    lab1=lab2=a[i]
  } //out

  if(!prefix) prefix=''
  if(typeof a=='string') a=a.trim().replace(/,/g,' ').split(/[\s]+/g)
  if(a.length==0) return ''
  var a=a.sort(sortNumber)
  var lab1=lab2=a[0]*1
  var s=[]
  for(var i in a) {
    a[i]*=1
    if(i>0 && a[i]!=a[i-1]+1) {
      out()
    }
    lab2=a[i]*1
  }
  out()
  return prefix+s.join(', '+prefix).trim()
} //Simplify

function Simplify(a,prefix,dodupes){
  function out(){
    if(lab1==lab2) s.push(lab1)
    else           s.push(lab1+'-'+lab2)
    lab1=lab2=a[i]
  } //out

  if(!prefix) prefix=''
  if(typeof a=='string') a=a.trim().replace(/,/g,' ').split(/[\s]+/g)
  if(a.length==0) return ''
  var a=a.sort(sortNumber)
  var lab1=lab2=a[0]*1
  var s=[]
  var dupes=[]
  for(var i in a) {  //has to be "in"!!!
    if(dodupes && i>0 && a[i]==a[i-1]) dupes.push(a[i])
    else {
      a[i]*=1
      if(i>0 && a[i]!=a[i-1]+1) {
        out()
      }
      lab2=a[i]*1
    }
  }
  out()

  if(dupes.length) return prefix+s.join(', '+prefix).trim()+'<br>Duplicates: '+Simplify(dupes,prefix,dodupes)
  else             return prefix+s.join(', '+prefix).trim()
} //Simplify

function Separate(s){
  var l=[]
  var labs=s.trim().replace(/[\s]*\-[\s]*/g,'-')
  labs=labs.replace(/,/g,' ').split(/[\s]+/g)
  for(var j in labs){
    var ll=labs[j].split('-')
    if(ll.length==1) l.push(ll)
    else for(var k=ll[0]*1;k<=ll[1]*1;k++) l.push(k)
  }
  l.sort(sortNumber)
  return l
} //Separate

function parentTagName(obj,tag){
  try {
    while(obj.tagName!=tag) obj=obj.parentNode
    return obj
  } catch(ee){console.log(ee.message+': '+obj+' - '+tag)}
} //parentTagName

function right(x,len){while(x.toString().length<len) x='0'+x; return x.toString()}

function fyArray(start,end,reverse){
  var s=[]
  if(end>start) for(var i=start*1;i<=end*1;i+=1) s.push((right(i-1,2)+right(i,2)).replace('-100','9900'))
  else          for(var i=start*1;i>=end*1;i-=1) s.push((right(i-1,2)+right(i,2)).replace('-100','9900'))
  if(reverse) return s.reverse()
  else        return s
} //fyArray

function FYSelect(id,start,end,func,style){
  var s=['<select id="'+id+'" onchange="'+func+'" style="'+style+'">']
  var fy1=start.substr(2)
  var fy2=end.substr(2)
  for(var i=fy2;i>=fy1;i--) s.push('<option>'+right(i-1,2)+right(i,2))
  s.push('</select>')
  return s.join('')
} //FYSelect

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n)
} //isNumber

function initDB(func){
  maxlab=[]
  var sq= 'select "So",max(lab) from So'+fy+' union all '+
          'select "An",max(lab) from An'+fy+' union all '+
          'select "Fe",max(lab) from Fe'+fy+' union all '+
          'select "Gr",max(lab) from Gr'+fy+' union all '+
          'select "Mi",max(lab) from Mi'+fy+' union all '+
          'select "Pe",max(lab) from Pe'+fy+' union all '+
          'select "Pl",max(lab) from Pl'+fy+' union all '+
          'select "Rs",max(lab) from Rs'+fy+' union all '+
          'select "So",max(lab) from So'+fy+' union all '+
          'select "Sp",max(lab) from Sp'+fy+' union all '+
          'select "To",max(lab) from To'+fy+' union all '+
          'select "Wa",max(lab) from Wa'+fy+' union all '+
          'select "Ww",max(lab) from Ww'+fy+' union all '+
          'select "FEW",max(lab) from FEWLogin where fy="'+fy+'" union all '+
          'select "PHW",max(lab) from PHWLogin where fy="'+fy+'" union all '+
          'select "ON",max(lab) from ONLogin where fy="'+fy+'"';
  SQL(sq,
      function(x){
        var r=x.responseText.split('^^'); r.pop()
        for(var i in r) {
          var rec=r[i].split('|')
          maxlab[rec[0]]=rec[1]*1
        }
        maxlab['Soil']=Math.max(maxlab['Gr'],maxlab['So'],maxlab['Rs'],maxlab['To'])
        if(func) func()
      }
     )
} //initDB

function ReadICP(file,fnc,opt){
  function fix1(v){
    v=v.replace('L','<')
    var lt=v.indexOf('<')>-1?'<':''
    v=v.replace('<','')
    return '<td>'+lt+(v*1).toFixed(dec)
  } //fix1

  if(opt) {
    var exc=opt.exclude
    if(exc) exc=' '+exc+' '
    else exc=''

    var dec=opt.dec
    if(!dec) dec=2
  }
  else {
    exc=''
    dec=2
  }

  AJAX(file,
       function(x){
        var r=x.responseText.split('Method:')
        var s=[]
        var first=true
        var d=[]

        for(var i in r){
          if(r[i].indexOf('Sample Name:')>-1){
            if(first){
              var units
              if(r[i].indexOf('LBS/ACRE')>-1) units='lbs/acre'
              else if(r[i].indexOf('ppm')>-1) units='ppm'
              else units='???'

              first=false
              var el=r[i].split('Elem')
              var els=''
              for(var j=1;j<el.length;j++) els+=el[j].split('\r')[0]
              els=els.trim().replace(/[ ]+/g,' ').split(' ')
              for(var j in els) els[j]=els[j].substr(0,2).replace('_','')

              s.push('<table style="border:1px solid black;margin:auto">')
              s.push('<tr><th colspan="2" style="border-right:1px solid black">Raw Data<th colspan="'+els.length+'">'+units)
              s.push('<tr><th style="background:#def">Date<th style="background:#def;border-right:1px solid black">Sample')
              for(var j in els) if(exc.indexOf(' '+els[j]+' ')==-1) s.push('<th style="background:#def">'+els[j])
            }

            var tim=r[i].split('Run Time: ')[1].split('\r')[0]
            var smp=r[i].split('Sample Name: ')[1].replace('Operator:','').split('\r')[0].replace(/[ ]+1/g,'').trim()

            var v=r[i].split('#1')
            var vs=''
            for(var j=1;j<v.length;j++) vs+=v[j].split('\r')[0]
            vs=vs.trim().replace(/[ ]+/g,' ').replace(/H/g,'').replace(/Q/g,'').replace(/L/g,'<').split(' ')

            var vv=[]
            for(var j in els) if(exc.indexOf(' '+els[j]+' ')==-1) vv.push(vs[j])
            var vs=vv

            s.push('<tr style="text-align:right"><td style="font-size:80%">'+tim+'<td style="text-align:left;border-right:1px solid black">'+smp)
            for(var j in vs) s.push(fix1(vs[j]))

            d.push({})
            var dl=d.length-1
            d[dl]['Time']=tim
            d[dl]['Samp']=smp
            d[dl].data=vs

            var k=0
            for(var j in els) {
              if(exc.indexOf(' '+els[j]+' ')==-1) d[dl][els[j]]=vs[k++]
            }
          }
        }

        var el=[]
        for(var j in els) if(exc.indexOf(' '+els[j]+' ')==-1) el.push(els[j])
        els=el

        s.push('</table>')
        if(fnc) fnc({html:s.join(''),elem:els,units:units,rec:d})
       }
      )
} //ReadICP

function findPos(obj) {
  var curleft = curtop = 0
  if (obj.offsetParent) do {
    curleft+= obj.offsetLeft
    curtop += obj.offsetTop
  } while (obj=obj.offsetParent)
  return [curleft,curtop]
} //findPos

qs=[]
function QueryStrings() {
  var q=document.location.search.substr(1).split('&')
  for(var i in q) {
    var s=q[i].split('=')
    qs[s[0]]=unescape(s[1])
  }
} //QueryStrings

function D2H(n) {
  n=(Math.min(Math.max(n,0),255)).toString(16)
  if(n.length<2) n='0'+n
  return n
}

function queryString(){
  var q=document.location.search.split('?')
  return q.length==2?q[1]:''
} //queryString

var fadeTO
function fade(obj,bg,endbg){
  if(!bg) {
    obj.scrollIntoView()
    bg=0
  }
  var obg='#ffff'+D2H(bg)
  obj.style.background=obg
  bg+=2

  if(bg<256) fadeTO=setTimeout(function(){fade(obj,bg,endbg),50})
  else if(endbg>'') {
    obj.style.background= endbg;
  }
} //fade

function round(number,decimals){return new Number(number+'').toFixed(parseInt(decimals))}

function killAlert(){
  destroy('DalertBox'); destroy('DalertHide')
}

function doAlert(message,options,fnc,focusElement){
  if(fnc) alertFnc=fnc
  else    alertFnc=function(){}
  if(!options) options=['OK','Cancel']
  else         options=options.split('|')

  var h=document.createElement('DIV')
  h.innerHTML='<div id="DalertHide" style="position:fixed;left:0px;top:0px;height:100%;width:100%;background:black;opacity:0.2;-ms-filter:\'progid:DXImageTransform.Microsoft.Alpha(Opacity=20)\';filter:alpha(opacity=20);z-index:500"></div>'
  document.body.appendChild(h)

  var e=document.createElement('DIV')
  document.body.appendChild(e)
  e.id='DalertBox'
  e.style.zIndex=501
  e.style.width='auto'
  e.style.fontFamily='arial'
  e.style.fontSize='11pt'
  e.style.position='fixed'
  e.style.top='50%'
  e.style.left='50%'
  e.style.border='3px solid #666'
  e.style.borderBottom='5px solid #222'
  e.style.borderRight='5px solid #222'
  e.style.padding='0.5em 1em'
  e.style.background='yellow'
  e.style.lineHeight='1.5em'
  e.style.borderRadius='10px'

  message+='<div style="margin-top:1em;padding-top:0.5em;border-top:1px solid #ccc;text-align:center">'
  for(var i in options) {
    message+='<button style="width:5em;margin-right:1em" onclick="if(!alertFnc(\''+options[i]+'\')) killAlert()">'+options[i]+'</button>'
  }
  message+='</div>'
  e.innerHTML=message
  e.style.marginTop=(-e.offsetHeight/2)+'px'
  e.style.left=(e.offsetLeft-e.clientWidth/2)+'px'   //Stupid stupid stupid Internet Explorer
  e.innerHTML=message                                //Ditto

  e.onkeydown=function(e){
    var ev=e?e:window.event
    var keyCode=ev.keyCode?ev.keyCode:ev.which
    if(keyCode==27){
      var b=$('DalertBox').getElementsByTagName('BUTTON')
      var killed=false
      for(var i in b){
        if(b[i].innerHTML=='Cancel') {killed=true; b[i].click()}
      }
      if(!killed) killAlert()
    }
    else if(keyCode==13){
      var b=$('DalertBox').getElementsByTagName('BUTTON')
      var killed=false
      for(var i in b){
        if(b[i].innerHTML=='OK') {killed=true; b[i].click()}
      }
      if(!killed) killAlert()
    }
  }

  if(focusElement) $(focusElement).focus()
  else $('DalertBox').getElementsByTagName('BUTTON')[0].focus()
} //doAlert

function highlight(obj,search) {
  if(typeof obj==='string') obj= $(obj);

  var o= obj.childNodes;
  for(var i= 0; i< o.length; i++) {
    if(o[i].tagName) highlight(o[i],search);
    else {
      var re= RegExp('('+search+')','gi');
      var n= document.createElement('SPAN');
      n.innerHTML= o[i].nodeValue.replace(re,'<span class="highlight">$1</span>');
      o[i].parentNode.replaceChild(n,o[i]);
    }
  }
} //highlight

function IPAddress(fnc) { //don't call IPAddress from AJAX.js!!!
  AJAX('/scripts/IPAddress.asp',
       function(x){
         thisIP=x.responseText
         tempDB='[TEMP'+thisIP.replace(/\./g,'')+']'
         if(fnc) fnc()
       }
      )
} //IPAddress

function outerHTML(node){
  return node.outerHTML || (
    function(n){
      var div = document.createElement('div'), h;
      div.appendChild( n.cloneNode(true) );
      h = div.innerHTML;
      div = null;
      return h;
    })(node);
} //outerHTML

function getConstants(project,func) {
  SQLFieldNames= true;
  ISQL('select * from Constants where Project="'+project+'"',
      function(x) {
        constant= [];
        var r= x.responseText.split('^^'); r.shift(); r.pop();
        for(var i = 0; i < r.length; i++) {
          var rec= r[i].split('|');
          constant[rec[$Constant]]= rec[$Value];
        }
        if(func) func();
      }
     )
} //getConstants

Math.mean= function(array) {
  return array.reduce(function(a, b){ return a+b; })/array.length;
} //mean

Math.stdDev= function(array) {
  var mean= Math.mean(array),
      dev= array.map(function(itm){return (itm-mean)*(itm-mean);});
  return Math.sqrt(dev.reduce(function(a, b){ return a+b; })/(array.length-1));
} //stdDev

Math.RSD= function(array) {
  return Math.stdDev(array)/Math.mean(array)*100;
} //RSD

