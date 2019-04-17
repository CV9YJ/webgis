window.onload = function () {
    var map = new AMap.Map('container', {
        resizeEnable: true,
        zoom: 12,
        center: [106.642024, 26.389751]
    });
    //地图内容
    map.setFeatures(['bg', 'building', 'road', 'point'])
    //地图空间
    AMap.plugin(['AMap.ToolBar', 'AMap.Scale', 'AMap.MapType'],
        function () {
            map.addControl(new AMap.ToolBar());

            map.addControl(new AMap.Scale());
        });
    //覆盖物
    var marker = new AMap.Marker({
        position: [106.642024, 26.389751]
    });
    marker.setMap(map);
    var circle = new AMap.Circle({
        center: [106.642024, 26.389751],
        radius: 100,
        fillOpacity: 0.2,
        strokeWeight: 1
    })
    circle.setMap(map);
    //自定义窗体
    var infowindow;
    var infoWindowContent = '<div class="infowindow-content"><h3>地图导航系统</h3><p>基于高德地图API</p><span style="color:red;font-size:12px;">选择地址与出行方式</span></div>';
    map.plugin('AMap.AdvancedInfoWindow', function () {
        infowindow = new AMap.AdvancedInfoWindow({
            panel: 'panel',
            placeSearch: true,
            asOrigin: true,
            asDestination: true,
            content: infoWindowContent
        });
        infowindow.open(map, [106.642024, 26.389751]);
    });
    var locationMarker;
    $("#location").click(function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var coords = position.coords;
                //定位成功
                var longtitude = coords.longitude;
                var latitude = coords.latitude;
                //覆盖物
                if (locationMarker) {
                    locationMarker.setMap(null);
                    locationMarker = null;
                }

                locationMarker = new AMap.Marker({
                    position: [longtitude, latitude]
                });
                locationMarker.setMap(map);



                //自定义窗体
                var locationInfowindow;                
                map.plugin('AMap.AdvancedInfoWindow', function () {
                    infowindow = new AMap.AdvancedInfoWindow({                       
                        content: "我的位置"
                    });
                    infowindow.open(map, [longtitude, latitude]);
                });

              //  alert(position);
            }, 
                function (error) {
                  alert("定位失败"+error);
                }  
                , {
                    enableHighAccuracy: true, //boolean 是否要求高精度的地理信息，默认为false
                    maximumAge: 1000 //应用程序的缓存时间
            });
        } else {
            alert("Your browser does not support Geolocation!");
        }  
    });






    //汽车路线规划
    $('#car').on('click', function () {
        var start = $('#star').val();
        var end = $('#end').val();
        if (start == "" || end == "") {
            alert("起点或终点不能为空");
            return;
        }
        //清空结果
        $("#panel").html("");

       //获取策略        
        var _policy = AMap.DrivingPolicy.LEAST_TIME;
        var transitTransferPolicy = $('#DrivingPolicy').val();
        switch (transitTransferPolicy) {
            case "LEAST_TIME":
                _policy = AMap.DrivingPolicy.LEAST_TIME;
                break;
            case "LEAST_FEE":
                _policy = AMap.TransferPolicy.LEAST_FEE;
                break;
            case "LEAST_DISTANCE":
                _policy = AMap.TransferPolicy.LEAST_DISTANCE;
                break;
            case "REAL_TRAFFIC":
                _policy = AMap.TransferPolicy.REAL_TRAFFIC;
                break;           
            default:
                break;
        }

        $('.pageShow').slideToggle();
        clearMarker()
        AMap.plugin('AMap.Driving', function () {
            var drving = new AMap.Driving({
                map: map,
                panel: "panel",
                policy: _policy
            })
            drving.search([
                { keyword: $('#star').val() },
                { keyword: $('#end').val() }
            ]);
        })
    })
    //公交路线规划
    $("#transit").on('click', function () {
        var start = $('#cStar').val();
        var end = $('#cEnd').val();
        if (start == "" || end == "") {
            alert("起点或终点不能为空");
            return;
        }

        $("#panel").html("");

        $('.pageShow').slideToggle();
        clearMarker()

        //获取策略
        var _policy = AMap.TransferPolicy.LEAST_TIME;
        var transitTransferPolicy = $('#TransferPolicy').val();
        switch (transitTransferPolicy) {
            case "LEAST_TIME":
                _policy = AMap.TransferPolicy.LEAST_TIME;
                break;
            case "LEAST_FEE":
                _policy = AMap.TransferPolicy.LEAST_FEE;
                break;
            case "LEAST_TRANSFER":
                _policy = AMap.TransferPolicy.LEAST_TRANSFER;
                break;
            case "LEAST_WALK":
                _policy = AMap.TransferPolicy.LEAST_WALK;
                break;
            case "MOST_COMFORT":
                _policy = AMap.TransferPolicy.MOST_COMFORT;
                break;
            case "NO_SUBWAY":
                _policy = AMap.TransferPolicy.NO_SUBWAY;
                break;
         
            default:
                break;
        }

        var transOptions = {
            map: map,
            city: '贵阳市',
            panel: 'panel',
            policy: _policy //乘车策略
        };
        //构造公交换乘类
        var transfer = new AMap.Transfer(transOptions);
        //根据起、终点名称查询公交换乘路线
        transfer.search([
            { keyword: $('#cStar').val() , city: '贵阳市' },
            //第一个元素city缺省时取transOptions的city属性
            { keyword: $('#cEnd').val() , city: '贵阳市' }
            //第二个元素city缺省时取transOptions的cityd属性
        ], function (status, result) {
            // result即是对应的公交路线数据信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_TransferResult
            if (status === 'complete') {
               // log.success('绘制公交路线完成')
            } else {
               // log.error('公交路线数据查询失败' + result)
                }
            });
        })
