var conn = new WebIM.connection({
    isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
    https: typeof WebIM.config.https === 'boolean' ? WebIM.config.https : location.protocol === 'https:',
    url: WebIM.config.xmppURL,
    heartBeatWait: WebIM.config.heartBeatWait,
    autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
    autoReconnectInterval: WebIM.config.autoReconnectInterval,
    apiUrl: WebIM.config.apiURL,
    isAutoLogin: true
});

function zhuce(username, nickname) {
    var options = {
        username: username,
        password: username,
        nickname: nickname,
        appKey: WebIM.config.appkey,
        success: function () {
        },
        error: function () {
        },
        apiUrl: WebIM.config.apiURL
    };
    conn.registerUser(options);
}