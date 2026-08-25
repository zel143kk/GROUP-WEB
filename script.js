// ==========================================
// SFHS EMERGENCY ALERT SYSTEM
// ==========================================


// ==========================================
// MOBILE NAVIGATION
// ==========================================

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", function () {

    navLinks.classList.toggle("show");

});


document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", function () {

        navLinks.classList.remove("show");

    });

});


```javascript
// ==========================================
// AUTOMATIC EMERGENCY ALARM
// ==========================================

const modal =
    document.getElementById("emergencyModal");

const alarmStatus =
    document.getElementById("alarmStatus");

const modalTitle =
    document.getElementById("modalTitle");

const modalMessage =
    document.getElementById("modalMessage");

const automaticStatus =
    document.getElementById("automaticStatus");

const stopAlarmBtn =
    document.getElementById("stopAlarmBtn");


let alarmActive = false;

let audioContext = null;

let oscillator = null;

let gainNode = null;


// ==========================================
// START ALARM SOUND
// ==========================================

function startAlarmSound() {

    try {

        audioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();


        oscillator =
            audioContext.createOscillator();


        gainNode =
            audioContext.createGain();


        oscillator.type =
            "square";


        oscillator.frequency.value =
            800;


        gainNode.gain.value =
            0.08;


        oscillator.connect(
            gainNode
        );


        gainNode.connect(
            audioContext.destination
        );


        oscillator.start();


        let high = false;


        const alarmInterval =
            setInterval(function () {

                if (!alarmActive) {

                    clearInterval(
                        alarmInterval
                    );

                    return;

                }


                high = !high;


                oscillator.frequency
                    .setValueAtTime(

                        high
                        ? 1000
                        : 600,

                        audioContext.currentTime

                    );


            }, 500);

    }

    catch (error) {

        console.log(
            "Browser blocked automatic audio."
        );

    }

}


// ==========================================
// AUTOMATIC ALARM
// ==========================================

function activateAutomaticAlarm(
    title,
    message
) {

    if (alarmActive) {

        return;

    }


    alarmActive = true;


    modalTitle.textContent =
        title;


    modalMessage.textContent =
        message;


    modal.classList.add(
        "show"
    );


    alarmStatus.textContent =
        "🚨 AUTOMATIC ALARM ACTIVE";


    alarmStatus.classList.add(
        "active"
    );


    automaticStatus.classList.add(
        "alarm-active"
    );


    automaticStatus.innerHTML = `

        <span class="status-light"></span>

        <strong>
            🚨 EMERGENCY DETECTED
        </strong>

    `;


    stopAlarmBtn.classList.add(
        "show"
    );


    document.body.style.overflow =
        "hidden";


    startAlarmSound();

}


// ==========================================
// STOP ALARM
// ==========================================

function stopEmergency() {

    alarmActive = false;


    modal.classList.remove(
        "show"
    );


    alarmStatus.textContent =
        "Status: Monitoring";


    alarmStatus.classList.remove(
        "active"
    );


    automaticStatus.classList.remove(
        "alarm-active"
    );


    automaticStatus.innerHTML = `

        <span class="status-light"></span>

        <strong>
            Automatic Monitoring Active
        </strong>

    `;


    stopAlarmBtn.classList.remove(
        "show"
    );


    document.body.style.overflow =
        "auto";


    if (oscillator) {

        try {

            oscillator.stop();

        }

        catch (error) {

            console.log(
                "Alarm already stopped."
            );

        }

    }


    if (audioContext) {

        audioContext.close();

        audioContext = null;

    }

}


// ==========================================
// CHECK QC SUSPENSION
// ==========================================

async function checkQCAnnouncements() {

    try {

        const response =
            await fetch(
                "api.php?action=announcements"
            );


        if (!response.ok) {

            throw new Error(
                "API connection failed."
            );

        }


        const data =
            await response.json();


        if (!data.success) {

            throw new Error(
                "Announcement service unavailable."
            );

        }


        displayAnnouncements(
            data.announcements
        );


        checkForSuspension(
            data.announcements
        );


        updateLastChecked();

    }

    catch (error) {

        console.error(error);


        document.getElementById(
            "suspensionStatus"
        ).textContent =

            "Unable to check official QC announcements.";

    }

}


// ==========================================
// DETECT SUSPENSION
// ==========================================

function checkForSuspension(
    announcements
) {

    const status =
        document.getElementById(
            "suspensionStatus"
        );


    const card =
        document.getElementById(
            "suspensionCard"
        );


    const suspension =
        announcements.find(
            announcement => {

                const text = (

                    announcement.title +
                    " " +
                    announcement.description

                ).toLowerCase();


                return (

                    text.includes(
                        "class suspension"
                    )

                    ||

                    text.includes(
                        "walang pasok"
                    )

                    ||

                    text.includes(
                        "classes suspended"
                    )

                );

            }
        );


    if (suspension) {

        status.textContent =
            "🚨 Official suspension detected.";

        card.classList.add(
            "danger"
        );


        /*
         * Create a unique ID for
         * this announcement.
         */

        const alertID =
            suspension.id ||
            suspension.title;


        const previousAlert =
            localStorage.getItem(
                "lastSuspensionAlert"
            );


        /*
         * Only sound the alarm when
         * this is a NEW announcement.
         */

        if (
            previousAlert !==
            alertID
        ) {

            localStorage.setItem(
                "lastSuspensionAlert",
                alertID
            );


            activateAutomaticAlarm(

                "🚨 CLASS SUSPENSION",

                suspension.title +
                ". Please check the official Quezon City Government announcement for complete details."

            );

        }

    }

    else {

        status.textContent =
            "No official suspension detected.";

        card.classList.remove(
            "danger"
        );

    }

}


// ==========================================
// DISPLAY ANNOUNCEMENTS
// ==========================================

function displayAnnouncements(
    announcements
) {

    const list =
        document.getElementById(
            "announcementList"
        );


    if (
        !announcements ||
        announcements.length === 0
    ) {

        list.innerHTML = `

            <div class="announcement-card">

                <h3>
                    No New Announcements
                </h3>

                <p>
                    No recent official announcements
                    were detected.
                </p>

            </div>

        `;

        return;

    }


    list.innerHTML = "";


    announcements.forEach(
        announcement => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "announcement-card";


            card.innerHTML = `

                <h3>
                    ${escapeHTML(
                        announcement.title
                    )}
                </h3>

                <p>
                    ${escapeHTML(
                        announcement.description
                    )}
                </p>

                <span class="date">
                    ${escapeHTML(
                        announcement.date
                    )}
                </span>

                ${
                    announcement.url

                    ?

                    `
                    <a
                        href="${announcement.url}"
                        target="_blank"
                        rel="noopener">

                        View Official Announcement →

                    </a>
                    `

                    :

                    ""
                }

            `;


            list.appendChild(
                card
            );

        }
    );

}


// ==========================================
// SECURITY
// ==========================================

function escapeHTML(
    text
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text || "";


    return div.innerHTML;

}


// ==========================================
// LAST CHECKED
// ==========================================

function updateLastChecked() {

    const now =
        new Date();


    document.getElementById(
        "lastUpdate"
    ).textContent =

        now.toLocaleString(
            "en-PH"
        );

}


// ==========================================
// START MONITORING
// ==========================================

checkQCAnnouncements();

checkRain();


// Check every 5 minutes

setInterval(
    checkQCAnnouncements,
    5 * 60 * 1000
);


setInterval(
    checkRain,
    5 * 60 * 1000
);
```
