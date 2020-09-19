let statsPopupDiv = document.getElementById('statsPopup');
let statsPopupContentDiv = document.getElementById('statsPopupContent');

let avgResTimeDiv = document.getElementById('avgResTime');
let correctCountDiv = document.getElementById('correctCount');
let totalCountDiv = document.getElementById('totalCount');
let sessionBreakdownDiv = document.getElementById('sessionBreakdown');
let correctPercentDiv = document.getElementById('correctPercent');

let statsStorageKey = 'cool';
let allSessionsInfo = loadAllSessionsInfo();
let sessionInfo = getLastSessionInfo();


function initSessionLog() {
    sessionInfo = [];
}

function updateStatsDisplay() {
    if (!sessionInfo) return;
    let avgResTime = ((sessionInfo.reduce((total, curr) => total + curr.responseTime, 0) / sessionInfo.length) / 1000).toFixed(3);
    let total = sessionInfo.length;
    let correct = sessionInfo.filter(x=>x.isCorrect).length;

    avgResTimeDiv.innerText = avgResTime;
    totalCountDiv.innerText = total;
    correctCountDiv.innerText = correct;
    correctPercentDiv.innerText = (correct / total * 100).toFixed(1);

    let html = '';

    for (let i of sessionInfo) {
        html += `<div class="sessionBreakdownItem">
                    <div>${i.roundNum}</div>
                    <div>${i.isCorrect}</div>
                    <div>${(i.responseTime / 1000).toFixed(3)}</div>
                    <div>${i.probePos}</div>
                    <div>${i.probeDir}</div>
                    <div>${i.probeBehind}</div>
                    <div>Image ${i.pictureId}</div>
                </div>`;
    }


    sessionBreakdownDiv.innerHTML = html;
}

function logInfo(roundNum, responseTime, isCorrect, probePos, probeDir, probeBehind, pictureId) {
    sessionInfo.push({ roundNum, responseTime, isCorrect, probePos, probeDir, probeBehind, pictureId });
}

function saveSessionInfo() {
    let today = new Date().toLocaleDateString('en-GB');
    if (!allSessionsInfo) allSessionsInfo = {};
    if (!allSessionsInfo[today]) allSessionsInfo[today] = [];
    allSessionsInfo[today].push(sessionInfo);

    window.localStorage.setItem(statsStorageKey, JSON.stringify(allSessionsInfo));
}

function getLastSessionInfo() {
    if (!allSessionsInfo) return null;

    let today = new Date().toLocaleDateString('en-GB');
    if (!allSessionsInfo[today]) return null;

    return allSessionsInfo[today][allSessionsInfo[today].length - 1];
}

function loadAllSessionsInfo() {
    try {
        let info = JSON.parse(window.localStorage.getItem(statsStorageKey));

        if (Array.isArray(info)) return {};
        return info;
    }
    catch(e) {
        return null;
    }
}

function KeyPress(e) {
    var evtobj = window.event? window.event : e;
    if (evtobj.keyCode == 83 && evtobj.altKey) {
        if(statsPopupContentDiv.classList.contains('popupShow')) {
            // hiding popup
            statsPopupContentDiv.classList.remove('popupShow');
            statsPopupContentDiv.classList.add('popupHide');

            setTimeout(()=>{
                statsPopupDiv.style.display = 'none';
            }, 1100);
        }
        else {
            // showing popup
            updateStatsDisplay();
            statsPopupDiv.style.display = '';
            setTimeout(()=>{
                statsPopupContentDiv.classList.remove('popupHide');
                statsPopupContentDiv.classList.add('popupShow');
            }, 50);

        }
    }
}

function buildInfoForExport() {
    let headlines = 'Date,Session,Round,Response Time(miliseconds),Is Correct,Probe Position,Probe Direction,Probe Image Type,Round Image Id';
    let content = '';

    if (allSessionsInfo)
    {
        for (let date in allSessionsInfo) {
            let dateSessions = allSessionsInfo[date];
            for (let sessionIdx in dateSessions) {
                let session = dateSessions[sessionIdx];
                for (let roundIdx in session) {
                    let {roundNum, responseTime, isCorrect, probePos, probeDir, probeBehind, pictureId} = session[roundIdx];
                    content += `${date},${sessionIdx+1},${roundNum},${responseTime},${isCorrect},${probePos},${probeDir},${probeBehind},${pictureId}\r\n`;
                }
            }
        }
    }

    return headlines + '\r\n' + content;
}

function downloadStats() {
    let filename = 'stats.csv';
    let content = buildInfoForExport();
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

document.onkeydown = KeyPress;

//KeyPress({keyCode: 83, altKey: true});