var sContacts={List:[],U:''}

function $n(id) {return $t(id)*1}

function showType(t){
  var d=$('D'+t.id.substr(1))
  d.style.display=t.checked?'block':'none'
  if(t.checked) d.scrollIntoView()
} //showType

function showNextRow(t){
  t.parentNode.parentNode.nextSibling.style.display=''
} //showNextRow

function loadEvent(tevent){
  fillForm(tevent,
           function(rec){
             $('fDate').value=dateFormat(rec[$Date],'mm/dd/yyyy')
             $('fTime').value=dateFormat(rec[$Date],'hh:MM tt')
             $('RainTime').value=$t('iRainHours')
             if($t('iStream')=='rocky') $('DStream0').checked=true
             if($t('iStream')=='muddy') $('DStream1').checked=true

             if($t('iMethod')=='kick')    $('DMethod0').checked=true
             if($t('iMethod')=='d-frame') $('DMethod1').checked=true

             if($t('AddA')>'') parentTagName($('AddA'),'TR').style.display=''
             if($t('AddB')>'') parentTagName($('AddB'),'TR').style.display=''
             if($t('AddC')>'') parentTagName($('AddC'),'TR').style.display=''
             if($t('AddD')>'') parentTagName($('AddD'),'TR').style.display=''
             if($t('AddE')>'') parentTagName($('AddE'),'TR').style.display=''
             if($t('AddF')>'') parentTagName($('AddF'),'TR').style.display=''
             if($t('AddG')>'') parentTagName($('AddG'),'TR').style.display=''

             if(rec[$pH]>'' && $t('pH1')+$t('pH2')=='') $('pH1').value=rec[$pH]
             if(rec[$DissolvedOxygen]>'' && $t('Dissolved.Oxygen1')+$t('Dissolved.Oxygen2')=='') $('Dissolved.Oxygen1').value=rec[$DissolvedOxygen]
             if(rec[$Salinity]>'' && $t('Salinity1')+$t('Salinity2')=='') $('Salinity1').value=rec[$Salinity]
             if(rec[$SecchiDisk]>'' && $t('Secchi.Disk1')+$t('Secchi.Disk2')=='') $('Secchi.Disk1').value=rec[$SecchiDisk]

             if(rec[$Chemical]      ==-1) {$('BChemical').checked =true; Show('DChemical') }
             if(rec[$Biological]    ==-1) {$('BMacro').checked    =true; Show('DMacro')    }
             if(rec[$Bacterial]     ==-1) {$('BBacterial').checked=true; Show('DBacterial')}

             if(rec[$StreamHabitat] ==-1) {
               $('BHabitat').checked=true;   Show('DHabitat')
               editing=true
               SHScore()
               if(ft1.checked) rockyBottom()
               if(ft2.checked) muddyBottom()
               editing=false
             }

             if(rec[$FecalColiform]+rec[$EcoliUnknown]+rec[$EcoliIDEXX]>'') {
               $('ECO1').checked=true
               Show('DECO')
               $('BBacterial').checked=true; Show('DBacterial')
             }

             if(rec[$History]) {
               var h=rec[$History].split(';'); h.pop()
               var s=[]
               s.push('<table cellspacing=0 cellpadding=0 style="border:1px solid #ddd;color:silver;font-size:8pt;background:#333">')
               s.push('<tr><th colspan=3>Edit history')
               for(var i in h){
                 s.push('<tr><td>'+h[i].split('~').join('<td>'))
               }
               s.push('</table>')
               $('History').innerHTML=s.join('')
             }

             SQLFieldNames=true
             ASQL('Select * from Parts a left join Contacts b on a.Contact_ID=b.Contact_ID where [Event_ID]='+tevent,
                  function(x){
                    var r=x.responseText.split('^^'); r.shift(); r.pop()

                    for(var i in r){
                      var rec=r[i].split('|')
                      if(rec[$Other]>'') sContacts.U=$('UContacts').value=rec[$Other]
                      else               sContacts.List.push(rec[$bContactID])
                      Names[rec[$bContactID]]=rec[$FirstName]+' '+rec[$LastName]+' '+rec[$SeniorityTitle]
                    }
                    CUpdate()

                  }
                 )

             ASQL('select Waterbodyname from sites where monitoring_site_id='+$t('iSite'),
                  function(x){
                    $('ISites').value=x.responseText.split('^^')[0]+' ('+$t('iSite')+')'
                    Search($t('iSite'))
                    Show('Outer')
                    setEditing(false)
                    update()
                  }
                 )

           }
          )
} //loadEvent

//________________________________________________________________________________________________________________________________________________________________
function Search(id) {
  if($t('ISites')) {
    id= $t('ISites').split(' (')
    id= id[id.length-1].split(')')[0];
  }

  if(id=='' || isNaN(id)) {
    $('MCFGroupName').innerHTML=$('MCFCountyName').innerHTML='';

    jq('#ISites, #iSite, #iMonitoring_Site_ID').val('');

    SiteID=0;
    return;
  }
  SiteID=id;
  $('iSite').value=$('iMonitoring_Site_ID').value=id;

  getSiteCoordinators(id);

  SQLFieldNames= true;
  ASQL('select * from QSites where Monitoring_Site_ID='+id,
       function(x) {
         var r=x.responseText.split('^^')[1].split('|')
         GroupID=$('iGroup_ID').value=r[$GroupID]
         getGroupLeaders(GroupID);
         $('MCFGroupName').innerHTML='Group G-'+r[$GroupID]+': <span style="font-weight:normal">'+r[$GroupName]+'</span>'
         $('MCFCountyName').innerHTML=r[$County]>''?r[$County]+' County':''
       }
      )
} //Search
//________________________________________________________________________________________________________________________________________________________________
function CUpdate(n,remove) {
  if(remove) {
    for(var i in sContacts.List) if(sContacts.List[i]==n) sContacts.List.splice(i,1)
  }
  else if($v('CContacts')) try {
    var d=$v('CContacts').split('(')[1].split(')')[0]
    if((','+sContacts.List.toString()+',').indexOf(','+d+',')>-1) {$('CContacts').value=''; return}

    Names[d]=$v('CContacts').split('(')[0].trim()
    sContacts.List.push(d)
    $('CContacts').value=''
  } catch(ee){return;}

  var s=[]
  for(var i in sContacts.List){
    s.push('<span style="white-space:nowrap">'+Names[sContacts.List[i]]+'<button style="font-size:8pt;margin-left:0.2em;padding:0 0.2em;background:#eeeeee;cursor:pointer;border:1px solid gray" tabindex=-1 onclick="if(editing) CUpdate('+sContacts.List[i]+',true)">x</button>&nbsp;&nbsp;&nbsp;</span> ')
  }
  $('CContactsL').innerHTML=s.join('')

//  if(sContacts.U=='') $('iParticipants').value=sContacts.List.length //screws up

  var td=$t('fDate'); if(td=='') td='12/12/2999'

  var sq='select "Chem",count(*) from certs where Contact_ID in ('+sContacts.List.join(',')+') and ((Certification_Type like "%Chemical%"          and Certification_Date between #'+td+'#-365*1.25 and #'+td+'#) or Certification_type="EPD SQAP") union all '+
         'select "Macr",count(*) from certs where Contact_ID in ('+sContacts.List.join(',')+') and ((Certification_Type like "%Macroinvertebrate%" and Certification_Date between #'+td+'#-365*1.25 and #'+td+'#) or Certification_type="EPD SQAP") union all '+
         'select "Bact",count(*) from certs where Contact_ID in ('+sContacts.List.join(',')+') and ((Certification_Type like "%Bacterial%"         and Certification_Date between #'+td+'#-365*1.25 and #'+td+'#) or Certification_type="EPD SQAP")'
  ASQL(sq,
       function(x){
         certChem=certMacr=certBact=false
         var r=x.responseText.split('^^')
         for(var i in r){
           var rec=r[i].split('|')
           if     (rec[0]=='Chem') certChem=rec[1]>0
           else if(rec[0]=='Macr') certMacr=rec[1]>0
           else if(rec[0]=='Bact') certBact=rec[1]>0
         }
         for(var i in sContacts.List) if(sContacts.List[i]==6101 || sContacts.List[i]==31419) certChem=certMacr=certBact=true
         Validate()
       }
      )

} //CUpdate
//________________________________________________________________________________________________________________________________________________________________
function goto(fld,typ){
  if(typ) $(typ).click()
  $(fld).focus()
} //goto
//________________________________________________________________________________________________________________________________________________________________
function Dupe(){
  Show('DHide')
  Show('DDupe')
} //Dupe

