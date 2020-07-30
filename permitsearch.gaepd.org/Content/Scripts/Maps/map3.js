document.write([
  '<meta name="viewport" content="initial-scale=1.0, user-scalable=no" />',
  '<script src="http://maps.googleapis.com/maps/api/js?sensor=true&libraries=places,weather,geometry"><\/script>',
  '<script src="/Content/Scripts/Maps/markerclusterer.js"><\/script>',
  '<script src="/Content/Scripts/Maps/Layers.js?a=b"><\/script>',
  '<script src="/Content/Scripts/Maps/tooltip.js"><\/script>',
  '<script src="https://www.google.com/jsapi?key="><\/script>',
  '<script src="scripts/ajax.js"><\/script>'
].join(''))

//__________________________________________________________________________________________________________________________________________________________________
function mapType(WM,type){
  if     (type=='Road Map')   WM.setMapTypeId(google.maps.MapTypeId.ROADMAP)
  else if(type=='Terrain')    WM.setMapTypeId(google.maps.MapTypeId.TERRAIN)
  else if(type=='Satellite')  WM.setMapTypeId(google.maps.MapTypeId.HYBRID)
  else if(type=='OpenStreet') WM.setMapTypeId('OSM')
  else if(type=='TopOSM1')    WM.setMapTypeId('TopOSM1')
  else if(type=='TopOSM2')    WM.setMapTypeId('TopOSM2')
  else if(type=='Topo')       WM.setMapTypeId('Topo')
} //mapType

//function mapTypes(){return ['Road Map','Terrain','Satellite','Topo','TopOSM1','TopOSM2','OpenStreet']}
function mapTypes(){return ['Road Map','Terrain','Satellite','Topo','OpenStreet']}                                                              

function mapMarker(WM, site) {
   
  function markerProperties(marker,site){
    marker.setOptions({boxStyle:{fontSize:'100%',
                                 background:WM.options.labelBackground?WM.options.labelBackground(site):'#eee',
                                 color:WM.options.labelColor?WM.options.labelColor(site):'#000',
                                 border:WM.options.border?WM.options.border:'1px solid black',
                                 padding:'0em 0em',
                                 textAlign:'center',
                                 width:'4em',
                                 marginLeft:'-2.5em',
                                 whiteSpace:'nowrap',
                                 zIndex:0
                                }
                      }
                     )
  } //markerProperties

  if(WM.options.meters) {
    var pos=new google.maps.LatLng(site[$lat],site[$lng])
    var d=google.maps.geometry.spherical.computeDistanceBetween(toLatLng(WM.options.center),pos)
    if(d>WM.options.meters) return null
  }

  if (WM.options.label) {
     // debugger;
      WM.options.label=[]
    var content=site//WM.options.label(site)
    var marker= new InfoBox({
                  position:new google.maps.LatLng(site.lat,site.lng),
                  closeBoxURL:'',
                  enableEventPropagation:false,
                  content:content,
                  disableAutoPan:true,
                  pane:'floatPane',
                  zpane:'mapPane',
                  contextmenu:WM.options.contextmenu?function(){WM.options.contextmenu(site)}:null,
                  title:WM.options.title?WM.options.title(site):''
                })

    if(content>'') marker.open(WM)

      //if(content.indexOf('style')==-1) markerProperties(marker,site)
    if (content > '') markerProperties(marker, site)

    var dsite=WM.options.labelID?WM.options.labelID(site):content
    WM.labels[dsite]=marker
  }
  else {
    if(WM.options.icon) {
      if(typeof(WM.options.icon)=='function') var ic=WM.options.icon(site);
      else var ic=WM.options.icon;
    }

    if(WM.options.shadow) var sic=WM.options.shadow

    var iw=WM.options.iconwidth
    var ih=WM.options.iconheight
    var sz =new google.maps.Size(iw?iw    :20,ih?ih:20)
    var sz2=new google.maps.Size(iw?iw*1.8:20,ih?ih:20)
//https://developers.google.com/chart/image/docs/gallery/dynamic_icons
    var marker=
          new google.maps.Marker({
              position: new google.maps.LatLng(site.lat, site.lng),  //google.maps.LatLng(site[$lat],site[$lng]),--pv
            map:WM,
            icon  :typeof(ic)==='object'?ic:
                   ic ?{
                        url        :ic ,
                        size       :null,
                        origin     :null,
                        anchor     :new google.maps.Point(iw/2,ih),
                        scaledSize :sz
                       }:
                       {
                        url        :'https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png',
                        size       :null,
                        origin     :null,
                        anchor     :new google.maps.Point(iw/2,ih),
                        scaledSize :sz
                       },
            shadow:sic?{
                        url        :sic ,
                        size       :null,
                        origin     :null,
                        anchor     :new google.maps.Point(iw/2,ih),
                        scaledSize :sz2
                       }:
                       {
                        url        :'http://maps.gstatic.com/mapfiles/shadow50.png',
                        size       :null,
                        origin     :null,
                        anchor     :new google.maps.Point(iw/2,ih),
                        scaledSize :sz2
                       }

                       ,
            flat:WM.options.flaticon,
            title:WM.options.title?WM.options.title(site):''
          })
  }
  //debugger;
  WM.options.label=true
  if(WM.options.balloon) {
    if(WM.options.label) {
      google.maps.event.addListener(marker,'domready',
        function(event){
          google.maps.event.addDomListener(this.div_,'click',
            function() {
              if(WM.infowindow) WM.infowindow.close()
              WM.infowindow = new google.maps.InfoWindow({content:WM.options.balloon(site),position:new google.maps.LatLng(site[$lat],site[$lng]),zIndex:5000})
              WM.infowindow.open(WM)
            }
          )
          WM.options.label = false
        }
      )
    }
    else {
       
      google.maps.event.addListener(marker,'click',
        function(){
          if(WM.infowindow) WM.infowindow.close()
          WM.infowindow = new google.maps.InfoWindow({content:WM.options.balloon(site)})
          WM.infowindow.open(WM,this)
        }
      )
    }
  }

  else if(WM.options.click) {
    if(WM.options.label) {
      google.maps.event.addListener(marker,'domready',
        function(event){
          google.maps.event.addDomListener(this.div_,'click',
            function(){
              WM.options.click(site)
            }
          )
        }
      )
    }
    else {
      google.maps.event.addListener(marker,'click',
        function(){
          WM.options.click(site)
        }
      )
    }
  }

  if(WM.options.contextmenu) {
    google.maps.event.addListener(marker, 'rightclick',
      function(lat,lng){
        tooltip.hide()
        WM.options.contextmenu(site,lat,lng)
      }
    )
  }

  if(WM.options.tooltip){
    if(WM.options.label) {
      google.maps.event.addListener(marker,'domready',
        function(event){
          google.maps.event.addDomListener(this.div_,'mousemove',function() {
            if(!incontext) tooltip.show('<div style="border-radius:5px;z-index:500;background:#333;color:#ddd;opacity:0.9;padding:0.5em"><b>'+WM.options.tooltip(site)+'</b></div>')
          })

          google.maps.event.addDomListener(this.div_,'mouseout',function() {
            tooltip.hide()
          })
        }
      )
    }
    else {
      google.maps.event.addListener(marker, 'mousemove', function() {
        if(!incontext) tooltip.show('<div style="border-radius:5px;z-index:500;background:#333;color:#ddd;opacity:0.9;padding:0.5em"><b>'+WM.options.tooltip(site)+'</b></div>')
      })

      google.maps.event.addListener(marker, 'mouseout', function(){
        tooltip.hide()
      })
    }
  }

  if(WM.holdMarkers) {
    WM.holdMarkers.push(marker);
  }

  return marker
} //mapMarker

