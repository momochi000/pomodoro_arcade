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


## CURRENT


---

## BACKLOG

#### Build the server backend to capture starting a timer

  + capture timer complete

#### Style the index view

  + Design/optimize for mobile first. Follow new bootstrap docs to make the 
    layout mobile friendly from the start
  + Fix the header text (that's outside of the backbone app)
    The markup around the backbone app should be minimal.

#### Style the show view

  + Design/optimize for mobile first

#### Ensure each user has a default pomodoro by default

  + Javascript ensures a default Pomodoro is available, but if the user starts 
    this, it won't be tracked.  Need to ensure that every user has at least
    one activity timer to their name which is the default Pomodoro. Also ensure
    the default one created by javascript doesn't get added if that database
    one is present.

#### Add delete action/option

  + This needs to be in a separate view, I don't think an edit action is 
    appropriate.  You cannot edit a timer since a timer keeps track of
    your efforts.  If you change the timer settings then we'll lose data on
    the effort you spent.  I'm thinking of delete being someting like how iOS
    handles edit/delete actions.  There's a little info button that takes you
    to another screen where you can delete.

#### Upgrade font awesome

  + Looks like this will have to wait, font-awesome-rails gem doesn't use 
    font awesome 4.0 yet

#### Play alarm/sound when pomo is done (configurable)

#### Add state machine to timer (makes more sense to control it's behavior this way)

#### Add ability to rearrange timers

#### Capture pause timer

#### Replace start button with resume button when paused

---

## DONE

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

