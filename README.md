# Pomodoro tracking software to help track progress on tasks/habits and reward yourself for being diligent.  
Uses a Rewards-based pomodoro tracking metaphor of arcade tickets.  Win at arcade games, get tickets, buy trinkets.  Complete pomodoros, get tickets, reward yourself with things from the store (which you define).

You fill the store and determine the prices.  Later on link to the prizes as links to amazon/etc (any store) and buy sends you to the site (v1). Next use the api to buy directly when you turn in your tickets and hit buy.  Should see a graphic of a roll of tickets gradually growing in size.  Use a similar icon to represent prices (have the exact number in the middle of the roll) so you can compare your haul with the cost needed, you'll see those desires getting closer.

Basic functionality: 1 press to start pomo, alarm goes off after the time. The time can be set in options but is out of the box 25.  you then start the break timer.  it goes for 5 mins and another alarm goes off.  then the pomodoro timer resets and you press again to start the next cycle.  You don't get credit for the pomodoro until you finish the break as well.

Inspiration:
From android store:

1. Clockwork tomato - Has a very pretty clock/timer.  Marks off on the clock an arc for pomodoro time and break time (in different colors)
2. Habits - Breaks down pomodoros by your goals (e.g. course work, exercise, french, piano etc.) Shows a week view that illustrates pomodoros consecutively.
3. Pomodoro master - Allows to set goals
4. Pomodroido - Leveling. (Level: Apprentice(1) <---progress bar+++> Pomodoros until next level: 4)

From apple store:

1. dPomodoro - Interruptions/cancellation.  You can mark a pomodoro as interrupted or canceled.  Could be useful.

### Things to test

#### Force user to take action to start the rest period.

To emphasize that the user really should take advantage of the rest 
period in order to truly leverage the pomodoro technique.

---

---

## CURRENT

#### Going to index view should reset all the timers

---

## BACKLOG

#### Add ability to show progress 
  + First do some design on paper as to how this should look.
  + First a simple how many of each pomo completed
  + Graph of pomodoros over time
  + Need some kind of calendar/history view.  Realistically your goal is going 
    to be something like 3 pomos per day per task.  With this purpose in mind,
    there isn't any value in using a line graph to show a user hitting 3 every 
    day.  There needs to be a better presentation to get the idea across of
    successful sustained work over time, while still allowing for max effort.
    My personal use case is to deliver as many pomos of code as possible per
    day.  However, I also want to throw in a few reading or music study or
    whatever, this should cover a bunch of the use cases I can envision.

#### Ensure audio play correctly on mobile devices/browsers
  + For now just check chrome on android and ios
#### Add ability to choose icon for a timer
#### Fix the size of the timer progress bar (too big for phones now) 
  + Should adapt depending on the size of the screen, maybe use a media query
    in the javascript to render one of several size arcs.
#### Further style the timer progress bar with colors/glow/border/etc
#### Ensure each user has a default pomodoro by default
  + Javascript ensures a default Pomodoro is available, but if the user starts 
    this, it won't be tracked.  Need to ensure that every user has at least
    one activity timer to their name which is the default Pomodoro. Also ensure
    the default one created by javascript doesn't get added if that database
    one is present.

#### BUG: when the progress bar renders in landscape and phone rotates to portrait
  + The progress bar is broken/shifted to the left
  + Might want to recenter on each render.

#### Test the timers_controller
#### Add some jasmines, or at least a jasmine test harness
#### Ensure the timer progress bar works properly with rest period.
#### Come up with a logo
  + Make a tiny version for favico
#### Allow the tune/tone that plays to be configurable
#### delete action/option
  + This needs to be in a separate view, I don't think an edit action is 
    appropriate.  You cannot edit a timer since a timer keeps track of
    your efforts.  If you change the timer settings then we'll lose data on
    the effort you spent.  I'm thinking of delete being someting like how iOS
    handles edit/delete actions.  There's a little info button that takes you
    to another screen where you can delete.

#### Make the audio more accomodating to more browsers
  + audio support spotty, doesn't seem to play on chrome or safari
  + http://stackoverflow.com/questions/10951524/play-and-replay-a-sound-on-safari-mobile
    function initAudio() {
        var audio = new Audio('./path/to/my/sound.mp3');
        audio.addEventListener('play', function () {
            // When the audio is ready to play, immediately pause.
            audio.pause();
            audio.removeEventListener('play', arguments.callee, false);
        }, false);
        document.addEventListener('click', function () {
            // Start playing audio when the user clicks anywhere on the page,
            // to force Mobile Safari to load the audio.
            document.removeEventListener('click', arguments.callee, false);
            audio.play();
        }, false);
    }
  + If the phone is asleep while the timer completes, the tone should play once 
    the javascript resumes

#### Add ability to set goals
  + daily
  + weekly
  + monthly
  + milestones

#### Design a more complete style/site design.
  + Need colors
  + Need shapes