//__________________________________________________________________________________________________________________________________________________________________
function clearMarkers(WM){
  if(WM.markers) {
    for(var i=0;i<WM.markers.length;i++){
      if(WM.options.label) {
        try{WM.markers[i].close()}catch(ee){alert('clearMarkers: '+i)}
        WM.markers[i]=null
      }
      else {
        try{WM.markers[i].setMap(null)}catch(ee){}
        WM.markers[i]=null
      }
    }
  }
  WM.markers=[]
} //clearMarkers

//__________________________________________________________________________________________________________________________________________________________________

function WMSSpec(map, baseUrl, name, shortName, layers, srs, version, styles, format, copyright, bgcolor, transparent) {
  var imageMap = new google.maps.ImageMapType({
    getTileUrl : function(coord, zoom) {
        var proj = map.getProjection();
        var zfactor = Math.pow(2, zoom);
         // get Long Lat coordinates
        var top = proj.fromPointToLatLng(
               new google.maps.Point(coord.x * 256 / zfactor, coord.y * 256 / zfactor) );
        var bot = proj.fromPointToLatLng(
              new google.maps.Point((coord.x + 1) * 256 / zfactor, (coord.y + 1) * 256 / zfactor));

          var ulx;
          var uly;
          var lrx;
          var lry;
          var lBbox;

          if(srs.toLowerCase() == "EPSG:4326".toLowerCase()){
            ulx = Math.round(top.lng()*10000000)/10000000;
            uly = Math.round(bot.lat()*10000000)/10000000;
            lrx = Math.round(bot.lng()*10000000)/10000000;
            lry = Math.round(top.lat()*10000000)/10000000;
            lBbox=ulx+","+uly+","+lrx+","+lry;
          }
          else{
            lBbox = Math.round(dd2MercMetersLng(top.lng())) + "," + Math.round(dd2MercMetersLat(bot.lat())) + "," + Math.round(dd2MercMetersLng(bot.lng()))+ "," + Math.round(dd2MercMetersLat(top.lat()));
          }
         
          var lURL= baseUrl;
          lURL+="&REQUEST=GetMap";
          lURL+="&SERVICE=WMS";
          lURL+="&VERSION=" +version;
          lURL+="&LAYERS="+ layers;
          if (styles && styles != 'default')
                  lURL+="&STYLES="+styles;
          else
                  lURL+="&STYLES=";
          lURL+="&FORMAT="+format;
          lURL+="&BGCOLOR=0xFFFFFF";
          lURL+="&TRANSPARENT=TRUE";
          //lURL+="&SRS="+this.srs;
          lURL+="&SRS="+srs;
          lURL+="&BBOX="+lBbox;
          lURL+="&WIDTH=256";
          lURL+="&HEIGHT=256";
          lURL+="&reaspect=false";
          //lURL+="&EXCEPTIONS=INIMAGE";
          //alert(lURL);
          return lURL;
    },
    tileSize: new google.maps.Size(256, 256),
    maxZoom: 17,
    minZoom: 0,
    name: name
   }
  )

 if(name == 'Topo') map.mapTypes.set(name, imageMap)
 else               map.overlayMapTypes.push(imageMap)
} //WMSSpec

