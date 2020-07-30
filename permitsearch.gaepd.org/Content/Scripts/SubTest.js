function clearAll() {
  clearForm();
  $('ISites').value= '';
  $('fDate').value= '';
  $('fTime').value= '';
  $('RainTime').value= '';
  sContacts={List:[],U:''};
  CUpdate();
  Validate();
} //clearAll

function test(t,good){
  function cdo(test,fld){
    test=test.trim()
    if(good) {
      if(test=='Secchi Disk Depth') {var r1=50; var r2=50.05}
      else {
        var r1=(Math.random()*100+20).toFixed(0)
        var r2=(r1*1.05).toFixed(0)
      }
      $('I'+fld+'1').value=r1; $('I'+fld+'2').value=r2
    }
    else {
      if(test=='Secchi Disk Depth') {var r1=50; var r2=50.2}
      else {
        var r1=(Math.random()*100+10).toFixed(0)
        var r2=(r1*1.2).toFixed(0)
      }
      $('I'+fld+'1').value=r1; $('I'+fld+'2').value=r2
    }
  } //cdo

  var p=t.parentNode.parentNode.childNodes[0].innerHTML.trim()

  if(p=='All Site'){
    $('ZA').onclick()
    $('ZB').onclick()
    $('ZC').onclick()
    $('ZD').onclick()
    $('ZE').onclick()
    $('ZF').onclick()
    $('ZG').onclick()
    $('iParticipants').value= 15;
    return
  }
  else if(p=='All Chemical'){
    $('BChemical').click()
    $('ZH').onclick()
    $('ZI').onclick()
    $('ZJ').onclick()
    return
  }
  else if(p=='All Macro'){
    $('BMacro').click()
    $('ZK').onclick()
    $('ZL').onclick()
    return
  }
  else if(p=='All Bacterial'){
    $('BBacterial').click()
    $('ZM').onclick()
    $('ZN').onclick()
    return
  }
  else if(p=='Site'){
    $('ISites').value='Test Site (0)'
    Search(0)
  }
  else if(p=='Event date'){
    if(good) $('fDate').value='12/15/2013'
    else     $('fDate').value='11/32/2012'
  }
  else if(p=='Event time'){
    if(good) $('fTime').value="12:12p"
    else     $('fTime').value="12:12"
  }
  else if(p=='Time spent'){
    if(good) {
      $('Sampling').value = 300;
      $('Traveling').value = 100;
      $('iDistance').value = 60;
    }
    else {
      $('Sampling').value=''
    }
  }
  else if(p=='Observations'){
    if(good){
      $('flow1').click()
      $('flow6').click()
      $('clarity2').click()
      $('RainTime').value=15
      $('RT2').click()
    }
  }
  else if(p=='S Participants'){
    if(good){
      sContacts={List:[],U:'Ogee the dog'}
      $('iParticipants').value= 15;
      SQLFieldNames=true
      ASQL('select top 5 * from Contacts where LastName>"S"',
           function(x){
             var r=x.responseText.split('^^'); r.shift(); r.pop()
             for(var i in r){
               var rec=r[i].split('|')
               Names[rec[$ContactID]]=rec[$FirstName]+' '+rec[$LastName]+' '+rec[$SeniorityTitle]
               sContacts.List.push(rec[$ContactID])
             }
             CUpdate()
             Validate()
           }
          )
    }
    else {
      sContacts={List:[],U:'Ogee the dog'}
      CUpdate()
      Validate()
    }
  }
  else if(p=='C Participants'){
    if(good){
      sContacts={List:[],U:'Ogee the dog2'}

      SQLFieldNames=true
      ASQL('select top 5 * from Contacts where LastName>"C" union all select * from Contacts where Contact_ID=30357',
           function(x){
             var r=x.responseText.split('^^'); r.shift(); r.pop()
             for(var i in r){
               var rec=r[i].split('|')
               Names[rec[$ContactID]]=rec[$FirstName]+' '+rec[$LastName]+' '+rec[$SeniorityTitle]
               sContacts.List.push(rec[$ContactID])
             }
             CUpdate()
             Validate()
           }
          )
    }
    else {
      sContacts={List:[],U:'Ogee the dog2'}
      CUpdate()
      Validate()
    }
  }
  else if(p=='M Participants'){
    if(good){
      sContacts={List:[],U:'Ogee the dog'}

      SQLFieldNames=true
      ASQL('select top 5 * from Contacts where LastName>"M" union all select * from Contacts where Contact_ID=30351',
           function(x){
             var r=x.responseText.split('^^'); r.shift(); r.pop()
             for(var i in r){
               var rec=r[i].split('|')
               Names[rec[$ContactID]]=rec[$FirstName]+' '+rec[$LastName]+' '+rec[$SeniorityTitle]
               sContacts.List.push(rec[$ContactID])
             }
             CUpdate()
             Validate()
           }
          )
    }
    else {
      sContacts={List:[],U:'Ogee the dog'}
      CUpdate()
      Validate()
    }
  }
  else if(p=='B Participants'){
    if(good){
      sContacts={List:[],U:'Ogee the dog3'}

      SQLFieldNames=true
      ASQL('select top 5 * from Contacts where LastName>"B" union all select * from Contacts where Contact_ID=30357',
           function(x){
             var r=x.responseText.split('^^'); r.shift(); r.pop()
             for(var i in r){
               var rec=r[i].split('|')
               Names[rec[$ContactID]]=rec[$FirstName]+' '+rec[$LastName]+' '+rec[$SeniorityTitle]
               sContacts.List.push(rec[$ContactID])
             }
             CUpdate()
             Validate()
           }
          )
    }
    else {
      sContacts={List:[],U:'Ogee the dog3'}
      CUpdate()
      Validate()
    }
  }
  else if(p=='Core tests') {

    if(good) {
      $('iWaterTemp').value=25
      $('iAirTemp').value=15
    }
    else if(t.innerHTML=='range') {
      $('iWaterTemp').value=50
      $('iAirTemp').value=-5
    }

    if(good) {$('pH1').value=5.5; $('pH2').value=5.6}
    else {
      if     (t.innerHTML=='diff')  {$('pH1').value=5.5; $('pH2').value=5.8}
      else if(t.innerHTML=='range') {$('pH1').value=-1; $('pH2').value=15}
    }

    if(good) {$('Dissolved.Oxygen1').value=5; $('Dissolved.Oxygen2').value=5.5}
    else {
      if     (t.innerHTML=='diff')  {$('Dissolved.Oxygen1').value=5.5; $('Dissolved.Oxygen2').value=6.4}
      else if(t.innerHTML=='range') {$('Dissolved.Oxygen1').value=-1; $('Dissolved.Oxygen2').value=15}
    }

    if(good) $('iConductivity').value=70
    else {
      if(t.innerHTML=='range') $('iConductivity').value=-1
    }

    if(good)                      {$('Salinity1').value=5; $('Salinity2').value=6}
    else if(t.innerHTML=='range') {$('Salinity1').value=301; $('Salinity2').value=299}
    else                          {$('Salinity1').value=5; $('Salinity2').value=8}

    if(good) {$('Secchi.Disk1').value=5; $('Secchi.Disk2').value=5.1}
    else     {$('Secchi.Disk1').value=5; $('Secchi.Disk2').value=18}
  }
  else if(p=='Other tests') {
    $('iAlkalinity').value        =(Math.random()*100+20).toFixed(0)
    $('iAmmonia').value           =(Math.random()*100+20).toFixed(0)
    $('iNitrate.Nitrogen').value  =(Math.random()*100+20).toFixed(0)
    $('iOrthophosphate').value    =(Math.random()*100+20).toFixed(0)
    $('iDepth').value             =(Math.random()*100+20).toFixed(0)
    $('iSettleable.Solids').value =(Math.random()*100+20).toFixed(0)
    $('iTurbidity').value         =(Math.random()*100+20).toFixed(0)
  }
  else if(p=='E coli') {
    if(good) {
      $('3MSDate').value='12/12/2011'
      $('3MSTime').value='10:42a'
      $('3MEDate').value='12/13/2011'
      $('3METime').value='10:42a'
      $('3MSTemp').value=34.2
      $('3METemp').value=35.3
      $('Holding').value=23

      $('3MB').value=0
      $('3M1').value=1
      $('3M2').value=4
      $('3M3').value=6
    }
    else {
      $('3MSDate').value='12/12/201'
      $('3MSTime').value='10:42'
      $('3MEDate').value='12/13/2011'
      $('3METime').value='10:432a'
      $('3MSTemp').value=37
      $('3METemp').value=36
      $('Holding').value=49

      $('3MB').value=1
      $('3M2').value=1
      $('3M3').value=4
      $('3M5').value=6
    }
  }
  else if(p=='Macro data'){
    $('otherFish').value=50
    $('otherClam').value=40
    $('otherSalamander').value=30
    $('otherTadpole').value=20
    $('otherCrayfish').value=10
    $('CrayfishSpecies').value='Procambarus clarkii'

    $('iNaquatic.snipe.flies').value=['','','','','R','C','D'][randBetween(0,6)]
    $('iNaquatic.sow.bugs').value=['','','','','R','C','D'][randBetween(0,6)]
    $('iNaquatic.worms').value=['','','','','R','C','D'][randBetween(0,6)]
    $('iNblackfly.larvae').value=['','','','','R','C','D'][randBetween(0,6)]
    $('iNcaddisflies').value=['','','','','R','C','D'][randBetween(0,6)]
    $('iNclams.and.mussels').value=['','','','','R','C','D'][randBetween(0,6)]
    $('iNcommon.net.spinning.caddisflies').value=['','','','','R','C','D'][randBetween(0,6)]
    $('iNcrane.flies.larvae').value=['','','','','R','C','D'][randBetween(0,6)]
    $('iNcrayfish').value=['','','','','R','C','D'][randBetween(0,6)]
    $('iNdobsonfly.hellgrammites.and.fishfly').value=['','','','','R','C','D'][randBetween(0,6)]
    $('iNdragonfly.and.damselfly.nymphs').value=['','','','','R','C','D'][randBetween(0,6)]
    $('iNgilled.snails').value=['','','','','R','C','D'][randBetween(0,6)]
    $('iNleech').value=['','','','','R','C','D'][randBetween(0,6)]
    $('iNlunged.snails').value=['','','','','R','C','D'][randBetween(0,6)]
    $('iNmayfly.nymphs').value=['','','','','R','C','D'][randBetween(0,6)]
    $('iNmidge.fly.larvae').value=['','','','','R','C','D'][randBetween(0,6)]
    $('iNriffle.beetle').value=['','','','','R','C','D'][randBetween(0,6)]
    $('iNscud').value=['','','','','R','C','D'][randBetween(0,6)]
    $('iNstonefly.nymphs').value=['','','','','R','C','D'][randBetween(0,6)]
    $('iNwater.penny.larvae').value=['','','','','R','C','D'][randBetween(0,6)]

    if(good){
      $('AreaSampled').value=4
      $('DMethod0').click()
    }
    else{
      $('AreaSampled').value=''
      $('DMethod0').checked=$('DMethod1').checked=false
    }
  }
  else if(p=='Comments') {
    $('Site').value='Site comment\rabcdefghijklmnopqrstuvwxyz1234567890~`!@#$%^&*()_-+=\':;<,>."\'?/'
    $('Chemical').value='Chemical comment\rabcdefghijklmnopqrstuvwxyz1234567890~`!@#$%^&*()_-+=\':;<,>."\'?/'
    $('Bacterial').value='Bacterial comment\rabcdefghijklmnopqrstuvwxyz1234567890~`!@#$%^&*()_-+=\':;<,>."\'?/'
    $('Macro').value='Macro comment\rabcdefghijklmnopqrstuvwxyz1234567890~`!@#$%^&*()_-+=\':;<,>."\'?/'
  }

  Validate()
} //test

function dtest(t,b) {
  setTimeout(function() {
               test(t,b);
             },
             10
            )
}