//骑行路线规划
    $('#walk').on('click', function () {
        var start = $('#wStar').val();
        var end = $('#wEnd').val();
        if (start == "" || end == "") {
            alert("起点或终点不能为空");
            return;
        }
        $("#panel").html("");
        
        var _policy =0;
        var transitTransferPolicy = $('#WalkingPolicy').val();
        switch (transitTransferPolicy) {
            case "0":
                _policy = 0;
                break;
            case "1":
                _policy =1;
                break;
            case "2":
                _policy =2;
                break;          
            default:
                break;
        }


    $('.pageShow').slideToggle();
    clearMarker()
    var riding = new AMap.Riding({
        map: map,
        panel: "panel"
    });
    riding.search([
        { keyword: $('#wStar').val() },
        { keyword: $('#wEnd').val() }
    ]);
})

function clearMarker() {
    if (marker) {
        marker.setMap(null);
        marker = null;
    }
    if (infowindow) {
        infowindow.close()
    }
}

//输入提示
var autoOptions = new AMap.Autocomplete({
    input: "tipinput"
});
//城市搜索
var auto = new AMap.Autocomplete(autoOptions);
var placeSearch = new AMap.PlaceSearch({
    map: map
});  //构造地点查询类
AMap.event.addListener(auto, "select", select);//注册监听，当选中某条记录时会触发
function select(e) {
    placeSearch.setCity(e.poi.adcode);
    placeSearch.search(e.poi.name);  //关键字查询查询
}

$('#show').on('click', function () {
    clearMarker()
    $('.pageShow').slideToggle();
})

$('#box').on('click', function () {
    clearMarker()
    $('.pageShow').slideToggle();
    var rectOptions = {
        strokeStyle: "dashed",
        strokeColor: "#333",
        fillColor: "#333",
        fillOpacity: 0.3,
        strokeOpacity: 1,
        strokeWeight: 1
    };
    map.plugin(["AMap.MouseTool"], function () {
        var mouseTool = new AMap.MouseTool(map);
        //通过rectOptions更改拉框放大时鼠标绘制的矩形框样式
        mouseTool.rectZoomIn(rectOptions);
    });
})
$('#meter').on('click', function () {
    $('.pageShow').slideToggle();
    map.plugin(["AMap.RangingTool"], function () {
        ruler1 = new AMap.RangingTool(map);
        AMap.event.addListener(ruler1, "end", function (e) {
            ruler1.turnOff();
        });
        var sMarker = {
            icon: new AMap.Icon({
                size: new AMap.Size(19, 31),//图标大小
                image: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b1.png"
            })
        };
        var eMarker = {
            icon: new AMap.Icon({
                size: new AMap.Size(19, 31),//图标大小
                image: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b2.png"
            }),
            offset: new AMap.Pixel(-9, -31)
        };
        var lOptions = {
            strokeStyle: "solid",
            strokeColor: "#FF33FF",
            strokeOpacity: 1,
            strokeWeight: 2
        };
        var rulerOptions = { startMarkerOptions: sMarker, endMarkerOptions: eMarker, lineOptions: lOptions };
        ruler2 = new AMap.RangingTool(map, rulerOptions);
    });
    //启用自定义样式测距

    ruler1.turnOff();
    ruler2.turnOn();
})
}