function Validate(){
  function ad(s,id,dif){
    var r1=$t(id+'1'); var r2=$t(id+'2'); if(r1>'' && r2>'') pchem(Math.abs(r1-r2).toFixed(2)>dif,'<b>'+s+'</b> difference >'+dif,id+'1')
  } //ad

  function pbac(cond,desc,fld){
    if(cond) {
      wbac.push(desc.replace('<b>','<b style="color:white;cursor:pointer" onclick="goto(\''+fld+'\')">'))
      bacw.push(desc)
    }
  } //pbac

  function pmac(cond,desc,fld){
    if(cond) {
      wmac.push(desc.replace('<b>','<b style="color:white;cursor:pointer" onclick="goto(\''+fld+'\')">'))
      macw.push(desc)
    }
  } //pmac

  function pchem(cond,desc,fld){
    if(cond) {
      wchem.push(desc.replace('<b>','<b style="color:white;cursor:pointer" onclick="goto(\''+fld+'\')">'))
      chemw.push(desc)
    }
  } //pchem

  function perr(cond,desc,fld,typ){
    if(!typ) typ=''
    if(cond) err.push(desc.replace('<b>','<b style="color:white;cursor:pointer" onclick="goto(\''+fld+'\',\''+typ+'\')">'))
  } //perr

  function preq(cond,desc,fld,typ){
    if(!typ) typ=''
    if(cond) req.push(desc.replace('<b>','<b style="color:white;white-space:nowrap;cursor:pointer" onclick="goto(\''+fld+'\',\''+typ+'\')">'))
  } //preq

  function validateChemical(){
    if(isChemical()){
      ad('pH','pH',0.25)
      ad('Dissolved Oxygen','Dissolved.Oxygen',0.6)
      ad('Secchi Disk','Secchi.Disk',10)
      ad('Salinity','Salinity',1)
    }
  } //validateChemical

  function validateBacterial(){
    if(isBacterial()){
      var SDate=$t('3MSDate')
      var STime=$t('3MSTime')
      var EDate=$t('3MEDate')
      var ETime=$t('3METime')
      var SDT=SDate+' '+STime
      var EDT=EDate+' '+ETime

      pbac(SDate>'' && !ValidDate(SDate,true),'<b>START Date</b> is invalid','3MSDate')
      pbac(STime>'' && !ValidTime(STime,true),'<b>START Time</b> is invalid','3MSTime')
      pbac($t('3MSTemp')>'' && ($t('3MSTemp')<34 || $t('3MSTemp')>36),'<b>Minimum Temperature</b> should be between<br>34 &deg;C and 36 &deg;C','3MSTemp')

      pbac(EDate>'' && !ValidDate(EDate,true),'<b>END   Date</b> is invalid','3MEDate')
      pbac(ETime>'' && !ValidTime(ETime,true),'<b>END   Time</b> is invalid','3METime')
      pbac($t('3METemp')>'' && ($t('3METemp')<34 || $t('3METemp')>36),'<b>Maximum Temperature</b> should be between<br>34 &deg;C and 36 &deg;C','3METemp')

      if(!update3MTime()) {
        wbac.push('3M total time should be between 23 and 25 hours')
        bacw.push('3M total time should be between 23 and 25 hours')
      }

      pbac($t('3MB')*1>0,'<b>Blank</b> cannot be a positive number','3MB')
      pbac($t('3MB')    =='','<b>Blank</b>               missing','3MB')
      pbac($t('3M1')    =='','<b>Plate 1</b>             missing','3M1')
      pbac($t('3M2')    =='','<b>Plate 2</b>             missing','3M2')
      pbac($t('3M3')    =='','<b>Plate 3</b>             missing','3M3')

      pbac($t('Holding')*1<0 || $t('Holding')*1>24,'<b>Sample Holding Time</b> should be between 0 and 24 hours.','Holding')

      pbac($t('3MSDate')=='','<b>START Date</b>          missing','3MSDate')
      pbac($t('3MSTime')=='','<b>START Time</b>          missing','3MSTime')
      pbac($t('3MSTemp')=='','<b>Minimum Temperature</b> missing','3MSTemp')
      pbac($t('3MEDate')=='','<b>END   Date</b>          missing','3MEDate')
      pbac($t('3METime')=='','<b>END   Time</b>          missing','3METime')
      pbac($t('3METemp')=='','<b>Maximum Temperature</b> missing','3METemp')

      pbac($t('3MSTemp')*1>$t('3METemp')*1,'<b>Minimum Temperature</b> should be less than Maximum Temperature','3MSTemp')
    }

  } //validateBacterial

  if($t('iSite')>'' && $t('fDate')>'' && $t('fTime')>'' && !tevent) {
    ASQL('select * from Events where site='+$t('iSite')+' and date=#'+$t('iDate')+'#',
         function(x){
           var r=x.responseText.split('^^'); r.pop()
//           if(r.length>0) Dupe()
         }
        )
  }
  req=[]
  err=[]
  wmac=[]; macw=[]
  wbac=[]; bacw=[]
  wchem=[]; chemw=[]

  preq(sContacts.List.length==0,'<b>AAS monitors</b>','CContacts')
  preq($t('iParticipants')=='' ,'<b>Total participants</b>','iParticipants')

  preq($t('ISites')=='','<b>Site</b>','ISites')
  preq($t('fDate') =='','<b>Event Date</b>','fDate')
  if($t('fDate')>'') perr(!ValidDate($t('fDate'),true),'<b>Date</b> is invalid','fDate')
  preq($t('fTime') =='','<b>Event Time</b>','fTime')
  if($t('fTime')>'') perr(!ValidTime($t('fTime'),true),'<b>Time</b> is invalid','fTime')
  preq($t('Sampling')=='','<b>Time Spent Sampling</b>','Sampling')

  if(isChemical()){
    pchem($t('fDate')>'' && !certChem,'No QA/QC-certified <b>Chemical AAS Participants</b>','CContacts')
  }

  if(isMacro()) {
    pmac($t('fDate')>'' && !certMacr,'No QA/QC-certified <b>Macro AAS Participants</b>','CContacts')
    pmac(!$('DMethod0').checked && !$('DMethod1').checked,'Macro <b>Method used</b>','DMethod0')
    pmac($t('AreaSampled')=='','<b>Total Area Sampled</b>','AreaSampled')
  }

  if(isBacterial()){
    pbac($t('fDate')>'' && !certBact,'No QA/QC-certified <b>Bacterial AAS Participants</b>','CContacts')
  }


  var air=$t('iAirTemp')*1
//  perr(air<-10 || air>43,'<b>Air Temperature</b> must be between -10 and 43','iAirTemp')
  pchem(air*10%1!=0,'<b>Air Temperature</b> should be rounded to the nearest tenth','iAirTemp')

  var h2o=$t('iWaterTemp')*1
  perr(h2o<-3 || h2o>43,'<b>Water Temperature</b> must be between -3 and 43','iWaterTemp')
  pchem(h2o*10%1!=0,'<b>Water Temperature</b> should be rounded to the nearest tenth','iWaterTemp')

  var p1=$t('pH1')*1
  var p2=$t('pH2')*1
  perr(p1*1>14 || p2*1>14,'<b>pH</b> must be between 0 and 14','pH1')
  pchem(p1 && !p2,'<b>pH</b> Test 2 missing','pH2')
  pchem(!p1 && p2,'<b>pH</b> Test 1 missing','pH1')

  var DO1=$t('Dissolved.Oxygen1')*1
  var DO2=$t('Dissolved.Oxygen2')*1
  perr(DO1>14.6 || DO2>14.6,'<b>Dissolved Oxygen</b> must be between 0 and 14.6','Dissolved.Oxygen1')
  pchem(DO1*10%1!=0 || DO2*10%1!=0,'<b>Dissolved Oxygen</b> should be rounded to the nearest tenth','Dissolved.Oxygen1')
  pchem(DO1 && !DO2,'<b>Dissolved Oxygen</b> Test 2 missing','Dissolved.Oxygen2')
  pchem(!DO1 && DO2,'<b>Dissolved Oxygen</b> Test 1 missing','Dissolved.Oxygen1')

  var EC=$t('iConductivity')*1
  pchem(EC>10000,'<b>Conductivity</b> should be between 0 and 10000','iConductivity')
//  perr(EC%10!=0,'<b>Conductivity</b> must be rounded to the nearest 10','iConductivity')

  var sal1=$t('Salinity1')*1
  var sal2=$t('Salinity2')*1
  perr(sal1<0 || sal1>100 || sal2<0 || sal2>100,'<b>Salinity</b> must be between 0 and 100','Salinity1')
  pchem(sal1%1!=0 || sal2%1!=0,'<b>Salinity</b> must be a whole number','Salinity1')
  pchem(sal1 && !sal2,'<b>Salinity</b> Test 2 missing','Salinity2')
  pchem(!sal1 && sal2,'<b>Salinity</b> Test 1 missing','Salinity1')

  var sec1=$t('Secchi.Disk1')*1
  var sec2=$t('Secchi.Disk2')*1
  pchem(sec1>300 || sec2>300,'<b>Secchi Disk</b> should be between 0 and 300','Secchi.Disk1')
  pchem(sec1*10%1!=0 || sec2*10%1!=0,'<b>Secchi Disk</b> should be rounded to the nearest tenth','Secchi.Disk1')
  pchem(sec1 && !sec2,'<b>Secchi Disk</b> Test 2 missing','Secchi.Disk2')
  pchem(!sec1 && sec2,'<b>Secchi Disk</b> Test 1 missing','Secchi.Disk1')

  var ec=$t('iEcoliIDEXX')*1
  pchem(ec*10%1!=0 || sec2*10%1!=0,'<b>E Coli</b> should be rounded to the nearest tenth','iEcoliIDEXX')

  validateBacterial()
  validateChemical()

//  if(req.length || err.length) Hide('BSubmit'); else Show('BSubmit')
  
  if(req.length) req='<div style="font-size:10pt;position:relative;background:#333;color:#ccc;padding:0.3em 0em">'+
                     ' <div style="text-align:center">'+
                     '  <button style="background:#b33;color:white;width:90%" onclick="ToggleDisplay(\'DRequired\'); dRequired=dRequired==\'none\'?\'block\':\'none\'">'+
                     '   View '+cardinal(req.length)+'<br>required parameter'+(req.length>1?'s':'')+
                     '  </button>'+
                     ' </div>'+
                     ' <div id="DRequired" style="padding:0.3em;border-bottom:2px solid white;display:'+dRequired+'">'+
                        req.join('<br>')+
                     ' </div>'+
                     '</div>'
  else req=''

  if(err.length) err='<div style="font-size:10pt;position:relative;background:#333;color:#ccc;padding:0.3em 0em">'+
                     ' <div style="text-align:center">'+
                     '  <button style="background:#b33;color:white;width:90%" onclick="ToggleDisplay(\'DErrors\'); dErrors=dErrors==\'none\'?\'block\':\'none\'">'+
                     '   View '+cardinal(err.length)+'<br>error'+(err.length>1?'s':'')+
                     '  </button>'+
                     ' </div>'+
                     ' <div id="DErrors" style="padding:0.3em;border-bottom:2px solid white;display:'+dErrors+'">'+
                        err.join('<br>')+
                     ' </div>'+
                     '</div>'
  else err=''

  if(wbac.length) {
    wbac='<div style="font-size:10pt;position:relative;background:#333;color:#ccc;padding:0.3em 0em">'+
         ' <div style="text-align:center">'+
         '  <button style="background:#b33;color:white;width:90%" onclick="ToggleDisplay(\'DBac\'); dBac=dBac==\'none\'?\'block\':\'none\'">'+
         '   View '+cardinal(wbac.length)+'<br>bacterial warning'+(wbac.length>1?'s':'')+
         '  </button>'+
         ' </div>'+
         ' <div id="DBac" style="padding:0.3em;border-bottom:2px solid white;display:'+dBac+'">'+
            wbac.join('<br>')+
         ' </div>'+
         '</div>'
  }
  else wbac=''

  if(wmac.length) {
    wmac='<div style="font-size:10pt;position:relative;background:#333;color:#ccc;padding:0.3em 0em">'+
         ' <div style="text-align:center">'+
         '  <button style="background:#b33;color:white;width:90%" onclick="ToggleDisplay(\'DMac\'); dMac=dMac==\'none\'?\'block\':\'none\'">'+
         '   View '+cardinal(wmac.length)+'<br>macro warning'+(wmac.length>1?'s':'')+
         '  </button>'+
         ' </div>'+
         ' <div id="DMac" style="padding:0.3em;border-bottom:2px solid white;display:'+dMac+'">'+
            wmac.join('<br>')+
         ' </div>'+
         '</div>'
  }
  else wmac=''

  if(wchem.length) {
    wchem='<div style="font-size:10pt;position:relative;background:#333;color:#ccc;padding:0.3em 0em">'+
          ' <div style="text-align:center">'+
          '  <button style="background:#b33;color:white;width:90%" onclick="ToggleDisplay(\'DChem\'); dChem=dChem==\'none\'?\'block\':\'none\'">'+
          '   View '+cardinal(wchem.length)+'<br>chemical warning'+(wchem.length>1?'s':'')+
          '  </button>'+
          ' </div>'+
          ' <div id="DChem" style="padding:0.3em;border-bottom:2px solid white;display:'+dChem+'">'+
             wchem.join('<br>')+
          ' </div>'+
          '</div>'
  }
  else wchem=''

  $('DError').innerHTML=req+err+wchem+wmac+wbac
} //Validate
//________________________________________________________________________________________________________________________________________________________________
function update3MTime(){
  var SDate=$t('3MSDate')
  var STime=$t('3MSTime')
  var EDate=$t('3MEDate')
  var ETime=$t('3METime')
  var SDT=SDate+' '+STime
  var EDT=EDate+' '+ETime
  if(ValidDateTime(SDT,true) && ValidDateTime(EDT,true)) {
    ValidDateTime(SDT); var d1=new Date(FixDate+' '+FixTime)
    ValidDateTime(EDT); var d2=new Date(FixDate+' '+FixTime)
    var hr=1000*60*60
    var diff=((d2-d1)/hr).toFixed(1)

    $('3MTotal').innerHTML=diff+' hours'
    if(diff<23 || diff>25) return false
  }
  else $('3MTotal').innerHTML=''
  return true
} //update3MTime

