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


var map = new BMap.Map("map");            // 创建Map实例
var point = new BMap.Point(120.8792,31.4570);    // 创建点坐标
map.centerAndZoom(point,15);                     // 初始化地图,设置中心点坐标和地图级别。
map.enableScrollWheelZoom();                            //启用滚轮放大缩小
map.addControl(new BMap.NavigationControl());
//左鍵坐標
// map.addEventListener("click",function(e){
//     alert(e.point.lng + "," + e.point.lat);
// });

//json

// var routes;
// var cmses;
// var vds;
var data;

function loadDATA(callback){
  $.ajax({
    url:"JSON/data.json",
    type:"GET",
    dataType:"json",
    success: function(json){
      data = json;
      //setTimeout(loadDATA(), 60000);
    },
    error: function(){
      alert("error...");
    }
  });
}
// var data = loadDATA();
setTimeout(loadDATA(), 10);

function showCMS(){
  scr();
  map.clearOverlays();
  cmses = new Array(data.cms.length);
  var myIcon = new BMap.Icon("stylesheet/image/cms.gif", new BMap.Size(35,35));
  for(var i = 0; i < data.cms.length; i++){
    (function(x){
      var cms = new BMap.Marker(new BMap.Point(data.cms[x].lng,data.cms[x].lat),{icon:myIcon});
      map.addOverlay(cms);
      cms.show();
      var windowOpt = {
        width: 250,
        height: 100,
        title: "<strong>" + data.cms[x].name + "</strong>"
      }
      var windowContent = "";
      for(var j = 0; j < data.cms[x].info.length; j++){
        windowContent += "<p>" + data.cms[x].info[j] + "</p>";
      }
      var infoWindow = new BMap.InfoWindow(windowContent, windowOpt);
      cms.addEventListener("click", function(){
        this.openInfoWindow(infoWindow);
      });
    })(i);
    
    // var myIcon = new BMap.Icon("stylesheet/image/cms.gif", new BMap.Size(35,35));
    // cmses[i] = new BMap.Marker(new BMap.Point(data.cms[i].lng,data.cms[i].lat),{icon:myIcon});
    // map.addOverlay(cmses[i]);
    // cmses[i].setAnimation(BMAP_ANIMATION_BOUNCE);
    // cmses[i].show();
    // var innerHTML;
    // for(var j = 0; j < data.cms[i].info.length; j++){
    //   innerHTML += "<p>" + data.cms[i].info[j] + "</p>";
    // }
    // var infoWindow = new BMap.InfoWindow(innerHTML);
    // cmses[i].addEventListener("click", function(){this.openInfoWindow(infoWindow);});
  }
}

function showVD(){
  scr();
  map.clearOverlays();
  vds = new Array(data.vd.length);
  for(var i = 0; i < data.vd.length; i++){
    var myIcon = new BMap.Icon("stylesheet/image/vd.gif", new BMap.Size(35,35));
    vds[i] = new BMap.Marker(new BMap.Point(data.vd[i].lng,data.vd[i].lat),{icon:myIcon});
    map.addOverlay(vds[i]);
    vds[i].setAnimation(BMAP_ANIMATION_BOUNCE);
    vds[i].show();
  }
}

function showPolyline(){
  scr();
  map.clearOverlays();
  routes = new Array(data.route.length);
  for(var i = 0; i < data.route.length; i++){
    var color;
    var points = new Array(data.route[i].points.length);
    if(data.route[i].speed < 19){
      color = "#ff0000";
    }
    else if(data.route[i].speed >= 19 && data.route[i].speed < 40){
      color = "#ff9900";
    }
    else{
      color = "#009900"
    }
    for(var j = 0; j < data.route[i].points.length; j++){
      points[j] = new BMap.Point(data.route[i].points[j].lng,data.route[i].points[j].lat);
    }
    routes[i] = new BMap.Polyline(points,{strokeColor:color, strokeWeight:6, strokeOpacity:0.5});
    map.addOverlay(routes[i]);
  }
}