#### Add state machine to timer (makes more sense to control it's behavior this way)
#### Add ability to rearrange timers
#### Capture pause timer
#### Show analytics on a timer
  + goal progress
  + number completed per day
  + time of day that they're completed
  + good days/months
  + ability to place notes?
  + calendar view? 

#### Upgrade font awesome
  + Looks like this will have to wait, font-awesome-rails gem doesn't use 
    font awesome 4.0 yet

#### Test that timer behaves properly when rest period begins while phone sleeps
  + It should simply start the rest period once the phone or device continues
    operation of the js

#### Use html5 vibrate if phone volume is down
  + Is this even possible?

#### Add ability to reward self for progress
#### Levels / leveling up
#### Share progress with friends
#### Facebook share
#### Tweet share
#### Public profile view
#### Omni auth

---

## DONE

#### Add audio on timer completion
#### BUG: When the rest period completes, the back button doesn't display
#### BUG: break timer seems to be broken.
  + Probably related to the new _verifyTime method.   I suspect the time is 
    being saved but when the state changes, the time isn't being re-saved.

#### Make the timer work properly in the background on mobile
  + When the phone is locked or the browser is navigated away
  + http://stackoverflow.com/questions/7047989/javascript-stops-as-i-lock-iphone-can-it-still-run
  + Ok, so here's the findings from this research:
    Mobile browsers will absolutely stop javascript running when sleep mode.
    There may be some hacks that could work on safari or perhaps chrome but
    essentially, the behavior is unreliable.
  + Given that we cannot rely on the javascript running while the phone is 
    asleep, we need a different solution.
  + Another strategy might be to store the start time on the model and when
    the timer updates, we can check the current time against the start time
    and update the timer accordingly.
  + The problem is then how can we ring an alarm 

#### Make the buttons more mobile responsive
  + https://developers.google.com/mobile/articles/fast_buttons
  + use touchstart and touchend events.. pretty much follow the above article
  + alternatively, look at fastclick.js

#### BUG: Create action doesn't properly send user back to index
#### BUG: With multiple timers on screen in index action, they all goto the same show timer
#### Research/Tinker with Raphael js to build a pretty timer.
#### Style the show view
  + Design/optimize for mobile first
  + Make a slick timer widget
    - Something that shows the progression of time
    - Timer is essentially a progress bar

#### BUG: when rest period ends, pause/stop doesn't reset back to initial state
  + This might push the final move to state machine

#### Style the index view
  + Design/optimize for mobile first. Follow new bootstrap docs to make the 
    layout mobile friendly from the start
  + Fix the header text (that's outside of the backbone app)
    The markup around the backbone app should be minimal.

#### BUG: guest timer tries to hit the server, but it shouldn't because it has no id
#### BUG: guest timer is pretty much broken.
  + Start button doesn't disappear after it's started
  + Can press start button multiple times and the timer ticks down faster
  + Might be time to implement state machine.

#### Deploy to heroku
  + convert to postgres

#### Build the server backend to capture starting a timer
  * Capture timer start
  + Capture timer complete
  + Capture rest period complete
  + Capture timer reset/abandoned (actually we don't care.. if timer started 
    and wasn't completed then that's not a complete cycle.  Only start and 
    complete events together represent a completed timer, and then including 
    the rest period is the full cycle complete.  Will need to experiment forcing
    the user to take action (press a button) to start the rest period
  + Once the server actions are being correctly hit, create the appropriate 
    models

#### Start button becomes pause when running
  + when paused, pause button becomes resume.
  + once started (or paused) a stop button appears after the start

#### Make the press on mini timer (routes to show view) start the timer as well
#### Wire up create timer to the server
  + ensure new timer created gets added to the collection
  + make create button re-route back to the index view

#### Load timers owned by the user in the index view
#### Wire up the actions to the server
  + Figure out how to add the server endpoint to the router/collection/timers
  + Make start timer fire a start timer call
  + Pause timer fires pause timer call
  + Timer complete fires timer finished call

#### New button stops working when you go back to the index view
#### Incorporate rest period into the timer
#### Logged in users goto the timers/index page where the pomo router now lives
#### Create demo timer for splash page
#### Wire up the pause button
#### Build out the Index and Timer actions/views.
  + Index view renders itself.
  + Index view contains a collection of timer icon views (build these out)
  + Clicking/touching on a mini timer icon routes to the show view for that
    timer.
  + Timer view fills up the screen and contains the timer widget and controls.
  + Needs a back button to go back to the index action

#### Rewrite the timer with backbone
  + Consider angular or some other framework which will work with mobile
    Not doing angular because of increased overhead of learning new framework.
    Jumping in with backbone because I know how to do it already and it's
    pretty flexible and easy to use.

#### Create a basic javascript timer
  + (DONE) Build the timer
  + (DONE) Add a button to start/stop the timer
  + Add a button to reset the timer

#### Use Foundation (or maybe twitter bootstrap, do some research first) and ensure the site is fully mobile responsive.
  + It should work pretty much for mobile first over desktop
  + It should also load fast and send minimal assets