function update(){
  function avg(id) {
    try {
      var rid='i'+id

      var r1=$t(id+'1')
      var r2=$t(id+'2')

      if(r1==='' && r2==='') {
        $(rid).value=''
        return
      }

  //        if(traceok && r1.toLowerCase()=='trace') {$(id).innerHTML='Trace'; return}

      if(r1!=='') r1*=1
      if(r2!=='') r2*=1

      if(isNaN(r1) || isNaN(r2)) return

      if     (r1==='') $(rid).value=r2.toFixed(2)
      else if(r2==='') $(rid).value=r1.toFixed(2)
      else             $(rid).value=((r1+r2)/2).toFixed(2)
    }catch(ee){}
  } //avg

  $('BSubmit').style.display=editing?'inline':'none'
  $('DInstructions1').style.display=$('DInstructions2').style.display=editing?'block':'none'

  sContacts.U=$v('UContacts')

  $('iDate').value=$t('fDate')+' '+$t('fTime')

  if($t('fDate')>'' && $t('fTime')>'' && $t('3MSDate')>'' && $t('3MSTime')>'') {
    var d1=new Date($t('iDate').toLowerCase().replace('am',' am').replace('pm',' pm'))
    var d2=new Date(dateFormat($t('3MSDate')+' '+$t('3MSTime').toLowerCase().replace('am',' am').replace('pm',' pm')))
    var hr=1000*60*60
    var diff=((d2-d1)/hr).toFixed(1)
    $('Holding').value=diff
    $('DHolding').innerHTML=$t('Holding')+' hours'
  }
  else $('Holding').value=$('DHolding').innerHTML=''

  $('3MFormula').innerHTML=$('3MCalc').innerHTML=$('iEcoli3M').value=''
  var n=0; var t=0
  for(var i=1;i<=5;i++) if($t('3M'+i)>'') {n++; t+=$v('3M'+i)*1}
  if(n>0) {
    var j=0
    for(var i=1;i<=5;i++) if($t('3M'+i).toUpperCase().indexOf('T')>-1 || $t('3M'+i).toUpperCase().indexOf('N')>-1 || $t('3M'+i).toUpperCase().indexOf('C')>-1) {
      j++
      if($('3M'+i)!=document.activeElement) $('3M'+i).value='TNTC'
      $('3MCalc').innerHTML='TNTC<br><span style="font-size:8pt;font-weight:normal">(too numerous to count)</span>'
      $('iEcoli3M').value=15000
    }
    if(j==0) {
      $('3MFormula').innerHTML='( '+t+' / '+n+' ) x 100 ='
      var v=(t/n*100).toFixed(0)
      if(isNumber(v)) $('3MCalc').innerHTML=$('iEcoli3M').value=v
      else {
        $('3MCalc').innerHTML='Error'
        $('iEcoli3M').value=''
      }
    }
  }
  update3MTime()

  var iP=$t('iParticipants')
  var iM=$t('Sampling')
  var iT=$t('Traveling')

  if(iP>'' && iM>'') {
    var vt=$('iMinutes').value=iM*iP+iT*1
    $('DVolunteerHours').innerHTML='Total volunteer time for this event: '+vt.toFixed(0)+' minutes ('+(vt/60).toFixed(2)+' hours)'
    $('iMinutes').value=vt/iP
  }
  else $('DVolunteerHours').innerHTML=''

  var tot=0

  var s=$('DSensitive').getElementsByTagName('SELECT')
  var n=0
  for(var i=0;i<s.length;i++) if(selValue(s[i].id)>'') n++
  $('T3').innerHTML='<u>&nbsp;'+n+'&nbsp;</u> # of taxa times 3 = <u>&nbsp;'+(n*3)+'&nbsp;</u>'
  tot+=n*3

  var s=$('DSomewhat').getElementsByTagName('SELECT')
  var n=0
  for(var i=0;i<s.length;i++) if(selValue(s[i].id)>'') n++
  $('T2').innerHTML='<u>&nbsp;'+n+'&nbsp;</u> # of taxa times 2 = <u>&nbsp;'+(n*2)+'&nbsp;</u>'
  tot+=n*2

  var s=$('DTolerant').getElementsByTagName('SELECT')
  var n=0
  for(var i=0;i<s.length;i++) if(selValue(s[i].id)>'') n++
  $('T1').innerHTML='<u>&nbsp;'+n+'&nbsp;</u> # of taxa times 1 = <u>&nbsp;'+(n*1)+'&nbsp;</u>'
  tot+=n*1

  var r=document.getElementsByName('Rating')
  if     (tot>22)  {r[0].checked=true; $('WQR').innerHTML='&nbsp;Excellent&nbsp;'}
  else if(tot>=17) {r[1].checked=true; $('WQR').innerHTML='&nbsp;Good&nbsp;'}
  else if(tot>=11) {r[2].checked=true; $('WQR').innerHTML='&nbsp;Fair&nbsp;'}
  else             {r[3].checked=true; $('WQR').innerHTML='&nbsp;Poor&nbsp;'}

  $('WQI').innerHTML=$('WQI0').innerHTML=tot
  if(tot>0) $('iWQi').value=tot

  for(var i in chemEquals) {
    $('CE'+chemEquals[i]).innerHTML=isNumber($t('i'+chemEquals[i]))?($t('i'+chemEquals[i])*1).toFixed(2):''
  }
  for(var i in chemAvg) {
    avg(chemAvg[i]);
  }

  var rb=document.getElementsByTagName('INPUT')
  var s=[]
  for(var i=0;i<rb.length;i++){
    s.push(rb[i].id+': '+rb[i].tagName+': '+rb[i].type)
    if(rb[i].type=='radio' || rb[i].type=='checkbox') {
      try{
        if(rb[i].checked) {
          rb[i].parentNode.style.background='#afa'
          rb[i].parentNode.style.border='1px solid #aaa'
          rb[i].parentNode.style.padding='0em'
          rb[i].parentNode.style.borderRadius='5px'
          rb[i].parentNode.style.padding='1px'
        }
        else {
          rb[i].parentNode.style.background=''
          rb[i].parentNode.style.border='1px solid white'
          rb[i].parentNode.style.padding='0em'
        }
      }catch(ee){}
    }

  }


} //update
//________________________________________________________________________________________________________________________________________________________________
function set(obj,val){
  var rb=document.getElementsByName(obj)
  if(rb.length>0 && rb[0].type=='radio') {
    for(var i=0;i<rb.length;i++) if(rb[i].value.trim()==val) rb[i].click()
  }
  else {
  }
  update()
}
//________________________________________________________________________________________________________________________________________________________________
function Submit(){
  function doSave(){
    if(!$t('iHistory')) $('iHistory').value=Username+'~'+dateFormat('mm/dd/yyyy hh:MM')+'~;'

    saveForm()
    ASQL('delete * from Parts where event_id='+tevent,
         function(){
           try{
             calcDOSat()

             if(sContacts.U>'') {
               var sq='insert into Parts (Event_ID,Other) values('+tevent+',"'+sContacts.U+'")'
               ASQL(sq)
             }

             for(var i in sContacts.List){
               var sq='insert into Parts (Event_ID,Contact_ID) values('+tevent+','+sContacts.List[i]+')'
               ASQL(sq)
             }

             var site='S-'+SiteID+' '+$t('ISites').split('(')[0].trim()

             var errs=''
             if(chemw.length) errs+='Chemical  warnings:<ul><li>'+chemw.join('<li>')+'</ul>'
             if(bacw.length)  errs+='Bacterial warnings:<ul><li>'+bacw.join('<li>')+'</ul>'
             if(macw.length)  errs+='Macro warnings:<ul><li>'+macw.join('<li>')+'</ul>'

             var comments=''
             if($t('Site')>'')      comments+='<p><b>Site comments:</b> '+$t('Site')+'</p>'
             if($t('Chemical')>'')  comments+='<p><b>Chemical comments:</b> '+$t('Chemical')+'</p>'
             if($t('Bacterial')>'') comments+='<p><b>Bacterial comments:</b> '+$t('Bacterial')+'</p>'
             if($t('Macro')>'')     comments+='<p><b>Macro comments:</b> '+$t('Macro')+'</p>'

             if($('cEmail').checked) {
               email({from:'Adopt-A-Stream <aas@gaepd.org>',
                      to:emailAddress,
                      cc:comments.length?groupLeaderEmails+','+siteCoordinatorEmails+',AAS@gaepd.org':groupLeaderEmails+','+siteCoordinatorEmails,
                      bcc: 'AAS@gaepd.org',
                      subject:'Adopt-A-Stream Data Submission: '+site,
                      message:'<html>'+$('DEmail').innerHTML.replace(/SITE/g,site).replace(/SID/g,SiteID).replace(/EVENT/g,tevent).replace(/ERROR/g,errs).replace(/COMMENTS/g,comments)+'</html>'
                     })
             }
             else if(GroupID!=458) {
               email({from:'Adopt-A-Stream <aas@gaepd.org>',
                      to:comments.length?groupLeaderEmails+','+siteCoordinatorEmails+',AAS@gaepd.org':groupLeaderEmails+','+siteCoordinatorEmails,
                      bcc: 'AAS@gaepd.org',
                      subject:'Adopt-A-Stream Data Submission: '+site,
                      message:'<html>'+$('DNoEmail').innerHTML.replace(/SITE/g,site).replace(/SID/g,SiteID).replace(/EVENT/g,tevent).replace(/ERROR/g,errs).replace(/NAME/g,Username).replace(/COMMENTS/g,comments)+'</html>'
                     })
             }

             setEditing(false)
             if($('cEmail').checked) doAlert('Successfully submitted.<p>You and this site\'s Local Coordinators<br>will get a notification by email.</p>')
             else if(GroupID==458)   doAlert('Successfully submitted.')
             else                    doAlert('Successfully submitted.<p>Your this site\'s Local Coordinators<br>will get a notification by email.</p>')
           }catch(ee){
             email({from:'Adopt-A-Stream <aas@gaepd.org>',
                    to:'AAS@gaepd.org',
                    subject:ee.message+': Adopt-A-Stream Data Submission: '+site+': '+groupLeaderEmails+','+siteCoordinatorEmails,
                    message:'<html>'+$('DEmail').innerHTML.replace(/SITE/g,site).replace(/SID/g,SiteID).replace(/EVENT/g,tevent).replace(/ERROR/g,errs)+'</html>'
                   })
           }
         }
        )
  } //doSave

  function okSave(){
    if(tevent) doSave()
    else {
      ASQL('insert into events (Event_ID,Site) select top 1 (select max(Event_ID)+1 from events),'+SiteID+' from events',
           function(x){
             ASQL('select max(Event_ID) from events where site='+SiteID,
                  function(x){
                    tevent=$('iEvent_ID').value=x.responseText.split('^^')[0]
                    doSave()
                  }
                 )
           }
          )
    }
  } //okSave

  Validate()
  if(req.length) {
    doAlert('Please enter <b>Required Data</b><br>listed above the Submit button.','OK')
    if(dRequired=='none') $('DRequired').style.display=dRequired='block'
  }
  else if(err.length) doAlert('Please correct the <b>Errors</b><br>listed above the Submit button.','OK')
  else if(!wbac.length && !wmac.length && !wchem.length) okSave()
  else doAlert('There are warnings for this submission.<p>Submit anyway?</p>','',
               function(x){
                 if(x=='OK') okSave()
               }
              )

} //Submit