//__________________________________________________________________________________________________________________________________________________________________
function mapSQL1(x,WM){
    debugger;
  clearMarkers(WM)

  var Sites=toTable(x)
  var markers=[]
  var bounds = WM.options.bestfit && !WM.options.county && !WM.options.watershed && Sites.length && !WM.options.center && !WM.options.zoom?new google.maps.LatLngBounds():null

  for(var i in Sites) {
    var mm=mapMarker(WM,Sites[i])
    if(mm){
      markers.push(mm)
      if(bounds) bounds.extend(new google.maps.LatLng(Sites[i][$lat],Sites[i][$lng]))
    }
  }

  if(bounds) {
    WM.fitBounds(bounds)
    WM.setZoom(Math.min(WM.getZoom(),16))
  }

  WM.markers=markers
  if(WM.cluster) {
    var markerCluster = new MarkerClusterer(WM, markers)
  }

  if(WM.options.onload) WM.options.onload()
} //mapSQL1

function mapSQL(WM,sql,fnc){
  if(sql) {
    SQLFieldNames=true
    if(WM.options.aas) ASQL(sql,function(x,WM){mapSQL1(x,WM); if(fnc) fnc(x)},WM)
    else               SQL( sql,function(x,WM){mapSQL1(x,WM); if(fnc) fnc(x)},WM)
  }
} //mapSQL

//__________________________________________________________________________________________________________________________________________________________________
function mapRoute(WM,from,dest) {
  $('_MAP').parentNode.style.width='75%'
  $('_PANEL').parentNode.style.width='25%'
  Show('_PANEL')
  if(!WM.directionsService) WM.directionsService = new google.maps.DirectionsService()
  if(!WM.directionsDisplay) WM.directionsDisplay = new google.maps.DirectionsRenderer()

  WM.directionsDisplay.setMap(WM)
  WM.directionsDisplay.setPanel($('_PANEL'))

  var request = {
    origin:from,
    destination:dest,
    travelMode:google.maps.TravelMode['DRIVING']
  }
  WM.directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      WM.directionsDisplay.setDirections(response)
    }
  })
} //mapRoute

//__________________________________________________________________________________________________________________________________________________________________
function clientCity() {return google.loader.ClientLocation.address.city}
function clientState(){return google.loader.ClientLocation.address.region}
function clientLat() {return google.loader.ClientLocation.latitude}
function clientLng() {return google.loader.ClientLocation.longitude}

//__________________________________________________________________________________________________________________________________________________________________
function getDirections(v){
  if(v) {
    var autocomplete = new google.maps.places.Autocomplete($('_DRIVING'))
    autocomplete.bindTo('bounds',WM)

    autocomplete = new google.maps.places.Autocomplete($('_DEST'))
    autocomplete.bindTo('bounds',WM)

    $('BMapDriving').innerHTML='Close'
    Show('_TDrivingDirections')
    if     ($t('_DRIVING')=='') $('_DRIVING').focus()
    else if($t('_DEST')   =='') $('_DEST').focus()
    else mapRoute(WM,$t('_DRIVING'),$t('_DEST'))
  }
  else {
    $('BMapDriving').innerHTML='Driving directions'
    Hide('_TDrivingDirections')

    if(WM.directionsDisplay) WM.directionsDisplay.setMap(null)
    $('_MAP').parentNode.style.width='100%'
    Hide('_PANEL')
  }
} //getDirections

