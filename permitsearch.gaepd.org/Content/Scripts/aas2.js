var qs=[]
var rephone=/^.*([0-9][0-9][0-9]).*([0-9][0-9][0-9]).*([0-9][0-9][0-9][0-9])$/
var Role=['','Board Member','Coordinator','Leader','Participant','Leader','Participant']
var _mMapError=0
var WM

//------------------------------------------------------------------------------------------------------------------------
document.createNamedElement = function(type, name) {
  var element;
  try {
    element = document.createElement('<'+type+' name="'+name+'">');
  } catch (e) { }
  if (!element || !element.name) { // Not in IE, then
    element = document.createElement(type)
    element.name = name;
  }
  return element;
} //createNamedElement
//------------------------------------------------------------------------------------------------------------------------
function QueryStrings() {
  var q=document.location.search.substr(1).split('&')
  for(var i in q) {
    var s=q[i].split('=')
    qs[s[0]]=unescape(s[1])
  }
} //QueryStrings
//------------------------------------------------------------------------------------------------------------------------
function OpenContactID(ID,Name){top.location='http://www.georgiaadoptastream.com/db/People.html?'+'ID='+ID}
function OpenGroupID(ID,GroupName){return '<a style="white-space:nowrap" href="Groups.html?'+'GroupID='+ID+'">'+GroupName+'</a>'}
function OpenSiteID(ID,SiteName){return '<a href="Sites.html?'+'SiteID='+ID+'">'+SiteName+'</a>'}
function OpenCounty(County){
  County=County.replace(' County','')
  return '<a href="Views.html?County='+County+'">'+County+' County</a>'
}
function OpenWatershed(Watershed){
  Watershed=Watershed.replace(' watershed','')
  return '<a href="Views.html?Watershed='+Watershed+'">'+Watershed+' watershed</a>'
}
//------------------------------------------------------------------------------------------------------------------------
function cardinal(n) {
  var ns='zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen'.split('|')
  if     (n<20)  return ns[n]
  else if(n==20) return 'twenty'
  else if(n<30)  return 'twenty-'+ns[n-20]
  else if(n==30) return 'thirty'
  else if(n<40)  return 'thirty-'+ns[n-30]
  else if(n==40) return 'forty'
  else if(n<50)  return 'forty-'+ns[n-40]
  else if(n==50) return 'fifty'
  else if(n<60)  return 'fifty-'+ns[n-50]
  else if(n==60) return 'sixty'
  else if(n<70)  return 'sixty-'+ns[n-60]
  else if(n==70) return 'seventy'
  else if(n<80)  return 'seventy-'+ns[n-70]
  else if(n==80) return 'eighty'
  else if(n<90)  return 'eighty-'+ns[n-80]
  else if(n==90) return 'ninety'
  else if(n<100) return 'ninety-'+ns[n-90]
  else return n
} //cardinal

function fixlat(lat)  {
  if(lat[0]==='0') return '+'+lat.substr(1,2)+'.'+lat.substr(3);
  else return lat;
}

