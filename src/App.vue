<template>
    <div id="app">
        <div class="tipsAni-transition ui-poptips ui-poptips-success {{tips.ani}} ">
            <div class="ui-poptips-cnt"><i></i>{{tips.msg}}</div>
        </div>
        <!-- <canvas id="canvas"></canvas> -->
        <div class="allUser">
            <span>在线人数</span>
            <span class="ui-badge-muted">0 {{allUser}} </span>
        </div>
        <div class="ui-dialog">
            <div class="ui-dialog-cnt">
                <header class="ui-dialog-hd ui-border-b">
                    <h3>you need a name</h3>
                </header>
                <div class="ui-dialog-bd">
                    <div>plase在下面输入框中输入昵称并提交(昵称不能超过12个字符)</div>
                </div>
                <div class="ui-dialog-ft">
                    <button type="button" data-role="button">ok</button>
                    <button type="button" data-role="button">yes</button>
                </div>
            </div>
        </div>
        <!-- main msg -->
        <ul class="ui-list ui-border-tb msgs">
            <li class="ui-border-t" v-for="item of msgList">
                <div class="ui-avatar">
                    <span></span>
                </div>
                <div class="ui-list-info">
                    <span>{{item.username}}:</span>
                    <p class="">{{item.msg}}</p>
                </div>
            </li>
        </ul>
        <div class="talk">
            <section class="ui-input-wrap ui-border-t">
                <div class="ui-input ui-border-radius">
                    <input type="text" :placeholder="inputGroup.in" v-model="inputMsg" :value="empty">
                </div>
                <button :disabled="!canspeak" @click="submit()" class="ui-btn">{{inputGroup.btn}}</button>
            </section>
        </div>
    </div>
</template>
<script>
import socketIo from './socket.js'
export default {
    data() {
            return {
                inputGroup: { in : "请输入昵称",
                    btn: "确定"
                },
                isAddUser: true,
                username: null,
                inputMsg: null,
                userId: null,
                tips: {
                    msg: null,
                    ani: 'tipsAni-leave'
                },
                allUser: 0,
                msgList: [],
                adminMsg: {
                    quiet: '禁言中，请认真听',
                    clear: '',
                    speak: '解除禁言'
                },
                canspeak: true
            }
        },
        methods: {
            tipsOpr: function(msg) {
                this.tips.ani = 'tipsAni-enter'
                this.tips.msg = msg
                let that = this
                setTimeout(function() {
                    that.tips.ani = 'tipsAni-leave'
                    that.tips.msg = null
                }, 2500)
            },
            submit: function() {
                if (this.inputMsg && this.inputMsg.length >= 1) {
                    if (this.isAddUser) {
                        if (this.inputMsg.length <= 12) {
                            let time = new Date()
                            this.username = this.inputMsg
                            this.userId = time.getTime()
                            localStorage.setItem('username', this.username)
                            localStorage.setItem('userId', this.userId)
                            console.log(this.username)
                            socket.emit('username', {
                                username: this.username,
                                userId: this.userId
                            })
                            this.inputGroup.in = "我也说句一..."
                            this.inputGroup.btn = "发送"
                            this.tipsOpr('嗨 ' + this.username + '！昵称发送成功')
                            this.isAddUser = false
                        } else {
                            this.tipsOpr('昵称不能超过12个字符')
                        }
                    } else {
                        if (this.inputMsg === '143736quiet') {
                            socket.emit('admin_quiet', {
                                msg: this.adminMsg.quiet
                            })
                        } else if (this.inputMsg === '143736clear') {
                            localStorage.clear()
                            location.reload()
                        } else if (this.inputMsg === '143736speak') {
                            socket.emit('admin_speak', {
                                msg: this.adminMsg.speak
                            })
                        } else {
                            socket.emit('new_msg', {
                                username: this.username,
                                msg: this.inputMsg
                            })
                        }
                    }
                }
                this.inputMsg = null
            },
            ifNewUser: function() {
                if (localStorage.getItem('username') && localStorage.getItem('userId')) {
                    this.isAddUser = false
                    this.inputGroup.in = "我也说一句..."
                    this.inputGroup.btn = "发送"
                    this.username = localStorage.getItem('username')
                    this.userId = localStorage.getItem('userId')
                    socket.emit('username', {
                        username: this.username,
                        userId: this.userId
                    })
                    this.tips.show = true
                } else {
                    $(".ui-dialog").dialog("show");
                }
            },
            socketEvents: function() {
                let that = this
                socket.on('changeuser', function(data) {
                    console.log(data)
                    that.allUser = data.allUser
                })
                socket.on('admin_quiet', function(data) {
                    console.log(data)
                    that.canspeak = false
                })
                 socket.on('admin_speak', function(data) {
                    console.log(data)
                    that.canspeak = true
                })
                socket.on('newmsg', function(data) {
                    console.log(data)
                    if (that.canspeak) {
                        that.msgList.push(data)
                        if (that.msgList.length > 30) {
                            that.msgList.shift()
                        }
                        that.msgList.push({})
                        window.scrollTo(0, document.body.scrollHeight + 45)
                        that.msgList.pop()
                    }
                })
            }
        },
        ready() {
            socketIo.runSocket()
            this.ifNewUser()
            this.socketEvents()
                // socketIo.socketEvents()
        }
}
</script>
<style lang="less">
// html,
// body,
// #app {
//     height: 100%;
//     width: 100%;
// }
.talk {
    width: 100%;
    position: fixed;
    bottom: 0;
}

.tipsAni-transition {
    transition: all .3s ease;
}

.tipsAni-enter {
    top: 0;
}

.tipsAni-leave {
    top: -45px;
}

.allUser {
    width: 100%;
    background: #fff;
    position: fixed;
    top: 0px;
    left: 0px;
    padding: 10px 0 0 10px;
    z-index: 111;
    color: #666;
    font-size: 14px;
}

.msgs {
    margin-top: 50px;
    margin-bottom: 45px;
    .ui-avatar {
        width: 30px;
        height: 30px;
    }
    .ui-list-info {
        span {
            display: inline-block;
            margin-bottom: 3px;
        }
        p {
            margin-left: 10px
        }
    }
}

.ui-border-radius:before {
    content: none;
}
</style>
