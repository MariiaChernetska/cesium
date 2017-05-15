var data = [
["Engine RPM", [28.441486,49.234070,100,
            28.439415,49.234266,150
            , 28.438932, 49.234343, 100,
            28.436808, 49.234434, 80,
            28.435585, 49.234441, 30]
],
["Engine Temperature", [28.441486,49.234070,200,
            28.439415,49.234266,400
            , 28.438932, 49.234343, 150,
            28.436808, 49.234434, 300,
            28.435585, 49.234441, 180]
],
["Speed", [28.441486,49.234070,100,
            28.439415,49.234266,180
            , 28.438932, 49.234343, 120,
            28.436808, 49.234434, 180,
            28.435585, 49.234441, 80]
],
["Trottle", [28.441486,49.234070,90,
            28.439415,49.234266,50
            , 28.438932, 49.234343, 100,
            28.436808, 49.234434, 80,
            28.435585, 49.234441, 70]
]]
var dataObj = {
    "engineRPM": [{
        lat: 49.234070,
        lon: 28.441486,
        h: 100
    },{
        lat: 49.234266,
        lon: 28.439415,
        h: 200
    },
    {
        lat: 49.234343,
        lon: 28.438932,
        h: 150
    },
    {
        lat: 49.234434,
        lon: 28.436808,
        h: 80
    },
     {
        lat: 49.234441,
        lon: 28.435585,
        h: 250
    }
    ]
}
//first longtutide, second latitude
function GraphBuilder(data, viewer){
    var sourceName = '';
    var coords = [];
    var colors = [Cesium.Color.CADETBLUE, Cesium.Color.BLUEVIOLET, Cesium.Color.DARKGREEN, Cesium.Color.DARKSALMON]
    var color = "";
    var show = true;
    var top = 0;
    getCoordsFromArray(data);
    function getCoords(data){
        for(var key in data){
            
            data[key].forEach(function(element, i, arr) {
                coords.push(element.lon, element.lat, element.h)
            }, this);
            switch(key){
                case "engineRPM":{
                    sourceName = "Engine RPM";
                    color = colors[0];
                    console.log(color)
                }
            }
            createGraph();
        }
    }
    function getCoordsFromArray(data){
       for (var x = 0; x < data.length; x++) {
        var series = data[x];
        coords = series[1];
        sourceName = series[0];
        color = colors[x];
      
        createGraph(x);
        
        createButton(x, sourceName);
       
    } }
    function createGraph(x){
      viewer.entities.add({
        name : sourceName,
        wall : {
            positions : Cesium.Cartesian3.fromDegreesArrayHeights(coords),
            material : new Cesium.ColorMaterialProperty(color.withAlpha(0.7)),
            outline : true,
            outlineColor : Cesium.Color.BLACK,
            show: show
        }
    });
    

}
 function toggleEntity(e){
        var switcher = e.target;
        var entity = viewer.entities.values[switcher.id]
        var val = !entity.show;
        entity.show = val;
    }
function createButton(index, text){
        var but = document.createElement("button");
        but.className = "switcher";
        but.innerText = text; 
        but.id = index;
        but.style.top = top+"px";
        top += 50;
        but.addEventListener("click", toggleEntity);
        var body = document.getElementsByTagName("body")
        body[0].appendChild(but)
}

}

var viewer = new Cesium.Viewer('cesiumContainer', {
    selectionIndicator : false,
    infoBox : false
});
var scene = viewer.scene;
var handler;


  
    

    var labelEntity = viewer.entities.add({
        label : {
            show : true,
            showBackground : true,
            font : '14px monospace',
            horizontalOrigin : Cesium.HorizontalOrigin.LEFT,
            verticalOrigin : Cesium.VerticalOrigin.TOP,
            pixelOffset : new Cesium.Cartesian2(15, 0)
        }
    });

    // Mouse over the globe to see the cartographic position
    handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    handler.setInputAction(function(movement) {

        var foundPosition = false;

        var scene = viewer.scene;
        if (scene.mode !== Cesium.SceneMode.MORPHING) {
            var pickedObject = scene.pick(movement.endPosition);
            if (scene.pickPositionSupported && Cesium.defined(pickedObject) && pickedObject.id === modelEntity) {
                var cartesian = viewer.scene.pickPosition(movement.endPosition);

                if (Cesium.defined(cartesian)) {
                    var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                    var longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(2);
                    var latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(2);
                    var heightString = cartographic.height.toFixed(2);

                    labelEntity.position = cartesian;
                    labelEntity.label.show = true;
                    labelEntity.label.text =
                        'Lon: ' + ('   ' + longitudeString).slice(-7) + '\u00B0' +
                        '\nLat: ' + ('   ' + latitudeString).slice(-7) + '\u00B0' +
                        '\nAlt: ' + ('   ' + heightString).slice(-7) + 'm';

                    labelEntity.label.eyeOffset = new Cesium.Cartesian3(0.0, 0.0, -cartographic.height * (scene.mode === Cesium.SceneMode.SCENE2D ? 1.5 : 1.0));

                    foundPosition = true;
                }
            }
        }

        if (!foundPosition) {
            labelEntity.label.show = false;
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

console.log(viewer)
var builder = new GraphBuilder(data, viewer);
viewer.zoomTo(viewer.entities);

