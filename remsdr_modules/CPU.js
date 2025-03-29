var Model = "";
var CPUshort = "";
const cp = require('child_process');
const fs = require('fs');

// SDR Management

var SDRrx = "";
var SDRtx = "";
var hackrf_info = "";
function Def_SDR() {
    var info_usb = cp.execSync("lsusb").toString();
    var SDRs = [];
    try {
        SDRrx = fs.readFileSync('/remsdr/data/SDRrx.txt', 'utf8');
    } catch (e) {}
    try {
        SDRtx = fs.readFileSync('/remsdr/data/SDRtx.txt', 'utf8');
    } catch (e) {}
    if (info_usb.indexOf("ID 1df7:") > 0) {
        SDRs.push("sdrplay|SDR Play / RSP1..");
        if (SDRrx.length < 2)
            SDRrx = "sdrplay";
    }
    if (info_usb.indexOf("RTL2838") > 0) {
        SDRs.push("rtlsdr|RTL-SDR");
        if (SDRrx.length < 2)
            SDRrx = "rtlsdr";
    }
    if (info_usb.indexOf("HackRF One") > 0) {
        try {
            hackrf_info = cp.execSync("hackrf_info ").toString(); //Cannot be read if Hack RF already busy
        } catch (e) {
            //Use old one

        }
        var hacks = hackrf_info.split("\n");
        var sn = "";
        for (var i = 0; i < hacks.length; i++) {
            if (hacks[i].indexOf("Serial number") >= 0) {
                sn = hacks[i].substr(-8);
                SDRs.push("hackrf" + sn + "|HackRF One:" + sn);
                if (SDRrx.length < 2)
                    SDRrx = "hackrf" + sn; //By default
                if (SDRtx.length < 2)
                    SDRtx = "hackrf" + sn;
            }
        }

    }
    if (info_usb.indexOf("ADALM-PLUTO") > 0) {
        SDRs.push("pluto|Adalm Pluto");
        if (SDRrx.length < 2)
            SDRrx = "pluto";
        if (SDRtx.length < 2)
            SDRtx = "pluto";
    }
    SetSDR("RX", SDRrx);
    SetSDR("TX", SDRtx);
    return SDRs;
}
function SetSDR(Which, Type) {
    if (Which == "RX") {
        fs.writeFileSync('/remsdr/data/SDRrx.txt', Type);
    } else {
        fs.writeFileSync('/remsdr/data/SDRtx.txt', Type);
    }
}
function LastInfoCPU() {
    console.log(Model)
    SDRs = Def_SDR();
    return {
        Model: Model,
        SDRs: SDRs,
        SDRrx: SDRrx,
        SDRtx: SDRtx,
        CPUshort: CPUshort
    }
}
module.exports = {
    LastInfoCPU,
    SetSDR,
};
Def_SDR();