//__________________________________________________________________________________________________________________________________________________________________
function defineMapTypes(WM){

  WMSSpec(WM, 'http://orthoimage.er.usgs.gov/ogcmap.ashx?', 'Topo', 'Topo', 'DRG', 'EPSG:4326', '1.1.1', 'default', 'image/jpeg', '(c) Unknown');
//  WMSSpec(WM, 'http://www.mappingsupport.com/p/google.mapsap4/helpfile/Howson_Creek_trail.kml&ll=47.357087,-121.074701&t=t4&z=14&streetview=off


  WM.mapTypes.set("Topo", new google.maps.ImageMapType({
    getTileUrl: function(coord, zoom) { return "http://services.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer/tile/" + zoom + "/" + coord.y + "/" + coord.x ;},
    tileSize: new google.maps.Size(256, 256),
    name: "Topo",
    alt:"Topo",
    maxZoom: 15
  }))

  WM.mapTypes.set("OSM", new google.maps.ImageMapType({
    getTileUrl: function(coord, zoom) {
      return "http://tile.openstreetmap.org/" + zoom + "/" + coord.x + "/" + coord.y + ".png";
    },
    tileSize: new google.maps.Size(256, 256),
    name: "OpenStreet",
    alt:"OpenStreetMap",
    maxZoom: 18
  }))

/*
  WM.mapTypes.set("TopOSM1", new google.maps.ImageMapType({
    getTileUrl: function(coord, zoom) {
//      alert("http://www.georgiaadoptastream.com/db/TopOSMTile.asp?" + zoom + "/" + coord.x + "/" + coord.y)
//      return "http://www.georgiaadoptastream.com/db/TopOSMTile.asp?" + zoom + "/" + coord.x + "/" + coord.y
      return "http://c.tile.stamen.com/toposm-features/" + zoom + "/" + coord.x + "/" + coord.y + ".png";
    },
    tileSize: new google.maps.Size(256, 256),
    name: "TopOSM1",
    alt:"TopOSM1",
    maxZoom: 18
  }))

  WM.mapTypes.set("TopOSM2", new google.maps.ImageMapType({
    getTileUrl: function(coord, zoom) {
//      alert("http://www.georgiaadoptastream.com/db/TopOSMTile.asp?" + zoom + "/" + coord.x + "/" + coord.y)
//      return "http://www.georgiaadoptastream.com/db/TopOSMTile.asp?" + zoom + "/" + coord.x + "/" + coord.y
      return "http://c.tile.stamen.com/toposm-color-relief/" + zoom + "/" + coord.x + "/" + coord.y + ".png";
    },
    tileSize: new google.maps.Size(256, 256),
    name: "TopOSM2",
    alt:"TopOSM2",
    maxZoom: 18
  }))
*/  
}//defineMapTypes

//__________________________________________________________________________________________________________________________________________________________________
function definePrototypes(){

    if (!google.maps.Polygon.prototype.getBounds) {       

    google.maps.Polygon.prototype.getBounds=function(latLng) {
      var bounds=new google.maps.LatLngBounds()
      var paths=this.getPaths()
      var path
      for (var p = 0; p < paths.getLength() ; p++) {
          //debugger;
        path=paths.getAt(p)
        for(var i=0;i<path.getLength();i++) bounds.extend(path.getAt(i))
      }

      return bounds
    }
  }
} //definePrototypes