function fixlong(lng) {
  if(lng[0]==='0') return '-'+lng.substr(1,2)+'.'+lng.substr(3);
  else return lng;
}
//------------------------------------------------------------------------------------------------------------------------
function ExcelSite(site){

  if(site.toString().indexOf('=')>-1) {var cond=site; var All=true}
  else                                {var cond=site==-1?'Group_ID='+GroupID:'monitoring_site_id='+site; var All=false}

  var sq='select AirTemp,[WaterTemp],pH,[Dissolved Oxygen],[Alkalinity],[Nitrate Nitrogen],Ammonia,[Orthophosphate],[Settleable Solids],[ChlorophyllA],[Conductivity],Salinity,Turbidity,'+
       '[Fecal Coliform],EcoliIDEXX,Ecoli3M,[Secchi Disk],WQi,Lat,Lng,[8HUC]&" "&WShedName as Watershed,Group,Site,County,SiteCity,WaterPlan,* from (select q.*,Site_Lat/10000 as Lat,Site_Long/10000 as Lng from QEvents as q left join sites as s on q.monitoring_site_id=s.monitoring_site_id) where Date and '+cond+' order by Date'

//  $('TA').value=sq
  SQLFieldNames=true
  ASQL(sq,
       function(x){
         var s=[]
         var dt

         function getDetails(){
           if(AAS) {
             var rec=r[0].split('|')

             dt=$('HData').innerHTML.replace(/XNAMEX/g,'S'+rec[$MonitoringSiteID])
             if(!All) {
               dt=dt.replace(/xGroup/g,'<a href="http://www.georgiaadoptastream.org/db/Groups.html?GroupID='+rec[$GroupID]+'">G-'+rec[$Group]+'</a>')

               if(site==-1) {
                 dt=dt.replace(/xSite/g,'').replace(/xLoc/g,'').replace(/xWatershed/g,'').replace(/xLatLng/g,'');
               }
               else {
                 dt=dt.replace(/xSite/g,'<a href="http://www.georgiaadoptastream.org/db/Sites.html?SiteID='+rec[$MonitoringSiteID]+'">S-'+rec[$Site]+'</a>')

                 var loc=rec[$SiteCity]
                 if(loc>'' && rec[$County]>'') loc+=', '
                 if(rec[$County]>'') loc+=rec[$County]+' County'
                 dt=dt.replace(/xLoc/g,loc)

                 var ws=rec[$8HUC]+' '+rec[$WShedName]
                 if(ws>'') dt=dt.replace(/xWatershed/g,ws)

                 var ll= 'Latitude, Longitude: '+rec[$Lat]+', -'+rec[$Lng];
                 dt=dt.replace(/xLatLng/g,ll);
               }
             }
             else {
               dt=dt.replace(/xGroup/g,'').replace(/xSite/g,'').replace(/xLoc/g,'').replace(/xWatershed/g,'')
             }
           }
           else {
             var rec=r2[0].split('|')
             dt=$('HData').innerHTML.replace(/XNAMEX/g,'S'+rec[$Site])
             dt=dt.replace(/xGroup/g,'<a href="http://www.georgiaadoptastream.org/db/Groups.html?GroupID='+rec[$Group]+'">G-'+rec[$Group]+' '+rec[$GroupName]+'</a>')
             dt=dt.replace(/xSite/g,'<a href="http://www.georgiaadoptastream.org/db/Sites.html?SiteID='+rec[$Site]+'">S-'+rec[$Site]+' '+rec[$WaterbodyName]+'</a>')
             dt=dt.replace(/xLoc/g,rec[$County]+' County')
             dt=dt.replace(/xWatershed/g,rec[$QREWatershed])
           }
         } //getDetails

         function getAAS(){
           var rec

           var units=[]
           var label=[]
           if(All) {
             label[$Lat]='Latitude'
             label[$Lng]='Longitude'
             label[$Group]='Group'
             label[$Site]='Site'
             label[$County]='County'
             label[$SiteCity]='City'
             label[$Watershed]='Watershed'
             label[$WaterPlan]='Water Plan Region'
           }
           label[$AirTemp              ]='="Air"&char(10)&"Temp"'
           label[$WaterTemp            ]='="Water"&char(10)&"Temp"'
           label[$pH                   ]='pH'
           label[$DissolvedOxygen      ]='Dissolved Oxygen'
           label[$Alkalinity           ]='Alkalinity'
           label[$NitrateNitrogen      ]='Nitrate Nitrogen'
           label[$Ammonia              ]='Ammonia Nitrogen'
           label[$Orthophosphate       ]='="Ortho-"&char(10)&"phosphate"'
           label[$SettleableSolids     ]='Settleable Solids'
           label[$ChlorophyllA         ]='Chloro-phyll A'
           label[$Conductivity         ]='="Conduc-"&char(10)&"tivity"'
           label[$Salinity             ]='Salinity'
           label[$Turbidity            ]='Turbidity'
           label[$FecalColiform        ]='Fecal Coliform'
           label[$EcoliIDEXX           ]='<i>E coli</i> IDEXX'
           label[$Ecoli3M              ]='<i>E coli</i><br><span style="font-size:80%">3M Petri.</span>'
           label[$SecchiDisk           ]='Secchi Disk'
           label[$WQi                  ]='Water Quality Index'

           function f(fld,fmt,bd){
             if(fmt) fmt='style="mso-number-format:'+fmt+';'+bd+'"'
             else    fmt='style="'+bd+'"'
             if(rec[fld]=='') return '<td '+fmt+'>&nbsp;'
             else {
               var val
               if(rec[fld]*1<0 && fld!=$AirTemp && fld!=$WaterTemp) val='<'+(-rec[fld]*2)
               else val=rec[fld]
               return '<td '+fmt+'>'+val
             }
           } //f

           function Header(){
             s.push('<tr><td colspan="3" style="font-size:120%;color:navy"><b>Monitoring Events</b>')

             if(site==-1) {
               s.push('<tr class="BB"><td colspan="5"><th style="border:0.5pt solid black">inches/<br>hours')
             }
             else {
               s.push('<tr class="BB"><td colspan="2"><th style="border:0.5pt solid black">inches/<br>hours')
             }
             var hold
             var holdn=1
             for(var i in zf) {
               if(hold==units[zf[i]]) holdn++
               else {
                 if(hold) {
                   if(hold=='&nbsp;') s.push('<td colspan="'+holdn+'">'+hold)
                   else               s.push('<th style="border:0.5pt solid black" colspan="'+holdn+'">'+hold)
                 }
                 holdn=1
               }
               hold=units[zf[i]]
             }
             if(hold) {
               if(hold=='&nbsp;') s.push('<td colspan="'+holdn+'">'+hold)
               else               s.push('<th style="border:0.5pt solid black" colspan="'+holdn+'">'+hold)
             }

             s.push('<tr class="BB" style="font-family:arial narrow;font-weight:normal !important">')

             if(site==-1) {
               s.push('<th style="height:3.5em">Site<th>Latitude<th>Longitude')
             }

             s.push(' <th style="width:3em;font-size:80%;color:gray;border-left:0.5pt solid black">="Event"&char(10)&"ID"'+
                    ' <th style="width:3.5em">="Event"&char(10)&"Date"'+
                    ' <th style="width:4em;border:0.5pt solid black">Rain'
                   )
             for(var i=0;i<zf.length;i++) {
               var bd='border-bottom:0.5pt solid black;'
               if(i==zf.length-1 || units[zf[i]]!=units[zf[i+1]]) bd+='border-right:0.5pt solid black;'
               s.push('<th style="'+bd+'">'+label[zf[i]])
             }
           } //Header

           function add(fld,unit){if(rec[fld]>'') units[fld]=unit}

           AAS=true
           getDetails()

           for(var i in r) {
             rec=r[i].split('|')

             add($AirTemp              ,'&deg;C')
             add($WaterTemp            ,'&deg;C')
             add($pH                   ,'&nbsp;')

             add($DissolvedOxygen      ,'mg/L or ppm')
             add($Alkalinity           ,'mg/L or ppm')
             add($NitrateNitrogen      ,'mg/L or ppm')
             add($Ammonia              ,'mg/L or ppm')
             add($Orthophosphate       ,'mg/L or ppm')
             add($SettleableSolids     ,'mg/L or ppm')
             add($ChlorophyllA         ,'mg/L or ppm')

             add($Conductivity         ,'&micro;s/cm')
             add($Salinity             ,'ppt')
             add($Turbidity            ,'NTU')
             add($FecalColiform        ,'cfu/100 mL')
             add($EcoliIDEXX           ,'cfu/100 mL')
             add($Ecoli3M              ,'cfu/100 mL')
             add($SecchiDisk           ,'cm')
             add($WQi                  ,'&nbsp;')

             if(All) {
               add($Lat,'&nbsp;')
               add($Lng,'&nbsp;')
               add($Group,'&nbsp;')
               add($Site,'&nbsp;')
               add($County,'&nbsp;')
               add($SiteCity,'&nbsp;')
               add($Watershed,'&nbsp;')
               add($WaterPlan,'&nbsp;')
             }
           }

           var zf=[]
           for(var i in units) if(units[i]) zf.push(i)

           Header()

           for(var j=0;j<r.length;j++) {
             rec=r[j].split('|')

             if(j==r.length-1) bd='border-bottom:0.5pt solid black;'
             else              bd=''

             s.push('<tr class="BD" style="text-align:right;height:1.5em">')

             if(site==-1) {
               s.push('<td style="width:15em;text-align:left">S-'+rec[$Site]);
               s.push('<td>'+rec[$Lat]);
               s.push('<td>-'+rec[$Lng]);
             }
             s.push('<td style="font-size:80%;border-left:0.5pt solid black;color:gray;'+bd+'">'+rec[$EventID]+
                    '<td style="font-size:90%;mso-number-format:\'mm\/dd\/yy\';border-right:0.5pt solid black;'+bd+'">'+rec[$Date]
                   )

             if(rec[$RainHours]+rec[$RainInches]>'') {
               var hours=rec[$RainHours]*1
               var inches=(rec[$RainInches]*1).toFixed(1)
               s.push('<td style="text-align:center;border-right:0.5pt solid black;'+bd+'">'+inches+' / '+hours)
             }
             else s.push('<td style="border-right:0.5pt solid black;'+bd+'">&nbsp;')

             for(var i=0;i<zf.length;i++) {
               var bd=''
               if(i==zf.length-1 || units[zf[i]]!=units[zf[i+1]]) bd+='border-right:0.5pt solid black;'
               if(j==r.length-1) bd+='border-bottom:0.5pt solid black;'
               var fmt='0.0'
               var fz=fd[zf[i]]
               if(fz=='WQi' || fz=='Ecoli3M' || fz=='EcoliIDEXX' || fz=='Fecal Coliform') fmt='0'
               else if(fz=='Lat') fmt='0.0000'
               else if(fz=='Lng') fmt='-0.0000'
               else if(fz=='Group' || fz=='Site')                                            fmt='0;width:20em;text-align:left'
               else if(fz=='County' || fz=='Watershed' || fz=='SiteCity' || fz=='WaterPlan') fmt='0;width:12em;text-align:left'
               s.push(f(zf[i],fmt,bd))
             }
           }

           getRA()
         } //getAAS

         function getRA(){
           var flds=['Aluminum','Appliances','Bait','Balloons','Batteries','Bleach','BottleCaps','Building','Bulbs','Buoys',
                     'CarParts','Carts','Cigarettes','Cigars','Clothing','Condoms','Crates','Cups','Diapers','Drugs','Drums',
                     'Fishing','Furniture','GlassBottles','Grocery','Lighters','Lures','Nets','OilBottles',
                     'Pallets','PaperBags','PlasticBags','PlasticBottles','Pulltabs','Rope',
                     'Sheets','SixPack','Strapping','Straws','Styrofoam','Tampons','Tires','Tobacco','Toys','Traps',
                     'Weapons','Wrappers'
                    ]
           var doit=[]

           if(site.toString().indexOf('=')>-1) var cond='1=0'
           else                                var cond=site==-1?'[Group]='+GroupID:'site='+site

           SQLFieldNames=true
           ASQL('select '+flds.join(',')+',* from QRE where '+cond+' order by Date',
                function(x) {
                  function f(fld,fmt,bd){
                    if(fmt) fmt='style="mso-number-format:'+fmt+';'+bd+'"'
                    else    fmt='style="'+bd+'"'
                    if(rec[fld]=='') return '<td '+fmt+'>&nbsp;'
                    else {
                      var val
                      if(rec[fld]*1<0 && fld!=$AirTemp && fld!=$WaterTemp) val='<'+(-rec[fld]*2)
                      else val=rec[fld]
                      return '<td '+fmt+'>'+val
                    }
                  } //f

                  r2=x.responseText.split('^^'); r2.shift(); r2.pop()

                  if(!AAS) getDetails()

                  if(r2.length>0) {
                    s.push('<tr><td>&nbsp;')
                    s.push('<tr><td colspan="3" style="font-size:120%;color:navy"><b>Cleanup Events</b>')

                    s.push('<tr class="BB" style="font-family:arial narrow">')
                    if(site==-1) s.push('<th style="width:15em">Site')
                    s.push('<th style="border-left:0.5pt solid black">Date<th>Volunteers<th>Volunteer Hours<th>Bags Collected<th>Pounds of garbage<th style="border-right:0.5pt solid black">Miles cleaned')

                    for(var j in flds) for(var i=0;i<r2.length;i++) {
                      var rec=r2[i].split('|')
                      if(rec[j]>0) {
                        s.push('<th>'+flds[j].replace('Bottles',' Bottles').replace('Bags',' Bags'))
                        doit[j]=true
                        break
                      }
                    }

                    for(var i=0;i<r2.length;i++){
                      var rec=r2[i].split('|')
                      var bd=''
                      if(i==r2.length-1) bd+='border-bottom:0.5pt solid black;'

                      s.push('<tr class="BD">')
                      if(site==-1) s.push('<td>S-'+rec[$Site]+' '+rec[$WaterbodyName])
                      s.push('<td style="font-size:90%;mso-number-format:\'mm\/dd\/yy\';border-left:0.5pt solid black;'+bd+'">'+rec[$Date])
                      s.push(f($Volunteers,'0',bd)+
                             f($Hours     ,'0',bd)+
                             f($Bags      ,'0',bd)+
                             f($Pounds    ,'0',bd)+
                             f($Miles     ,'0','border-right:0.5pt solid black;'+bd)
                            )

                      for(var j in flds) if(doit[j]) s.push('<td style="'+bd+'">'+rec[j])
                    }
                  }

                  $('Filename').value=All?'Data.xls':site==-1?'G-'+GroupID+'.xls':'S-'+site+'.xls'
                  $('HTML').value="<html xmlns:o='urn:schemas-microsoft-com:office:office'\n" +
                                  "xmlns:x='urn:schemas-microsoft-com:office:excel'\n" +
                                  "xmlns='http://www.w3.org/TR/REC-html40'>\n" +
                                  dt.replace(/\&lt;/g,'<').replace(/\&gt;/g,'>').replace('XXXX',s.join('\r'))+
                                  "</html>"
                  $('XFRM').submit()
                }
               )
         }

         var r=x.responseText.split('^^')
         var fd=r[0].split('|')
         r.shift(); r.pop()

         var AAS=false
         if(r.length>0) getAAS()
         else getRA()

       }
      )
} //ExcelSite

