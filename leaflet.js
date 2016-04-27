var mymap;
var marker = null;
var address;

var loadPhotos = function() {
  $("#direcciones").empty();
  $("#pict").empty();
  var flickerAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
  $.getJSON( flickerAPI, {
    tags: address,
    tagmode: "any",
    format: "json"
  })
  .done(function( data ) {
    console.log("Success");
    if(data.stat == "fail"){

    }
    $.each( data.items, function( i, item ) {
      $("#pict").append('<img src="'+item.media.m+' "/>');
      if ( i === 3 ) {
        return false;
      }
    });
  });
};

var loadResult = function(items){
  $("#direcciones").empty();
  if (items.length != 0) {
    $('<p>', { html: "Search results:" }).appendTo('#direcciones');
    $('<ul/>', {
      'class': 'my-new-list',
      html: items.join('')
    }).appendTo('#direcciones');
  } else {
    $('<p>', { html: "No results found" }).appendTo('#direcciones');
  }
};

var searchAddress = function(){
  address = $("#direccion").val();
  console.log(address);

  var items = [];
  var i = 0;
  $.getJSON('http://nominatim.openstreetmap.org/search?format=json&limit=5&q=' + address, function(data) {
    $.each(data, function(key, val) {
      items[i]=( "<li><a href='#' onclick='rightAddress(" + val.lat + ", " + val.lon + ");return false;'>" + val.display_name +'</a></li>');
      console.log(items[i]);
      i++;
    });
    loadResult(items);
  });
};

var rightAddress = function(lat, long){
  marker = L.marker([lat, long]);
  marker.addTo(mymap);
  mymap.panTo(new L.LatLng(lat, long));
  mymap.setZoom(16);
  loadPhotos();
};


$(document).ready(function(){
  mymap = L.map('map');

  mymap.locate({setView: true, maxZoom: 16});

  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	   attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mymap);

  $("#send").click(searchAddress);
});