//__________________________________________________________________________________________________________________________________________________________________
function Map(container,options){
  if(!options) options={}
//alert(new google.maps.LatLng('33','-81').toString().replace(/^\((.+)\)$/,"$1"));
//alert(new google.maps.LatLng('33.432','-81.3423').toString().slice(1,-1))
  if(options.width)  container.style.width=options.width+'px'
  if(options.height) container.style.height=options.height+'px'
  //debugger;
  definePrototypes()

  var mapTypeIds=[]
  for(var type in google.maps.MapTypeId) mapTypeIds.push(google.maps.MapTypeId[type])
  mapTypeIds.push('OSM')
//  mapTypeIds.push('TopOSM1')
//  mapTypeIds.push('TopOSM2')
  mapTypeIds.push('Topo')

  var myOptions=$.merge({type:'Road Map',
                       title:null,
                       balloon:null,
                       within:50,
                       mapTypeControlOptions: {
                         mapTypeIds:mapTypeIds,
                         style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
                       },

                       contextmenu: function (site, lat, lng) {
                          
                         var s=[]
                         if(site){
                           lat=site[$lat]*1
                           lng=site[$lng]*1
                         }
                         if(WM.options.directions){
//                           alert(lat+' '+lng)
                           s.push('<div style="white-space:nowrap">Directions '+
                                  '<span class="mapmenuitem" style="color:blue" onclick="mapmenu.hide(); driving('+lat+','+lng+',true) ">&nbsp;from&nbsp;</span>/'+
                                  '<span class="mapmenuitem" style="color:blue" onclick="mapmenu.hide(); driving('+lat+','+lng+',false)">&nbsp;to&nbsp;</span>'+
                                  ' here</div>'
                                 )
                           s.push('<hr>')
                         }
                         s.push('<div style="white-space:nowrap">Zoom '+
                                '<span class="mapmenuitem" style="color:blue" onclick="mapmenu.hide(); WM.setZoom(WM.getZoom()+1)">&nbsp;in&nbsp;</span>/'+
                                '<span class="mapmenuitem" style="color:blue" onclick="mapmenu.hide(); WM.setZoom(WM.getZoom()-1)">&nbsp;out&nbsp;</span>'+
                                '&nbsp;&nbsp;&nbsp;&nbsp;<span class="mapmenuitem" style="color:blue" onclick="mapmenu.hide(); WM.setCenter(new google.maps.LatLng('+lat+','+lng+'))">Center</span>'+
                                '</div>'
                         )
                         s.push('<hr>')
                         s.push('<div style="font-size:8pt;color:gray;border-bottom:1px dotted #ccc">'+lat.toFixed(6)+' , '+lng.toFixed(6)+'</div>')
                         s.push('<div style="font-size:8pt;color:gray;border-bottom:1px dotted #ccc" id="maplocation"></div>')
                         s.push('<div style="font-size:8pt;color:gray;border-bottom:1px dotted #ccc" id="mapcounty"></div>')
                         s.push('<div style="font-size:8pt;color:gray;border-bottom:1px dotted #ccc" id="mapwatershed"></div>')
//                         s.push('<div style="font-size:8pt;color:gray;border-bottom:1px dotted #ccc"><b style="color:blue;text-decoration:underline;cursor:pointer" onclick="filterRadius(new google.maps.LatLng('+lat+','+lng+'),$t(\'within\')*5280*0.3048)">Filter within</b> <input type="text" id="within" value="'+WM.options.within+'" style="width:2em;font-size:9pt;background:yellow"> miles</div>')
                         s.push('<div style="font-size:8pt;color:gray;border-bottom:1px dotted #ccc"><b style="color:blue;text-decoration:underline;cursor:pointer" onclick="filterRadius(['+lat+','+lng+'],$t(\'within\')*5280*0.3048)">Filter within</b> <input type="text" id="within" value="'+WM.options.within+'" style="width:2em;font-size:9pt;background:yellow"> miles</div>')
                         if(WM.options.county || WM.options.meters || WM.options.watershed) {
                           s.push('<div style="font-size:8pt;color:gray;border-bottom:1px dotted #ccc;font-weight:bold;color:blue;cursor:pointer" onclick="removeAreaFilter()">Remove filter</div>')
                         }
                         mapmenu.show('<div style="background:white;padding:0.2em 0.5em;border:1px solid silver"><div>'+s.join('</div><div>')+'</div>')

                         geocodeLL(lat,lng,
                                   function(results){
                                     var cty=geoparse('County',results)

                                     var address=geoparse('Number',results)+' '+geoparse('Street',results)+'<br>'
                                     address+='<b style="color:#44f;cursor:pointer;text-decoration:underline" onclick="filterCity(this.innerHTML.replace(\' GA\',\'\'))">'+geoparse('City',results)+' '+geoparse('State',results)+'</b> '+geoparse('Zip',results)

                                     var city=(results[0].formatted_address.replace(',','<br>').replace(', USA',''))
                                     $('maplocation').innerHTML=address
                                     var s='<b style="color:#44f;cursor:pointer;text-decoration:underline" onclick="filterCounty(this.innerHTML)">'+cty+'</b> County'
                                     s+='<br>&hellip; and <b style="color:#44f;cursor:pointer;text-decoration:underline" onclick="filterCounty(\''+cty+'\',true)">surrounding counties</b>'
                                     $('mapcounty').innerHTML=s

                                     //filterCounty(cty,true)
                                     AJAX('/scripts/aas/huc8/huc8.asp?lat='+lat+'&lon='+(-lng),
                                          function(x){
                                            var s=x.responseText.split(':')
                                            if(s>'') {
                                              var ws='HUC8: '+s[0]+'<br>'
                                              ws+='<b style="color:#44f;cursor:pointer;text-decoration:underline" onclick="filterWatershed(\''+s[1]+'\',true)">'+s[1]+' Watershed</b>'
                                              $('mapwatershed').innerHTML=ws
                                            }
                                          }
                                     )

                                   }
                                  )
                        }   
                       },
                       options
                     )


  if(myOptions.directions) {
    container.innerHTML='<div style="position:absolute;z-index:1;background:#eee;color:black;padding:0em;border:1px solid silver">'+
                        '<div style="text-align:center"><button id="BMapDriving" onclick="getDirections(this.innerHTML==\'Driving directions\')" style="border:1px solid silver;padding:0px 5px;overflow:visible;margin:0px;font-size:8pt;font-family:verdana">Driving directions</button></div>'+
                        '<table id="_TDrivingDirections" cellspacing=5 cellpadding=0 style="font-family:arial;font-size:10pt;display:none;border:none">'+
                        '<tr><td style="padding:0em;border:none;width:3em"><b>From:</b> <td style="width:30em;padding:0em;border:none"><input id="_DRIVING" type="text" size="50" style="width:100%" placeholder="Enter starting location" onchange="mapRoute(WM,this.value,$t(\'_DEST\'))">    <td style="padding:0px 5px;border:none;color:#888;cursor:pointer" onclick="$(\'_DRIVING\').value=\'\'; $(\'_DRIVING\').focus()">X'+
                        '<tr><td style="padding:0em;border:none">          <b>To:</b>   <td style="           padding:0em;border:none"><input id="_DEST"    type="text" size="50" style="width:100%" placeholder="Enter ending location"   onchange="mapRoute(WM,$t(\'_DRIVING\'),this.value)"> <td style="padding:0px 5px;border:none;color:#888;cursor:pointer" onclick="$(\'_DEST\').value   =\'\'; $(\'_DEST\').focus()   ">X'+
                        '<tr><td style="padding:0em;border:none">          &nbsp;       <td style="           padding:0em;border:none"><button onclick="mapRoute(WM,$t(\'_DRIVING\'),$t(\'_DEST\'))">Directions</button>'+
                        '</table>'+
                        '</div>'+
                        '<table cellspacing=0 cellpadding=0 style="width:100%">'+
//                        ' <col style="width:75%">'+
                        '<tr valign="top">'+
                        '<td style="padding:0em;border:none"><div id="_MAP" style="border:1px solid black;height:'+container.clientHeight+'px"></div>'+
                        '<td style="padding:0em;border:none"><div id="_PANEL" style="position:relative;z-index:500000;background:white;display:none;height:'+(container.clientHeight)+'px;overflow-y:auto;border:1px solid black;padding:0px 10px"></div>'+
                        '</table>'
    container.style.height=''
    container=$('_MAP')
  }

  var WM = new google.maps.Map(container,myOptions)

  mapType(WM,myOptions.type)

  WM.loaded=false
  if(myOptions.zoom || myOptions.lat || myOptions.lng) {
    WM.setZoom(myOptions.zoom?myOptions.zoom:10)
    WM.setCenter(new google.maps.LatLng(myOptions.lat?myOptions.lat:32.8499, myOptions.lng?myOptions.lng:-83.565))
    WM.loaded=true
  }
  else {
    var bounds=new google.maps.LatLngBounds()
    bounds.extend(new google.maps.LatLng(30,-81))
    bounds.extend(new google.maps.LatLng(30,-85))
    bounds.extend(new google.maps.LatLng(35,-81))
    bounds.extend(new google.maps.LatLng(35,-85))
    WM.fitBounds(bounds)
    google.maps.event.addListenerOnce(WM, 'bounds_changed', function(event) {WM.loaded=true})
  }
  defineMapTypes(WM)

  google.maps.event.addListener(WM, 'mousedown',function(){try{mapmenu.hide()}catch(ee){}})

  google.maps.event.addListener(WM, 'maptypeid_changed',
                                function(){
                                  try {
                                    if(WM.mapTypeId=='OSM') {
                                      $('OSMKey').innerHTML=OSMLegend(WM.getZoom())
                                      Show('OSMKey')
                                    }
                                    else Hide('OSMKey')
                                  } catch(ee){}
                                }
                               )

  google.maps.event.addListener(WM, 'zoom_changed',
                                function(){
                                  try{
                                    if(WM.mapTypeId=='OSM') $('OSMKey').innerHTML=OSMLegend(WM.getZoom())
                                  }catch(ee){}
                                }
                               )

  WM.options=myOptions
  WM.options.type=options.type
  WM.polygons=[]
  WM.labels=[]

  if(WM.options.contextmenu) {
    google.maps.event.addListener(WM, 'rightclick',
      function(e){
        if(incontext) return
        tooltip.hide()
        WM.options.contextmenu(null,e.latLng.lat(),e.latLng.lng())
      }
    )
  }

  if(WM.options.mousemove) {
    google.maps.event.addListener(WM, 'mousemove',
      function(e){
        return WM.options.mousemove(e)
      }
    )
  }

  try{
    WM.controls[google.maps.ControlPosition.RIGHT_TOP].push(document.getElementById('DLegend'))
  }catch(ee){}

  if(myOptions.earth) googleEarth = new GoogleEarth(WM)

 // mapSQL(WM,myOptions.sql)

  WM.legend=[]
  WM.dec=[]
  WM.units=[]
  WM.options.range=null

  return WM
} //Map