function doEdit() {
  if(AASStaff) {
    $('ISites').sq='select WaterbodyName&" ("&Monitoring_Site_ID&")" from Sites where " "&WaterbodyName like "% #inp#%" or Monitoring_Site_ID like "#inp#%" order by WaterbodyName'
    Show('Outer'); setEditing(true);
  }
  else {
    $('ISites').sq='select WaterbodyName&" ("&Monitoring_Site_ID&")" from Sites where group_id in (select group_id from cg where contact_ID='+User+') and (" "&WaterbodyName like "% #inp#%" or Monitoring_Site_ID like "#inp#%") order by WaterbodyName'
    Show('Outer'); setEditing(true);
  }

  var lastTerm, results= [];

  function doMatch(term, responseFn) {
    if(results.length && results[0].toUpperCase().indexOf(term.toUpperCase().substr(0,2))>-1) {
      var re = jq.ui.autocomplete.escapeRegex(term);
      var matcher = new RegExp( "\\b" + re, "i" );
      var a = jq.grep(results, function(item,index) {
        return matcher.test(item);
      });
      responseFn(a);
    }
    else {
      setTimeout(function(){doMatch(term, responseFn)},1000);
    }
  } //doMatch

  jq('#CContacts')
    .autocomplete({
      source: function(req, responseFn) {
        if(req.term.length===2) {
          PQ('ContactNames',
             {TERM: req.term},
             function(x) {
               results= x.split('^^'); results.pop();
               responseFn(results);
               lastTerm= req.term;
             }
            );
        }
        else {
          doMatch(req.term, responseFn);
        }
      },
      minLength: 2,
      delay: 0,
      select: function(_,result) {
        jq(this).val(result.item.value);
        CUpdate();
        setTimeout(function() {
          jq('#CContacts').val('');
        },100);
      },
      autoFocus: true
    })
    .blur(function() {
      this.value= '';
    });
} //doEdit