function ExcelGroup(iGroupID) {
  GroupID=iGroupID
  ExcelSite(-1); return
  var s='/scripts/AG.asp?db=aas&Excel=true&FieldNames=true&Negligible=true&rev=true&SQL='
/*
  var sq='select Group,Site,County,SiteCity as City,Event_ID,format(Date,\'mm/dd/yyyy hh:mm\') as [Date],Rain_24_hours,Present_Conditions,Precip_Hours,Precip_Inches,AirTemp,[WaterTemp],[Dissolved Oxygen],pH,[Nitrate Nitrogen],[Orthophosphate],[Settleable Solids],[Alkalinity],[Conductivity],WQI '+
         'from QEvents where Site>\'\' and Group_ID='+GroupID+' order by Site,Date'
*/
  var sq='select Group,Site,County,SiteCity as City,Event_ID,format(Date,\'mm/dd/yyyy hh:mm\') as [Date],AirTemp,[WaterTemp],[Dissolved Oxygen],pH,[Nitrate Nitrogen],[Orthophosphate],[Settleable Solids],[Alkalinity],[Conductivity],WQI '+
         'from QEvents where Site>\'\' and Group_ID='+GroupID+' order by Site,Date'
  s+= encodeURIComponent(sq.split('').reverse().join(''))
  return s
} //ExcelGroup
//------------------------------------------------------------------------------------------------------------------------
function Views(a,str)    {return '<a href="Views.html?'+a+'">'+str+'</a>'}
function Groups(a,str)   {return '<a href="Groups.html?'+a+'">'+str+'</a>'}
function Sites(a,str)    {return '<a href="Sites.html?'+a+'">'+str+'</a>'}
Date.prototype.addDays = function(days) {this.setDate(this.getDate()+days)}
Date.prototype.toString= function(){return (this.getMonth()+1)+'/'+this.getDate()+'/'+this.getUTCFullYear()}
//------------------------------------------------------------------------------------------------------------------------
function simpleEncode(valueArray,maxValue) {
  var simpleEncoding = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var chartData = ['s:'];
  for (var i=0; i<valueArray.length; i++) {
    var currentValue = valueArray[i]
    if (!isNaN(currentValue) && currentValue >= 0) {
      chartData.push(simpleEncoding.charAt(Math.round((simpleEncoding.length-1) * currentValue / maxValue)));
    }
    else chartData.push('_')
  }
//  alert(chartData)
  return chartData.join('')
} //simpleEncode
//---------------------------------------------------------------------------------------------------------------------------------------
function ShowGraph(x,fld,obj,header) {
  function fixdate(s){
    var mo=['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    return s.split('-')[0]+'-'+mo[s.split('-')[1]*1]
  } //fixdate

  if($(obj)) {
    var r=x.responseText.split('^^')
    if(r.length>1) {
      var len=0
      for(var i in r) {
        var rec=r[i].split('|')
        if(rec[fld]>'') len++
      }

      if(len==1) {
        var rec=r[0].split('|')
        var s='http://chart.apis.google.com/chart?chtt='+header+'&chs=200x100&cht=s&chd=t:50|100&chxt=x,y'
        var date=fixdate(rec[0])
        var val=rec[fld]
        if(val>'') {
          val*=1
          if     (val<1)  dec=2
          else if(val<10) dec=1
          else dec=0

          s+='&chxl=0:||'+date+'||1:||'+val.toFixed(dec) //+'|'+Math.ceil(val*1.2)
          if(val==15000) $(obj).src='images/FG.png'
          else $(obj).src=s
  //        $(obj).parentNode.innerHTML=s
          $(obj).style.display='inline'
        }
      }
      else {
//chm=o,0066FF,0,-1,6&      
        var s='http://chart.apis.google.com/chart?chtt='+header+'&chs=200x100&cht=lc&chxt=x,y&chd='
        var date=[]
        var data=[]
        var max=0
        var min=9999999
        var lx='0:|'
        var j=-1
        for(var i=0;i<r.length-1;i++) {
          var val=r[i].split('|')[fld]
          if(val>'') {
            j++
            date[j]=r[i].split('|')[0]
            date[j]=date[j].substr(0,date[j].indexOf(' '))
            data[j]=(val*1).toFixed(1)
            if(data[j]*1>max) max=data[j]*1
            if(data[j]*1<min) min=data[j]*1
          }
        }
        if(j>-1) {
          lx='0:|'+fixdate(date[0])+'|'+fixdate(date[j])+'|'
          max=(max+1).toFixed(0)
          s+=simpleEncode(data,max)+'&chxl='+lx+'1:||'+(max/2).toFixed(0)+'|'+max
          if(max==15001) $(obj).src='images/FG.png'
          else $(obj).src=s
  //        $(obj).parentNode.innerHTML=s
          $(obj).style.display='inline'
        }
      }
    }
  }
} //ShowGraph

function Graph(obj,header,sql) {
  ASQL(sql,ShowGraph,1,obj,header)
}
//------------------------------------------------------------------------------------------------------------------------
function WMSGetTileUrl( tile, zoom ) {
  var southWestPixel = new GPoint( tile.x * 256, ( tile.y + 1 ) * 256);
  var northEastPixel = new GPoint( ( tile.x + 1 ) * 256, tile.y * 256);
  var southWestCoords =G_NORMAL_MAP.getProjection().fromPixelToLatLng( southWestPixel, zoom );
  var northEastCoords =G_NORMAL_MAP.getProjection().fromPixelToLatLng( northEastPixel, zoom );
  var bbox = southWestCoords.lng() + ',' + southWestCoords.lat() +',' + northEastCoords.lng() + ',' + northEastCoords.lat();
  return this.baseUrl + '?VERSION=1.1.1&REQUEST=GetMap&LAYERS=' +this.layer + '&STYLES=&SRS=EPSG:4326&BBOX=' + bbox +'&WIDTH=256&HEIGHT=256&FORMAT=image/jpeg&BGCOLOR=0xCCCCCC&EXCEPTIONS=INIMAGE';
} //WMSGetTileUrl
//------------------------------------------------------------------------------------------------------------------------
function WMSCreateMap( name, copyright, baseUrl, layer, minResolution, maxResolution, urlArg ) {
  var tileLayer = new GTileLayer( new GCopyrightCollection( copyright ), minResolution, maxResolution );
  tileLayer.baseUrl = baseUrl;
  tileLayer.layer = layer;
  tileLayer.getTileUrl = WMSGetTileUrl;
  tileLayer.getCopyright = function () { return copyright; };
  var tileLayers = [ tileLayer ];
  return new GMapType( tileLayers, G_SATELLITE_MAP.getProjection(),name, { errorMessage: _mMapError, urlArg: 'o' } );
} //WMSCreateMap

//------------------------------------------------------------------------------------------------------------------------

function InitMap(w,h){

  var WMS_TOPO_MAP=WMSCreateMap('Topo', 'Imagery by USGS / Web Service by TerraServer', 'http://www.terraserver-usa.com/ogcmap6.ashx', 'DRG',4, 17, 't' )

  var icon = new GIcon();
  icon.image = "images/mm_20_red.png";
  icon.shadow = "images/mm_20_shadow.png";
  icon.iconSize = new GSize(12, 20);
  icon.shadowSize = new GSize(22, 20);
  icon.iconAnchor = new GPoint(6, 20);
  icon.infoWindowAnchor = new GPoint(5, 1);

  iconred  = new GIcon(icon,"images/mm_20_red.png")
  icongreen= new GIcon(icon,"images/mm_20_green.png")
  iconyellow= new GIcon(icon,"images/mm_20_yellow.png")

  WM = new GMap2($("Map"),{draggableCursor: 'crosshair', draggingCursor: 'pointer',size:new GSize(w,h)})

//  WM.addMapType(G_SATELLITE_3D_MAP)

  WM.addControl(new GLargeMapControl3D())
  WM.addControl(new GMenuMapTypeControl())
//  WM.addControl(new GMapTypeControl())
  WM.addControl(new GScaleControl())
  WM.addMapType(G_PHYSICAL_MAP)
  WM.addMapType(WMS_TOPO_MAP)
} //InitMap
//------------------------------------------------------------------------------------------------------------------------
function createMarker(point,html,cs,color) {
  if(color) var marker = new GMarker(point, {icon:color})
  else      var marker = new GMarker(point, {icon:iconred})

  GEvent.addListener(marker, "click", function() {
    if(html>'') marker.openInfoWindowHtml(html)
    else        marker.openInfoWindowHtml(info(cs),{maxWidth:310, buttons:{close:{height:0,width:25}}})
  })
  return marker
} //createMarker

function info(cs){
  s=['<div id="dInfo" style="background:#def;padding:0.5em;border:ridge">']
  s.push('<div style="border-bottom:1px solid black">')
  s.push('<p><a target="_top" href="/db/Groups.html?GroupID=$GroupID">Group G-$GroupID $GroupName</a></p>')
  s.push('<p><a target="_top" href="/db/Sites.html?SiteID=$MonitoringSiteID">Site S-$MonitoringSiteID $WaterbodyName</a></b></p>')
//  s.push('<p>Site description: $Description</p>')
  if(cs[$Events]>0) s.push(cs[$Events]+' monitoring event'+(cs[$Events]>1?'s':''))
  s.push('</div>')
  s.push('<p>View all sites in:</p>')
  s.push( '<ul style="list-style-type:none">')
  if(cs[$WShedName]>'') s.push('<li><a target="_top" href="/db/Views.html?Watershed=$WShedName">$WShedName</a> watershed<br>(HUC8 $8HUC)')
  if(cs[$SiteCity]>'')  s.push('<li><a target="_top" href="/db/Views.html?City=$SiteCity">$SiteCity</a> Georgia')
  if(cs[$County]>'')    s.push('<li><a target="_top" href="/db/Views.html?County=$County">$County County</a> Georgia')
  s.push( '</ul>')
  s.push('</div>')
  return s.join('').
         replace(/\$MonitoringSiteID/g,cs[$MonitoringSiteID]).
         replace(/\$WaterbodyName/g,cs[$WaterbodyName]).
         replace(/\$GroupID/g,cs[$GroupID]).
         replace(/\$GroupName/g,cs[$GroupName]).
         replace(/\$WShedName/g,cs[$WShedName]).
         replace(/\$8HUC/g,cs[$8HUC]).
         replace(/\$SiteCity/g,cs[$SiteCity]).
         replace(/\$County/g,cs[$County]).
         replace(/\$Events/g,cs[$Events]).
         replace(/\$Description/g,cs[$Description])
} //info

function siteInfo(site){
  SQLFieldNames=true
  SQLChar='_'
  ASQL('select count(Event_ID) as Events,WaterbodyName,b.Monitoring_Site_ID,Site_Lat/10000 as lat,-Site_Long/10000 as lng,WShedName,[8HUC],SiteCity,County,b.Group_ID,b.GroupName,mid(b.Description,1,2000) as Description from qsites as b left join events as a on a.monitoring_site_id=b.monitoring_site_id where b.Monitoring_Site_ID='+site[$id]+' group by b.Monitoring_Site_ID,WaterbodyName,Site_Lat,Site_Long,WShedName,[8HUC],SiteCity,County,b.Group_ID,b.GroupName,mid(b.Description,1,2000)',
       function(x){
        var cs=x.responseText.split('^^')[1].split('|')
//        alert(site[$MonitoringSiteID]+'\r'+x.responseText)
        s=['<div id="dInfo" style="background:#def;padding:0.5em;border:ridge;font-weight:normal;font-size:8pt;color:black">']
        s.push('<div style="border-bottom:1px solid black">')
        s.push('<p><a target="_top" href="/db/Groups.html?GroupID=_GroupID">Group G-_GroupID _GroupName</a></p>')
        s.push('<p><a target="_top" href="/db/Sites.html?SiteID=_MonitoringSiteID">Site S-_MonitoringSiteID _WaterbodyName</a></b></p>')
      //  s.push('<p>Site description: _Description</p>')
        s.push(cs[_Events]+' monitoring event'+(cs[_Events]!=1?'s':''))
        s.push('</div>')
        s.push('<p>View all sites in:</p>')
        s.push( '<ul style="list-style-type:none">')
        if(cs[_WShedName]>'') s.push('<li><a target="_top" href="/db/Views.html?Watershed=_WShedName">_WShedName</a> watershed<br>(HUC8 _8HUC)')
        if(cs[_SiteCity]>'')  s.push('<li><a target="_top" href="/db/Views.html?City=_SiteCity">_SiteCity</a> Georgia')
        if(cs[_County]>'')    s.push('<li><a target="_top" href="/db/Views.html?County=_County">_County County</a> Georgia')
        s.push( '</ul>')
        s.push('</div>')
        s=s.join('').
               replace(/\_MonitoringSiteID/g,cs[_MonitoringSiteID]).
               replace(/\_WaterbodyName/g,cs[_WaterbodyName]).
               replace(/\_GroupID/g,cs[_GroupID]).
               replace(/\_GroupName/g,cs[_GroupName]).
               replace(/\_WShedName/g,cs[_WShedName]).
               replace(/\_8HUC/g,cs[_8HUC]).
               replace(/\_SiteCity/g,cs[_SiteCity]).
               replace(/\_County/g,cs[_County]).
               replace(/\_Events/g,cs[_Events]).
               replace(/\_Description/g,cs[_Description])

        WM.infowindow.setContent(s)
        tooltip.hide()
       }
      )
} //siteInfo

//------------------------------------------------------------------------------------------------------------------------
var legend='right'