//__________________________________________________________________________________________________________________________________________________________________
function geocode(address,fnc,lab){
  if(!geocoder) geocoder = new google.maps.Geocoder()
  geocoder.geocode({address:address},
                   function(results,status){fnc(results,status,lab)}
                  )
} //geocode

function geocodeLL(lat,lng,fnc,lab){
  if(!geocoder) geocoder = new google.maps.Geocoder()
  var latlng=new google.maps.LatLng(lat, lng)
  geocoder.geocode({'latLng':latlng},
                   function(results,status){
                     if(status == google.maps.GeocoderStatus.OK) {
                       fnc(results,status,lab)
                     }
                     else if(status=='OVER_QUERY_LIMIT'){
                       setTimeout(function(){geocodeLL(lat,lng,fnc,lab)},1000)
                     }
                   }
                  )
} //geocodeLL

function geoparse(type,results){
  for(var j in results){
    var r=results[j].address_components
    for(var i in r) {
      var ri=r[i]
      for(var j in ri.types){
        if     (type=='Number'  && ri.types[j]=='street_number')               return r[i].short_name
        else if(type=='Street'  && ri.types[j]=='route')                       return r[i].short_name
        else if(type=='City'    && ri.types[j]=='locality')                    return r[i].long_name
        else if(type=='County'  && ri.types[j]=='administrative_area_level_2') return r[i].long_name
        else if(type=='State'   && ri.types[j]=='administrative_area_level_1') return r[i].short_name
        else if(type=='Zip'     && ri.types[j]=='postal_code')                 return r[i].short_name
      }
    }
  }
  return ''
} //geoparse