function setEditing(b){
  function okEdit(){
    $('iDataEntry').value=User

    var t=$t('ISites')

    if(AASStaff) var sq='select WaterbodyName&" ("&Monitoring_Site_ID&")" from Sites where WaterbodyName order by WaterbodyName';
    else         var sq='select WaterbodyName&" ("&Monitoring_Site_ID&")" from Sites where WaterbodyName and group_id in (select group_id from cg where contact_ID='+User+') order by WaterbodyName';

    ASQL(sq,
         function(x) {
           var r= x.responseText.split('^^'); r.pop();
           if(r.length===0) {
             doAlert('You cannot submit events unless you are a member of a Group that has Sites.<p>Redirecting to the Group/Site registration page.',
                     'OK',
                     function() {
                       document.location= 'NewSite.html';
                     }
                    );
           }
           else {
             jq('#ISites')
               .focus()
               .autocomplete({
                 zsource: '/scripts/AG.asp?db=aas&sql='+sq+'&autocomplete=1&space=1',
                 source: function(req, responseFn) {
                   var re = jq.ui.autocomplete.escapeRegex(req.term);
                   var matcher = new RegExp( "\\b" + re, "i" );
                   var a = jq.grep(r, function(item,index) {
                     return matcher.test(item);
                   });
                   responseFn( a );
                 },
                 minLength: 1,
                 delay: 0,
                 select: Search,
                 change: Search,
                 autoFocus: true
               });
            }
          }
        );

    Hide('BEdit')
    $('ISites').focus(); $('ISites').select()
    var o=document.getElementsByTagName('INPUT')
    for(var i=0;i<o.length;i++) {
      if(o[i].type=='checkbox' || o[i].type=='radio') o[i].style.display='inline'
      if(o[i].type=='text') o[i].style.background='lightyellow'
      o[i].style.fontWeight='normal'
    }
    var o=document.getElementsByTagName('TEXTAREA')
    for(var i=0;i<o.length;i++) {
      o[i].style.background='lightyellow'
      o[i].style.fontWeight='normal'
    }

    setInterval(update,100)
  } //okEdit

  editing=b

  if(tevent && !editing) {
    Show('DCreateNew')
    $('DCreateButton').innerHTML='Create new submission'
  }
  else {
    Hide('DCreateNew')
    $('DCreateButton').innerHTML='Clear form'
  }
  
  if(User && editing) {
    if(tevent && !AASStaff) {
      ASQL('select Monitoring_Site_ID from (select * from CG where contact_id='+User+') as a left join sites as b on a.group_id=b.group_id',
           function(x){
             var r=x.responseText.split('^^')
             var found=false
             for(var i in r) if(r[i]==SiteID) found=true
             if(!found) {
               setEditing(false)
               doAlert('Only group members can edit this form.','OK')
             }
             else okEdit()
           }
          )
    }
    else okEdit()
  }
  else {
    if(User && tevent && !AASStaff) {
      ASQL('select Monitoring_Site_ID from (select * from CG where contact_id='+User+') as a left join sites as b on a.group_id=b.group_id',
           function(x){
             var r=x.responseText.split('^^')
             for(var i in r) if(r[i]==SiteID) Show('BEdit')
           }
          )
    }
    else Show('BEdit')

    var o=document.getElementsByTagName('INPUT')
    for(var i=0;i<o.length;i++) {
      if(o[i].type=='checkbox' || o[i].type=='radio') {
        if(o[i].id=='sub1' || o[i].id=='sub2' || o[i].id=='sub3' || o[i].id=='sub4' || o[i].id=='sub5') continue
        o[i].style.display='none'
      }
      o[i].style.background='white'
      o[i].style.fontWeight='bold'
    }
    var o=document.getElementsByTagName('TEXTAREA')
    for(var i=0;i<o.length;i++) {
      o[i].style.background='white'
      o[i].style.fontWeight='bold'
    }
  }

  var inp=$('TB').getElementsByTagName('INPUT')
  for(var i in inp) {
    inp[i].readOnly=!editing
    if(inp[i].id!='ISites'){
      inp[i].onblur=function(){
        clearTimeout(toValidate)
        toValidate=setTimeout(Validate,500)
      }
    }
  }

  var inp=$('TB').getElementsByTagName('TEXTAREA')
  for(var i in inp) inp[i].readOnly=!editing

  var inp=$('TB').getElementsByTagName('SELECT')
  for(var i in inp) {
    inp[i].disabled=!editing
    inp[i].onblur=function(){
      clearTimeout(toValidate)
      toValidate=setTimeout(Validate,500)
    }
  }

  Validate()
} //setEditing

