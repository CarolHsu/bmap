var scrollAmount = 0;


function scr() {
    // window.scrollBy(0,20);
    // scrollAmount += 20;
    // if(scrollAmount < 1000) {
    //     scrolldelay = setTimeout('scr()',1);
    // }
}

function scrUp() {
    window.scrollBy(0,-20);
    scrollAmount += 20;
    if(scrollAmount < 1000) {
        scrolldelay = setTimeout('scrUp()',1);
    }
}

function back() {
  scrollAmount = 0;
  scrUp();
}

function updateTime(){
  var hour        = now.getHours();
  var minute      = now.getMinutes();
  var second      = now.getSeconds();
  var monthnumber = now.getMonth();
  var monthday    = now.getDate();
  var year        = now.getYear();
}


var map = new BMap.Map("map");
var point = new BMap.Point(120.871936, 31.464811);
map.centerAndZoom(point,15);
map.enableScrollWheelZoom();
map.addControl(new BMap.NavigationControl());


// map.addEventListener("click", function(e){
//   alert(e.point.lng + ", " + e.point.lat);
// });
//json data
var data;

function loadDATA(){
  $.ajax({
    url:"JSON/data.json",
    type:"GET",
    dataType:"json",
    success: function(json){
      data = json;
      setTimeout(loadDATA(), 60000);
    },
    error: function(result){
      console.log("FAILED : " + result.status + ' ' + result.statusText);
    }
  });
}
setTimeout(loadDATA(), 1);

function showCMS(){
  scrollAmount = 0;
  scr();
  map.clearOverlays();
  var myIcon = new BMap.Icon("stylesheet/image/cms.gif", new BMap.Size(35,35));
  for(var i = 0; i < data.cms.length; i++){
    (function(x){
      var cms = new BMap.Marker(new BMap.Point(data.cms[x].lng + 0.0065,data.cms[x].lat + 0.0060),{icon:myIcon});
      map.addOverlay(cms);
      cms.show();
      cms.setAnimation(BMAP_ANIMATION_BOUNCE);
      var windowOpt = {
        width: 300,
        height: 150,
        title: "<strong>" + data.cms[x].name + " - " + data.cms[x].location + "</strong><hr />"
      }
      var windowContent = "";
      for(var j = 0; j < data.cms[x].info.length; j++){
        windowContent += data.cms[x].info[j] + "<br />";
      }
      var infoWindow = new BMap.InfoWindow(windowContent, windowOpt);
      cms.addEventListener("click", function(){
        this.openInfoWindow(infoWindow);
      });
    })(i);
  }
}

function showVD(){
  scrollAmount = 0;
  scr();
  map.clearOverlays();
  var myIcon = new BMap.Icon("stylesheet/image/vd.gif", new BMap.Size(35,35));
  for(var i = 0; i < data.vd.length; i++){
    (function(x){
      var vd = new BMap.Marker(new BMap.Point(data.vd[x].lng + 0.0065,data.vd[x].lat + 0.0060), {icon:myIcon});
      map.addOverlay(vd);
      vd.show();
      vd.setAnimation(BMAP_ANIMATION_BOUNCE);
      var windowOpt = {
        width: 300,
        height: 150,
        title: "<strong>" + data.vd[x].name + " - " + data.vd[x].location + "</strong><hr />"
      }
      var windowContent = "平均速度 : " + data.vd[x].info.avgspeed + " km/hr<br />最大流量 : " + data.vd[x].info.bigvolumn;
      var infoWindow = new BMap.InfoWindow(windowContent, windowOpt);
      vd.addEventListener("click", function(){
        this.openInfoWindow(infoWindow);
      });
    })(i);
  }  
}

function showPolyline(){
  scrollAmount = 0;
  scr();
  map.clearOverlays();
  for(var i = 0; i < data.route.length; i++){
    (function(x){
      var color;
      if (data.route[x].speed < 19) {
        color = "#ff0000";
        var routeMarker = new BMap.Marker(new BMap.Point(data.route[x].points[data.route[x].points.length - 1].lng + 0.0065,data.route[x].points[data.route[x].points.length - 1].lat + 0.0060));
        map.addOverlay(routeMarker);
        routeMarker.show();
        routeMarker.setAnimation(BMAP_ANIMATION_BOUNCE);
        var windowOpt = {
          width: 300,
          height: 150,
          title: "<strong>路段状况 - 壅塞</strong><hr />"
        }
        var windowContent = "平均速率: " + data.route[x].speed + " km/hr<br />" + data.route[x].suggestion;
        var infoWindow = new BMap.InfoWindow(windowContent, windowOpt);
        routeMarker.addEventListener("click", function(){
          this.openInfoWindow(infoWindow);
        });  
      }
      else if (data.route[x].speed >= 19 && data.route[x].speed < 40) {
        color = "#ff9900";
      }
      else{
        color = "#009900";
      }
      var pots = new Array(data.route[x].points.length);
      for(var j = 0; j < data.route[x].points.length; j++){
        pots[j] = new BMap.Point(data.route[x].points[j].lng + 0.0065,data.route[x].points[j].lat + 0.0060);
      }
      var route = new BMap.Polyline(pots,{strokeColor:color, strokeWeight:6, strokeOpacity:0.5});
      map.addOverlay(route);
      })(i);
  }
}