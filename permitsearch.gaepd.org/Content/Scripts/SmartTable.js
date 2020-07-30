function smartTable(tb,options) {
//console.clear();
  var t1= new Date();

  var pt;
  var ps;
  function profile(s) {pt= new Date(); ps= s;}
  function profileStop() {
//    console.log(ps+': '+(new Date()-pt)+'ms')
  }

  function getColumns() {
profile('getColumns');
    var tc= tb.rows[options.top-1].cells;
    var cs= '';
    for(var i = 0; i < tc.length; i++) {
      cs+= '<col>';
    }

    var cg= tb.getElementsByTagName('colgroup')[0] || document.createElement('colgroup');
    cg.innerHTML= cs;
    tb.insertBefore(cg,tb.firstChild);
profileStop();
  } //getColumns

  function spanBorders() {
    if(options.spanBorder) {
      var tr= tb.rows;
      var tc= tr[0].cells;
      var doBorders= false;
      for(var i in tc) {
        if(tc[i].colSpan>1) {
          doBorders= true;
          break;
        }
      }
      if(doBorders) {
        var tt= tr[0].cells;
        var ofs= 0;
        for(var c = 0; c < tt.length; c++) {
          if(c>0) tt[c].style.borderLeft= '1px solid black';
          for(var i = 1; i < tr.length; i++) {
            var tc= tb.rows[i].cells;
            if(c>0) try {
              tc[ofs].style.borderLeft= '1px solid black';
            } catch(ee){} 
          }
          ofs+= tt[c].colSpan;
        }
      }
    }
  } //spanBorders

  function deleteColumns(tb,start,stop) {
profile('deleteColumns');
    var tr= tb.rows;

    if(tr.length) {
      if(stop==null) stop= tr[0].cells.length-1;

      for(var i = 0; i < options.top; i++) {
        var del= [];
        var tc= tr[i].cells;
        var ofs= 0;
        for(var j = 0 ; j < tc.length; j++) try {
          var cs= tc[j].colSpan;
          for(var k= 0; k < cs; k++) {
            if(ofs>=start && ofs<=stop) {
              var hc= tc[j].colSpan;
              if(hc===1) {
                del.push(j);
              }
              else tc[j].colSpan= hc-1;
            }
            ofs++;
          }
        } catch(ee){console.log('deleteColumns:'+j+' '+ee.message)}

        for(var j = del.length-1; j >= 0; j--) try {
          tr[i].deleteCell(del[j])
        } catch(ee){alert('del: '+del)}
      }

      for(var i = options.top; i < tr.length; i++) {
        for(var j = stop; j >= start; j--) try {
          tr[i].deleteCell(j);
        } catch(ee){console.log('deleteColumns: '+i+' '+ee.message)}
      }
    }
profileStop();
  } //deleteColumns

  function deleteEmptyColumns() {
    var tr= tb.rows;
    var tc= tb.getElementsByTagName('col');
    for(var j = tr[options.top].cells.length-1; j >= options.left; j--) {
      var fnd= false;
      for(var i = options.top; i < tr.length; i++) {
        if(getInnerText(tr[i].cells[j]).trim()>'') {
          fnd= true;
          break;
        }
      }
      if(!fnd) {
        deleteColumns(tb,j,j);
      }
    }
  } //deleteEmptyColumns

  function OKSort() {
profile('OKSort')
    var img= document.createElement('span');
    var tc= tb.rows[options.top-1].cells;

    var stats= document.createElement('div');
    stats.className= 'stats';
    stats.innerHTML= 'stats';

    img.innerHTML= '<img class="sort" src="http://aesl.ces.uga.edu/images/sort_neutral.png" style="padding-left:0.5em;zopacity:0.5;width:12px;height:14px">';
    img.style.cursor= 'pointer';
    for(var i = 0; i < tc.length; i++) try{
      var im= tc[i].appendChild(img.cloneNode(true));
      im.style.whiteSpace= 'pre';
      im.className= '_sort'+i;

//      var st= tc[i].appendChild(stats.cloneNode(true));
    } catch(ee){alert(ee.message)}
profileStop()
  } //OKSort

  function topStyle() {
    if(options.topStyle) {
      var tr= tb.rows;
      for(var i = 0; i < options.top; i++) tr[i].style.cssText= options.topStyle;
    }
  } //topStyle

  function leftStyle() {
    if(options.leftStyle) {
      var tr= tb.rows;
      for(var i = options.top; i < tr.length; i++) {
        for(var j = 0; j < options.left; j++) {
          tr[i].cells[j].style.cssText= tr[i].cells[j].style.cssText+options.leftStyle;
        }
      }
    }
  } //leftStyle

  function cornerStyle() {
    if(options.cornerStyle) {
      var tr= tb.rows;
      for(var i = 0; i < options.top; i++) {
        for(var j = 0; j < options.left; j++) {
          tr[i].cells[j].style.cssText= options.cornerStyle;      }
      }
    }
  } //cornerStyle

  function alternate(tb) {
    var tr= tb.rows;
    if(typeof options.alternate==='object') {
      var n= 0;
      var st= options.alternate;
      for(var i = options.top; i < tr.length; i++) {
        var bg= st[n++];
        tr[i].style.cssText= bg;
        if(n >= st.length) n= 0;
      }
    }
    else if(options.alternate) {
      var bg= '#f0f0f0';
      for(var i = options.top; i < tr.length; i++) {
        bg= bg==='#f0f0f0'?'#fff':'#f0f0f0'
        tr[i].style.background= bg;
      }
    }
  } //alternate

  function blanks() {
    if(options.blank || options.blankStyle) {
      var tr= tb.rows;
      for(var i = 0; i < tr.length; i++) {
        var tc= tr[i].cells;
        for(var j = 0; j < tc.length; j++) {
          if(getInnerText(tc[j]).trim()==='') {
            if(options.blank) tc[j].innerHTML= options.blank;
            if(options.blankStyle) tc[j].style.cssText= options.blankStyle;
          }
        }
      }
    }
  } //blanks

  function repeats(tb) {
    if(options.repeat || options.repeatStyle) {
      var tr= tb.rows;
      var lv= [];
      for(var i = 0; i < tr.length; i++) {
        var tc= tr[i].cells;
        for(var j = 0; j < tc.length; j++) {
          var hb= tc[j].style.borderLeft;
          if(getInnerText(tc[j]).trim()===lv[j]) {
            if(options.repeat && lv[j]>'') {
              tc[j].innerHTML= options.repeat;
            }
            if(options.repeatStyle) {
              tc[j].style.cssText= tc[j].style.cssText+options.repeatStyle;
              tc[j].style.borderLeft= hb;
            }
          }
          else {
            if(options.repeatStyle) {
              tc[j].style.cssText= (tb==tbLeft)?'background:white;'+tc[j].style.cssText+'color:black;visibility:visible;':'';
              tc[j].style.borderLeft= hb;
            }
            lv[j]= getInnerText(tc[j]).trim();
          }
        }
      }
    }
  } //repeats

  function attach() {
profile('attach');
    if(options.left) DMain.appendChild(dLeft);
    if(options.top)  DMain.appendChild(dTop);
    if(options.left && options.top) DMain.appendChild(dCorner);
    DMain.appendChild(dContent);
profileStop();    
  } //attach

  function timer(s) {
//    console.log(s+': '+(new Date()-t1));
  } //timer

  options= merge({leftStyle:'background:white',top:1,left:0,whiteSpace:'nowrap',Excel:false,sort:false},options)

  if(typeof tb === 'string') tb= $(tb);
//  tb.style.tableLayout= 'fixed'; //not needed ... doesn't seem faster

  var DMain= document.createElement('DIV');
  DMain.style.position= 'relative';
  DMain.style.background= '#eee';

  DMain.onmouseover= function(ev) {
    ev=ev || window.event;
    var e=ev.srcElement?ev.srcElement:ev.target;
    if(e.tagName==='TH') {
      var posx = 0;
      var posy = 0;
      if (ev.pageX || ev.pageY) {
        posx = ev.pageX;
        posy = ev.pageY;
      }
      else if (ev.clientX || ev.clientY) {
        posx = ev.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        posy = ev.clientY + document.body.scrollTop + document.documentElement.scrollTop;
      }
      e.getElementsByTagName('div')[0].style.left= posx-20+'px';

    }
  } //onmouseover

  DMain.oncontextmenu= function(ev) {
    ev=ev || window.event;
    var e=ev.srcElement?ev.srcElement:ev.target;
    ev.stopPropagation();
//    return false;
  } //oncontextmenu

  DMain.onclick= function(ev) {
    ev=ev || window.event;
    var e=ev.srcElement?ev.srcElement:ev.target;
    var pc= e.parentNode.className;
    if(pc.indexOf('sort')>-1) {
      DMain.sort(pc.split('_sort')[1]);
    }
  } //onclick

  DMain.lastSort= null;

  DMain.sort= function(n) {
    function update(tbs) {
      var tbt= tbs.cloneNode(true);
      var tr= tbs.rows;
      var tr2= tbt.rows;

      for(var i = 0; i < s.length; i++) {
        tr[i].parentNode.replaceChild(tr2[s[i][1]].cloneNode(true),tr[i+options.top])
      }
    } //update

    var ls= DMain.lastSort;

    DMain.lastSort= n;

    var cell1= tbTop.rows[options.top-1].cells[n].getElementsByTagName('img')[0];
    var cell2= tbCorner.rows[options.top-1].cells[n].getElementsByTagName('img')[0];

    if(cell1.src.indexOf('sort_up.png')>-1) {
      cell1.src= cell2.src= 'http://aesl.ces.uga.edu/images/sort_down.png';
      var reverse= true;
    }
    else {
      cell1.src= cell2.src= 'http://aesl.ces.uga.edu/images/sort_up.png';
      var reverse= false;
    }

    if(ls && ls!=DMain.lastSort) {
      var cell1= tbTop.rows[options.top-1].cells[ls].getElementsByTagName('img')[0];
      var cell2= tbCorner.rows[options.top-1].cells[ls].getElementsByTagName('img')[0];
      cell1.src= cell2.src= 'http://aesl.ces.uga.edu/images/sort_neutral.png';
    }

    var tr= tb.rows;
    var arr= [];
    for(var i = options.top; i < tr.length; i++) {
      arr.push([getInnerText(tr[i].cells[n]),i]);
    }

    if(typeof options.sort === 'function') {
      var s= arr.sort(function(a,b) {
                        return options.sort(a[0],b[0],n);
                      }
                     )
    }
    else {
      var s= arr.sort();
    }

    if(reverse) s.reverse();

    update(tbLeft);
    update(tb);

    alternate(tbLeft);
    alternate(tb);

    repeats(tbLeft);
    repeats(tb);
  } //DMain.sort

  DMain.Excel= function(flags) {
    var tb2= tb.cloneNode(true);
    var nodes= tb2.querySelectorAll('*.noexport');
    for(var i = 0; i < nodes.length; i++) {
      destroy(nodes[i]);
    }

    var hi= [];
    if(options.sort && tb2.rows.length > options.top+1) {  //temporarily remove sort icons
      var tc= tb2.rows[options.top-1].cells;
      for(var j = 0; j < tc.length; j++) {
        var img= tc[j].getElementsByTagName('img')[0];
        hi[j]= img.parentNode.removeChild(img);
      }
    }

    Excel('<style>td {border:0.5pt solid silver}</style>'+outerHTML(tb2))

    if(hi.length) {
      for(var j = 0; j < tc.length; j++) {
        tc[j].appendChild(hi[j]);
      }
    }
  } //DMain.Excel
//________________________________________________________________________________________________________________________________________

  getColumns();
  if(options.deleteEmptyColumns) deleteEmptyColumns();

  spanBorders();

  if(options.sort && tb.rows.length>options.top+1) OKSort();
  topStyle();
  leftStyle();
  cornerStyle();
  blanks();
  tb.style.whiteSpace= options.whiteSpace;

  var toht= 0;
  var toh= 0;
  for(var i = 0; i < tb.rows.length; i++) {
    var ofs= tb.rows[i].offsetHeight;
    toh+= ofs;
    if(i < options.top) toht+= ofs;
  }

  var towl= 0;
  var tow= 0
  var tc= tb.rows[options.top-1].cells;
  for(var i = 0; i < tc.length; i++) {
    var ofs= tc[i].offsetWidth;
    tow+= ofs;
    if(i < options.left) towl+= ofs;
  }

  if(!tb.style.background) tb.style.background= 'white';

  DMain.id= tb.id;
  tb.id= '';

profile('visibility');

  var tbCorner = tb.cloneNode(true);
  var tbLeft   = tb.cloneNode(true);
  var tbTop    = tb.cloneNode(true);

  tbCorner.style.visibility= 'hidden';
  tbCorner.className= 'cellRelative';
  for(var i = 0; i < options.top; i++) {
    for(var j = 0; j < options.left; j++) {
      var c= tbCorner.rows[i].cells[j];
      c.style.visibility= 'visible';
      tb.rows[i].cells[j].style.visibility= 'hidden';
    }
  }

  tbLeft.style.visibility= 'hidden';
  tbLeft.className= 'cellRelative';
  for(var i = options.top; i < tbLeft.rows.length; i++) {
    for(var j = 0; j < options.left; j++) {
      var c= tbLeft.rows[i].cells[j];
      c.style.visibility= 'visible';
      tb.rows[i].cells[j].style.visibility= 'hidden';
    }
  }

  tbTop.style.visibility= 'hidden';
  tbTop.className= 'cellRelative';
  for(var i = 0; i < options.top; i++) {
    tbTop.rows[i].style.visibility= 'visible';
    tb.rows[i].style.visibility= 'hidden';
  }
profileStop();
  
  if(options.Excel) {
    var dXL= document.createElement('button');
    dXL.className= 'BExport';
    dXL.innerHTML= 'Export&nbsp;<img src="http://aesl.ces.uga.edu/images/XLS.png" style="width:16px;cursor:pointer;margin-left:0.5em">';
    dXL.style.padding= '0px 5px';
    dXL.onclick= function() {
      DMain.Excel();
    }
    DMain.appendChild(dXL);
  }

  if(options.filter) {
    var dFilter= document.createElement('div');
    dFilter.innerHTML= '<button><b>Remove filter</b></button>';
    dFilter.style.display= 'none';
    dFilter.onclick= function() {
      this.style.display= 'none';
      for(var i = 0; i < tb.rows.length; i++) {
        tb.rows[i].style.display= '';
        tbLeft.rows[i].style.display= '';
        tbTop.rows[i].style.display= '';
        tbCorner.rows[i].style.display= '';
      }
    }

    DMain.appendChild(dFilter);

    tbLeft.onmouseover= tb.onmouseover= function(ev) {
      ev=ev || window.event;
      var e=ev.srcElement?ev.srcElement:ev.target;
      if(e.tagName === 'TD' || e.tagName === 'TH') {
        setTimeout( //setTimeout required for Chrome
          function() {
            e.style.cursor= 'pointer';
            e.title= 'click to filter';
          },
          1
        )
      }
    } //onmouseover

    tbLeft.onclick= tb.onclick= function(ev) {
      ev=ev || window.event;
      var e=ev.srcElement?ev.srcElement:ev.target;
      if(e.tagName === 'TD' || e.tagName === 'TH') {
        var tr= this.rows;
        if(this===tb) var trl= tbLeft.rows;
        else          var trl= tb.rows;
        var cell= e.cellIndex;
        var filter= getInnerText(e).trim().toLowerCase();

        var wd= [];
        var tc= tb.rows[options.top-1].cells;

        for(var i = 0; i < tc.length; i++) {
          var w= tc[i].offsetWidth;
          wd[i]= w+'px';
        }

        for(var i = options.top; i < tr.length; i++) {
          if(getInnerText(tr[i].cells[cell]).trim().toLowerCase()!==filter) {
            tb.rows[i].style.display=
            tbLeft.rows[i].style.display=
            tbTop.rows[i].style.display=
            tbCorner.rows[i].style.display= 'none';
          }
          else {
            tb.rows[i].style.display=
            tbLeft.rows[i].style.display=
            tbTop.rows[i].style.display=
            tbCorner.rows[i].style.display= '';
          }
        }

        var tc1= tb.getElementsByTagName('col');
        var tc2= tbTop.getElementsByTagName('col');
        var tc3= tbCorner.getElementsByTagName('col');
        var tc4= tbLeft.getElementsByTagName('col');

        for(var i = 0; i < tc.length; i++) {
          tc1[i].style.width=
          tc2[i].style.width=
          tc3[i].style.width=
          tc4[i].style.width= wd[i];
        }

        tb.style.width= tbCorner.style.width= tbLeft.style.width= tbTop.style.width= tow+2+'px';

        Show(dFilter);
        dFilter.style.position= 'relative';
        dFilter.style.left= e.getBoundingClientRect().left+'px';
      }
    } //onclick
  }

  function dimensions() {
    tb.parentNode.replaceChild(DMain,tb);
    dContent.appendChild(tb);
    attach();

    profile('dimensions');
    if(!options.width) {
      var w= Math.min(document.body.clientWidth-5,tb.offsetWidth+20);
    }
    else {
      var w= options.width-2;
    }
    DMain.style.width= w+'px';
    profileStop();

    if(options.height) {
      var h= options.height-(toht+2);
      if(h>toh+22) h= toh+22;
      else if(options.Excel) h-= 25;
      dContent.style.height= h+'px';
    }

    dLeft.style.width= towl+1+'px';
    dTop.style.height= toht+1+'px';

//    DMain.style.background= dLeft.style.background=
    dTop.style.background= dCorner.style.background= '#369';  //prevents bleed-through at top

    dCorner.style.width= towl+1+'px';
    dCorner.style.height= toht+1+'px';
    DMain.style.border= '1px solid #bbb';

    dTop.style.width= w-18+'px';
    dLeft.style.height= h-18+'px';

//    dTop.style.width= dContent.clientWidth+'px';
//    dLeft.style.height= dContent.clientHeight+'px';

    parent.style.width= parent.style.height= parent.style.overflow= '';

    DMain.dLeft   =tbLeft;
    DMain.dTop    =tbTop;
    DMain.dCorner =tbCorner;
    DMain.dContent=tb;

    profileStop();
  } //dimensions

//________________________________________________________________________________________________________________________
  var dCorner= document.createElement('div');
  dCorner.style.position= 'absolute';
  dCorner.style.left= '0px';
  dCorner.style.overflow= 'hidden';
  dCorner.appendChild(tbCorner);

  var dLeft= document.createElement('div');
  dLeft.style.position= 'absolute';
  dLeft.style.left= '0px';
  dLeft.style.overflow= 'hidden';
  dLeft.appendChild(tbLeft);

  var dTop= document.createElement('div');
  dTop.style.position= 'absolute';
  dTop.style.overflow= 'hidden';
  dTop.appendChild(tbTop);

  var dContent= document.createElement('div');
  dContent.style.overflow= 'scroll';

  dContent.onscroll=function() {
    dTop.scrollLeft= this.scrollLeft;
    dLeft.scrollTop = this.scrollTop;
  } //dContent.onscroll

  dLeft.style.borderRight= dTop.style.borderBottom= dCorner.style.borderRight= dCorner.style.borderBottom= '1px solid #369';

  alternate(tbLeft);
  alternate(tb);

  repeats(tbLeft);
  repeats(tb);

  var parent= tb.parentNode;
  parent.style.width= options.width+'px';
  parent.style.height= options.height-20+'px';
  parent.style.overflow= 'scroll';
//  setTimeout(dimensions,0);  //check PG2013!!!
  dimensions();

  timer('End');

  return DMain;
} //smartTable