function fillcheck(id,opts){
  opts=opts.split('|')
  var s=[]
  for(var i=0;i<opts.length;i++){
    if(opts[i]=='') s.push('<br>')
    else {
      var t=opts[i].split('^')
      s.push('<label for="'+(id+i)+'" style="white-space:nowrap;margin-right:2.5em"><input type="checkbox" id="'+(id+i)+'" value="'+t[1]+'" class="cHabitat"><span>'+t[0]+'</span></label>')
    }
  }
  $(id).innerHTML=s.join('')
} //fillcheck

function fillRCD(id,opts){
  opts=opts.split('|')
  var s=[]
  for(var i=0;i<opts.length;i++){
    var t=opts[i].split('^')
    var zid='iN'+t[0].
            replace('Riffle Beetle Larvae/Adults','riffle beetle').
            replace('Dobsonfly/Hellgrammites &amp; Fishfly','dobsonfly hellgrammites and fishfly').
            replace('Dragonfly &amp; Damselfly Nymphs','dragonfly and damselfly nymphs').
            replace('Crane Flies','crane flies larvae').
            replace('Clams &amp; Mussels','clams and mussels').
            replace('Black Fly Larvae','blackfly larvae').
            replace('Leeches','leech').
            toLowerCase().replace(/ /g,'.')
    s.push('<select id="'+zid+'" style="background:#def"><option><option value="R">R<option value="C">C<option value="D">D</select><span>'+t[0]+'</span><br>')
  }
  $(id).innerHTML=s.join('')
} //fillRCD

