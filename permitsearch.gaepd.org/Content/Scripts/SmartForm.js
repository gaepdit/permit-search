function initForm(tb,key,AAS,options){
  tb=tb.replace(/"/g,"'")
  AJAX('/scripts/Schema.asp?Table='+tb+'&Key='+key+'&Session='+ThisSession+(AAS?'&db=aas':''),
       function(x){
//         console.log(x.responseText)
         eval('form='+x.responseText)
         form.options=merge({dateFormat:'mm/dd/yyyy HH:MM:ss'},options)
         for(var i in form){
           try{
             i=i.replace(/ /g,'.')
             var o=$('i'+i)
             o.style.background='lightyellow'
             if     (form[i].type=='Date')    o.onkeypress=o.onkeypress?o.onkeypress:inputDate
             else if(form[i].type=='String')  o.maxLength=form[i].size
             else if(form[i].type=='Double')  o.onkeypress=o.onkeypress?o.onkeypress:inputDouble
             else if(form[i].type=='Integer') o.onkeypress=o.onkeypress?o.onkeypress:inputWhole
             else if(form[i].type=='Boolean') o.type='checkbox'
             else alert(i+' '+form[i].type)
           }catch(ee){}
         }
         form.aas=AAS
       }
      )
} //initForm

function clearForm(fnc){
  if(typeof form!='object') setTimeout(function(){clearForm(fnc)},100)
  else {
    for(var i in form) if(i!='aas'){
      try{
//        var m=document.getElementsByClassName('c'+i)
        var m=getElementsByClassName(document.body,'c'+i)

        for(var l in m) try{
          if(m[l].type=='text' || m[l].tagName=='TEXTAREA') m[l].value=''
          else m[l].checked=false
        } catch(ee){}
        i=i.replace(/ /g,'.')
        var o=$('i'+i)
        o.value=''
      }catch(ee){}
    }
    if(fnc) fnc()
  }
} //clearForm

function fillForm(val,fnc){
  if(typeof form!='object') setTimeout(function(){fillForm(val,fnc)},100)
  else {
    SQLFieldNames=true
    var sq='select * from ('+form.query+') where ['+form.thekey+']='

    if     (form[form.thekey].type=='String') sq+='"'+val+'"'
    else if(form[form.thekey].type=='Date')   sq+='#'+val+'#'
    else                                      sq+=val
    var SQ=form.aas?ASQL:SQL
    SQ(sq,
        function(x){
          var r=x.responseText.split('^^'); r.shift(); r.pop()
          if(!r.length) return
          var rec=r[0].split('|')
          var j=-1
          for(var i in form) if(i!='aas'){
            j++
            var v=rec[j]

//            var m=document.getElementsByClassName('c'+i)
            var m=getElementsByClassName(document.body,'c'+i)
            if(m.length) {
              v=v.replace(/\\;/g,'SEMICOLON').replace(/\\"/g,'DOUBLEQUOTE').split(';')
              for(var k in v){
                var vk=v[k]
                for(var l=0;l<m.length;l++) try{
                  if((m[l].type=='text' || m[l].tagName=='TEXTAREA') && vk.indexOf(m[l].id+':')==0) m[l].value=vk.substr(vk.indexOf(':')+1).replace(/SEMICOLON/g,';').replace(/DOUBLEQUOTE/g,'"')
                  else {
                    if(vk==m[l].id || vk==m[l].value.trim()) m[l].checked=true
                  }
                }catch(ee){}
              }
            }
            else try{
              var z=i.replace(/ /g,'.')
              var iz=$('i'+z)
              if(iz) {
                if(form[i].type=='Date') try{
                  if(v>'') {
                    iz.value=dateFormat(v,form.options.dateFormat)
                  }
                }catch(ee){}
                else if(form[i].type=='Boolean') try{iz.checked=v==-1}catch(ee){}
                else if(iz.tagName=='SELECT')  try{
                  for(var k=0;k<iz.options.length;k++) if(iz.options[k].innerHTML.trim()==v) {
                    iz.selectedIndex=k
                    break
                  }
                }catch(ee){alert(ee.message)}
                else try{iz.value=v.replace(-9999,'Trace')}catch(ee){}
              }
            } catch(ee){alert('fillForm: '+i)}
          }
          if(fnc) fnc(rec)
        }
       )
  }
} //fillForm

function saveForm(fnc){
  if(typeof form!='object') setTimeout(function(){saveForm(val)},100)
  else {
    var s=[]
    for(var i in form) if(i!='aas'){
      try{
        var val=''

//        var m=document.getElementsByClassName('c'+i)
        var m=getElementsByClassName(document.body,'c'+i)
        if(m.length) {
          for(var j=0;j<m.length;j++) try{
            var mv=m[j].value.replace(/;/g,'\\;')
            if(m[j].type=='text' || m[j].tagName=='TEXTAREA'){
              if(mv>'') val+=m[j].id?(m[j].id+':'+mv+';'):(mv+';')
            }
            else if(m[j].checked) val+=mv?mv.trim()+';':m[j].id+';'
          }catch(ee){}
          if(val.trim()>'') {
            if(form[i].type=='Integer' || form[i].type=='Double') val=val.replace(';','')
            else val='"'+val.replace(/"/g,'DOUBLEQUOTE')+'"'
          }
        }
        else {
          var o=$('i'+i)

          if     (form[i].type=='Boolean') val=o.checked?'true':'false'
          else if(o.value>'' || o.tagName=='SELECT'){
//            if(o.tagName=='SELECT') alert(i+' '+o.value)
            if     (form[i].type=='Date')    val='#'+o.value+'#'
            else if(form[i].type=='String')  val='"'+o.value.replace(/"/g,'DOUBLEQUOTE')+'"'
            else                             val=o.value.toUpperCase()=='TRACE'?'-9999':o.value
          }
        }

        if(val.trim()>'' && val!='""') s.push('['+(i.replace(/\./g,' '))+']='+val)
        else                           s.push('['+(i.replace(/\./g,' '))+']=null')  //needed to clear data entry from saved forms
      }catch(ee){}
    }

    val=$('i'+form.thekey).value
    if     (form[form.thekey].type=='String') val='"'+val+'"'
    else if(form[form.thekey].type=='Date')   val='#'+val+'#'

    var sq='update ('+form.query+') set '+s.join(',')+' where '+form.thekey+'='+val
    var SQ=form.aas?ASQL:SQL

    email({from:'aas@gaepd.org',
           to: SQLTo,
           subject:'SmartForm',
           message:sq
          })

    SQ(sq,function(x) {
         if(fnc) fnc()
       }
      )
  }
} //saveForm

ASQL('select SValue from Constants where Constant="SubmissionSQL"',
     function(x) {
       SQLTo= x.responseText.split('^^')[0];
     }
    );
