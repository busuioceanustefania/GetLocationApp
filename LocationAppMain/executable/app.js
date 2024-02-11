 // Map initialization 

    var map = L.map('map').setView([51.505, -0.09], 13);

    //osm layer

    var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    osm.addTo(map);

// asking for current position

    if(!navigator.geolocation) {
        console.log("Your browser doesn't support geolocation feature!")
    } else {
            navigator.geolocation.getCurrentPosition(getPosition);
    }

    var marker, circle;

// the actualt getPosition function that works through geolocation API and checks for my coordonations

    function getPosition(position){
        // console.log(position)
        var lat = position.coords.latitude
        var long = position.coords.longitude
        var accuracy = position.coords.accuracy

        if(marker) {
            map.removeLayer(marker)
        }

        if(circle) {
            map.removeLayer(circle)
        }

        //makes the blue marker to see where i am and the circle that shows the accuracy of my locaiton

        marker = L.marker([lat, long])
        circle = L.circle([lat, long], {radius: accuracy})

        //here is created the feature group - a container for multiple layers in our case the marker and the circle 
        // we simply add them to our current map thorug map.add function

        var featureGroup = L.featureGroup([marker, circle]).addTo(map)

        // this line adjusts the map's view to contain the boundaries of the featureGroup
        // if commented this line the marker and circle will show my location but the map will not redirect me to my location
        map.fitBounds(featureGroup.getBounds())


        //shows coordinates in log 
        console.log("Your coordinate is: Lat: "+ lat +" Long: "+ long+ " Accuracy: "+ accuracy)

        
       ///////////making custom icons

        //hospital icon
        var hospitalIcon = L.icon({
            iconUrl: '../resources/icons/hospital.png',
            iconSize:[35,35]
        })

        //restaurant icon
        var restaurantIcon = L.icon({
            iconUrl: '../resources/icons/restaurant.png',
            iconSize:[35,35]
        })

        //gas icon
        var gasIcon = L.icon({
            iconUrl: '../resources/icons/gas.png',
            iconSize:[35,35]
        })

        //hotel icon
        var hotelIcon = L.icon({
            iconUrl: '../resources/icons/hotel.png',
            iconSize:[35,35]
        })

        
        //////////// marking json location on map

        //putting hospitals on map
        var hospitalLocations = L.geoJSON(hospitalList,{
            onEachFeature:showPopup,
            pointToLayer: function(feature,latlng){
                return L.marker(latlng,{icon:hospitalIcon});
            }
        });

        hospitalLocations.addTo(map);

        //puting restaurant on map 
        var restaurantLocations = L.geoJSON(restaurantList,{
            onEachFeature:showPopup,
            pointToLayer: function(feature,latlng){
                return L.marker(latlng,{icon:restaurantIcon});
            }
        });

        restaurantLocations.addTo(map);

        // putting gas stations on map
        var gasLocations = L.geoJSON(gasList,{
            onEachFeature:showPopup,
            pointToLayer: function(feature,latlng){
                return L.marker(latlng,{icon:gasIcon});
            }
        });

        gasLocations.addTo(map);

        //putting hotel on map
        var hotelLocations = L.geoJSON(hotelList,{
            onEachFeature:showPopup,
            pointToLayer: function(feature,latlng){
                return L.marker(latlng,{icon:hotelIcon});
            }
        });

        hotelLocations.addTo(map);



        ////////////////////////////// making pop-up functions
        function showPopup(feature,layer){
            layer.bindPopup(makePopupContent(feature),{closeButton:false,offset: L.point(0,-8)})
        }

        function makePopupContent(office){
            return `
            <div> 
                <h4>${office.properties.name}</h4>
                <p>${office.properties.address}</p>
                <div class="phone-number">
                    <a href="tel:${office.properties.phone}">${office.properties.phone}</a>
                </div>
            </div>
            `
        }


      

        //left container fill 
        function populateLocations(){
            const ul =document.querySelector('.list');
            restaurantList.forEach((office) => {
                const li=document.createElement('li');
                const div=document.createElement('div');
                const a =document.createElement('a');
                const p = document.createElement('p');

                //calling flyToStore function in order to work properly
                a.addEventListener('click', () => {
                    flyToStore(office);
                });
                
                div.classList.add('office-item');
                a.innerText = office.properties.name;
                a.href='#';
                p.innerText = office.properties.address;

                div.appendChild(a);
                div.appendChild(p);
                li.appendChild(div);
                ul.appendChild(li);
            })

            hotelList.forEach((office) => {
                const li=document.createElement('li');
                const div=document.createElement('div');
                const a =document.createElement('a');
                const p = document.createElement('p');

                //calling flyToStore function in order to work properly
                a.addEventListener('click', () => {
                    flyToStore(office);
                });

                div.classList.add('office-item');
                a.innerText = office.properties.name;
                a.href='#';
                p.innerText = office.properties.address;

                div.appendChild(a);
                div.appendChild(p);
                li.appendChild(div); 
            })

            gasList.forEach((office) => {
                const li=document.createElement('li');
                const div=document.createElement('div');
                const a =document.createElement('a');
                const p = document.createElement('p');

                //calling flyToStore function in order to work properly
                a.addEventListener('click', () => {
                    flyToStore(office);
                });

                div.classList.add('office-item');
                a.innerText = office.properties.name;
                a.href='#';
                p.innerText = office.properties.address;

                div.appendChild(a);
                div.appendChild(p);
                li.appendChild(div);
                ul.appendChild(li);
            })

            hospitalList.forEach((office) => {
                const li=document.createElement('li');
                const div=document.createElement('div');
                const a =document.createElement('a');
                const p = document.createElement('p');

                //calling flyToStore function in order to work properly
                a.addEventListener('click', () => {
                    flyToStore(office);
                });

                div.classList.add('office-item');
                a.innerText = office.properties.name;
                a.href='#';
                p.innerText = office.properties.address;

                div.appendChild(a);
                div.appendChild(p);
                li.appendChild(div);
                ul.appendChild(li);
            })

            
            
        }

        populateLocations();

        //when clicking  fly to location
        function flyToStore(office){
            const lat = office.geometry.coordinates[1];
            const lng = office.geometry.coordinates[0];
            map.flyTo([lat,lng],14, {
                duration : 3
            });
            setTimeout( () => {
                L.popup({closeButton:false,offset: L.point(0,-8)})
                .setLatLng([lat,lng])
                .setContent(makePopupContent(office))
                .openOn(map)
            },3000);
        }
    }

