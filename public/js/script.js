(function($){

    var socket = io.connect('http://localhost:3000');

    function show_key(data) {
        $("#key").text("" + data.code);
    };

    var ctx;

    // Draw Function
    function draw(x, y, type) {                
        if (type === "dragstart") {                    
            ctx.beginPath();
            ctx.moveTo(x, y);
        } else if (type === "drag") {                    
            ctx.lineTo(x,y);
            ctx.stroke();
        } else {                    
            ctx.closePath();
        }
    };
    
    // Player
    var Player = function(id) {
        this.id = id;
        this.x  = 0;
        this.y  = 0;
        this.init();
    };    
    Player.prototype = function(){
        var init = function(){
            bind.call(this);
        }
        , bind = function(){
            $("#canvas").on( 'mousemove', {PlayerObj: this}, (function(event) {
                var player = event.data.PlayerObj;                
                var page = $("#canvas");
                // player.x = ((100 * event.pageX / page.width())).toFixed(4);
                // player.y = ((100 * event.pageY / page.height())).toFixed(4);
                player.x = event.pageX;
                player.y = event.pageY;
                socket.emit('move', { friend: player.id, friendX: player.x, friendY: player.y });                
            }));
            $(document).on( 'focus',  {PlayerObj: this}, (function(event) {
                $(".friend").hide();
            }));
            $(document).on( 'click',  {PlayerObj: this}, (function(event) {
                $(".friend").hide();
            }));
            $(document).on( 'keypress',  {PlayerObj: this}, (function(event) {
                var code = (event.keyCode ? event.keyCode : event.which);
                var data =  { code: code};
                socket.emit('key', data);
                show_key(data);
            }));
            
            $('#canvas').on('drag dragstart dragend', {PlayerObj: this}, (function(event) {
                var offset, type, x, y;
                type = event.handleObj.type;
                if ((type === "drag") || ( type === "dragstart")) {
                    offset = $(this).offset();
                    x = event.pageX - offset.left; // event.layerX - offset.left;
                    y = event.pageY - offset.top; // event.layerY - offset.top;
                } else {
                    x = 0;
                    y = 0;
                }                
                var data =   {x: x, y: y, type: type};
                socket.emit('drawClick', data);
                // console.log("-------- canvas drag " + x + ", " + y + ", " + type);
                draw(x, y, type);
            }));
            
        };
        return { init: init };
    }();
    
    // Friends
    var Friends  = function() {
        this.friends = {};
    };
    Friends.prototype = function(){
        var add = function(friend) {
            var label = doLabel.call(this, friend.id);
            this.friends[label] = friend;
        }
        , remove = function(id){
            var label = doLabel.call(this, id);
            if ( this.friends[label] ) {
                this.friends[label].remove();
                delete(this.friends[label]);
            }
        }
        , update = function(data) {
            var label = doLabel.call(this,data.friend);
            if ( this.friends[label] ) {
                this.friends[label].update(data.friendX, data.friendY);
            }
        }
        , doLabel = function(id){
            return 'friend-'+id;
        };
        return {
            add: add,
            remove: remove,
            update: update
        };
    }();
    
    // Friend
    var Friend = function(id) {
        this.id = id;
        this.x  = 0;
        this.y  = 0;
        this.idx = 'friend-'+id;        
        this.element = false;
        this.init();
    };
    Friend.prototype = function(){
        var init = function() {
            if  ( check.call(this) === true ) {
                return false;
            }
        }
        , create = function() {
            this.element = $('<div/>').attr('id',this.idx).addClass('friend').appendTo('body').fadeIn();
            $(".friend").hide();
        }
        , remove = function() {
            if ( this.element ){
                this.element.fadeOut('200',function(){
                    $(this).remove();
                });
            }
        }
        , check = function(){
            if ( $('#'+this.idx).length > 0 ) {
                return true;
            }
            create.call(this);
            return false;
        }
        , update = function(x, y) {
            this.element.css({'left': x - 5,'top': y - 3, 'display': 'inline'});
        };
        return {
            init: init,
            remove: remove,
            update: update
        };
    }();
    
    // Meeting
    var Meeting = function(socket) {
        this.player = false;
        this.friends = new Friends();
        this.init();
    };
    Meeting.prototype = function(){
        var init = function(){
            bind.call(this);            
        }
        , bind = function(){
            var self = this;
            
            // Connected
            socket.on('connected', function (data) {
                $.each(data.friends, function(index,item){
                    createFriend.call(self, item, data.player);
                });
                self.player = new Player(data.player);
                updateTotalConnections(data.friends.length);

                var canvas = $("#canvas");
                if (canvas[0].getContext) {
                    ctx = canvas[0].getContext("2d");
                    ctx.strokeStyle = 'rgba(77, 200, 80, 0.1)';
                    ctx.lineWidth = 10;
                    ctx.lineCap = "round";
                    self.ctx = ctx;
                } else {
                    canvas.text("Can not use canvas.");
                }
            });
            
            // New friend
            socket.on('new friend', function (data) {
                createFriend.call(self, data.player);
                updateTotalConnections(data.friends.length);
            });
            
            // Bye friend
            socket.on('bye friend', function (data) {
                removeFriend.call(self, data.player);
                updateTotalConnections(data.friends.length);
            });
            
            // Move
            socket.on('move', function (data) {
                self.friends.update(data);
            });

            // Key
            socket.on('key', function (data) {
                show_key(data);
            });

            // drawClick
            socket.on('drawClick', function (data) {
                draw(data.x, data.y, data.type);
            });

        }
        , createFriend = function(id, player){
            if ( player && player == id ) {
                return;
            }
            var friend = new Friend(id);
            if (friend) {
                this.friends.add(friend);
            }
        }
        , removeFriend = function(id) {
            this.friends.remove(id);
        }
        , updateTotalConnections = function(total){
            $('#connections').html(total);
        };
        return { init: init };
    }();
    
    var app = new Meeting(socket);
    
})(jQuery);