//__________________________________________________________________________________________________________________________________________________________________
function OSMLegend(zoom){
  function addOSMKey(typ,img,min,max){
    if(min<zoom && zoom<max) OSMKey.push('<tr valign="top"><th style="text-align:center;padding:0em 0.2em;border:none"><img src="http://www.openstreetmap.org/assets/key/mapnik/'+img+'"><td style="padding:0.2em 0.5em;border:none">'+typ)
  }

  var OSMKey=[]
  OSMKey.push('<table cellspacing=0 cellpadding=0 style="border:1px solid black;background:#eee;font-family:verdana;font-size:8pt">')
  addOSMKey("Motorway"			,"motorway-7fb4051c1b63f580e94633042e944584.png"     ,0 ,18)
  addOSMKey("Trunk road"		,"trunk-12fb8f9ab01e951514832becbdd96e59.png"	     ,0 ,11)
  addOSMKey("Trunk road"		,"trunk12-0e5de23fa841c9637c0b579696bb1046.png"	     ,12,18)
  addOSMKey("Primary road"		,"primary-8d14bdc1cbf3635ad428d214fe9f4000.png"	     ,7 ,11)
  addOSMKey("Primary road"		,"primary12-32b46768c0c3bf539534a1200946b40e.png"    ,12,18)
  addOSMKey("Secondary road"		,"secondary-b628280a79a24bbef1344a6976b0f2d2.png"    ,9 ,11)
  addOSMKey("Secondary road"		,"secondary12-46cab7379f06c9bf88285e3ba43083be.png"  ,12,18)
  addOSMKey("Unsurfaced road"		,"unsurfaced-25461c6198c3b98531654c84b1afb222.png"   ,13,18)
  addOSMKey("Track"			,"track-5d5dc5369a93571e13cbb0677f564b23.png"	     ,13,18)
  addOSMKey("Byway"			,"byway-8ac5412595baa98b295d9b0f38b52b0e.png"	     ,13,18)
  addOSMKey("Bridleway"			,"bridleway-5b3c9e1df10eda7efe36e53c031737f6.png"    ,13,18)
  addOSMKey("Cycleway"			,"cycleway-a6c3acb5661ddd6347d9b4f8b33c7d74.png"     ,13,18)
  addOSMKey("Footway"			,"footway-404067cb1f741158ad96ee104dcfaf60.png"	     ,13,18)
  addOSMKey("Railway"			,"rail-f990621612cfce0ad312bf8dd1fcf47a.png"	     ,8 ,12)
  addOSMKey("Railway"			,"rail13-248373c7d94902f1801dc131dc5e0a06.png"	     ,13,18)
  addOSMKey("Subway"			,"subway-4f147c07b3e15eaa3feffca511c86d75.png"	     ,13,18)
  addOSMKey("Light rail and tram"	,"tram-68eaeb386f74fb7d397e7fbd78db6a84.png"	     ,13,18)
  addOSMKey("Cable car and chair lift"	,"cable-b1f5032d85b8de744991ae8730546851.png"	     ,12,18)
  addOSMKey("Airport Runway and taxiway","runway-9852a7582d1fda673efec39369d1b2a9.png"	     ,11,18)
  addOSMKey("Airport apron and terminal","apron-3cbe5385a6c21eb9c911329cf09f9d8e.png"	     ,12,18)
  addOSMKey("Administrative boundary"	,"admin-e607162f60bf6b8de710a37db53646ab.png"	     ,0 ,18)
  addOSMKey("Forest"			,"forest-e1e9ab0d6e1a1ef19c8ffba95f335011.png"	     ,9 ,18)
  addOSMKey("Wood"			,"wood-09758d409332ad8eecb47ab5a2283713.png"	     ,10,18)
  addOSMKey("Golf course"		,"golf-80a8bc61c2829d13f17d5755a46076b9.png"	     ,10,18)
  addOSMKey("Park"			,"park-3c328df8b0bdb6a929660fd7d68f147d.png"	     ,10,18)
  addOSMKey("Residential area"		,"resident-46494427886556d7bd2459ecf5e9ac95.png"     ,8 ,18)
  addOSMKey("Tourist attraction"	,"tourist-a0807b992368ab16f7fa0014ed44772d.png"	     ,10,18)
  addOSMKey("Common and meadow"		,"common-695c1fb304063e0517ede01f0ba19d35.png"	     ,10,18)
  addOSMKey("Retail area"		,"retail-4790dc7f1c3f780ab388f5b321c89fa2.png"	     ,10,18)
  addOSMKey("Industrial area"		,"industrial-03b9be512cac9c71c08d52bfc442a960.png"   ,10,18)
  addOSMKey("Commercial area"		,"commercial-ca1de75d228c99768054c3de20183198.png"   ,10,18)
  addOSMKey("Heathland"			,"heathland-befc73b124af2660fe871d07ba07d219.png"    ,10,18)
  addOSMKey("Lake and reservoir"	,"lake-c191e9fa042d27bd9eaea08c57859229.png"	     ,7 ,18)
  addOSMKey("Farm"			,"farm-82edc58cf7a46b75ad9307acd8f58f52.png"	     ,10,18)
  addOSMKey("Brownfield site"		,"brownfield-cb0b070fd71c958fcc35c6328db72378.png"   ,10,18)
  addOSMKey("Cemetery"			,"cemetery-995b24baf6727d6b3b5a4d1019537173.png"     ,11,18)
  addOSMKey("Allotments"		,"allotments-1e2a54573cbcee4231e1a0ef96714561.png"   ,11,18)
  addOSMKey("Sports pitch"		,"pitch-30d80347ab013aeb4007899a7f1cced8.png"	     ,11,18)
  addOSMKey("Sports centre"		,"centre-3c4547f634fa12fe0c8dc8170376f977.png"	     ,11,18)
  addOSMKey("Nature reserve"		,"reserve-0f1d23ae1db2e606e914811f6ad1f817.png"	     ,11,18)
  addOSMKey("Military area"		,"military-e4fd52948694f07c5a70ba47a2055882.png"     ,11,18)
  addOSMKey("School and university"	,"school-b134d593f12987695e532742e4cf885e.png"	     ,12,18)
  addOSMKey("Significant building"	,"building-05a03b57ef3ab98f1149e6bf7faba283.png"     ,12,18)
  addOSMKey("Railway station"		,"station-497a40e5d8fb85bcb11db044794e6de7.png"	     ,12,18)
  addOSMKey("Summit and peak"		,"summit-b1012df0e5910ea844c97054914e263b.png"	     ,12,18)
  addOSMKey("Dashed casing = tunnel"	,"tunnel-c187e6c137f8b56f4ce61f060cfe7f2f.png"	     ,12,18)
  addOSMKey("Black casing = bridge"	,"bridge-e968cea22eb0c832c5ac4b4b0533b854.png"	     ,13,18)
  addOSMKey("Private access"		,"private-3fffa831ec63c962bf22523afd08e82e.png"	     ,15,18)
  addOSMKey("Permissive access"		,"permissive-f5796c28702ff95e4b319aa0d0cf3398.png"   ,15,18)
  addOSMKey("Destination access"	,"destination-1feac25da6ba2aaef09efb63e6de40df.png"  ,15,18)
  addOSMKey("Roads under construction"	,"construction-18e3fd3fa068c061a2ae984d902acc5c.png" ,12,18)
  OSMKey.push('</table>')
  return OSMKey.join('')
} //OSMLegend

function toLatLng(p){
  return new google.maps.LatLng(p[0],p[1])
} //toLatLng

//__________________________________________________________________________________________________________________________________________________________________

var geocoder


