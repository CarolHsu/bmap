var scrollAmount = 0;

function scr() {
    window.scrollBy(0,5);
    scrollAmount += 5;
    if(scrollAmount < 300) {
        scrolldelay = setTimeout('scr()',1);
    }
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
var point = new BMap.Point(120.8792,31.4570);
map.centerAndZoom(point,15);
map.enableScrollWheelZoom();
map.addControl(new BMap.NavigationControl());

//json data
var data;

function loadDATA(callback){
  $.ajax({
    url:"JSON/data.json",
    type:"GET",
    dataType:"json",
    success: function(json){
      data = json;
      setTimeout(loadDATA(), 60000);
    },
    error: function(){
      alert("error...");
    }
  });
}
setTimeout(loadDATA(), 1);

function showCMS(){
  scr();
  map.clearOverlays();
  var myIcon = new BMap.Icon("stylesheet/image/cms.gif", new BMap.Size(35,35));
  for(var i = 0; i < data.cms.length; i++){
    (function(x){
      var cms = new BMap.Marker(new BMap.Point(data.cms[x].lng,data.cms[x].lat),{icon:myIcon});
      map.addOverlay(cms);
      cms.show();
      cms.setAnimation(BMAP_ANIMATION_BOUNCE);
      var windowOpt = {
        width: 200,
        height: 80,
        title: "<strong>" + data.cms[x].name + "</strong>"
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
  scr();
  map.clearOverlays();
  var myIcon = new BMap.Icon("stylesheet/image/vd.gif", new BMap.Size(35,35));
  for(var i = 0; i < data.vd.length; i++){
    (function(x){
      var vd = new BMap.Marker(new BMap.Point(data.vd[x].lng,data.vd[x].lat), {icon:myIcon});
      map.addOverlay(vd);
      vd.show();
      vd.setAnimation(BMAP_ANIMATION_BOUNCE);
      var windowOpt = {
        width: 200,
        height: 80,
        title: "<strong>" + data.vd[x].name + "</strong>"
      }
      var windowContent = "平均速度 : " + data.vd[x].info.avgspeed + "<br />最大流量 : " + data.vd[x].info.bigvolumn;
      var infoWindow = new BMap.InfoWindow(windowContent, windowOpt);
      vd.addEventListener("click", function(){
        this.openInfoWindow(infoWindow);
      });
    })(i);
  }
}

function showPolyline(){
  scr();
  map.clearOverlays();
  for(var i = 0; i < data.route.length; i++){
    (function(x){
      var color;
      if (data.route[x].speed < 19) {
        color = "#ff0000";
        var routeMarker = new BMap.Marker(new BMap.Point(data.route[x].points[data.route[x].points.length/2].lng,data.route[x].points[data.route[x].points.length/2].lat));
        map.addOverlay(routeMarker);
        routeMarker.show();
        routeMarker.setAnimation(BMAP_ANIMATION_BOUNCE);
        var windowOpt = {
          width: 300,
          height: 150,
          title: "<strong>" + data.route[x].name + "</strong>"
        }
        var windowContent = "平均速率 : " + data.route[x].speed + " km/hr<br />建議改道路段 :<br/>" + data.route[x].suggestion;
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
        pots[j] = new BMap.Point(data.route[x].points[j].lng,data.route[x].points[j].lat);
      }
      var route = new BMap.Polyline(pots,{strokeColor:color, strokeWeight:6, strokeOpacity:0.5});
      map.addOverlay(route);
      })(i);
  }
}