
var MonsterTpl = '<div class="character facing-left"><div class="msg">Hello</div><div class="side left"><div class="arrow"></div><div class="arrow"></div><div class="arrow"></div><div class="eye"></div><div class="mouth"></div></div><div class="side right"><div class="arrow"></div><div class="arrow"></div><div class="arrow"></div><div class="eye"></div><div class="mouth"></div></div></div>';

var Monster = function(data) {
    this.name = data.name;
    this.color = data.color || randColor();
    this.speed = 3;
    this.elem = $(MonsterTpl);
    this.elem.css('color', this.color);
    this.elem.css('backgroundColor', this.color);
    this.moving = null;
    this.dir = data.direction || 1;
    this.location = data.location || Math.random() * 200;
    this.to = 0;
    this.elem.css('left', this.location);
};

Monster.prototype = {

    toData: function() {
        return {
            location: this.location,
            dir: this.dir,
            name: this.name,
            color: this.color
        };
    },

    moveLeft: function() {
        this.location += this.speed * -1;
        this.dir = -1;
        this.update(this.toData());
    },

    moveRight: function() {
        this.location += this.speed;
        this.dir = 1;
        this.update(this.toData());
    },

    update: function(data) {
        this.elem.css('left', this.location);
        this.location = data.location;
        this.dir = data.dir;
        this.switchDirection(this.dir);
    },

    switchDirection: function(dir) {
        if (dir === -1) {
            this.elem.addClass('facing-right');
            this.elem.removeClass('facing-left');
        } else {
            this.elem.removeClass('facing-right');
            this.elem.addClass('facing-left');
        }
    },

    say: function(msg) {
        var msgbox = this.elem.find('.msg')
        msgbox.text(msg).addClass('show');
        setTimeout(function() {
            msgbox.removeClass('show');
        }, 3000);
    },

    render: function() {
        return this.elem;
    }
}

var Stage = function(elem) {
    this.monsters = {};
    this.elem = $(elem);
}

Stage.prototype = {

    add: function(monster) {

        this.monsters[monster.name] = monster;
        this.elem.append(monster.render());

    },

    addOrUpdateMonsters: function(monsters) {
        $.each(monsters, $.proxy(function(name, monster) {

            if (name in this.monsters) {
                this.updateMonster(monster);
            } else {
                this.add(new Monster(monster));
            }

        }, this));
    },

    updateMonster: function(monster) {
        if (this.monsters[monster.name]) {
            this.monsters[monster.name].update(monster);
        }
    },

    monsterTalk: function(data) {
        if (this.monsters[data.monster.name]) {
            this.monsters[data.monster.name].say(data.msg)
        }
    } 
};

function randColor() {
    var parts = [
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255)
    ];
    return 'rgb(' + parts.join(',') + ')';
}

