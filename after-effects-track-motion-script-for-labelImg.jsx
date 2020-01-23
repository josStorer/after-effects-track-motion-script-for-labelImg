var myWindow = new Window("dialog", "", [1920 / 2, 1080 / 2, 1920 / 2 + 200, 1080 / 2 + 300])
var input = myWindow.add("edittext", { x: 50, y: 10, width: 100, height: 50 }, "Default Tag", { multiline: false })
var myButton = myWindow.add("button", { x: 50, y: 70, width: 100, height: 50 }, "Run")
var myButton2 = myWindow.add("button", { x: 50, y: 130, width: 100, height: 50 }, "Test")
myButton.onClick = myFunc
myButton2.onClick = test

function test () {
    // alert(app.project.item(1).workAreaStart)
}

var source// motion trackers
var trackers = []
var xmin, ymin, xmax, ymax
var dirName, outputDirName, filename
var prefix, start, end, currentTime = 0
var defaultTag, tag
function myFunc () {
    dirName = app.project.file.parent.toString() + "/"
    outputDirName = dirName.split("/").join("\\")

    source = app.project.item(1).layer(1).property(3)// motion trackers

    defaultTag = input.text

    filename = app.project.item(1).layer(1).name
    var reg = /(.*)\[([0-9]+)\-([0-9]+)\]\.png$/;
    var result = reg.exec(filename)
    prefix = result[1]
    start = result[2]
    end = result[3]

    for (var i = 0; i <= end - start; i++) {
        writexml(prefix + (parseInt(start) + i), i + 1)
    }
}

function getTrackers () {
    try {
        var j = 0
        trackers = []
        while (true) {
            j++
            trackers.push(source.property(j))
        }
    } catch (e) { }
}

function checkEveryFrame (trackerNumber) {
    var trackerPoint = trackers[trackerNumber].property(1)
    try {
        var key = 0
        while (true) {
            key++
            var checkTime = trackerPoint.property(1).keyTime(key)
            if (checkTime === currentTime)
                return key
            if (checkTime > currentTime)
                return -1
        }
    } catch (e) { return -1 }
}

function getXY (trackerNumber, key) {
    var trackerPoint = trackers[trackerNumber].property(1)
    try {
        var checkTime = trackerPoint.property(1).keyTime(key)// cant use valueAtTime
        if (checkTime != currentTime) {
            key = checkEveryFrame(trackerNumber)
            if (key === -1)
                return [0, 0, 0, 0]
        }
        var center = trackerPoint.property(1).keyValue(key)
    } catch (e) {
        key = checkEveryFrame(trackerNumber)
        if (key === -1)
            return [0, 0, 0, 0]
        var center = trackerPoint.property(1).keyValue(key)
    }
    var scale = trackerPoint.property(4).value
    var x = center[0]
    var y = center[1]
    var width = scale[0]
    var height = scale[1]
    return [x - width / 2, y - height / 2, x + width / 2, y + height / 2]
}

function writeMultiTrackers (write_file, trackerNumber) {
    var reg = /^tag:(.*)$/i
    tag = reg.exec(trackers[trackerNumber].name)
    if (tag === null)
        tag = defaultTag
    else
        tag = tag[1]

    write_file.writeln("	<object>\
		<name>"+ tag + "</name>\
		<pose>Unspecified</pose>\
		<truncated>0</truncated>\
		<difficult>0</difficult>\
		<bndbox>")
    write_file.writeln("			<xmin>" + xmin + "</xmin>")
    write_file.writeln("			<ymin>" + ymin + "</ymin>")
    write_file.writeln("			<xmax>" + xmax + "</xmax>")
    write_file.writeln("			<ymax>" + ymax + "</ymax>")
    write_file.writeln("		</bndbox>\
	</object>")
}

function writexml (filename, key) {
    var filepath = dirName + filename + ".xml"
    var write_file = File(filepath)
    if (!write_file.exists) {
        write_file = new File(filepath)
    }/* else {
        var res = confirm("File: " + filename + ".xml already exists, overwrite it?", true, "File exists");
        if (res !== true) {
            return;
        }
    }*/

    var out;
    if (write_file !== '') {
        out = write_file.open('w', undefined, undefined)
        write_file.encoding = "UTF-8"
        write_file.lineFeed = "Windows"
        // write_file.lineFeed = "Unix"
        // write_file.lineFeed = "Macintosh"
    }

    if (out !== false) {
        write_file.writeln("<annotation>\
	<folder>"+ app.project.file.parent.name + "</folder>\
	<filename>"+ filename + ".png" + "</filename>\
	<path>"+ outputDirName + filename + ".png" + "</path>\
	<source>\
		<database>Unknown</database>\
	</source>\
	<size>\
		<width>800</width>\
		<height>600</height>\
		<depth>3</depth>\
	</size>\
	<segmented>0</segmented>")

        getTrackers()
        var trackerPoint = trackers[0].property(1)
        try {
            currentTime = trackerPoint.property(1).keyTime(key)
        } catch (e) { alert("Your first tracker, which used as standard, not covers every frame!") }
        for (var trackerNumber = 0; trackerNumber < trackers.length; trackerNumber++) {
            // [xmin, ymin, xmax, ymax] = getXY(trackerNumber, key)
            var tmp = getXY(trackerNumber, key)
            if (tmp.toString() === [0, 0, 0, 0].toString()) {// cant use continue
            } else {
                xmin = tmp[0]
                ymin = tmp[1]
                xmax = tmp[2]
                ymax = tmp[3]

                writeMultiTrackers(write_file, trackerNumber)
            }
        }

        write_file.writeln("</annotation>")
        write_file.close()
    }
}

myWindow.show()