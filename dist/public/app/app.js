"use strict";function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function, not "+typeof b);a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,enumerable:!1,writable:!0,configurable:!0}}),b&&(Object.setPrototypeOf?Object.setPrototypeOf(a,b):a.__proto__=b)}angular.module("classViewApp.resources",["ngResource"]).constant("API_BASE_URL","/api"),angular.module("classViewApp",["ngCookies","ngResource","ngSanitize","ui.router","ui.bootstrap","com.2fdevs.videogular","com.2fdevs.videogular.plugins.controls","classViewApp.resources","ui.dashboard"]).config(["$stateProvider","$urlRouterProvider","$httpProvider","$locationProvider",function(a,b,c,d){d.html5Mode(!0),c.interceptors.push("interceptor")}]),angular.module("classViewApp").controller("ClassViewCtrl",["$scope","$q","Course","Section","Recording","buildIntervalQuery","getUrlForVideo","formatRecording","_",function(a,b,c,d,e,f,g,h,i){function j(a){var c=b.defer();return c.resolve(a),c.promise}function k(a){return i.merge(a,{videoSources:[{src:g(a.filename),type:"video/mp4"}]})}function l(a){var b=a.getHours()>=11?"PM":"AM",c=a.getHours()%12+1,d=a.getMinutes();return c+":"+d+" "+b}function m(a){return l(a.startTime)+" - "+l(a.endTime)}function n(b){b.forEach(h),a.searchResults=b.map(k),a.searchResults=i.sortByAll(a.searchResults,["startTime","endTime"]),a.currentTime=i.first(a.searchResults).startTime,a.dashboardOptions={widgetDefinitions:a.searchResults.map(function(b,c){var d=m(b);return{title:d,name:String(b.id),templateUrl:"app/classView/videoWidget/videoWidget.html",dataModelType:"VideoWidgetDataModel",dataModelArgs:{recordings:a.searchResults,title:d,idx:c},size:{width:"25%",height:"25%"}}}),defaultWidgets:a.searchResults.map(function(a){return String(a.id)}),hideToolbar:!0,hideWidgetName:!0,hideWidgetSettings:!0,hideWidgetClose:!0}}function o(a,b){var c=a.startTime,d=a.endTime;return b.then(function(a){var b=f({startTime:c,endTime:d},a.id);return e.query(b).$promise})}function p(b){return b=b||a.section,d.get({id:b}).$promise}a.searchResults=[],a.currentTime=new Date(0),a.playingRecording=null,a.$on("setPlayingRecording",function(b,c){a.playingRecording=c,a.$broadcast("playingRecording",a.playingRecording)}),a.$on("updateCurrentTime",function(b,c){var d=c.recording,e=c.videoTime;if(a.playingRecording.id===d.id){var f=1e3*e,g=d.startTime.getTime();a.currentTime=new Date(f+g)}}),a.$on("videoPlaybackDone",function(b,c){if(a.playingRecording.id===c.id){a.playingRecording=null;var d=i.last(a.searchResults);d.id===c.id?a.currentTime=new Date(0):a.$broadcast("nextVideo",c)}}),a.$on("skipVideo",function(b,c){var d=i.last(a.searchResults);d.id===c.id?a.currentTime=new Date(0):a.$broadcast("nextVideo",c)});var q=i.isNumber(a.section)?p():j([]);a.mediaPlayer.onSetInterval(function(b){var c=b.startTime,d=b.endTime;return a.startTime=c,a.endTime=d,o({startTime:c,endTime:d},q).then(function(a){return n(a),a})});var r=!1;a.$watch("section",function(b,c){b===c&&r||(q=p(b),o({startTime:a.startTime,endTime:a.endTime},q).then(function(a){n(a)}),r=!0)})}]),angular.module("classViewApp").directive("classView",function(){return{templateUrl:"app/classView/classView.html",restrict:"EA",scope:{mediaPlayer:"=",section:"=?",apiHost:"=?"}}}),angular.module("classViewApp").constant("STATE_DIM_PERCENTS",{playing:40,live_paused:30,paused:25}).constant("SMALL_VIDEO_SEEK_THRESH",2e3).constant("MIN_PLAYING_VIDEO_LENGTH",7e3).controller("VideoWidgetCtrl",["$scope","_","STATE_DIM_PERCENTS","SMALL_VIDEO_SEEK_THRESH","MIN_PLAYING_VIDEO_LENGTH",function(a,b,c,d,e){function f(a,b,c){return a>c?a:c>b?b:c}function g(){var d={};d=a.isPlaying()?b.merge(b.clone(i),{width:c.playing+"%",height:c.playing+"%"}):!a.isPlaying()&&a.isLive()?b.merge(b.clone(i),{width:c.live_paused+"%",height:c.live_paused+"%"}):b.merge(b.clone(i),{width:c.paused+"%",height:c.paused+"%"}),b.isEqual(i,d)||(a.widget.updateContainerStyle(d),i=d)}a.API={},a.videoTime=0,a.currState="pause",a.recording=a.widgetData.recordings[a.widgetData.idx];new Date(0);a.isLive=function(c){var d=a.recording;c=b.isDate(c)?c:a.currentTime;var e=d.startTime,f=d.endTime;return c>=e&&f>=c},a.attatchAPI=function(b){return a.API=b},a.onUpdateTime=function(b){return a.videoTime=b},a.onStateChange=function(b){return a.currState=b},a.isPlaying=function(){return"play"===a.currState},a.isPaused=function(){return"pause"===a.currState},a.isStopped=function(){return"stop"===a.currState},a.playbackCompleted=function(){a.API.stop(),a.$emit("videoPlaybackDone",a.recording)},a.$watch("currState",function(b,c){b!==c&&"play"===b&&a.$emit("setPlayingRecording",a.recording)});var h=0,i={};a.$watch("currentTime",function(b){if(a.isLive(b)&&a.isPaused()){var c=b.getTime();if(c-h>=d){var e=c-a.recording.startTime.getTime();e=f(0,a.API.totalTime,e),a.API.seekTime(e/1e3),h=c}}g()}),a.$on("nextVideo",function(b,c){if(c.id!==a.recording.id&&0!==a.recording.id){h=0;var d=a.widgetData.recordings[a.widgetData.idx-1];if(c.id===d.id){var f=a.API.totalTime-1e3*a.videoTime;f>=e?a.API.play():(a.API.stop(),a.$emit("skipVideo",a.recording))}}}),a.$on("playingRecording",function(b,c){c.id!==a.recording.id&&a.isPlaying()&&a.API.pause()}),a.$watch("videoTime",function(b,c){b!==c&&a.isPlaying()&&a.$emit("updateCurrentTime",{recording:a.recording,videoTime:b})})}]),angular.module("classViewApp").factory("interceptor",function(){return{request:function(a){return a.headers["consumer-device-id"]=String(Date.now()*Math.random()*100),a}}}),angular.module("classViewApp").factory("_",function(){return window._}),angular.module("classViewApp").factory("MediaPlayer",["$q","_",function(a,b){var c=function d(){var c=this;this.setIntervalCbDeferred=a.defer(),this.onSetIntervalCallback=b.noop,this.onSeekCallback=b.noop,this.onPauseCallback=b.noop,this.onPlayCallback=b.noop,d.prototype.onSetInterval=function(a){return c.onSetIntervalCallback=a,c.setIntervalCbDeferred.resolve(c),c},d.prototype.setInterval=function(a){var b=a.startTime,d=a.endTime;return c.setIntervalCbDeferred.promise.then(function(a){return a.onSetIntervalCallback({startTime:b,endTime:d})})},d.prototype.onSeek=function(a){return c.onSeekCallback=a,c},d.prototype.onPause=function(a){return c.onPauseCallback=a,c},d.prototype.onPlay=function(a){return c.onPlayCallback=a,c}};return c}]),angular.module("classViewApp").factory("Course",["$resource","API_BASE_URL",function(a,b){return a(b+"/course/:id",{id:"@id"})}]),angular.module("classViewApp.resources").factory("Recording",["$resource","API_BASE_URL",function(a,b){return a(b+"/recording/:id",{id:"@id"})}]).factory("formatRecording",function(){return function(a){return a.startTime=new Date(a.startTime),a.endTime=new Date(a.endTime),a.createdAt=new Date(a.createdAt),a.updatedAt=new Date(a.updatedAt),a}}).factory("buildIntervalQuery",function(){return function(a,b){var c=a.startTime,d=a.endTime,e={where:JSON.stringify({startTime:{">=":c.toISOString()},endTime:{"<=":d.toISOString()}})};return b&&(e.section=b),e}}).factory("getUrlForVideo",["API_BASE_URL",function(a){return function(b){return[a,"video",b].join("/")}}]),angular.module("classViewApp").factory("Section",["$resource","API_BASE_URL",function(a,b){return a(b+"/section/:id",{id:"@id"})}]);var _createClass=function(){function a(a,b){for(var c=0;c<b.length;c++){var d=b[c];d.enumerable=d.enumerable||!1,d.configurable=!0,"value"in d&&(d.writable=!0),Object.defineProperty(a,d.key,d)}}return function(b,c,d){return c&&a(b.prototype,c),d&&a(b,d),b}}(),_get=function(a,b,c){for(var d=!0;d;){var e=a,f=b,g=c;h=j=i=void 0,d=!1,null===e&&(e=Function.prototype);var h=Object.getOwnPropertyDescriptor(e,f);if(void 0!==h){if("value"in h)return h.value;var i=h.get;return void 0===i?void 0:i.call(g)}var j=Object.getPrototypeOf(e);if(null===j)return void 0;a=j,b=f,c=g,d=!0}};angular.module("classViewApp").factory("VideoWidgetDataModel",["WidgetDataModel",function(a){var b=function(a){function b(a){var c=a.recordings,d=a.idx,e=a.title;_classCallCheck(this,b),_get(Object.getPrototypeOf(b.prototype),"constructor",this).call(this),this.recordings=c,this.title=e,this.idx=d}return _inherits(b,a),_createClass(b,[{key:"init",value:function(){this.updateScope({recordings:this.recordings,title:this.title,idx:this.idx})}},{key:"destroy",value:function(){}}]),b}(a);return b}]),angular.module("classViewApp").factory("Modal",["$rootScope","$modal",function(a,b){function c(c,d){var e=a.$new();return c=c||{},d=d||"modal-default",angular.extend(e,c),b.open({templateUrl:"components/modal/modal.html",windowClass:d,scope:e})}return{confirm:{"delete":function(a){return a=a||angular.noop,function(){var b,d=Array.prototype.slice.call(arguments),e=d.shift();b=c({modal:{dismissable:!0,title:"Confirm Delete",html:"<p>Are you sure you want to delete <strong>"+e+"</strong> ?</p>",buttons:[{classes:"btn-danger",text:"Delete",click:function(a){b.close(a)}},{classes:"btn-default",text:"Cancel",click:function(a){b.dismiss(a)}}]}},"modal-danger"),b.result.then(function(b){a.apply(b,d)})}}}}}]),angular.module("classViewApp").run(["$templateCache",function(a){a.put("app/classView/classView.html","<div ng-controller=ClassViewCtrl><div ng-if=dashboardOptions><div dashboard=dashboardOptions></div></div></div>"),a.put("app/classView/videoWidget/videoWidget.html","<div ng-controller=VideoWidgetCtrl><videogular class=videogular-container vg-player-ready=attatchAPI($API) vg-update-time=onUpdateTime($currentTime) vg-update-state=onStateChange($state) vg-auto-play=\"widgetData.idx === 0\" vg-complete=playbackCompleted() vg-responsive=true><vg-media vg-src=recording.videoSources title=\"Course Video Content\" description=widgetData.title></vg-media><vg-controls vg-autohide=true><vg-play-pause-button></vg-play-pause-button><vg-time-display>{{ currentTime | date:'mm:ss' }}</vg-time-display><vg-scrub-bar><vg-scrub-bar-current-time></vg-scrub-bar-current-time></vg-scrub-bar><vg-time-display>{{ timeLeft | date:'mm:ss' }}</vg-time-display><vg-volume><vg-mute-button></vg-mute-button><vg-volume-bar></vg-volume-bar></vg-volume><vg-chromecast-button></vg-chromecast-button><vg-fullscreen-button></vg-fullscreen-button></vg-controls><vg-overlay-play></vg-overlay-play></videogular></div>"),a.put("components/modal/modal.html",'<div class=modal-header><button ng-if=modal.dismissable type=button ng-click=$dismiss() class=close>&times;</button><h4 ng-if=modal.title ng-bind=modal.title class=modal-title></h4></div><div class=modal-body><p ng-if=modal.text ng-bind=modal.text></p><div ng-if=modal.html ng-bind-html=modal.html></div></div><div class=modal-footer><button ng-repeat="button in modal.buttons" ng-class=button.classes ng-click=button.click($event) ng-bind=button.text class=btn></button></div>')}]);