function doCheck(val){
  var cb=document.getElementsByTagName('INPUT')
  for(var i in cb) if(!cb[i].checked && cb[i].value==val) cb[i].click()
} //doCheck

function isChemical(){
  var ok=false
  for(var i in chemAvg)    if($t('i'+chemAvg[i])>'')    ok=true
  for(var i in chemEquals) if($t('i'+chemEquals[i])>'') ok=true
  if($t('iAlkalinity')+$t('iAmmonia')+$t('iNitrate.Nitrogen')+$t('iOrthophosphate')+$t('iDepth')+$t('iSettleable.Solids')+$t('iTurbidity')>'') ok=true
  if(ok){
    $('iChemical').checked=true
    return true
  }
  else {
    $('iChemical').checked=false
    return false
  }
} //isChemical

function isBacterial() {
  if($t('iEcoliIDEXX')+$t('iEcoliUnknown')+$t('iFecal.Coliform')>'') $('iBacterial').checked=true

  if($t('3MB')+$t('3M1')+$t('3M2')+$t('3M3')+$t('3M4')+$t('3M5')+$t('iEcoli3M')+$t('Holding')+$t('3MSDate')+$t('3MSTime')+$t('3MEDate')+$t('3METime')+$t('3MSTemp')+$t('3METemp')>''){
//    alert('ok')
    $('iBacterial').checked=true
    return true
  }
  else {
    $('iBacterial').checked=false
    return false
  }

} //isBacterial

function isMacro(){
  if($('WQI').innerHTML>0){
    $('iBiological').checked=true
    return true
  }
  else {
    $('iBiological').checked=false
    return false
  }
} //isMacro

//________________________________________________________________________________________________________________________________________________________________

function input3M(evt) {
  evt = evt || window.event
  var kc=(typeof evt.which == "undefined") ? evt.keyCode : evt.which
  if(kc==0 || kc==8) return true //GD Firefox triggers keypress on the TAB and Backspace keys!!!
  var key = String.fromCharCode(kc)
  return (key>='0' && key<='9') || key.toUpperCase()=='T' || key.toUpperCase()=='N' || key.toUpperCase()=='C'
} //input3M

function updateRain(){$('iRainHours').value=$t('RainTime')*($('RT1').checked?1:24)}

function tryEdit(){
  if(User) {
    doAlert('<div style="padding:0.5em;color:red;font-weight:bold;background:white;border:1px solid black">IMPORTANT!<br>Do <i>not</i> edit this form if you want to create a <i>new</i> submission.</div><p>Reason for editing (required):</p><input id="EReason" style="width:33em">','OK|Cancel',
            function(response){
              if(response=='OK'){
                reason=$t('EReason')
                if(reason) {
                  $('iHistory').value=$t('iHistory')+Username+'~'+dateFormat('mm/dd/yyyy hh:MM')+'~'+reason+';'
                  doEdit()
                }
                else return true
              }
            },
            'EReason'
           )
  }
  else document.location=document.location+'&Edit=1'
} //tryEdit

