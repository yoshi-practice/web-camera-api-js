$(function () {
    var myStream;

    function startVideo() {
        if (myStream) {
            return;
        }
        navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
            })
            .then(function (stream) {
                var $video = $("#myVideo");
                $video.attr("src", URL.createObjectURL(stream));
                myStream = stream;
            }).catch(function (error) {
                console.log("カメラの映像を取得できませんでした: ", error);
            });
    }

    function stopVideo() {
        if (!myStream) {
            return;
        }
        myStream.getVideoTracks().forEach(function (track) {
            track.stop();
        });
        myStream = null;
    }

    function snapshot() {
        if (!myStream) {
            return;
        }
        var $div = $(`
      <div class="snapshot">
        <canvas/>
        <a class="btn btn-default">
          <span class="glyphicon glyphicon-download-alt"></span>
        </a>
      </div>
    `);

        $(".preview").append($div)
        var video = document.getElementById("myVideo");
        var canvas = $div.find("canvas")[0];
        var context = canvas.getContext("2d");
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0);
        $a = $div.find("a");
        $a.attr("download", "snapshot.png");
        $a.attr("href", canvas.toDataURL());
    }

    function record() {
        navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            })
            .then(function (stream) {
                var recorder = new MediaRecorder(stream);
                recorder.addEventListener("dataavailable", handleRecorded);
                recorder.start();
                // 5秒後に停止する
                setTimeout(function () {
                    recorder.stop();
                    stream.getTracks().forEach(function (track) {
                        track.stop();
                    });
                }, 5000);
            }).catch(function (error) {
                console.log("カメラの映像を取得できませんでした: ", error);
            });
    }

    function handleRecorded(event) {
        var $div = $(`
      <div class="snapshot">
        <video controls/>
        <a class="btn btn-default">
          <span class="glyphicon glyphicon-download-alt"></span>
        </a>
      </div>
    `);
        $(".preview").append($div)
        var $video = $div.find("video");
        var url = URL.createObjectURL(event.data);
        $video.attr("src", url);
        var $a = $div.find("a");
        $a.attr("download", "video.webm");
        $a.attr("href", url);
    }

    $("#startVideo").click(startVideo).click();
    $("#stopVideo").click(stopVideo);
    $("#snapshot").click(snapshot);
    $("#record").click(record);
});
