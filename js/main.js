var app = new Vue({
    el: "#app",
    data: {
        username: null,
        username_text_field: "",
        mapElement: null,
        currentPage: 'dashboard',
        popover: 'none',
        activeEvent: 0,
        events: [],
        markers: [],
        mapLocation: {lat: 0.0, long: 0.0},
    },
    methods: {

        openRSVPModal: function() {
            if(this.username == null) {
                this.popover = 'login'
            }else{
                this.popover = 'RSVP'
            }
        },
        getActiveEventInfo: function(prop) {
            if (this.events[this.activeEvent] == null) {
                return ""
            }
            return this.events[this.activeEvent][prop]
            
        },
        login: function() {
            this.username = this.username_text_field
            this.popover = 'none'
        },
        logout: function() {
            this.username = null;
            this.goToDashboard();
        },
        goToDashboard: function() {
            if(this.currentPage != 'dashboard') {
                this.currentPage = 'dashboard';
                setTimeout(() => {initializeMap() }, 50);
            }
        },
        clickMarker: function(id, m) {
            console.log("Going to: " + id.toString());
            //Jump to the event entry with id: id.
            this.activeEvent = id;
            document.getElementById("event-" + id.toString()).scrollIntoView(true);
        },
        setMapLocation: function(lat, long) {
            this.mapElement.setView([lat, long], 13);
            //update the map view
            //add markers
            //search the backend for events, and add them to the events list.
            app.clearEvents();
            var number_of_events = 8 + Math.floor(Math.random() * 8);
            for(var i = 0; i < number_of_events; i++) {
            app.addEvent({
                    title: randomSentence(), 
                    is_full: false, 
                    lat: lat + (Math.random() * 0.05) -0.025, 
                    long: long + (Math.random() * 0.05)-0.025, 
                    start_time: "Oct 12, 2019, 2:30pm", 
                    organization: "United Way", 
                    duration: "4 hours", 
                    details: "lorem ipsum dolor jisf fhsif ishfiahfeif 3fh3fhf8hhahf f f hfaofoaiwf fw foawfoiahfoa hfoiwahfoia wfiaw foiahoifhwafoaf aof"
                });
            }
        },
        clearEvents: function() {
            while(this.events.length > 0) {
                this.events.pop();
            }
        },
        addEvent: function(event) {
            this.events.push(event);
        },
        removeEvent: function(id) {
            this.events.pop(id);
        }
    },
    watch: {
        events: function(oldValue, newValue){
            //clear all markers:
            this.markers.forEach((marker, index) => {
                this.mapElement.removeLayer(marker);
            });
            this.markers = [];
    
            //insert new markers
            newValue.forEach((event, index) => {
                var marker = L.marker([event.lat,event.long]).addTo(this.mapElement).on('click', (m) => this.clickMarker(index, m));
                marker.bindPopup(event.title);
    
                marker.on('mouseover', function (e) {
                    this.openPopup();
                });
    
                marker.on('mouseout', function (e) {
                    this.closePopup();
                });
                this.markers.push(marker)
            });
        }
    }
});