function Init(){
  function row(desc,parm,units,avg){
    var pt=parm.trim().replace(/ /g,'.')
    if(avg) {
      chemAvg.push(pt)
      s.push('<tr id="D'+pt+'">'+
             '  <td>'+desc.trim()+
             '  <td><input id="'+pt+'1" class="cMisc" style="width:3em">'+
             '  <td><input id="'+pt+'2" class="cMisc" style="width:3em">'+
             '  <td>'+units.trim()+
             '  <th style="background:#eee"><input id="i'+pt+'" disabled=true style="width:100%;text-align:center;color:darkgreen;border:none;background:none !important;">'
            )
    }
    else {
      chemEquals.push(pt)
      s.push('<tr id="D'+pt+'">'+
             '  <td>'+desc.trim()+
             '  <td><input id="i'+pt+'" style="width:3em">'+
             '  <td style="background:#eee">&nbsp;'+
             '  <td>'+units.trim()+
             '  <td style="text-align:center;background:#eee;color:darkgreen"><div id="CE'+pt+'">dd</div>'
            )
    }
  } //row

  QueryStrings()
  var s=[]
  s.push('<table id="ChemTable" cellpadding=0 cellspacing=0 style="width:100%;font-size:9pt;table-layout:fixed">')
  s.push(' <col style="width:30%"><col style="width:16%"><col style="width:16%"><col style="width:18%"><col style="width:20%">')
  s.push(' <tr style="background:#ddd"><th>Core Tests  <th>Test 1 <th>Test 2 <th>Units <th>Average')
  row('Air Temp                  ','AirTemp              ','&deg;C       ',false)
  row('Water Temp                ','WaterTemp            ','&deg;C       ',false)
  row('pH<br>(+/-0.25)           ','pH                   ','Standard unit',true)
  row('Dissolved Oxygen (+/-0.6) ','Dissolved Oxygen     ','mg/L (ppm)   ',true)
  row('Conductivity              ','Conductivity         ','&micro;S/cm  ',false)
  row('Salinity<br>(+/-1)        ','Salinity             ','ppt          ',true)
  row('Secchi Disk<br>(+/-10)    ','Secchi Disk          ','cm           ',true)
  row('Chlorophyll a             ','ChlorophyllA         ','&micro;g/L   ',false)
  s.push('</table>')
  $('DChemTable1').innerHTML=s.join('')

  for(var i in chemAvg)    $(chemAvg[i]+'1').onkeypress=$(chemAvg[i]+'2').onkeypress=inputRealPositive
  for(var i in chemEquals) $('i'+chemEquals[i]).onkeypress=inputRealPositive

  $('iAirTemp').onkeypress=$('iWaterTemp').onkeypress=inputReal

  $('iConductivity').onkeypress=
  $('iAlkalinity').onkeypress=
  $('iAmmonia').onkeypress=
  $('iNitrate.Nitrogen').onkeypress=
  $('iOrthophosphate').onkeypress=
  $('iDepth').onkeypress=
  $('iSettleable.Solids').onkeypress=
  $('iTurbidity').onkeypress=
  $('iEcoliIDEXX').onkeypress=
    inputRealPositive

  $('iSettleable.Solids').onkeypress=
    inputRealTrace

  reason=''

  fillcheck('DHabitats','Leaf Packs/Woody Debris^leaf pack|Vegetated Bank Margin^vegetated|Riffle^riffle||Streambed with silty area (v. fine particles)^silt|Streambed with Sand or small gravel^sand')

  fillRCD('DSensitive','Stonefly Nymphs|Mayfly Nymphs|Water Penny Larvae|Riffle Beetle Larvae/Adults|Aquatic Snipe Flies|Caddisflies|Gilled Snails')
  fillRCD('DSomewhat' ,'Common Net Spinning Caddisflies|Dobsonfly/Hellgrammites &amp; Fishfly|Dragonfly &amp; Damselfly Nymphs|Crayfish|Crane Flies|Aquatic Sow Bugs|Scud|Clams &amp; Mussels')
  fillRCD('DTolerant' ,'Midge Fly Larvae|Black Fly Larvae|Lunged Snails|Aquatic Worms|Leeches')

  $('iParticipants').onkeypress=  $('RainTime').onkeypress=
  $('Sampling').onkeypress=  $('Traveling').onkeypress=
  $('3MB').onkeypress=inputWhole

  $('3M1').onkeypress=$('3M2').onkeypress=$('3M3').onkeypress=$('3M4').onkeypress=$('3M5').onkeypress=input3M

  $('3MSTemp').onkeypress=
  $('3METemp').onkeypress=
  $('AreaSampled').onkeypress=
  inputReal

  $('fDate').onkeypress=$('3MSDate').onkeypress=$('3MEDate').onkeypress=inputDate
  $('fTime').onkeypress=$('3MSTime').onkeypress=$('3METime').onkeypress=inputTime

  $('RainTime').onchange=updateRain

  getCoordinators()

  if(tevent=='') doEdit()
  else           loadEvent(tevent)

  if(!User) update()
  else {
    SQLFieldNames=true
    ASQL('select max([Date]) as [Date],Cert from (                                                                                                                                                                                                               '+
         ' select iif(certification_type like "%Chemical%","Chemical",iif(certification_type like "%Macroinvertebrate%","Macroinvertebrate",iif(certification_type like "%Bacterial%","Bacterial",""))) as cert,certification_date as [Date] from certs                 '+
         ' where contact_id='+User+
         ') where Cert>"" group by cert                                                                                                                                                                                                                          ',
         function(x){
           var day=1000*60*60*24
           var r=x.responseText.split('^^'); r.shift(); r.pop()
           var cur=[]
           var exp=[]
           var ok=[]

           for(var i in r){
             var rec=r[i].split('|')

             if(dateFormat(rec[$Date],"yyyymmdd")>dateFormat(new Date()-day*365,"yyyymmdd")) {
               cur.push(rec[$Cert]+' <span style="font-size:8pt">(expires '+dateFormat(new Date(rec[$Date])*1+day*365,"mmm d, yyyy")+')</span>')
               if(rec[$Cert]=='Chemical')          Chem=true
               if(rec[$Cert]=='Macroinvertebrate') Macr=true
               if(rec[$Cert]=='Bacterial')         Bact=true
             }
             else {
               exp.push(rec[$Cert])
               if(dateFormat(rec[$Date],"yyyymmdd")>dateFormat(new Date()-day*365*1.25,"yyyymmdd")) {
                 if(rec[$Cert]=='Chemical')          {Chem=true; ok.push('You may continue submitting chemical          data until '+(dateFormat(new Date(rec[$Date])*1+day*365*1.25,"mmm d, yyyy"))+'.')}
                 if(rec[$Cert]=='Macroinvertebrate') {Macr=true; ok.push('You may continue submitting macroinvertebrate data until '+(dateFormat(new Date(rec[$Date])*1+day*365*1.25,"mmm d, yyyy"))+'.')}
                 if(rec[$Cert]=='Bacterial')         {Bact=true; ok.push('You may continue submitting bacterial         data until '+(dateFormat(new Date(rec[$Date])*1+day*365*1.25,"mmm d, yyyy"))+'.')}
               }
             }
           }

           if(AASStaff) {
             Chem=Bact=Macr=true
             ok=[]
           }

           var s=[]
           if(AASStaff) s.push('<a href="ErrorsWarnings.xlsx?2" style="float:right;font-weight:bold">Errors and Warnings list</a>')
           s.push('<p><a target="new" href="calendar.html" style="font-weight:bold">Trainings calendar <zimg src="images/ExternalLink.png" style="width:20px"></a></p>')
           if(cur.length) s.push('<div>Current certifications: '+cur.join(', ')+'</div>')
           if(exp.length) s.push('<div>Expired certifications: '+exp.join(', ')+'</div>')
           if(ok.length)  s.push(ok.join('<br>'))
           $('DCerts').innerHTML=s.join('')

           update()

         }
        )
  }
} //Init

function calcDOSat(){
  ASQL('update (                                                                                                                   '+
       ' select *,corppm/sat*100 as DOS from (                                                                                     '+
       '  select DOSat,760 as sealevel,8300 as refalt,sealevel*exp(-[Altitude]/refalt) as alttohg,                                 '+
       '  517 as x0,775 as x1,0.68 as y0,1.02 as y1,(y1-y0)/(x1-x0) as m,y0+m*(alttohg-x0) as corfact,                             '+
       '  corfact*[Dissolved Oxygen] as corppm,                                                                                    '+
       '  14.652 as a1,-0.41022 as a2,0.007991 as a3,-0.000077774 as a4,a1+[WaterTemp]*(a2+[WaterTemp]*(a3+[WaterTemp]*a4)) as sat '+
       '  from qevents where Altitude is not null and [Dissolved Oxygen] is not null and [WaterTemp] is not null                   '+
       ' )                                                                                                                         '+
       ') set DOSat=round(DOS,2)                                                                                                   '+
       'where DOSat is null                                                                                                        '
      )
} //calcDOSat

//window.onscroll=function(){
//  var top = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop
//  if(top<135) $('DHelp').style.position='static'
//  else        $('DHelp').style.position='fixed'
//} //onscroll

var chemEquals=[]
var chemAvg=[]
var toValidate=false
var dRequired=dErrors=dBac=dMac=dChem='none'
var Names=[]
var Chem=Macr=Bact=false
var certChem=certMacr=certBact=false
var hb
var SiteID=0
var sto
var editing=false

