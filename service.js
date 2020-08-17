// dy 11.0.0
Java.perform(function () {
    Java.openClassFile("/data/local/tmp/androidAsync.dex").load();
    Java.openClassFile("/data/local/tmp/r0gson.dex").load();
    var Gson = Java.use('com.r0ysue.gson.Gson'); // 使用Gson将对象类转成Json对象时出现\u003d 、\u0027等情况的问题
    var gson = Gson.$new();

    // 构建一个默认请求
    var HttpServerRequestCallback = Java.use("com.koushikdutta.async.http.server.HttpServerRequestCallback");
    var RequestTestCallback = Java.registerClass({
        name: "RequestTestCallback",
        implements: [HttpServerRequestCallback],
        methods: {
            onRequest: function (request, response) {
                // 主动调用代码直接写这里
                response.send("{\"code\":0,\"message\":\" 服务已经注册成功, 默认端口5000\"}");
            }
        }
    });

    // 实现搜索接口主动调用
    var MusicSearchRequestCallback = Java.registerClass({
        name: "MusicSearchRequestCallback",
        implements: [HttpServerRequestCallback],
        methods: {
            onRequest: function (request, response) {
                // 主动调用代码直接写这里
                var word = request.getQuery().getString("word");
                var SearchApi = Java.use("com.ss.android.ugc.aweme.discover.api.SearchApi");
                var ret = SearchApi.b(word, 0, 20, 1, 0, "", "switch_tab", 1);
                response.send(gson.toJson(ret));
            }
        }
    });


    // 注册服务
    var Application = Java.use("android.app.Application");
    Application.attach.implementation = function () {
        try {
            var AsyncHttpServer = Java.use("com.koushikdutta.async.http.server.AsyncHttpServer");
            var androidAsync = AsyncHttpServer.$new();
            androidAsync.get("/", RequestTestCallback.$new());
            androidAsync.get("/musicSearch", MusicSearchRequestCallback.$new());
            androidAsync.listen(5000);
            console.log("服务器已经注册成功");
        } catch (e) {
            console.error("服务器已经注册失败, e:" + e);
        }
        this.attach.apply(this, arguments);
    };

    // 函数拦截测试
    // var SearchApi = Java.use("com.ss.android.ugc.aweme.discover.api.SearchApi");
    // SearchApi.b.overload('java.lang.String', 'long', 'int', 'int', 'int', 'java.lang.String', 'java.lang.String', 'int').implementation = function () {
    //     for (var index in arguments) {
    //         console.log(index, arguments[index])
    //     }
    //     var ret = SearchApi.b.apply(this, arguments);
    //     return ret;
    // };
});
