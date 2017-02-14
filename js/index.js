var app = {
  // Application Constructor
  initialize: function() {
    this.bindEvents();
  },
  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
  },
  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicitly call 'app.receivedEvent(...);'
  onDeviceReady: function() {
    app.receivedEvent('deviceready');
  },
  // Update DOM on a Received Event
  receivedEvent: function(id) {


    //Initializing extensions
    SocialGap.Linkedin_ChangeSettings('apiKey', 'secretKey', 'ldAppDomain', 'ldScopes');

    console.log('Received Event: ' + id);
  },
  logonSuccess: function(accessToken)
  {
    alert(accessToken);
    console.log(accessToken);
  },

  logonFailure: function(){
    alert('Fail');
    console.log('Fail');
  }
};
app.initialize();